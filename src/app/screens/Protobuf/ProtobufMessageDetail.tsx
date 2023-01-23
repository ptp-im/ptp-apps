import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, List, TextInput } from '../../../';
import ScreenLarge from '../../components/ScreenLarge';
import DbStorage from '../../helpers/DbStorage';
import MsgConn from '../../helpers/MsgConn';
import * as PTPAuth from '../../protobuf/PTPAuth';
import * as PTPBuddy from '../../protobuf/PTPBuddy';
import * as PTPFile from '../../protobuf/PTPFile';
import * as PTPGroup from '../../protobuf/PTPGroup';
import * as PTPMsg from '../../protobuf/PTPMsg';
import * as PTPOther from '../../protobuf/PTPOther';
import * as PTPServer from '../../protobuf/PTPServer';
import * as PTPSwitch from '../../protobuf/PTPSwitch';
import schema from '../../protobuf/schema.json';
import type { MasterScreen } from '../../Screens';
import type { Dict } from '../../types';
import type { ProtoBufSchemaItem } from './ProtobufMessages';

const MsgObjs: Dict = {
  PTPAuth,
  PTPBuddy,
  PTPFile,
  PTPGroup,
  PTPMsg,
  PTPOther,
  PTPServer,
  PTPSwitch,
};
const ProtobufMessageDetail: React.FC<MasterScreen> = ({ route }) => {
  //@ts-ignore
  const { params }: { params: { schemaMsgItem: ProtoBufSchemaItem } } = route;
  const { cid, msgFileName } = params.schemaMsgItem;
  //@ts-ignore
  const { fields } = schema.msgFiles[msgFileName].msgs.find(
    (msg: any) => msg.name === cid
  );

  const initState: Dict = {};
  fields.forEach((field: any) => {
    let v = field.defaultValue;
    if (v === "''") {
      v = '';
    }
    initState[field.name] = field.isBytes ? '' : v;
  });
  const [state, setState] = useState<Dict>(initState);
  const [cid1, setCid1] = useState(cid);
  const [response, setResponse] = useState<Dict | null>(null);
  const [loading, setLoading] = useState(true);
  const getState = async (cid: string) => {
    const res = await DbStorage.getItem(`pb_msg_${cid}`);
    if (res) {
      setState(JSON.parse(res));
    } else {
      setState(initState);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (loading) {
      getState(cid);
    }
  }, [cid, getState, loading]);

  useEffect(() => {
    if (cid !== cid1) {
      setCid1(cid);
      getState(cid);
      setResponse(null);
    }
  }, [cid, cid1, getState]);
  // console.log(fields);
  return (
    <>
      <ScreenLarge>
        <List.Section title={``}>
          <View style={styles.row}>
            <Button
              mode='contained'
              onPress={async () => {
                const request: any = {};
                fields.forEach((field: any) => {
                  let v: any = state[field.name];
                  if (field.fieldType === 'number') {
                    v = Number(v);
                  }
                  if (field.isBytes) {
                    v = v ? Buffer.from(v) : Buffer.alloc(0);
                  }
                  if (v === "''") {
                    v = '';
                  }
                  request[field.name] = v;
                });
                await DbStorage.setItem(
                  `pb_msg_${cid}`,
                  JSON.stringify(request)
                );
                console.log('request', `${msgFileName}.${cid}`, request);
                if (MsgObjs[msgFileName][cid]) {
                  const pdu = await MsgConn.getMsgClient()?.SendPduWithCallback(
                    new MsgObjs[msgFileName][cid](request).pack()
                  );
                  if (MsgObjs[msgFileName][cid.replace('Req', 'Res')]) {
                    const response: any =
                      MsgObjs[msgFileName][cid.replace('Req', 'Res')].handlePdu(
                        pdu
                      );
                    if (response?.dispatch) {
                      console.log(
                        'response',
                        response.dispatch.type,
                        response.dispatch.payload
                      );
                    } else {
                      console.log('response', response);
                    }
                    setResponse(response);
                  } else {
                    console.error(
                      'not found',
                      MsgObjs[msgFileName][cid.replace('Req', 'Res')]
                    );
                  }
                } else {
                  console.error('not found', MsgObjs[msgFileName][cid]);
                }
              }}
              style={styles.button}
            >
              Run
            </Button>
          </View>
        </List.Section>
        {response && (
          <List.Section title={`Response`}>
            <Text style={styles.row}>{JSON.stringify(response, null, 2)}</Text>
          </List.Section>
        )}

        {fields
          .filter(
            (field: any) => !['auth_uid', 'attach_data'].includes(field.name)
          )
          .map((field: any) => {
            return (
              <List.Section key={field.name} title={field.name}>
                <TextInput
                  mode='outlined'
                  style={styles.inputContainerStyle}
                  dense
                  placeholder=''
                  value={state[field.name]}
                  onChangeText={(v) => {
                    setState({
                      ...state,
                      [field.name]: v,
                    });
                  }}
                />
              </List.Section>
            );
          })}
      </ScreenLarge>
    </>
  );
};

const styles = StyleSheet.create({
  row: {},
  button: {
    flex: 1,
  },

  inputContainerStyle: {
    marginHorizontal: 12,
  },
});

export default ProtobufMessageDetail;

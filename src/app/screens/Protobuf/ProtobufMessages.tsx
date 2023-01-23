import * as React from 'react';
import { StyleSheet } from 'react-native';

import { DataTable, Card } from '../../../';
import ScreenLarge from '../../components/ScreenLarge';
import schema from '../../protobuf/schema.json';
import type { MasterScreen } from '../../Screens';
import { jumpTo } from '../../Screens';

export type ProtoBufSchemaItem = {
  cid: string;
  title: string;
  msgFileName: string;
  sid: string;
  root: string;
};

type Items = Array<ProtoBufSchemaItem>;

const ProtobufMessages: React.FC<MasterScreen> = ({ navigation }) => {
  const [sortAscending, setSortAscending] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const messages: ProtoBufSchemaItem[] = [];

  Object.keys(schema.msgFiles).forEach((msgFileName: string) => {
    //@ts-ignore
    const fileObj = schema.msgFiles[msgFileName];
    fileObj.msgs
      .filter((msg: any) => msg.name.indexOf('Req') !== -1)
      .forEach((msg: any) => {
        messages.push({
          title: msg.name,
          cid: msg.name,
          msgFileName: msgFileName,
          sid: fileObj.fileNamespace[1],
          root: fileObj.fileNamespace[0],
        });
      });
  });
  const [items] = React.useState<Items>(messages);
  const [numberOfItemsPerPageList] = React.useState([30, 50]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const sortedItems = items
    .slice()
    .sort((item1, item2) =>
      (sortAscending ? item1.cid < item2.cid : item2.cid < item1.cid) ? 1 : -1
    );
  const fromPage = page * itemsPerPage;
  const toPage = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <>
      <ScreenLarge>
        <Card>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title
                sortDirection={sortAscending ? 'ascending' : 'descending'}
                onPress={() => setSortAscending(!sortAscending)}
                style={styles.firstCell}
              >
                Cid
              </DataTable.Title>
              <DataTable.Title>Sid</DataTable.Title>
              <DataTable.Title>-</DataTable.Title>
            </DataTable.Header>

            {sortedItems.slice(fromPage, toPage).map((item) => (
              <DataTable.Row key={item.title}>
                <DataTable.Cell
                  style={styles.firstCell}
                  onPress={() => {
                    jumpTo(navigation, 'ProtobufMessageDetail', {
                      schemaMsgItem: item,
                      title: item.cid,
                    });
                  }}
                >
                  {item.cid}
                </DataTable.Cell>
                <DataTable.Cell numeric>{item.sid}</DataTable.Cell>
                <DataTable.Cell numeric>-</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(sortedItems.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${fromPage + 1}-${toPage} of ${sortedItems.length}`}
              numberOfItemsPerPageList={numberOfItemsPerPageList}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
        </Card>
      </ScreenLarge>
    </>
  );
};

const styles = StyleSheet.create({
  firstCell: {
    flex: 2,
  },
});

export default ProtobufMessages;

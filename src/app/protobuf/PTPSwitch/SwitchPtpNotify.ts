import MsgConn from '../../helpers/MsgConn';
import BaseMsg from '../BaseMsg';
import type { Pdu } from '../Pdu';
import { CID_SWITCH, SID, SwitchType } from '../PTPCommon';
import type { SwitchPtpNotify_Type } from './types';

import { SwitchPtpReq } from './index';

function channelConfig(channel: RTCDataChannel) {
  channel.onclose = (event) => {
    console.log('Close channel:', event);
  };
  channel.onmessage = (event: MessageEvent) => {
    console.log('======>>>Receive channel msg:', event.data);
    if (event.data === 'handshake') {
      // channel.send('handshake');
    }
  };
  channel.onopen = () => {
    console.log('======>>>channel open');
    channel.send('handshake');
  };
  window.channel = channel;
}

const rtcPeers = new Map();

function initRtcPeer(from_adr: string) {
  if (rtcPeers.has(from_adr)) {
    return rtcPeers.get(from_adr);
  } else {
    let config = {
      iceServers: [
        {
          urls: 'stun:openrelay.metered.ca:80',
        },
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
        {
          urls: 'turn:openrelay.metered.ca:443',
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
      ],
    };
    const rtcPeer = new RTCPeerConnection(null);

    rtcPeer.ondatachannel = (event) => {
      let channel = event.channel;
      console.log('ondatachannel', event);
      channelConfig(channel);
    };

    rtcPeer.onicecandidate = (event) => {
      console.log('onicecandidate', event.candidate);
      const message: any = {
        type: 'candidate',
        candidate: null,
      };
      if (event.candidate) {
        message.candidate = event.candidate.candidate;
        message.sdpMid = event.candidate.sdpMid;
        message.sdpMLineIndex = event.candidate.sdpMLineIndex;
      }
      MsgConn.SendMessage(
        new SwitchPtpReq({
          switch_type: SwitchType.SwitchType_Candidate,
          to_adr: from_adr,
          data: JSON.stringify(message),
        }).pack()
      );
    };
    rtcPeer.onicecandidateerror = (event) => {
      console.log('onicecandidateerror', event);
    };

    rtcPeer.onicegatheringstatechange = (event) => {
      console.log('onicegatheringstatechange', event);
    };

    rtcPeer.oniceconnectionstatechange = (event) => {
      console.log('oniceconnectionstatechange', event);
    };

    rtcPeers.set(from_adr, rtcPeer);
    return rtcPeer;
  }
}

export default class SwitchPtpNotify extends BaseMsg {
  constructor(msg?: SwitchPtpNotify_Type) {
    super('PTP.Switch.SwitchPtpNotify', msg);
    this.setServiceId(SID.S_SWITCH);
    this.setCommandId(CID_SWITCH.CID_SwitchPtpNotify);
  }
  getMsg(): SwitchPtpNotify_Type {
    return this.__getMsg();
  }
  decode(data: Uint8Array): SwitchPtpNotify_Type {
    return this.__D(data);
  }
  pack(): Pdu {
    return this.__pack();
  }
  static async handlePdu(pdu: Pdu) {
    const msg = new SwitchPtpNotify().decode(pdu.getPbBody());
    const { switch_type, data, from_adr } = msg;
    let rtcPeer: RTCPeerConnection;
    switch (switch_type) {
      case SwitchType.SwitchType_Apply:
        {
          rtcPeer = initRtcPeer(from_adr);
          console.log('Add peer:', from_adr, rtcPeer);
          const channelId = String(Math.floor(Math.random() * 10000000000));
          console.log('Add channel Id:', channelId);
          let channel = rtcPeer.createDataChannel(channelId);
          console.log('config channel:', channel);
          channelConfig(channel);
          try {
            const offer: RTCSessionDescriptionInit =
              await rtcPeer.createOffer();
            console.log('Sending offer', JSON.stringify(offer));
            MsgConn.SendMessage(
              new SwitchPtpReq({
                switch_type: SwitchType.SwitchType_Offer,
                data: JSON.stringify(offer),
                to_adr: from_adr,
              }).pack()
            );
            await rtcPeer.setLocalDescription(offer);
          } catch (e) {
            console.error('createOffer', e);
          }
        }
        break;
      case SwitchType.SwitchType_Offer: {
        console.log('Receive offer', data);
        rtcPeer = initRtcPeer(from_adr);
        await rtcPeer.setRemoteDescription(JSON.parse(data));
        const answer = await rtcPeer.createAnswer();
        await rtcPeer.setLocalDescription(answer);
        console.log('Sending answer', JSON.stringify(answer));
        MsgConn.SendMessage(
          new SwitchPtpReq({
            switch_type: SwitchType.SwitchType_Answer,
            data: JSON.stringify(answer),
            to_adr: from_adr,
          }).pack()
        );
        console.log('Add peer', from_adr, rtcPeer);
        break;
      }
      case SwitchType.SwitchType_Answer: {
        console.log('rev answer:', from_adr, data);
        rtcPeer = initRtcPeer(from_adr);
        await rtcPeer.setRemoteDescription(
          new RTCSessionDescription(JSON.parse(data))
        );
        break;
      }
      case SwitchType.SwitchType_Candidate: {
        console.log('rev Candidate:', from_adr, data);
        rtcPeer = initRtcPeer(from_adr);
        if (!JSON.parse(data).candidate) {
          await rtcPeer.addIceCandidate(undefined);
        } else {
          await rtcPeer.addIceCandidate(JSON.parse(data));
        }
        break;
      }
      case SwitchType.SwitchType_Ready: {
        console.log('rev Ready:', from_adr);
        break;
      }
      case SwitchType.SwitchType_Bye: {
        console.log('rev Bye:', from_adr);
        break;
      }
      default:
        break;
    }
    return {
      dispatch: {
        type: 'ptp/SwitchPtpNotify',
        payload: msg,
      },
    };
  }
}

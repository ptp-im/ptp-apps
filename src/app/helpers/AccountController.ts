import { diff } from 'deep-object-diff';
import { decrypt, encrypt } from 'ethereum-cryptography/aes';
import { ecdh } from 'ethereum-cryptography/secp256k1';
import { sha256 } from 'ethereum-cryptography/sha256';

import config from '../config';
import type { BuddyGetALLRes_Type } from '../protobuf/PTPBuddy/types';
import type {
  GroupInfo_Type,
  GroupRecord_Type,
  MsgInfo_Type,
  UserInfo_Type,
} from '../protobuf/PTPCommon';
import { GroupRecord, UserInfo } from '../protobuf/PTPCommon';
import type {
  GroupGetListRes_Type,
  GroupUnreadMsgRes_Type,
} from '../protobuf/PTPGroup/types';
import type { Account } from '../redux/modules/Auth';
import DateHelper from './DateHelper';
import DbStorage from './DbStorage';
import GroupController from './GroupController';
import UserController from './UserController';
import Aes256Gcm from './wallet/Aes256Gcm';
import EcdsaHelper from './wallet/EcdsaHelper';
import Mnemonic from './wallet/Mnemonic';
import Wallet from './wallet/Wallet';

let currentAccountId: number;
let accounts: Record<number, AccountController> = {};

export default class AccountController {
  private accountId: number;
  private uid?: number;
  private shareKey?: Buffer;
  private iv?: Buffer;
  private aad?: Buffer;
  private group_ids: number[];
  private userInfo?: UserInfo_Type;
  private account?: Account;
  private address: string | undefined;
  private groupInfoUpdatedTime: number;
  private buddyUpdatedTime: number;
  private selectedGroupId: number;
  private groupRecords: Record<number, GroupRecord_Type>;
  private groupMsgUpdated: Array<number>[];
  constructor(accountId: number) {
    this.group_ids = [];
    this.accountId = accountId;
    this.groupInfoUpdatedTime = 0;
    this.buddyUpdatedTime = 0;
    this.address = undefined;
    this.uid = undefined;
    this.groupRecords = {};
    this.selectedGroupId = 0;
    this.groupMsgUpdated = [];
  }
  getShareKey() {
    return this.shareKey!;
  }
  getIv() {
    return this.iv!;
  }
  getAad() {
    return this.aad!;
  }
  getGroupInfoUpdatedTime() {
    return this.groupInfoUpdatedTime;
  }
  getBuddyUpdatedTime() {
    return this.buddyUpdatedTime;
  }
  async init(account: Account) {
    this.setAccount(account);
    this.address = account.address;
    if (account.uid) {
      this.uid = account.uid;
    }

    let userInfo: UserInfo_Type | undefined = this.getUserInfo();

    if (account.uid && !userInfo) {
      const user = UserController.getInstance(account.uid);
      user.setAddress(account.address);
      userInfo = await user.getUserInfoFromDb(account.address);
    }

    if (!userInfo) {
      userInfo = new UserInfo({
        address: account.address,
        avatar: '',
        nick_name: '',
        pub_key: Buffer.alloc(0),
        sign_info: '',
        status: 0,
        uid: 0,
        user_name: '',
      }).getMsg();
      if (account.uid) {
        UserController.getInstance(account.uid).setUserInfo(userInfo);
      }
    }
    this.setUserInfo(userInfo);
    return userInfo!;
  }
  setAccount(account: Account) {
    this.account = account;
  }
  getAccount() {
    return this.account!;
  }
  getAccountId() {
    return this.accountId;
  }
  getUserInfo() {
    if (this.userInfo?.uid) {
      return UserController.getInstance(this.userInfo?.uid).getUserInfo();
    } else {
      return this.userInfo!;
    }
  }
  setUserInfo(userInfo: UserInfo_Type) {
    this.userInfo = userInfo;
    if (userInfo.uid) {
      const user = UserController.getInstance(userInfo.uid);
      if (!user.getUserInfo() || diff(user.getUserInfo(), userInfo)) {
        user.setUserInfo(userInfo);
        user.saveUserInfoToDb();
      }
    }
  }
  getAddress() {
    return this.address;
  }
  setAddress(address: string) {
    this.address = address;
  }
  setUid(uid: number) {
    this.uid = uid;
  }
  getUid() {
    return this.uid;
  }
  async getAccountAddress() {
    const address = this.getAddress();
    if (!address) {
      const entropy = await this.getEntropy();
      let wallet = new Wallet(Mnemonic.fromEntropy(entropy));
      const ethWallet = wallet.getEthWallet(0);
      this.address = ethWallet.address;
      return this.address;
    } else {
      return address;
    }
  }
  async removeAccount() {
    const key = sha256(
      Buffer.from(`${config.dbPrefix.Key}${this.getAccountId()}`)
    ).toString('hex');
    await DbStorage.removeItem(`${config.dbPrefix.Key}${key}`);
    delete accounts[this.accountId];
  }
  async getEntropy() {
    const key = sha256(
      Buffer.from(`${config.dbPrefix.Key}${this.getAccountId()}`)
    ).toString('hex');
    let entropy = await DbStorage.getItem(`${config.dbPrefix.Key}${key}`);
    if (!entropy) {
      let mnemonic = new Mnemonic();
      entropy = mnemonic.toEntropy();
      let cipher = encrypt(
        Buffer.from(entropy, 'hex'),
        Buffer.from(key.substring(0, 16)),
        Buffer.from(key.substring(16, 32))
      );
      await DbStorage.setItem(
        `${config.dbPrefix.Key}${key}`,
        cipher.toString('hex')
      );
    } else {
      const plain = decrypt(
        Buffer.from(entropy, 'hex'),
        Buffer.from(key.substring(0, 16)),
        Buffer.from(key.substring(16, 32))
      );
      entropy = plain.toString('hex');
    }
    return entropy;
  }

  async signGroupMessage(message: string, group_idx: number) {
    const entropy = await this.getEntropy();
    let wallet = new Wallet(Mnemonic.fromEntropy(entropy));
    const groupWallet = wallet.getGroupWallet(group_idx);
    const ecdsa = new EcdsaHelper({
      pubKey: groupWallet.pubKey,
      prvKey: groupWallet.prvKey,
    });
    return { sign: ecdsa.sign(message), address: groupWallet.address };
  }
  async initEcdh(serverPubKey: Buffer, iv: Buffer, aad: Buffer) {
    const entropy = await this.getEntropy();
    let wallet = new Wallet(Mnemonic.fromEntropy(entropy));
    const ethWallet = wallet.getEthWallet(0);
    this.shareKey = Buffer.from(ecdh(serverPubKey, ethWallet.prvKey));
    this.aad = aad;
    this.iv = iv;
  }
  aesEncrypt(plainData: Buffer) {
    return Aes256Gcm.encrypt(
      plainData,
      this.getShareKey(),
      this.getIv(),
      this.getAad()
    );
  }
  aesDecrypt(cipherData: Buffer) {
    return Aes256Gcm.decrypt(
      cipherData,
      this.getShareKey(),
      this.getIv(),
      this.getAad()
    );
  }
  async signMessage(message: string) {
    const entropy = await this.getEntropy();
    let wallet = new Wallet(Mnemonic.fromEntropy(entropy));
    const ethWallet = wallet.getEthWallet(0);
    this.address = ethWallet.address;
    const ecdsa = new EcdsaHelper({
      pubKey: ethWallet.pubKey,
      prvKey: ethWallet.prvKey,
    });
    return ecdsa.sign(message);
  }

  verifyRecoverAddress(sig: Buffer, message: string) {
    return EcdsaHelper.recoverAddress({ message, sig });
  }

  recoverAddressAndPubKey(sig: Buffer, message: string) {
    return EcdsaHelper.recoverAddressAndPubKey({ message, sig });
  }

  async addEntropy(entropy: string) {
    const key = sha256(
      Buffer.from(`${config.dbPrefix.Key}${this.getAccountId()}`)
    ).toString('hex');
    let cipher = encrypt(
      Buffer.from(entropy, 'hex'),
      Buffer.from(key.substring(0, 16)),
      Buffer.from(key.substring(16, 32))
    );
    await DbStorage.setItem(
      `${config.dbPrefix.Key}` + key,
      cipher.toString('hex')
    );
  }

  getGroupIds() {
    return this.group_ids;
  }

  setGroupRecord(group_id: number, groupRecord: GroupRecord_Type) {
    this.groupRecords[group_id] = groupRecord;
    this.__saveGroupRecordToDb([{ group_id }]);
  }

  getGroupRecord(group_id: number) {
    return this.groupRecords[group_id];
  }

  setSelectedGroupId(group_id: number) {
    this.selectedGroupId = group_id;
    DbStorage.setItem(
      `${config.dbPrefix.GroupSelectedId}.` + this.uid,
      String(group_id)
    );
  }

  getSelectedGroupId() {
    return this.selectedGroupId;
  }

  async initGroups() {
    if (!this.selectedGroupId) {
      const selectedGroupIdStr = await DbStorage.getItem(
        `${config.dbPrefix.GroupSelectedId}.` + this.uid
      );
      if (selectedGroupIdStr) {
        this.selectedGroupId = Number(selectedGroupIdStr);
      }
    }
    if (this.buddyUpdatedTime === 0) {
      const buddy_updated_timeStr = await DbStorage.getItem(
        `${config.dbPrefix.BuddyUpdatedTime}.` + this.uid
      );
      if (buddy_updated_timeStr) {
        this.buddyUpdatedTime = Number(buddy_updated_timeStr);
      }
    }

    if (this.groupInfoUpdatedTime === 0) {
      const groupInfoUpdatedTimeStr = await DbStorage.getItem(
        `${config.dbPrefix.GroupInfoUpdatedTime}.${this.getUid()}`
      );
      if (groupInfoUpdatedTimeStr) {
        this.groupInfoUpdatedTime = Number(groupInfoUpdatedTimeStr);
      }
    }
    let unReadCnt = 0;
    if (this.getGroupIds().length === 0) {
      const groupIdsStr = await DbStorage.getItem(
        `${config.dbPrefix.GroupIds}.${this.getUid()}`
      );

      if (groupIdsStr) {
        this.group_ids = JSON.parse(groupIdsStr);
        for (let i = 0; i < this.group_ids.length; i++) {
          const group_id = this.group_ids[i];
          const groupRecordStr = await DbStorage.getItem(
            `${config.dbPrefix.GroupRecord}.${this.getUid()}.${group_id}`
          );
          if (groupRecordStr) {
            this.groupRecords[group_id] = new GroupRecord().fromHex(
              groupRecordStr
            );
          }
        }
        for (let i = 0; i < Object.keys(this.groupRecords).length; i++) {
          const group_id = Number(Object.keys(this.groupRecords)[i]);
          const groupRecord = this.groupRecords[group_id];
          unReadCnt += groupRecord.unReadCnt;
          if (!this.groupMsgUpdated.find((a) => a[0] === group_id)) {
            this.groupMsgUpdated = [
              ...this.groupMsgUpdated,
              [group_id, groupRecord.msgUpTime],
            ];
          }
        }
      }
      try {
        this.groupMsgUpdated.sort((a, b) => b[1] - a[1]);
      } catch (e) {
        console.error(this.groupMsgUpdated, e);
      }
      return [
        {
          type: 'im/initGroups',
          payload: {
            unReadCnt,
            selectedGroupId: this.selectedGroupId,
            accountId: this.accountId,
            groupMsgUpdated: this.groupMsgUpdated,
            buddyUpdatedTime: this.buddyUpdatedTime,
            groupInfoUpdatedTime: this.groupInfoUpdatedTime,
          },
        },
      ];
    } else {
      return [];
    }
  }
  saveGroupRecordAfterReadMsg(group_id: number) {
    this.groupRecords[group_id] = {
      ...this.groupRecords[group_id],
      unReadCnt: 0,
    };
    this.__saveGroupRecordToDb([
      {
        group_id,
      },
    ]);
  }
  saveGroupRecordName(group_id: number, field: Record<string, any>) {
    if (this.groupRecords[group_id]) {
      let changed = false;
      for (let i = 0; i < Object.keys(field).length; i++) {
        const key = Object.keys(field)[i];
        // @ts-ignore
        if (this.groupRecords[group_id][key] !== field[key]) {
          changed = true;
          break;
        }
      }
      if (changed) {
        this.groupRecords[group_id] = {
          ...this.groupRecords[group_id],
          ...field,
        };
        DbStorage.setItem(
          `${config.dbPrefix.GroupRecord}.${this.getUid()}.${group_id}`,
          new GroupRecord(this.groupRecords[group_id]).toHex()
        );
      }
    }
  }
  private __saveGroupRecordToDb(
    groupItems: {
      group_id: number;
      msgUpTime?: number;
    }[]
  ) {
    let needUpdateMsg = false;
    for (let i = 0; i < groupItems.length; i++) {
      const { group_id, msgUpTime } = groupItems[i];
      DbStorage.setItem(
        `${config.dbPrefix.GroupRecord}.${this.getUid()}.${group_id}`,
        new GroupRecord(this.groupRecords[group_id]).toHex()
      );
      if (msgUpTime) {
        needUpdateMsg = true;
        this.groupMsgUpdated = this.groupMsgUpdated.map((item) => {
          if (item[0] === group_id && msgUpTime) {
            return [item[0], msgUpTime];
          }
          return item;
        });
      }
    }
    if (needUpdateMsg) {
      this.groupMsgUpdated.sort((a, b) => b[1] - a[1]);
      this.group_ids = this.groupMsgUpdated.map((a) => a[0]);
      DbStorage.setItem(
        `${config.dbPrefix.GroupIds}.${this.getUid()}`,
        JSON.stringify(this.group_ids)
      );
    }
  }
  saveGroupRecord(
    group_id: number,
    msgInfo: MsgInfo_Type,
    needIncrUnReadCnt: boolean
  ) {
    let notify = {};
    if (needIncrUnReadCnt) {
      notify = {
        unReadCnt: this.groupRecords[group_id].unReadCnt + 1,
      };
    }
    this.groupRecords[group_id] = {
      ...this.groupRecords[group_id],
      lastMsgId: msgInfo.msg_id || undefined,
      msgUpTime: msgInfo.sent_at,
      ...notify,
    };
    GroupController.getInstance(msgInfo.group_id).saveMsg([msgInfo]);
    this.__saveGroupRecordToDb([
      {
        group_id,
        msgUpTime: msgInfo.sent_at,
      },
    ]);
    return this.groupMsgUpdated;
  }
  GroupGetListRes(GroupGetListRes: GroupGetListRes_Type) {
    const { groups, group_info_updated_time } = GroupGetListRes;
    this.groupInfoUpdatedTime = group_info_updated_time;
    let updatedGroups: GroupInfo_Type[] = [];
    if (groups && groups?.length > 0) {
      for (let i = 0; i < groups?.length; i++) {
        const groupInfo = groups[i];
        const {
          group_id,
          name,
          avatar,
          group_type,
          pair_uid,
          owner_uid,
          group_adr,
        } = groupInfo;
        if (!Object.keys(this.groupRecords).includes(String(group_id))) {
          updatedGroups.push(groupInfo);
          this.groupRecords[group_id] = {
            group_id,
            name,
            avatar,
            owner_uid,
            group_type,
            pair_uid,
            group_adr,
            lastMsgId: undefined,
            unReadCnt: 0,
            msgUpTime: groupInfo.created_time,
            memberUpTime: groupInfo.created_time,
          };
          this.groupMsgUpdated = [
            ...this.groupMsgUpdated,
            [group_id, groupInfo.created_time],
          ];
        }
      }
    }
    DbStorage.setItem(
      `${config.dbPrefix.GroupInfoUpdatedTime}.${this.getUid()}`,
      String(this.groupInfoUpdatedTime)
    );

    let groupRecordUpdate: {
      group_id: number;
      msgUpTime?: number;
    }[] = [];
    if (updatedGroups.length > 0) {
      updatedGroups.forEach((groupInfo: GroupInfo_Type) => {
        const group = GroupController.getInstance(groupInfo.group_id);
        group.saveGroupInfoToDb(groupInfo);
        groupRecordUpdate = [
          ...groupRecordUpdate,
          {
            group_id: groupInfo.group_id,
            msgUpTime: groupInfo.created_time,
          },
        ];
      });
    }
    if (groupRecordUpdate.length > 0) {
      this.__saveGroupRecordToDb(groupRecordUpdate);
    }
    return this.groupMsgUpdated;
  }
  GroupUnreadMsgRes(GroupUnreadMsgRes: GroupUnreadMsgRes_Type) {
    const { unread_list } = GroupUnreadMsgRes;

    if (unread_list && unread_list.length > 0) {
      let groupRecordUpdate: {
        group_id: number;
        msgUpTime?: number;
      }[] = [];
      unread_list.forEach((msgInfo: MsgInfo_Type) => {
        let unReadCnt = 0;
        const { group_id, sent_at } = msgInfo;
        if (this.groupRecords[group_id].lastMsgId) {
          const { lastMsgId } = this.groupRecords[group_id];
          unReadCnt = msgInfo.msg_id - lastMsgId!;
        } else {
          unReadCnt = msgInfo.msg_id;
        }
        this.groupRecords[group_id].unReadCnt = unReadCnt;
        this.groupRecords[group_id].msgUpTime = sent_at;

        groupRecordUpdate = [
          ...groupRecordUpdate,
          {
            group_id,
            msgUpTime: sent_at,
          },
        ];
      });

      if (groupRecordUpdate.length > 0) {
        this.__saveGroupRecordToDb(groupRecordUpdate);
      }
      return this.groupMsgUpdated;
    } else {
      return [];
    }
  }
  BuddyGetALLRes(BuddyGetALLRes: BuddyGetALLRes_Type) {
    const { buddy_list, buddy_updated_time } = BuddyGetALLRes;
    this.buddyUpdatedTime = buddy_updated_time;
    if (buddy_list && buddy_list.length > 0) {
      for (let i = 0; i < buddy_list.length; i++) {
        const userInfo = buddy_list[i];
        const user = UserController.getInstance(userInfo.uid);
        if (!user.getUserInfo() || diff(user.getUserInfo(), userInfo)) {
          user.setUserInfo(userInfo);
          user.saveUserInfoToDb();
        }
      }
    }
    DbStorage.setItem(
      `${config.dbPrefix.BuddyUpdatedTime}.` + this.uid,
      String(buddy_updated_time)
    );
  }
  static getInstance(accountId: number) {
    if (!accounts[accountId]) {
      accounts[accountId] = new AccountController(accountId);
    }
    return accounts[accountId];
  }

  static getCurrentAccount() {
    if (currentAccountId) {
      return AccountController.getInstance(currentAccountId);
    } else {
      return null;
    }
  }

  static getCurrentAccountId() {
    return currentAccountId;
  }

  static setCurrentAccountId(accountId: number) {
    currentAccountId = accountId;
  }
  static async initAccountId(): Promise<Account> {
    const accountId = DateHelper.currentTimestamp1000();
    const address = await AccountController.getInstance(
      accountId
    ).getAccountAddress();
    return { accountId, address: address! };
  }
}

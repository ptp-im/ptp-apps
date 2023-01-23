import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import Message, { messageSelectors } from '../Message';
// const messageList = [
//   {
//     _id: 1,
//     text: 'This is a system message',
//     createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
//     system: true,
//   },
//   {
//     _id: 2,
//     text: 'Hello developer',
//     createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
//     user: {
//       _id: 2,
//       name: 'React Native',
//       avatar: 'https://placeimg.com/140/140/any',
//     },
//   },
//   {
//     _id: 3,
//     text: 'Hi! I work from home today!',
//     createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
//     user: {
//       _id: 1,
//       name: 'React Native',
//       avatar: 'https://placeimg.com/140/140/any',
//     },
//     image: 'https://placeimg.com/960/540/any',
//   },
//   {
//     _id: 4,
//     text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
//     createdAt: new Date(Date.UTC(2016, 5, 14, 17, 20, 0)),
//     user: {
//       _id: 2,
//       name: 'React Native',
//       avatar: 'https://placeimg.com/140/140/any',
//     },
//     quickReplies: {
//       type: 'radio', // or 'checkbox',
//       keepIt: true,
//       values: [
//         {
//           title: '😋 Yes',
//           value: 'yes',
//         },
//         {
//           title: '📷 Yes, let me show you with a picture!',
//           value: 'yes_picture',
//         },
//         {
//           title: '😞 Nope. What?',
//           value: 'no',
//         },
//       ],
//     },
//   },
//   {
//     _id: 5,
//     text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
//     createdAt: new Date(Date.UTC(2016, 5, 15, 17, 20, 0)),
//     user: {
//       _id: 2,
//       name: 'React Native',
//       avatar: 'https://placeimg.com/140/140/any',
//     },
//     quickReplies: {
//       type: 'checkbox', // or 'radio',
//       values: [
//         {
//           title: 'Yes',
//           value: 'yes',
//         },
//         {
//           title: 'Yes, let me show you with a picture!',
//           value: 'yes_picture',
//         },
//         {
//           title: 'Nope. What?',
//           value: 'no',
//         },
//       ],
//     },
//   },
//   {
//     _id: 6,
//     text: 'Come on!',
//     createdAt: new Date(Date.UTC(2016, 5, 15, 18, 20, 0)),
//     user: {
//       _id: 2,
//       name: 'React Native',
//       avatar: 'https://placeimg.com/140/140/any',
//     },
//   },
//   {
//     _id: 7,
//     text: `Hello this is an example of the ParsedText, links like http://www.google.com or http://www.facebook.com are clickable and phone number 444-555-6666 can call too.
//         But you can also do more with this package, for example Bob will change style and David too. foo@gmail.com
//         And the magic number is 42!
//         #react #react-native`,
//     createdAt: new Date(Date.UTC(2016, 5, 13, 17, 20, 0)),
//     user: {
//       _id: 1,
//       name: 'React Native',
//       avatar: 'https://placeimg.com/140/140/any',
//     },
//   },
// ];

describe('Message test', () => {
  const store = configureStore({
    middleware: [thunk],
    reducer: combineReducers({
      message: Message,
    }),
  });
  const user1 = {
    _id: 1,
    name: 'Joseph',
    avatar: 'https://placeimg.com/140/140/any',
  };
  const user2 = {
    _id: 2,
    name: 'Tom',
    avatar: 'https://placeimg.com/140/140/any',
  };
  it('Message action', async () => {
    expect(messageSelectors.selectTotal(store.getState().message)).toEqual(0);
    expect(messageSelectors.selectAll(store.getState().message).length).toEqual(
      0
    );

    // const dispatch: any = store.dispatch;
    // dispatch(
    //   messageActions.upsertMessage({
    //     _id: 1,
    //     user: user1,
    //     createdAt: new Date(Date.UTC(2016, 5, 15, 17, 20, 0)),
    //   })
    // );
    expect(messageSelectors.selectTotal(store.getState().message)).toEqual(1);
    expect(
      messageSelectors.selectById(store.getState().message, 1)!._id
    ).toEqual(1);
    expect(
      messageSelectors.selectById(store.getState().message, 1)!.user._id
    ).toEqual(1);
    expect(
      messageSelectors.selectById(store.getState().message, 1)!.user.name
    ).toEqual('Joseph');

    console.debug(store.getState().message);
  });
  it('Message send msg', async () => {
    const dispatch: any = store.dispatch;
    dispatch({
      type: 'message/sendMessage',
      payload: {
        _id: 2,
        text: 'text',
        user: user2,
      },
    });
    expect(messageSelectors.selectTotal(store.getState().message)).toEqual(1);
    expect(
      messageSelectors.selectById(store.getState().message, 2)!._id
    ).toEqual(2);
    expect(
      messageSelectors.selectById(store.getState().message, 2)!.user._id
    ).toEqual(2);
    expect(
      messageSelectors.selectById(store.getState().message, 2)!.user.name
    ).toEqual('Tom');

    expect(
      messageSelectors.selectById(store.getState().message, 2)!.user.name
    ).toEqual('Tom');
    expect(store.getState().message.sendMessageList.length).toEqual(1);
    dispatch({
      type: 'message/sendMessage',
      payload: {
        _id: 3,
        text: 'text3',
        user: user1,
      },
    });
    dispatch({
      type: 'message/sendMessage',
      payload: {
        _id: 1,
        text: 'text1',
        user: user1,
      },
    });
    expect(store.getState().message.sendMessageList.length).toEqual(3);
    console.debug(store.getState().message);
  });
  it('Message sent msg', async () => {
    const dispatch: any = store.dispatch;
    dispatch({
      type: 'message/sendMessage',
      payload: {
        _id: 2,
        text: 'text2',
        user: user1,
      },
    });
    dispatch({
      type: 'message/sentMessage',
      payload: {
        _id: 2,
      },
    });
    dispatch({
      type: 'message/sendMessage',
      payload: {
        _id: 3,
        text: 'text3',
        user: user2,
      },
    });
    dispatch({
      type: 'message/sentMessage',
      payload: {
        _id: 3,
      },
    });
    expect(store.getState().message.sentMessageList.length).toEqual(2);
    console.debug(store.getState().message);
  });
});

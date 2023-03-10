/* @flow */

import * as React from 'react';

import Showcase from './src/Showcase';

export default class ShowcasePage extends React.Component<{}> {
  render() {
    return <Showcase />;
  }
}

export const meta = {
  title: 'Showcase',
  description: 'Showcase for applications build with Paper',
  link: 'showcase',
};

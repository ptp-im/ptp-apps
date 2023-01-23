export type Dict = Record<string, any>;
export type DictNum = Record<string, number>;
export type DictStr = Record<string, string>;

export type IconType =
  | 'material'
  | 'material-community'
  | 'simple-line-icon'
  | 'zocial'
  | 'font-awesome'
  | 'octicon'
  | 'ionicon'
  | 'foundation'
  | 'evilicon'
  | 'entypo'
  | 'antdesign'
  | 'font-awesome-5'
  | string;

export interface SectionListItem {
  id: string | number;
  title?: string;
  rightTitle?: string;
  iconType?: IconType;
  icon?: string;
  iconBgColor?: string;
  hideChevron?: boolean;
  checkbox?: boolean;
}

import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Icon, Text } from '@rneui/themed';

import { Card, DataTable, Searchbar } from '../../../';
import ScreenLarge from '../../components/ScreenLarge';
import colors from '../../config/colors';
// @ts-ignore
import antdesign from '../../config/icons/AntDesign.json';
// @ts-ignore
import entypo from '../../config/icons/Entypo.json';
// @ts-ignore
import evilicon from '../../config/icons/EvilIcons.json';
// @ts-ignore
import font_awesome from '../../config/icons/FontAwesome.json';
// @ts-ignore
import font_awesome_5 from '../../config/icons/FontAwesome5Free.json';
// @ts-ignore
import foundation from '../../config/icons/Foundation.json';
// @ts-ignore
import ionicon from '../../config/icons/Ionicons.json';
// @ts-ignore
import material_community from '../../config/icons/MaterialCommunityIcons.json';
// @ts-ignore
import material from '../../config/icons/MaterialIcons.json';
// @ts-ignore
import octicon from '../../config/icons/Octicons.json';
// @ts-ignore
import simple_line_icon from '../../config/icons/SimpleLineIcons.json';
// @ts-ignore
import zocial from '../../config/icons/Zocial.json';
import type { MasterScreen } from '../../Screens';

const icons_: any = {
  material_community,
  material,
  zocial,
  font_awesome,
  octicon,
  ionicon,
  foundation,
  evilicon,
  entypo,
  antdesign,
  font_awesome_5,
  simple_line_icon,
};

const IconTypes: string[] = [
  'material',
  'material-community',
  'simple-line-icon',
  'zocial',
  'font-awesome',
  'octicon',
  'ionicon',
  'foundation',
  'evilicon',
  'entypo',
  'antdesign',
  'font-awesome-5',
];

type Item = {
  title: string;
  iconId: string;
  iconType: string;
  iconBgColor?: string;
};

type Items = Item[];

const IconList: React.FC<MasterScreen> = () => {
  let icons1: Items = [];

  IconTypes.forEach((iconType: string) => {
    const name = iconType.replace(/-/g, '_');
    const icon_ids = Object.keys(icons_[name]);
    icons1 = [
      ...icons1,
      ...icon_ids.map((icon_id: string) => {
        return {
          iconId: icon_id,
          iconType: iconType,
          title: `${icon_id}`,
        };
      }),
    ];
  });
  const [sortAscending, setSortAscending] = React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);

  const [icons] = React.useState<Items>(icons1);
  const [firstQuery, setFirstQuery] = React.useState<string>('');
  const [numberOfItemsPerPageList] = React.useState([10, 30, 100]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const sortedItems = icons
    .filter((item: Item) => {
      if (firstQuery.length === 0) {
        return true;
      } else {
        return item.title.toLowerCase().indexOf(firstQuery.toLowerCase()) > -1;
      }
    })
    .slice()
    .sort((item1, item2) =>
      (sortAscending ? item1.title < item2.title : item2.title < item1.title)
        ? 1
        : -1
    );

  const fromPage = page * itemsPerPage;
  const toPage = Math.min((page + 1) * itemsPerPage, icons.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);
  return (
    <>
      <ScreenLarge>
        <Searchbar
          placeholder='Search'
          onChangeText={(query: string) => setFirstQuery(query)}
          value={firstQuery}
          style={styles.searchbar}
        />
        <Card>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title
                sortDirection={sortAscending ? 'ascending' : 'descending'}
                onPress={() => setSortAscending(!sortAscending)}
                style={styles.firstCell}
              >
                Icon
              </DataTable.Title>
              <DataTable.Title>IconId</DataTable.Title>
              <DataTable.Title>IconType</DataTable.Title>
            </DataTable.Header>

            {sortedItems.slice(fromPage, toPage).map((item) => (
              <DataTable.Row key={item.title + item.iconType}>
                <DataTable.Cell style={styles.firstCell}>
                  <Icon
                    type={item.iconType}
                    name={item.iconId}
                    size={32}
                    color={'white'}
                    containerStyle={{
                      width: 44,
                      height: 44,
                      backgroundColor: colors.BLUE,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  />
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{item.iconId}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text>{item.iconType}</Text>
                </DataTable.Cell>
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
  firstCell: { flex: 1 },

  searchbar: {
    marginBottom: 12,
  },
});

export default IconList;

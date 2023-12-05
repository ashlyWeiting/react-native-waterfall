import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import WaterfallList from './src/components/atoms/WaterfallList';
import waterfallStore from './src/stores/waterfallView.store';
import {ArtworkItem} from './src/types/api/responses/artworksResponse';
import {vw} from './src/utils/theme';

const Column = 2;

const App = observer(() => {
  useEffect(() => {
    (async () => {
      await waterfallStore.fetcher();
    })();
  }, []);

  const onEndReached = async () => {
    if (waterfallStore.isFetching || waterfallStore.list.length === 0) {
      return;
    }
    console.log('onEndReached');
    waterfallStore.fetcher();
  };

  const keyExtractor = (item: ArtworkItem) => {
    return String(item.id);
  };

  const getItemHeight = (index: number) => {
    return waterfallStore.list[index].height;
  };

  const renderItem = ({item}: {item: ArtworkItem; index: number}) => {
    const cellWidth = (vw - 50 - Column * 8) / Column;
    const size = {width: cellWidth, height: item.height};
    return (
      <View style={[styles.cellContainer, size]}>
        <Image
          source={{uri: item.thumbnail?.lqip, cache: 'force-cache'}}
          style={[styles.cellImg, size]}
        />
        <Text style={styles.cellText}>{item.title}</Text>
      </View>
    );
  };

  const list = waterfallStore.list;
  return (
    <View style={styles.container}>
      <WaterfallList
        data={list}
        column={Column}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        renderItem={renderItem}
        cellWidth={vw / 2 - 20}
        gap={8}
        getItemHeight={getItemHeight}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
  },
  cellContainer: {
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    overflow: 'hidden',
  },
  cellText: {
    padding: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  cellImg: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
});

export default App;

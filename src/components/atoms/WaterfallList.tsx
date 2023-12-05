import React, {ReactElement, useRef} from 'react';
import {FlatList, FlatListProps, StyleSheet, View} from 'react-native';
import {vh, vw} from '../../utils/theme';

interface WaterfallListProps {
  data: any[];
  column: number;
  onEndReached: () => void;
  renderItem: ({item, index}: {item: any; index: number}) => ReactElement;
  cellWidth: number;
  gap: number;
  getItemHeight: (index: number) => number;
}

export interface WaterfallListApi {
  forceUpdate: () => void;
}

interface Position {
  left: number;
  top: number;
}

const WaterfallList = ({
  column,
  onEndReached,
  renderItem,
  cellWidth = vw / 2 - 20,
  gap = 8,
  getItemHeight,
  data,
  ...rest
}: WaterfallListProps & FlatListProps<any>) => {
  const position = useRef<Position[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const getLastItemPosition = (lastIndex: number) => {
    const contentLength = position.current.length;
    if (contentLength < column) {
      return vh;
    }
    return (
      (position.current[contentLength - lastIndex]?.top ?? 0) +
      getItemHeight(contentLength - lastIndex)
    );
  };

  const getHighestListHeight = () => {
    const highestHeight = Math.max(
      getLastItemPosition(1),
      getLastItemPosition(2),
    );

    return highestHeight;
  };

  const forceUpdate = () => {
    flatListRef.current?.forceUpdate();
  };

  const calculateOffset = (index: number) => {
    const left = gap * (column - 1) + cellWidth * (index % column);

    const currentOffset =
      index < column
        ? 0
        : (position.current[index - column]?.top ?? 0) +
          getItemHeight(index - column) +
          gap;

    position.current[index] = {
      left,
      top: currentOffset,
    };

    return position.current[index];
  };

  const getPosition = (index: number) => {
    if (index <= position.current.length - 1) {
      return position.current[index];
    }
    return calculateOffset(index);
  };

  const render = ({item, index}: {item: any; index: number}) => {
    const {top, left} = getPosition(index);
    return (
      <View
        style={[
          styles.cellContainer,
          {
            top,
            left,
            height: getItemHeight(index),
          },
        ]}>
        {renderItem({item, index})}
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      style={styles.container}
      data={data}
      numColumns={column}
      renderItem={render}
      onEndReached={onEndReached}
      contentContainerStyle={[
        styles.contentContainerStyle,
        {height: getHighestListHeight()},
      ]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  cellContainer: {
    position: 'absolute',
  },
  contentContainerStyle: {
    minHeight: '100%',
  },
});

export default WaterfallList;

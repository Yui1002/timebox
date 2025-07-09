import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

interface TableHeaderProps {
  headerContent: string[];
}

const TableHeader = (props: TableHeaderProps) => {
  return (
    <View style={recordHistoryStyles.headerContainer}>
      {props.headerContent.map((content, index) => (
        <View style={recordHistoryStyles.column} key={index}>
          <Text style={recordHistoryStyles.tableText}>{content}</Text>
        </View>
      ))}
    </View>
  );
};

export const recordHistoryStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  column: {
    flex: 3,
    alignItems: 'flex-start',
  },
  tableText: {
    textAlign: 'center',
  },
});

export default TableHeader;

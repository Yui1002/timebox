import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

interface TableHeaderProps {
  headerContent: string[];
}

const TableHeader = (props: TableHeaderProps) => {
  return (
    <View style={recordHistoryStyles.headerContainer}>
      <View style={recordHistoryStyles.dateColumn}>
        <Text style={recordHistoryStyles.tableText}>Date</Text>
      </View>
      <View style={recordHistoryStyles.timeColumn}>
        <Text style={recordHistoryStyles.tableText}>In</Text>
      </View>
      <View style={recordHistoryStyles.timeColumn}>
        <Text style={recordHistoryStyles.tableText}>Out</Text>
      </View>
      <View style={recordHistoryStyles.totalColumn}>
        <Text style={recordHistoryStyles.tableText}>Total</Text>
      </View>
    </View>
  );
};

export const recordHistoryStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateColumn: {
    flex: 5,
    alignItems: 'flex-start',
  },
  timeColumn: {
    flex: 4,
    alignItems: 'flex-start',
  },
  totalColumn: {
    flex: 2,
    alignItems: 'flex-start',
  },
  tableText: {
    textAlign: 'center'
  }
});

export default TableHeader;

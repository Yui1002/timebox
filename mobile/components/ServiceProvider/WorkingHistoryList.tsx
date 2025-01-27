import React from 'react';
import {Text, View} from 'react-native';
import {ContainerStyle} from '../../styles';
import { returnFormat } from '../../helper/momentHelper';

interface WorkingHistoryProps {
    start: string | null;
    end: string | null;
    total: number;
}

const WorkingHistoryList = (props: WorkingHistoryProps) => {
  let date = returnFormat(props.start || props.end, 'YYYY/MM/DD');
  // props.start.formatDate('YYYY/MM/DD')
  let start = returnFormat(props.start, 'LT');
  let end = returnFormat(props.end, 'LT');
  let noRecord = 'N/A'

  let alignTopContainer = ContainerStyle.createAlignTopContainer();

  return (
    <View style={alignTopContainer}>
      <Text>{props.start ? date : noRecord}</Text>
      <Text>{props.start ? start : noRecord}</Text>
      <Text>{props.end ? end : noRecord}</Text>
      <Text>{props.total ? `${props.total}h` : noRecord}</Text>
    </View>
  );
};

export default WorkingHistoryList;

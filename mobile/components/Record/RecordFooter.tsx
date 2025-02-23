import React from 'react';
import {View, Text} from 'react-native';
import {Container} from '../index';

interface RecordFooterProps {
    record?: {
        startTime?: string | undefined;
        endTime?: string | undefined;
    }
}

const RecordFooter = ({record}: RecordFooterProps) => {
  const startTime = record?.startTime;
  const endTime = record?.endTime;

  return (
    <Container>
      <Text>Today's record</Text>
      <View style={{flexDirection: 'row'}}>
        <Text style={{width: '50%'}}>Start</Text>
        <Text style={{width: '50%'}}>End</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{width: '50%'}}>
          {startTime ? new Date(startTime).momentFormat('LT') : 'No Record'}
        </Text>
        <Text style={{width: '50%'}}>
          {endTime ? new Date(endTime).momentFormat('LT') : 'No Record'}
        </Text>
      </View>
    </Container>
  );
};

export default RecordFooter;

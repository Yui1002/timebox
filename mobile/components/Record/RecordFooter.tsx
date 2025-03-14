import React from 'react';
import {View, Text} from 'react-native';
import {Container, Title, Separator} from '../index';

interface RecordFooterProps {
  record?: {
    startTime?: string | undefined;
    endTime?: string | undefined;
  };
}

const RecordFooter = ({record}: RecordFooterProps) => {
  const startTime = record?.startTime;
  const endTime = record?.endTime;

  return (
    <Container>
      <Title title="Today's record" />
      <Container>
        <View style={{flexDirection: 'row'}}>
            <Text style={{width: '50%'}}>Start</Text>
            <Text style={{width: '50%'}}>End</Text>
        </View>
      </Container>
      <Separator />
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

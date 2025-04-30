import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {DefaultApiFactory} from '../../swagger';
import {AlignContainer, Container} from '../index';

const RecordChangeHistoryList = ({record}) => {
  const {startTime, endTime, updatedBy, changedOn} = record;

  return (
    <Container>
      <AlignContainer>
        <Text>{new Date(startTime).momentFormat('YYYY/MM/DD')}</Text>
        <Text>{new Date(startTime).momentFormat('LT')}</Text>
        <Text>{new Date(endTime).momentFormat('LT')}</Text>
        <Text>{updatedBy}</Text>
        <Text>{new Date(changedOn).momentFormat('YYYY/MM/DD h:mm:ss')}</Text>
      </AlignContainer>
    </Container>
  );
};

export default RecordChangeHistoryList;

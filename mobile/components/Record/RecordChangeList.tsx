import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {DefaultApiFactory} from '../../swagger';
import {AlignContainer} from '../index';

const RecordChangeList = ({record}) => {
  const {startTime, endTime, updatedBy, changedOn} = record;

  return (
    <TouchableOpacity>
      <AlignContainer>
        <Text>{new Date(startTime).momentFormat('YYYY/MM/DD')}</Text>
        <Text>{new Date(startTime).momentFormat('LT')}</Text>
        <Text>{new Date(endTime).momentFormat('LT')}</Text>
        <Text>{updatedBy}</Text>
        <Text>{new Date(changedOn).momentFormat('LT')}</Text>
      </AlignContainer>
    </TouchableOpacity>
  );
};

export default RecordChangeList;

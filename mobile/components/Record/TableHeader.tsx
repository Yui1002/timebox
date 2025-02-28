import React from 'react';
import {Text} from 'react-native';
import {
  AlignContainer,
} from '../index';

const TableHeader = () => {
  return (
    <AlignContainer>
      <Text>Date</Text>
      <Text>In</Text>
      <Text>Out</Text>
      <Text>Total</Text>
    </AlignContainer>
  );
};

export default TableHeader;

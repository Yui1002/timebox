import React from 'react';
import {Text} from 'react-native';
import {AlignContainer} from '../index';

interface TableHeaderProps {
  headerContent: string[];
}

const TableHeader = (props: TableHeaderProps) => {
  return (
    <AlignContainer>
      {props.headerContent.map((header: string, index: number) => (
        <Text style={{width: '20%'}} key={index}>{header}</Text>
      ))}
    </AlignContainer>
  );
};

export default TableHeader;

import React, {useState} from 'react';
import {Text, ScrollView, View} from 'react-native';
import {TextStyle} from '../../styles';
import {Record, DefaultApiFactory} from '../../swagger';
import {
  TopContainer,
  Separator,
  AlignContainer,
  Button,
  Result,
} from '../index';
import WorkingHistoryList from '../ServiceProvider/WorkingHistoryList';
import SearchField from './SearchField';
import {COLORS} from '../../styles/theme';
import {ResultModel} from '../../types';
import {StatusModel, ActionType, ErrMsg} from '../../enums';
import moment from 'moment';
import TableHeader from './TableHeader';
let api = DefaultApiFactory();

const RecordChange = ({route, navigation}: any) => {
  const headerContent = ['Date', 'In', 'Out', 'Updated by', 'Updated Date'];

  const getRecordChanges = () => {
    
  }

  return (
    <TopContainer>
        <SearchField />
        <TableHeader headerContent={headerContent}/>
        <Separator />
    </TopContainer>
  );
};

export default RecordChange;

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
import {alert} from '../../helper/Alert';
import moment from 'moment';
import TableHeader from './TableHeader';
let api = DefaultApiFactory();

const RecordChange = ({route, navigation}: any) => {
  return (
    <TopContainer>
        <TableHeader />
        <Separator />
    </TopContainer>
  );
};

export default RecordChange;

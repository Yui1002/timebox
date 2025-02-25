import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {RawEmployer, FormattedEmployer, Record, ResultModel} from '../../types';
import Validator from '../../validator/validator';
import {
  TopContainer,
  Dropdown,
  Title,
  DatePickerDropdown,
  Button,
  AlignContainer,
  Result,
} from '../index';
import {DefaultApiFactory} from '../../swagger';
import {StatusModel} from '../../enums';
let api = DefaultApiFactory();

const SearchField = ({setRecords, employer}) => {
  const {email} = useSelector(state => state.userInfo);
  const isFocused = useIsFocused();
  const [fromDropdown, setFromDropDown] = useState(false);
  const [toDropdown, setToDropDown] = useState(false);
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });

  const validateInput = (): boolean => {
    const validateErr = Validator.validateWorkingRecordSelect(from, to);
    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }

    return validateErr == null;
  };

  const searchRecord = async (): Promise<void> => {
    if (!validateInput()) return;

    try {
      const {data} = await api.getRecordByPeriod(
        employer.email,
        email,
        from ? from : '2020-01-01',
        to ? to : moment().format('YYYY-MM-DD'),
      );
      console.log('data', data)
      setRecords(data.records);
    //   setRecords(sortRecords(data.records));
    } catch (e) {
      setRecords([])
    }
  };

  const sortRecords = (recordData: Record[]): Record[] => {
    if (!recordData || recordData.length) return [];

    return recordData.sort((a, b) => {
      return moment(a.startTime).diff(moment(b.startTime));
    });
  };

  const onPeriodChange = (type: string, data: Date) => {
    const selected = moment(data).format('YYYY-MM-DD');
    type === 'from' ? setFrom(selected) : setTo(selected);
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Title title="Select period" />
      <AlignContainer>
        <Dropdown
          placeholder={from ? from : 'From'}
          onPress={() => setFromDropDown(!fromDropdown)}
          width={'45%'}
          height={'100%'}
        />
        <Dropdown
          placeholder={to ? to : 'To'}
          onPress={() => setToDropDown(!toDropdown)}
          width={'45%'}
          height={'100%'}
        />
      </AlignContainer>
      <DatePickerDropdown
        open={fromDropdown}
        mode="date"
        onConfirm={d => onPeriodChange('from', d)}
        onCancel={() => {
          setFromDropDown(false);
        }}
        minimumDate={new Date('2020-01-01')}
        maximumDate={new Date()}
      />
      <DatePickerDropdown
        open={toDropdown}
        mode="date"
        onConfirm={d => onPeriodChange('to', d)}
        onCancel={() => {
          setToDropDown(false);
        }}
        minimumDate={new Date('2020-01-01')}
        maximumDate={new Date()}
      />
      <Button title="Search" onPress={searchRecord} />
    </TopContainer>
  );
};

export default SearchField;

import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {View, Text, ScrollView} from 'react-native';
import {ContainerStyle, TextStyle} from '../../styles';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {RawEmployer, FormattedEmployer, Record, ResultModel} from '../../types';
import Validator from '../../validator/validator';
import {
  TopContainer,
  Dropdown,
  Title,
  Picker,
  DatePickerDropdown,
  Button,
  Separator,
  AlignContainer,
  Result,
} from '../index';
import WorkingHistoryList from '../ServiceProvider/WorkingHistoryList';
import {getDiff} from '../../helper/momentHelper';
import { StatusModel } from '../../enums';

const WorkingHistory = (props: any) => {
  const {email} = useSelector(state => state.userInfo);
  const isFocused = useIsFocused();
  const [employerDropdownOpen, setEmployerDropdownOpen] = useState(false);
  const [fromDropdown, setFromDropDown] = useState(false);
  const [toDropdown, setToDropDown] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [employers, setEmployers] = useState<FormattedEmployer[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: ''
  })

  useEffect(() => {
    if (isFocused) {
      getEmployers();
    }
  }, [isFocused]);

  const getEmployers = async () => {
    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/getEmployer`, {
        email,
      });
      setEmployers(formatData(response.data.employers));
    } catch (e) {
      console.log(e);
    }
  };

  const formatData = (employerData: RawEmployer[]): FormattedEmployer[] => {
    let result: FormattedEmployer[] = [];

    employerData.map((data: RawEmployer) => {
      let subData: FormattedEmployer = {label: '', value: ''};
      subData['label'] = `${data.firstName} ${data.lastName}`;
      subData['value'] = data.email;
      result.push(subData);
    });

    return result;
  };

  const validateInput = (): boolean => {
    const validateErr = Validator.validateWorkingRecordSelect(
      selectedEmployer,
      from,
      to,
    );
    if (validateErr) {
      setResult({status: StatusModel.ERROR, message: validateErr});
    }

    return validateErr == null;
  };

  const searchRecord = async (): Promise<void> => {
    if (!validateInput()) return;

    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/getRecordByPeriod`, {
        employerEmail: selectedEmployer,
        serviceProviderEmail: email,
        from: from ? from : '2020-01-01',
        to: to ? to : moment().format('YYYY-MM-DD'),
      });

      setRecords(sortRecords(response.data.records));
    } catch (e) {
      console.log(e);
    }
  };

  const sortRecords = (recordData: Record[]): Record[] => {
    if (!recordData.length) return recordData;

    return recordData.sort((a, b) => {
      return moment(a.startTime).diff(moment(b.startTime));
    });
  };

  const onPeriodChange = (type: string, data: Date) => {
    const selected = moment(data).format('YYYY-MM-DD');
    type === 'from' ? setFrom(selected) : setTo(selected);
  };

  let titleText = TextStyle.createTitleTextStyle();
  let topAlignContainer = ContainerStyle.createAlignTopContainer();
  let centerText = TextStyle.createCenterTextStyle();

  return (
    <TopContainer>
      {employers.length ? (
        <ScrollView>
          <View>
          {result.status && <Result status={result.status} msg={result.message} />}
            <Title title="Select employer's name" />
            <Picker
              open={employerDropdownOpen}
              value={selectedEmployer}
              items={employers}
              setOpen={() => setEmployerDropdownOpen(!employerDropdownOpen)}
              setValue={setSelectedEmployer}
              setItems={setEmployers}
            />
          </View>
          <View style={employerDropdownOpen ? {zIndex: -1} : null}>
            <Text style={titleText}>Select period</Text>
            <Dropdown
              placeholder={from ? from : 'From'}
              onPress={() => setFromDropDown(!fromDropdown)}
            />
            <Dropdown
              placeholder={to ? to : 'To'}
              onPress={() => setToDropDown(!toDropdown)}
            />
          </View>
          <View>
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
          </View>
          <Button title="Search" onPress={searchRecord} />
          <AlignContainer>
            <Text>Date</Text>
            <Text>Check In</Text>
            <Text>Check Out</Text>
            <Text>Total</Text>
          </AlignContainer>
          <Separator />
          {records?.length ? (
            records.map((h: Record, index: number) => {
              const total = getDiff({start: h.startTime, end: h.endTime});
              return <WorkingHistoryList total={total} />;
            })
          ) : (
            <Text style={centerText}>No records matched</Text>
          )}
        </ScrollView>
      ) : (
        <Text>You currenly have no working records</Text>
      )}
    </TopContainer>
  );
};

export default WorkingHistory;

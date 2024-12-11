import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {styles} from '../../styles/workingHistoryStyles.js';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import { RawEmployer, FormattedEmployer, Record } from '../../types';
import validator from 'validator';
import Error from '../Error';

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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isFocused) {
      getEmployers();
    }
  }, [isFocused]);

  const getEmployers = async () => {
    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/getEmployer`, {
        email
      });
      setEmployers(formatData(response.data.employers));
    } 
    catch (e) {
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
    let errors: any = {};

    if (validator.isEmpty(selectedEmployer)) {
      errors.emptyValue = "Employer's name is required";
    }

    if (moment(from).isAfter(moment(to))) {
      errors.invalidTime = "Invalid time";
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const searchRecord = async (): Promise<void> => {
    if (!validateInput()) return;

    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/getRecordByPeriod`, {
        employerEmail: selectedEmployer,
        serviceProviderEmail: email,
        from: from ? from : '1950-01-01',
        to: to ? to : moment().format('YYYY-MM-DD')
      });

      setRecords(sortRecords(response.data.records));
    } 
    catch (e) {
      console.log(e);
    }
  };

  const sortRecords = (recordData: Record[]): Record[] => {
    if (!recordData.length) return recordData;

    return recordData.sort((a, b) => {
      return moment(a.startTime).diff(moment(b.startTime))
    });
  };

  const onPeriodChange = (type: string, data: Date) => {
    const selected = moment(data).format('YYYY-MM-DD');
    type === 'from' ? setFrom(selected) : setTo(selected);
  };

  return (
    <SafeAreaView style={styles.container}>
      {employers.length ? (
        <ScrollView>
          <View>
            <Text style={styles.subHeader}>Select employer's name</Text>
            {Object.values(errors).map((error, key) => (
              <Error key={key} msg={error} />
            ))}
            <DropDownPicker
              open={employerDropdownOpen}
              value={selectedEmployer}
              items={employers}
              setOpen={setEmployerDropdownOpen}
              setValue={setSelectedEmployer}
              setItems={setEmployers}
              placeholder="Employer's name"
              listMode="SCROLLVIEW"
            />
          </View>
          <View style={employerDropdownOpen ? styles.dropdownOpen : null}>
            <Text style={styles.subHeader}>Select period</Text>
            <TouchableOpacity
              onPress={() => setFromDropDown(!fromDropdown)}
              style={styles.dropdown}>
              <Text style={styles.dropdownText}>{from ? from : 'From'}</Text>
              <View style={styles.arrow} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setToDropDown(!toDropdown)}
              style={styles.dropdown}>
              <Text style={styles.dropdownText}>{to ? to : 'To'}</Text>
              <View style={styles.arrow} />
            </TouchableOpacity>
          </View>
          <View>
            <DatePicker
              modal
              open={fromDropdown}
              mode="date"
              date={new Date()}
              onConfirm={d => onPeriodChange('from', d)}
              onCancel={() => {
                setFromDropDown(false);
              }}
              minimumDate={new Date('1950-01-01')}
              maximumDate={new Date()}
            />
            <DatePicker
              modal
              open={toDropdown}
              mode="date"
              date={new Date()}
              onConfirm={d => onPeriodChange('to', d)}
              onCancel={() => {
                setToDropDown(false);
              }}
              minimumDate={new Date('1950-01-01')}
              maximumDate={new Date()}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={searchRecord}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          <View style={styles.listHeader}>
            <Text>Date</Text>
            <Text>Check In</Text>
            <Text>Check Out</Text>
            <Text>Total</Text>
          </View>
          <View style={styles.separator}></View>
          {records && records.length > 0 ? (
            records.map((h: Record, index: number) => {
              const a = h.startTime ? moment(h.startTime) : null;
              const b = h.endTime ? moment(h.endTime) : null;
              const total = a && b ? `${b.diff(a, 'hours')}h` : '0h';
              return (
                <View style={styles.list} key={index}>
                  <Text>
                    {a ? `${moment(a || b).format('YYYY/MM/DD')}` : 'No record'}
                  </Text>
                  <Text>{a ? `${a.format('LT')}` : 'No record'}</Text>
                  <Text>{b ? `${b.format('LT')}` : 'No record'}</Text>
                  <Text>{`${total}`}</Text>
                </View>
              );
            })
          ) : (
            <Text style={styles.noMatch}>No records matched</Text>
          )}
        </ScrollView>
      ) : (
        <Text>You currenly have no working records</Text>
      )}
    </SafeAreaView>
  );
};

export default WorkingHistory;

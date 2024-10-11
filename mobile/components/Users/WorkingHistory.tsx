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

const WorkingHistory = (props: any) => {
  const {email} = useSelector(state => state.userInfo);
  const isFocused = useIsFocused();
  const [employerDropdownOpen, setEmployerDropdownOpen] = useState(false);
  const [fromDropdown, setFromDropDown] = useState(false);
  const [toDropdown, setToDropDown] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState<[] | null>(null);
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  useEffect(() => {
    if (isFocused) {
      getEmployers();
    }
  }, [isFocused]);

  const getEmployers = () => {
    axios
      .get(`${LOCAL_HOST_URL}/employers`, {
        params: {
          email,
        },
      })
      .then((res): any => {
        setItems(formatData(res.data));
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const searchRecord = () => {
    if (!validateInput()) return;
    axios
      .get(`${LOCAL_HOST_URL}/record/period`, {
        params: {
          epEmail: selectedEmployer,
          spEmail: email,
          from,
          to,
        },
      })
      .then(res => {
        const sorted = sortRecords(res.data);
        setHistory(sorted);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validateInput = () => {
    if (selectedEmployer.length < 1) {
      setInputError({
        type: 'EMPLOYER_EMPTY',
        msg: "Employer's name is required",
      });
      return false;
    }
    return true;
  };

  const formatData = (data: []) => {
    let result: any = [];
    data.map(d => {
      let subData: any = {};
      subData['label'] = `${d.first_name} ${d.last_name}`;
      subData['value'] = d.email_address;
      result.push(subData);
    });
    return result;
  };

  const sortRecords = (data: [{
    start_time: string,
    end_time: string
  }]) => {
    if (!data.length) return data;
    return data.sort((a, b) => {
      return new Date(a.start_time).valueOf() - new Date(b.start_time).valueOf();
    })
  }

  const onPeriodChange = (type, data) => {
    setFromDropDown(false);
    type === 'from'
      ? setFrom(moment(data).format('YYYY-MM-DD'))
      : setTo(moment(data).format('YYYY-MM-DD'));
  };

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <SafeAreaView style={styles.container}>
      {items.length > 0 ? (
        <View>
          <View>
            <Text style={styles.subHeader}>Select employer's name</Text>
            {inputError.type === 'EMPLOYER_EMPTY' && (
              <Text style={{fontSize: 12, color: '#FF0000'}}>
                {inputError.msg}
              </Text>
            )}
            <DropDownPicker
              style={styles.dropwdown}
              open={employerDropdownOpen}
              value={selectedEmployer}
              items={items}
              setOpen={setEmployerDropdownOpen}
              setValue={setSelectedEmployer}
              setItems={setItems}
              placeholder="Employer's name"
            />
          </View>
          <View
            style={employerDropdownOpen ? {marginTop: 120} : {marginTop: 10}}>
            <Text style={styles.subHeader}>Select period</Text>
            <TouchableOpacity
              onPress={() => setFromDropDown(!fromDropdown)}
              style={styles.dropdown_2}>
              <Text style={styles.dropdownText}>{from ? from : 'From'}</Text>
              <View style={styles.arrow} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setToDropDown(!toDropdown)}
              style={styles.dropdown_2}>
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
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={searchRecord}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
          {history !== null && history.length > 0 && (
            <View>
              <View style={styles.listHeader}>
                <Text>Date</Text>
                <Text>Check In</Text>
                <Text>Check Out</Text>
                <Text>Total</Text>
              </View>
              <Separator />
              <ScrollView>
                {history.map(
                  (
                    h: {
                      start_time: string;
                      end_time: string;
                    },
                    index: number,
                  ) => {
                    const a = h.start_time ? moment(h.start_time) : null;
                    const b = h.end_time ? moment(h.end_time) : null;
                    const total = a && b ? `${b.diff(a, 'hours')}h` : 'N/A';
                    return (
                      <View style={styles.list} key={index}>
                        <Text>
                          {a ? `${moment(a || b).format('YYYY/MM/DD')}` : 'N/A'}
                        </Text>
                        <Text>{a ? `${a.format('LT')}` : 'N/A'}</Text>
                        <Text>{b ? `${b.format('LT')}` : 'N/A'}</Text>
                        <Text>{`${total}`}</Text>
                      </View>
                    );
                  },
                )}
              </ScrollView>
            </View>
          )}
          {history !== null && history.length === 0 && (
            <View>
              <Text style={{textAlign: 'center', marginTop: 50}}>
                No records matched
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text>You currenly have no working records</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default WorkingHistory;

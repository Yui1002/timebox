import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {LOCAL_HOST_URL} from '../../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../../styles/viewWorkingHistoryStyles.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {Footer, Button, Error, Separator, Input} from '../../index';

interface searchResult {
  start_time: string;
  end_time: string;
}

const ViewWorkingHistory = ({route, navigation}: any) => {
  const epEmail = useSelector(state => state.userInfo).email;
  const {spEmail} = route.params;
  const [fromDropdown, setFromDropDown] = useState(false);
  const [toDropdown, setToDropDown] = useState(false);
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [searchResult, setSearchResult] = useState<[] | null>(null);

  const onPeriodChange = (type: string, date: string) => {
    type === 'from'
      ? setFrom(moment(date).format('YYYY-MM-DD'))
      : setTo(moment(date).format('YYYY-MM-DD'));
  };

  const search = () => {
    axios
      .get(`${LOCAL_HOST_URL}/record/period`, {
        params: {
          epEmail,
          spEmail,
          from,
          to,
        },
      })
      .then(res => {
        setSearchResult(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.subHeader}>Select period</Text>
        <View style={styles.align}>
          <TouchableOpacity
            onPress={() => setFromDropDown(!fromDropdown)}
            style={styles.dropdown}>
            <Text style={styles.dropdownText}>{from ? from : 'From'}</Text>
            <MaterialIcons name="arrow-drop-down" size={36} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setToDropDown(!toDropdown)}
            style={styles.dropdown}>
            <Text style={styles.dropdownText}>{to ? to : 'To'}</Text>
            <MaterialIcons name="arrow-drop-down" size={36} color="#000" />
          </TouchableOpacity>
        </View>
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
      <Button title='Search' onPress={search} />
      <View style={styles.align}>
        <Text>Date</Text>
        <Text>Check In</Text>
        <Text>Check Out</Text>
        <Text>Total</Text>
      </View>
      <View style={styles.separator}></View>
      {searchResult && searchResult.length > 0 && (
        <View>
          {searchResult.map((s: searchResult, index: number) => {
            const a = s.start_time ? moment(s.start_time) : null;
            const b = s.end_time ? moment(s.end_time) : null;
            const total = a && b ? `${b.diff(a, 'hours')}h` : 'N/A';
            return (
              <View style={styles.align} key={index}>
                <Text>
                  {a ? `${moment(a || b).format('YYYY/MM/DD')}` : 'N/A'}
                </Text>
                <Text>{a ? `${a.format('LT')}` : 'N/A'}</Text>
                <Text>{b ? `${b.format('LT')}` : 'N/A'}</Text>
                <Text>{`${total}`}</Text>
              </View>
            );
          })}
        </View>
      )}
      {searchResult && !searchResult.length && (
        <View style={{marginTop: 20}}>
          <Text style={styles.noMatchFound}>No match found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ViewWorkingHistory;

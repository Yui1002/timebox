import React, {useEffect, useState} from 'react';
import {UseSelector, useSelector} from 'react-redux';
import {LOCAL_HOST_URL} from '../../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../../styles/viewWorkingHistoryStyles.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const ViewWorkingHistory = ({route, navigation}: any) => {
  const epEmail = useSelector(state => state.userInfo).email;
  const {spEmail} = route.params;
  console.log(spEmail);
  const [fromDropdown, setFromDropDown] = useState(false);
  const [toDropdown, setToDropDown] = useState(false);
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [searchResult, setSearchResult] = useState([]);

  const onPeriodChange = (type: string, date: string) => {
    type === 'from'
      ? setFrom(moment(date).format('YYYY-MM-DD'))
      : setTo(moment(date).format('YYYY-MM-DD'));
  };

  const search = () => {
    console.log(epEmail, spEmail, from, to);

    axios
      .get(`${LOCAL_HOST_URL}/record`, {
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
      .catch(() => {});
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
      <TouchableOpacity style={styles.searchBtn} onPress={search}>
        <Text style={styles.searchBtnText}>Search</Text>
      </TouchableOpacity>
      <View style={{marginTop: 20}}>
        <View style={styles.align}>
          <Text>Date</Text>
          <Text>Check In</Text>
          <Text>Check Out</Text>
          <Text>Total</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewWorkingHistory;

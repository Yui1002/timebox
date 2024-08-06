import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux'
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Button,
  FlatList,
} from 'react-native';
import {styles} from '../../styles/workingHistoryStyles.js';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const WorkingHistory = (props: any) => {
  const userInfo = useSelector(state => state.workShifts);
  const {email} = userInfo;
  const [employerDropdownOpen, setEmployerDropdownOpen] = useState(false);
  const [fromDropdown, setFromDropDown] = useState(false);
  const [toDropdown, setToDropDown] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState<string>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState<[] | null>(null);

  useEffect(() => {
    getEmployers();
  }, []);

  const getEmployers = () => {
    axios.get(`${LOCAL_HOST_URL}/employers/${email}`).then((res): any => {
      setItems(formatData(res.data));
    });
  };

  const searchRecord = () => {
    axios
      .get(`${LOCAL_HOST_URL}/record`, {
        params: {
          employerEmail: selectedEmployer,
          serviceProviderEmail: email,
          from,
          to,
        },
      })
      .then(res => {
        setHistory(res.data);
      })
      .catch(() => {});
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
            <Text style={styles.subHeader}>Search by an employer's name</Text>
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
            <Text style={styles.subHeader}>Search by period</Text>
            <TouchableOpacity
              onPress={() => setFromDropDown(!fromDropdown)}
              style={styles.dropdown_2}>
              <Text style={styles.dropdownText}>{from ? from : 'From'}</Text>
              <View style={styles.arrow} />
            </TouchableOpacity>
            <View style={{marginVertical: 10}}></View>
            <TouchableOpacity
              onPress={() => setToDropDown(!toDropdown)}
              style={styles.dropdown_2}>
              <Text style={styles.dropdownText}>{to ? to : 'To'}</Text>
              <View style={styles.arrow} />
            </TouchableOpacity>
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
          {selectedEmployer && from && to && (
            <View style={styles.button}>
              <Button title="Search" color="#fff" onPress={searchRecord} />
            </View>
          )}
          {history === null && (
            <View>
              <Text style={{textAlign: 'center', marginTop: 150}}>
                Search from above!
              </Text>
            </View>
          )}
          {history !== null && history.length && (
            <View>
              <View style={styles.listHeader}>
                <Text>Date</Text>
                <Text>Check In</Text>
                <Text>Check Out</Text>
                <Text>Total</Text>
              </View>
              <Separator />
              <View>
                <FlatList
                  data={history}
                  renderItem={({item}) => (
                    <View style={styles.list}>
                      <Text>
                        {moment(item.start_time).format('YYYY/MM/DD')}
                      </Text>
                      <Text>{moment(item.start_time).format('LT')}</Text>
                      <Text>{moment(item.end_time).format('LT')}</Text>
                      <Text>Total</Text>
                    </View>
                  )}
                />
              </View>
            </View>
          )}
          {history !== null && history.length === 0 && (
            <View>
              <Text>No records matched</Text>
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

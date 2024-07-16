import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TouchableOpacity, Button} from 'react-native';
import {styles} from '../../styles/workingHistoryStyles.js';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';

const WorkingHistory = (props: any) => {
  const {email, firstName, lastName} = props.params;
  const [employerDropdownOpen, setEmployerDropdownOpen] = useState(false);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState({
    from: null,
    to: null,
  });
  const [items, setItems] = useState([]);
  const [from, setFrom] = useState([]);

  useEffect(() => {
    getEmployers();
  }, []);

  const getEmployers = () => {
    axios
      .get(`${LOCAL_HOST_URL}/employers/${email}`)
      .then(res => {
        const data = formatData(res.data);
        setItems(data);
      })
      .catch(() => {});
  };

  const searchRecord = (employerEmail: string) => {
    console.log('selected employer', selectedEmployer);
    axios
      .get(`${LOCAL_HOST_URL}/record/${employerEmail}`)
      .then(() => {})
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

  const Separator = () => <View style={styles.separator}></View>;

  return (
    <SafeAreaView style={styles.container}>
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
          placeholder={'Choose an employer'}
          onChangeValue={() => searchRecord(selectedEmployer)}
        />
      </View>
      {selectedEmployer && (
        <View style={employerDropdownOpen ? {marginTop: 120} : {marginTop: 10}}>
          <Text style={styles.subHeader}>Search by period</Text>
          <TouchableOpacity
            onPress={() => setPeriodDropdownOpen(!periodDropdownOpen)}
            style={{
              height: 40,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderRadius: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{lineHeight: 36, paddingLeft: 10}}>From</Text>
            <View
              style={{
                marginRight: 16,
                marginTop: 12,
                width: 10,
                height: 10,
                borderColor: '#484848',
                borderStyle: 'solid',
                borderTopWidth: 0,
                borderRightWidth: 2,
                borderBottomWidth: 2,
                borderLeftWidth: 0,
                padding: 3,
                transform: 'rotate(45deg)',
              }}
            />
          </TouchableOpacity>
          <View style={{marginVertical: 10}}></View>
          <TouchableOpacity
            onPress={() => setPeriodDropdownOpen(!periodDropdownOpen)}
            style={{
              height: 40,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderRadius: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{lineHeight: 36, paddingLeft: 10}}>To</Text>
            <View
              style={{
                marginRight: 16,
                marginTop: 12,
                width: 10,
                height: 10,
                borderColor: '#484848',
                borderStyle: 'solid',
                borderTopWidth: 0,
                borderRightWidth: 2,
                borderBottomWidth: 2,
                borderLeftWidth: 0,
                padding: 3,
                transform: 'rotate(45deg)',
              }}
            />
          </TouchableOpacity>
          <DatePicker
            modal
            open={periodDropdownOpen}
            mode="date"
            date={new Date()}
            onConfirm={date => {
              setPeriodDropdownOpen(false);
              setFrom(date);
            }}
            onCancel={() => {
              setPeriodDropdownOpen(false);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default WorkingHistory;

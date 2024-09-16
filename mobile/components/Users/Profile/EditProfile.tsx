import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TextInput, Button} from 'react-native';
import {styles} from '../../../styles/editProfileStyles.js';
import DropdownPicker from '../DropdownPicker';

const EditProfile = ({route, navigation}: any) => {
  const {status, rate, rate_type, shifts} = route.params;
  const [editRate, setEditRate] = useState(rate);
  const [editRateType, setEditRateType] = useState(rate_type);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Hourly', value: 'hourly'},
    {label: 'Daily', value: 'daily'},
  ]);

  const deleteDate = (day: any) => {};

  const saveChanges = () => {};

  const navigateToAddSchedule = () => {
    navigation.navigate('EditWorkShifts', {
      status,
      rate,
      rate_type,
      shifts,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <View style={{width: '45%'}}>
          <Text style={styles.text}>Rate</Text>
          <TextInput
            value={`${editRate}`}
            style={styles.input}
            onChangeText={val => setEditRate(val)}
          />
        </View>
        <View style={{width: '45%'}}>
          <Text style={styles.rateTypeText}>Rate Type</Text>
          <DropdownPicker.DropdownPicker
            open={open}
            value={editRateType}
            items={items}
            setOpen={setOpen}
            setValue={setEditRateType}
            setItems={setItems}
          />
        </View>
      </View>
      <View>
        <Text style={styles.text}>Status</Text>
        <Text>{status}</Text>
      </View>
      <View>
        <Text style={styles.text}>Schedule</Text>
        {shifts[0].day ? (
          shifts.map((s, index) => (
            <View
              key={index}
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: '30%'}}>{s.day}</Text>
              <Text style={{width: '50%'}}>
                {s.start_time} ~ {s.end_time}
              </Text>
              <Text style={styles.delete} onPress={() => deleteDate(w)}>
                Delete
              </Text>
            </View>
          ))
        ) : (
          <Text>Not specified</Text>
        )}
      </View>
      <View style={styles.addButton}>
        <Button
          title={`${String.fromCharCode(43)}  Add Schedule`}
          color="#fff"
          onPress={navigateToAddSchedule}
        />
      </View>
      {/* <View style={{width: '100%', backgroundColor: '#24a0ed', borderRadius: 10}}>
        <Button title="Save" color="#fff" onPress={saveChanges} />
      </View> */}
    </SafeAreaView>
  );
};

export default EditProfile;

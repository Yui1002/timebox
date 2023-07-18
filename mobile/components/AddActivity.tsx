import {View, Text, TextInput, StyleSheet, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles, {add_user_styles} from '../styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import constant from '../parameters/constant';

const AddActivity = () => {
  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState('');
  const [endTime, setEndTime] = useState('No');
  const [rate, setRate] = useState(0);
  const [rateType, setRateType] = useState('');
  const [status, setStatus] = useState('');
  const [endTimeOpen, setEndTimeOpen] = useState(false);
  const [rateTypeOpen, setRateTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const addActivity = () => {};

  return (
    <View style={styles.container}>
      <View style={add_user_styles.container}>
        <Text style={styles.title}>List Activities</Text>
        {activities.length < 1 ? (
          <View>
            <Text>No activity found</Text>
          </View>
        ) : (
          <View style={styles.list_user_container}>
            <View style={styles.list_user_previewContainer}>
              <View style={styles.list_user_headerBox}>
                <Text style={styles.list_user_box_text}>Name</Text>
              </View>
              <View style={styles.list_user_headerBox}>
                <Text style={styles.list_user_box_text}>Status</Text>
              </View>
            </View>
            <View>
              {activities.map(user => (
                <View>
                    <Text></Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
      <View style={add_user_styles.container}>
        <Text style={styles.title}>Add Activities</Text>
        <View>
          <Text>Activity Name *</Text>
          <TextInput
            style={styles.add_user_name}
            onChangeText={text => setActivity(text)}
            autoCorrect={false}
          />
        </View>
        <View>
          <Text>rate *</Text>
          <TextInput
            style={styles.add_user_name}
            onChangeText={text => setRate(Number(text))}
            autoCorrect={false}
          />
        </View>
        <View style={[add_user_styles.dropDown, {marginBottom: rateTypeOpen ? 100 : 10}]}>
          <Text>rate type *</Text>
          <DropDownPicker
            open={rateTypeOpen}
            value={rateType}
            items={constant.rateType}
            setOpen={() => setRateTypeOpen(!rateTypeOpen)}
            setValue={val => setRateType(val)}
            dropDownDirection="BOTTOM"
          />
        </View>
        <View style={[add_user_styles.dropDown, {marginBottom: endTimeOpen ? 100 : 10}]}>
          <Text>Track End Time? *</Text>
          <DropDownPicker
            open={endTimeOpen}
            value={endTime}
            items={constant.trackEndTime}
            setOpen={() => setEndTimeOpen(!endTimeOpen)}
            setValue={val => setEndTime(val)}
            dropDownDirection="BOTTOM"
          />
        </View>
        <View style={[add_user_styles.dropDown, {marginBottom: statusOpen ? 100 : 10}]}>
          <Text>Status *</Text>
          <DropDownPicker
            open={statusOpen}
            value={status}
            items={constant.status}
            setOpen={() => setStatusOpen(!statusOpen)}
            setValue={val => setStatus(val)}
            dropDownDirection="BOTTOM"
          />
        </View>
      </View>
      <View style={styles.add_user_btn}>
        <Button title="Add" color="#fff" onPress={addActivity} />
      </View>
    </View>
  );
};

export default AddActivity;

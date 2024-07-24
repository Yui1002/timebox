import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Button, Alert} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import StatusBar from './StatusBar';

interface Shifts {
  day: string;
  startTime: string;
  endTime: string;
}

const WorkShifts = ({route, navigation}: any) => {
  console.log('params in work shifts', route.params);
  const statusTitles = ['Information', 'Work Shifts', 'Review'];
  const [selectedDays, setSelectedDays] = useState<Array<Shifts>>([]);

  const deleteDate = (day: Shifts) => {
    const result = selectedDays.filter(
      s => JSON.stringify(s) !== JSON.stringify(day),
    );
    setSelectedDays(result);
  };

  const review = () => {
    if (selectedDays.length === 0) {
      showAlert();
      return;
    }

    navigation.navigate('Review', {
      params: route.params,
      workShifts: selectedDays,
    });
  };

  const navigateToAddSchedule = () => {
    navigation.navigate('RegisterWorkShifts', {
      params: route.params,
      selectedDays,
      setSelectedDays,
    });
  };

  const showAlert = () => {
    Alert.alert(
      `Do you want to proceed?`,
      'No assigned schedules. You can add later',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () =>
            navigation.navigate('Review', {
              params: route.params,
            }),
        },
      ],
    );
  };

  return (
    <View style={[styles.container, {height: '100%'}]}>
      <View style={[styles.statusBarContainer, {height: '10%'}]}>
        {statusTitles.map((val, index) =>
          statusTitles[index] === 'Work Shifts' ? (
            <StatusBar key={index} title={val} isFocused={true} />
          ) : (
            <StatusBar key={index} title={val} isFocused={false} />
          ),
        )}
      </View>
      <View style={{marginVertical: 20, height: '60%'}}>
        <Text style={{fontSize: 20, fontWeight: 500}}>Work Schedules</Text>
        {selectedDays.length > 0 ? (
          selectedDays.map(day => (
            <View style={styles.dateContainer}>
              <Text style={{width: '30%'}}>{day.day}</Text>
              <Text style={{width: '50%'}}>
                {day.startTime} ~ {day.endTime}
              </Text>
              <Text style={styles.delete} onPress={() => deleteDate(day)}>
                Delete
              </Text>
            </View>
          ))
        ) : (
          <Text style={{textAlign: 'center', marginTop: 40}}>
            No date and time selected
          </Text>
        )}
        <View style={styles.addButton}>
          <Button
            title={`${String.fromCharCode(43)}  Add Schedule`}
            color="#fff"
            onPress={navigateToAddSchedule}
          />
        </View>
      </View>
      <View style={styles.workShiftsBtn}>
        <View style={styles.workShiftsBtn_back}>
          <Button
            title="Back"
            onPress={() => navigation.goBack()}
            color="#fff"
          />
        </View>
        <View style={styles.workShiftsBtn_add}>
          <Button
            title={`Review  ${String.fromCharCode(9654)}`}
            onPress={review}
            color="#fff"
          />
        </View>
      </View>
    </View>
  );
};

export default WorkShifts;

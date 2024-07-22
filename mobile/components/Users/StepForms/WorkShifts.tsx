import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableOpacityBase,
} from 'react-native';
import {styles} from '../../../styles/stepFormsStyles.js';
import StatusBar from './StatusBar';
import InputField from '../../InputField';
import InputError from '../../InputError';
import DropdownPicker from '../DropdownPicker';
import Button from '../Button';

const WorkShifts = ({route, navigation}: any) => {
  const statusTitles = ['Information', 'Work Shifts', 'Review'];
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isDaySelected, setIsDaySelected] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.statusBarContainer}>
        {statusTitles.map((val, index) =>
          statusTitles[index] === 'Work Shifts' ? (
            <StatusBar key={index} title={val} isFocused={true} />
          ) : (
            <StatusBar key={index} title={val} isFocused={false} />
          ),
        )}
      </View>
      <View>
        <Text style={styles.header}>Work Shifts</Text>
        <Text style={{marginVertical: 4}}>Select day</Text>
        <View
          style={{
            width: '100%',
            height: 150,
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {days.map(d => (
            <TouchableOpacity
              style={{
                // backgroundColor: '#24a0ed',
                backgroundColor: '#ccc',
                borderRadius: 20,
                width: 100,
                height: 30,
                marginVertical: 4,
              }}
              onPress={() => setIsDaySelected(true)}>
              <Text
                style={{
                  color: '#fff',
                  padding: 6,
                  textAlign: 'center',
                  fontWeight: 400,
                }}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          <Text style={{marginVertical: 4}}>Select time</Text>
          {open && (
            <DropdownPicker.DateDropdownPicker
              open={open}
              date={date}
              setOpen={setOpen}
              setDate={setDate}
            />
          )}
        </View>
        <View>
          <TouchableOpacity
            style={{
              borderBottomWidth: 1,
              paddingTop: 20,
              borderBottomColor: '#ccc',
              width: '40%',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
            <Text style={{color: '#505050'}}>Start</Text>
            <View
              style={{
                width: 10,
                height: 10,
                borderTopWidth: 0,
                borderRightWidth: 2,
                borderBottomWidth: 2,
                borderLeftWidth: 0,
                borderStyle: 'solid',
                borderColor: '#000',
                padding: 2,
                transform: 'rotate(45deg)',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WorkShifts;

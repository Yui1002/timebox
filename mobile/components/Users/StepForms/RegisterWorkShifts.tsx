import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity} from 'react-native';
import DropdownPicker from '../DropdownPicker';
import moment from 'moment';
import {addShift} from '../../../redux/actions/workShiftsAction';
import {WorkShiftsProps, Schedule} from '../../../types';
import {ErrorModel} from '../../../types';
import { Footer, Button, Error } from '../../index'
import Validator from '../../../validator/validator';
import {Screen, Days} from '../../../enums';
import {
  ContainerStyle,
  ButtonStyle,
  InputStyle,
  TextStyle,
  IconStyle,
} from '../../../styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../../styles/theme';

const RegisterWorkShifts = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const params: WorkShiftsProps = route.params;
  const workShifts = useSelector(state => state.workShifts);
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [error, setError] = useState<ErrorModel>({message: ''});

  const validateInput = () => {
    const validateErr = Validator.validateWorkShifts(workShifts.workShifts, selectedDay, startTime, endTime);
    if (validateErr) {
      setError({message: validateErr});
    }
    return null;
  };

  const add = () => {
    if (!validateInput()) return;

    const value: Schedule = {
      day: selectedDay,
      startTime: moment(startTime).format('LT'),
      endTime: moment(endTime).format('LT'),
    };

    dispatch(addShift(value));
    navigation.navigate(Screen.WORK_SHIFTS, params);
  };

  let topContainer = ContainerStyle.createTopContainerStyle();
  let alignTopContainer = ContainerStyle.createAlignTopContainer();
  let wrapContainer = ContainerStyle.createWrapContainer();
  let alignContainer = ContainerStyle.createAlignContainer();
  let titleText = TextStyle.createTitleTextStyle();
  let selectedButton = ButtonStyle.createSelectedDayButtonStyle();
  let button = ButtonStyle.createDayButtonStyle();
  let buttonText = TextStyle.createButtonTextStyle();
  let continuBtn = ButtonStyle.createContinueButtonStyle();
  let backBtn = ButtonStyle.createBackButtonStyle();
  let dropdown = InputStyle.createDropdown3Style();
  let dropdownText = TextStyle.createDropdownTextStyle();
  let icon = IconStyle.createBasicIconStyle();

  return (
    <View style={topContainer}>
      <View style={{marginTop: 30}}>
        {error.message && <Error msg={error.message} />}
        <Text style={titleText}>Select day and time</Text>
        <View style={wrapContainer}>
          {Object.values(Days).map((day: string, key: number) => (
            <TouchableOpacity
              key={key}
              style={selectedDay === day ? selectedButton : button}
              onPress={() => setSelectedDay(day)}>
              <Text style={buttonText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View>
          {startOpen && (
            <DropdownPicker.DateDropdownPicker
              open={startOpen}
              date={startTime}
              setOpen={setStartOpen}
              setDate={setStartTime}
            />
          )}
          {endOpen && (
            <DropdownPicker.DateDropdownPicker
              open={endOpen}
              date={endTime}
              setOpen={setEndOpen}
              setDate={setEndTime}
            />
          )}
        </View>
        <View style={alignTopContainer}>
          <View style={alignContainer}>
            <Text style={titleText}>Start time</Text>
            <TouchableOpacity
              onPress={() => setStartOpen(true)}
              style={dropdown}>
              <Text style={dropdownText}>{moment(startTime).format('LT')}</Text>
              <MaterialIcons
                name="arrow-drop-down"
                size={36}
                color={COLORS.BLACK}
                style={icon}
              />
            </TouchableOpacity>
          </View>
          <View style={alignContainer}>
            <Text style={titleText}>End time</Text>
            <TouchableOpacity style={dropdown} onPress={() => setEndOpen(true)}>
              <Text style={dropdownText}>{moment(endTime).format('LT')}</Text>
              <MaterialIcons
                name="arrow-drop-down"
                size={36}
                color={COLORS.BLACK}
                style={icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={alignTopContainer}>
        <TouchableOpacity style={backBtn} onPress={() => navigation.goBack()}>
          <Text style={buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={continuBtn} onPress={add}>
          <Text style={buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterWorkShifts;

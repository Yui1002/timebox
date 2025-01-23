import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, TouchableOpacity, Button} from 'react-native';
import DropdownPicker from '../DropdownPicker';
import moment from 'moment';
import {addShift} from '../../../redux/actions/workShiftsAction';
import {WorkShiftsProps, Schedule} from '../../../types';
import {ErrorModel} from '../../../types';
import Error from '../../Error';
import Validator from '../../../validator/validator';
import {ErrMsg, Screen, Days} from '../../../enums';
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
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [error, setError] = useState<ErrorModel>({message: ''});

  const validateInput = () => {
    if (!Validator.isNotEmpty(selectedDay)) {
      setError({message: ErrMsg.DAY_EMPTY});
      return false;
    }
    if (workShifts.workShifts.some(shift => shift['day'] === selectedDay)) {
      setError({message: ErrMsg.DUPLICATE_DAY});
      return false;
    }
    if (startTime > endTime) {
      setError({message: ErrMsg.INVALID_TIME});
      return false;
    }
    if (endTime.getHours() - startTime.getHours() < 1) {
      setError({message: ErrMsg.INVALID_DURATION});
      return false;
    }
    return true;
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

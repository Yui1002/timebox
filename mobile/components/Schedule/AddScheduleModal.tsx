import React, {useEffect, useState} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../styles/theme';
import {DateDropdown, Dropdown} from '../Common/CustomDropdown';
import Button from '../Common/Button';
import {AlignContainer} from '../Common/Container';
import {Schedule} from '../../types';
import Validator from '../../validator/validator';
import { UserSchedule } from '../../swagger';

interface AddScheduleModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  addSchedule: (schedule: UserSchedule) => void;
  existingSchedules: UserSchedule[];
}

const AddScheduleModal = ({
  isModalVisible,
  setIsModalVisible,
  addSchedule,
  existingSchedules,
}: AddScheduleModalProps) => {
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [isStartTimeDropdownOpen, setIsStartTimeDropdownOpen] = useState(false);
  const [isEndTimeDropdownOpen, setIsEndTimeDropdownOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [items, setItems] = useState([
    {label: 'Monday', value: 'Monday'},
    {label: 'Tuesday', value: 'Tuesday'},
    {label: 'Wednesday', value: 'Wednesday'},
    {label: 'Thursday', value: 'Thursday'},
    {label: 'Friday', value: 'Friday'},
    {label: 'Saturday', value: 'Saturday'},
    {label: 'Sunday', value: 'Sunday'},
  ]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!isModalVisible) {
      setIsStartTimeDropdownOpen(false);
      setIsEndTimeDropdownOpen(false);
      setSelectedDay('');
      setStartTime(null);
      setEndTime(null);
    }
  }, [isModalVisible]);

  const handleAdd = () => {
    if (!selectedDay || !startTime || !endTime) {
      alert('Please select a day, start time, and end time.');
      return;
    }

    const isDuplicate = existingSchedules.some(
      schedule => schedule.day === selectedDay,
    );

    if (isDuplicate) {
      alert(`The schedule for ${selectedDay} is already registered.`);
      return;
    }

    const validateErr = Validator.validateWorkingRecordSelect(
      startTime,
      endTime,
    );

    if (validateErr) {
        alert(`End time must be after start time`);
        return;
    }

    addSchedule({
      day: selectedDay,
      start_time: startTime.momentFormat('LT'),
      end_time: endTime.momentFormat('LT'),
    });
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Schedule</Text>
          <View
            style={[
              styles.dropdownContainer,
              isDayDropdownOpen && {zIndex: 3},
            ]}>
            <Text>Day</Text>
            <Dropdown
              isOpen={isDayDropdownOpen}
              value={selectedDay}
              items={items}
              setOpen={() => setIsDayDropdownOpen(!isDayDropdownOpen)}
              setValue={(day: string) => setSelectedDay(day)}
              setItems={setItems}
            />
          </View>
          <View
            style={[
              styles.dropdownContainer,
              isStartTimeDropdownOpen ? {zIndex: 2} : {zIndex: 1},
              // isStartTimeDropdownOpen && {zIndex: 2},
            ]}>
            <Text>Start time</Text>
            <DateDropdown
              placeholder={
                startTime ? startTime.momentFormat('LT') : 'Select start time'
              }
              boxWidth={'100%'}
              boxHeight={'70%'}
              onPressDropdown={() => {
                setIsStartTimeDropdownOpen(!isStartTimeDropdownOpen);
              }}
              isDisabled={false}
              mode="time"
              isOpen={isStartTimeDropdownOpen}
              date={startTime || new Date()}
              onConfirm={(time: Date) => setStartTime(time)}
              onCancel={() => {
                setIsStartTimeDropdownOpen(false);
              }}
              isArrowIconShown={true}
            />
          </View>
          <View
            style={[
              styles.dropdownContainer,
              isEndTimeDropdownOpen ? {zIndex: 2} : {zIndex: 1},
              // isEndTimeDropdownOpen && {zIndex: 2},
            ]}>
            <Text>End time</Text>
            <DateDropdown
              placeholder={
                endTime ? endTime.momentFormat('LT') : 'Select end time'
              }
              boxWidth={'100%'}
              boxHeight={'70%'}
              onPressDropdown={() => {
                setIsEndTimeDropdownOpen(!isEndTimeDropdownOpen);
              }}
              isDisabled={false}
              mode="time"
              isOpen={isEndTimeDropdownOpen}
              date={endTime || new Date()}
              onConfirm={(time: Date) => setEndTime(time)}
              onCancel={() => {
                setIsEndTimeDropdownOpen(false);
              }}
              isArrowIconShown={true}
            />
          </View>
          <AlignContainer>
            <Button
              title="Cancel"
              onPress={() => setIsModalVisible(false)}
              buttonWidth={'48%'}
              buttonHeight={'45%'}
              buttonColor={COLORS.LIGHT_GREY}
            />
            <Button
              title="Add"
              onPress={handleAdd}
              buttonWidth={'48%'}
              buttonHeight={'45%'}
            />
          </AlignContainer>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    height: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    height: '8%',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 10,
    zIndex: 1, // Default zIndex
    height: '22%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  saveButton: {
    backgroundColor: COLORS.BLUE,
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.LIGHT_GREY,
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddScheduleModal;

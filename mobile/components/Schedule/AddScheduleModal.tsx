import React, {useEffect, useState} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../styles/theme';
import {DateDropdown, Dropdown} from '../Common/CustomDropdown';
import {convertDateToEpoch, convertEpochToDate} from '../../helper/DateUtils';
import Button from '../Common/Button';
import {AlignContainer} from '../Common/Container';
import {DefaultApiFactory, Record} from '../../swagger';
import {getAuthHeader} from '../../tokenUtils';
import Validator from '../../validator/validator';
import {ResultModel} from '../../types';
import {StatusModel} from '../../enums';
let api = DefaultApiFactory();

interface AddScheduleModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  //   rowSelected: Record | null;
  //   setResult: React.Dispatch<React.SetStateAction<ResultModel>>;
  //   setRowSelected: React.Dispatch<React.SetStateAction<Record | null>>
  //   updateRecord: any;
  //   resetSelection: () => void;
  //   updatedBy: string;
}

const AddScheduleModal = ({
  isModalVisible,
  setIsModalVisible,
}: //   rowSelected,
//   setResult,
//   updateRecord,
//   setRowSelected,
//   resetSelection,
//   updatedBy
AddScheduleModalProps) => {
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [isStartTimeDropdownOpen, setIsStartTimeDropdownOpen] = useState(false);
  const [isEndTimeDropdownOpen, setIsEndTimeDropdownOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [items, setItems] = useState([
    {label: 'Monday', value: 'Monday'},
    {label: 'Tuesday', value: 'Tuesday'},
    {label: 'Wednesday', value: 'Wednesday'},
    {label: 'Thursday', value: 'Thursday'},
    {label: 'Saturday', value: 'Saturday'},
    {label: 'Sunday', value: 'Sunday'},
  ]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  return (
    <Modal
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Schedule</Text>
          <View style={{height: '30%'}}>
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
          <View style={{height: '30%'}}>
            <Text>Start time</Text>
            <DateDropdown
              placeholder={startTime ? startTime.momentFormat('LT') : 'Select start time'}
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
          <View style={{height: '30%'}}>
            <Text>End time</Text>
            <DateDropdown
              placeholder={endTime ? endTime.momentFormat('LT') : 'Select end time'}
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
              onPress={() => {

                setIsModalVisible(false);
              }}
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
    height: '40%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    height: '8%',
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

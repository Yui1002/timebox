import React, {useEffect, useState} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../styles/theme';
import {DateDropdown} from '../Common/CustomDropdown';
import {convertDateToEpoch, convertEpochToDate} from '../../helper/DateUtils';
import Button from '../Common/Button';
import {AlignContainer} from '../Common/Container';
import {DefaultApiFactory, Employer, Record, TimeType} from '../../swagger';
import {getAuthHeader} from '../../tokenUtils';
import Validator from '../../validator/validator';
import {ResultModel} from '../../types';
import {StatusModel} from '../../enums';
let api = DefaultApiFactory();

interface AddRecordModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  setResult: React.Dispatch<React.SetStateAction<ResultModel>>;
  employer: Employer;
  serviceProviderEmail: string;
  updateRecord: (newRecord: Record) => void;
}

const AddRecordModal = ({
  isModalVisible,
  setIsModalVisible,
  setResult,
  employer,
  serviceProviderEmail,
  updateRecord,
}: AddRecordModalProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [isDateOpen, setIsDateOpen] = useState<boolean>(false);
  const [isStartDropdownOpen, setIsStartDropdownOpen] =
    useState<boolean>(false);
  const [isEndDropdownOpen, setIsEndDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isModalVisible) {
      setIsDateOpen(false);
      setIsStartDropdownOpen(false);
      setIsEndDropdownOpen(false);
    }
  }, [isModalVisible]);

  const validateInput = (): boolean => {
    const validateErr = Validator.validateWorkingRecordSelect(
      startTime,
      endTime,
    );
    if (validateErr) {
      setResult({
        status: StatusModel.ERROR,
        message: validateErr,
      });
    }
    return validateErr == null;
  };

  const addRecord = async () => {
    if (!validateInput()) return;

    const combinedStartTime = combineDateTime(date, startTime);
    const combinedEndTime = combineDateTime(date, endTime);

    const startTimeInEpoch = convertDateToEpoch(combinedStartTime);
    const endTimeInEpoch = convertDateToEpoch(combinedEndTime);

    try {
      const header = await getAuthHeader();
      if (!header) return null;

      await api.addRecord(
        {
          employerEmail: employer.email,
          serviceProviderEmail: serviceProviderEmail,
          startTime: startTimeInEpoch,
          endTime: endTimeInEpoch,
          updateBy: serviceProviderEmail,
        },
        header,
      );
      const newRecord: Record = {
        epoch_start_time: startTimeInEpoch.toString(),
        epoch_end_time: endTimeInEpoch.toString(),
        rate: undefined,
        rate_type: undefined,
      };

      updateRecord(newRecord);

      setResult({
        status: StatusModel.SUCCESS,
        message: 'Successfully updated record',
      });
      setIsModalVisible(false);
    } catch (e) {
      setResult({
        status: StatusModel.ERROR,
        message: e.response.data.mmessage,
      });
    }
  };

  const combineDateTime = (selectedDate: Date, selectedTime: Date): Date => {
    const combineDateTime = new Date(selectedDate);
    combineDateTime.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        selectedTime.getSeconds(),
        selectedTime.getMilliseconds()
    );
    return combineDateTime;
  }

  return (
    <Modal
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Record</Text>
          <View style={{height: '24%'}}>
            <Text>Date</Text>
            <DateDropdown
              placeholder={`${date.momentFormat('YYYY-MM-DD')}`}
              boxWidth={'100%'}
              boxHeight={'70%'}
              onPressDropdown={() => {
                setIsDateOpen(!isDateOpen);
              }}
              isDisabled={false}
              mode="date"
              isOpen={isDateOpen}
              date={date || new Date()}
              onConfirm={(time: Date) => setDate(time)}
              onCancel={() => {
                setIsDateOpen(false);
              }}
              isArrowIconShown={true}
              maximumDate={new Date()}
              minimumDate={new Date('2022-01-01')}
            />
          </View>
          <View style={{height: '24%'}}>
            <Text>Start time</Text>
            <DateDropdown
              placeholder={`${startTime.momentFormat('LT')}`}
              boxWidth={'100%'}
              boxHeight={'70%'}
              onPressDropdown={() => {
                setIsStartDropdownOpen(!isStartDropdownOpen);
              }}
              isDisabled={false}
              mode="time"
              isOpen={isStartDropdownOpen}
              date={startTime || new Date()}
              onConfirm={(time: Date) => setStartTime(time)}
              onCancel={() => {
                setIsStartDropdownOpen(false);
              }}
              isArrowIconShown={true}
            />
          </View>
          <View style={{height: '24%'}}>
            <Text>End time</Text>
            <DateDropdown
              placeholder={`${endTime.momentFormat('LT')}`}
              boxWidth={'100%'}
              boxHeight={'70%'}
              onPressDropdown={() => {
                setIsEndDropdownOpen(!isEndDropdownOpen);
              }}
              isDisabled={false}
              mode="time"
              isOpen={isEndDropdownOpen}
              date={endTime || new Date()}
              onConfirm={(time: Date) => setEndTime(time)}
              onCancel={() => {
                setIsEndDropdownOpen(false);
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
              onPress={addRecord}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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

export default AddRecordModal;

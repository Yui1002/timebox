import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../styles/theme';
import {Button, AlignContainer} from '../index';
import {DateDropdown} from '../Common/CustomDropdown';
import {Schedule} from '../../types';
import Validator from '../../validator/validator';
<<<<<<< HEAD
=======
import { UserSchedule } from '../../swagger';
>>>>>>> c691609 (save current work)

interface EditWorkScheduleModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
<<<<<<< HEAD
  itemSelected: Schedule;
  updateSchedule: (updatedItem: Schedule) => void;
=======
  itemSelected: UserSchedule;
  updateSchedule: (updatedItem: UserSchedule) => void;
>>>>>>> c691609 (save current work)
}

const EditWorkScheduleModal = ({
  isModalVisible,
  setIsModalVisible,
  itemSelected,
  updateSchedule,
}: EditWorkScheduleModalProps) => {
  const [isStartDropdownOpen, setIsStartDropdownOpen] =
    useState<boolean>(false);
  const [isEndDropdownOpen, setIsEndDropdownOpen] = useState<boolean>(false);

  const [updatedStartTime, setUpdatedStartTime] = useState<string>(
    itemSelected.start_time!,
  );
  const [updatedEndTime, setUpdatedEndTime] = useState<string>(
    itemSelected.end_time!,
  );

  const saveChanges = async () => {
    if (!updatedStartTime || !updatedEndTime) {
      alert('Please select a start time and end time.');
      return;
    }

    const validateErr = Validator.isValidSchedule(
      updatedStartTime,
      updatedEndTime,
    );

    if (!validateErr) {
      alert(`End time must be after start time`);
      return;
    }

    const updatedItem = {
      ...itemSelected,
      startTime: updatedStartTime,
      endTime: updatedEndTime,
    };
    updateSchedule(updatedItem);
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Work Schedule</Text>
          <Text>{itemSelected.day}</Text>
          <View style={{height: '30%'}}>
            <Text>Start time</Text>
            <DateDropdown
              placeholder={`${updatedStartTime}`}
              boxWidth={'100%'}
              boxHeight={'70%'}
              onPressDropdown={() => {
                setIsStartDropdownOpen(!isStartDropdownOpen);
              }}
              isDisabled={false}
              mode="time"
              isOpen={isStartDropdownOpen}
              date={new Date()}
              onConfirm={(time: Date) =>
                setUpdatedStartTime(time.momentFormat('LT'))
              }
              onCancel={() => {
                setIsStartDropdownOpen(false);
              }}
              isArrowIconShown={true}
            />
          </View>
          <View style={{height: '30%'}}>
            <Text>End time</Text>
            <DateDropdown
              placeholder={`${updatedEndTime}`}
              boxWidth={'100%'}
              boxHeight={'70%'}
              onPressDropdown={() => {
                setIsEndDropdownOpen(!isEndDropdownOpen);
              }}
              isDisabled={false}
              mode="time"
              isOpen={isEndDropdownOpen}
              date={new Date()}
              onConfirm={(time: Date) =>
                setUpdatedEndTime(time.momentFormat('LT'))
              }
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
              title="Save"
              onPress={() => saveChanges()}
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

export default EditWorkScheduleModal;

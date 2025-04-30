import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../../styles/theme';
import {Button, AlignContainer} from '../index';
import ReusableDropdown from '../Common/ReusableDropdown';
import {DefaultApiFactory, UserSchedule} from '../../swagger';
import {ResultModel, Schedule} from '../../types';
import {StatusModel} from '../../enums';
let api = DefaultApiFactory();

interface EditWorkScheduleModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  itemSelected: Schedule;
  setResult: React.Dispatch<React.SetStateAction<ResultModel>>;
  updateSchedule: (updatedItem: Schedule) => void;
}

const EditWorkScheduleModal = ({
  isModalVisible,
  setIsModalVisible,
  itemSelected,
  setResult,
  updateSchedule
}: EditWorkScheduleModalProps) => {
  console.log('itemSelected is ', itemSelected);
  const [isStartDropdownOpen, setIsStartDropdownOpen] =
    useState<boolean>(false);
  const [isEndDropdownOpen, setIsEndDropdownOpen] = useState<boolean>(false);

  const [updatedStartTime, setUpdatedStartTime] = useState<string>(
    itemSelected.startTime!,
  );
  const [updatedEndTime, setUpdatedEndTime] = useState<string>(
    itemSelected.endTime!,
  );

  const validateInput = (): boolean => {
    return true;
  };

  const saveChanges = async () => {
    if (!validateInput()) return;

    const updatedItem = {
      ...itemSelected,
      startTime: updatedStartTime,
      endTime: updatedEndTime
    }
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
            <ReusableDropdown
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
            <ReusableDropdown
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

export default EditWorkScheduleModal;

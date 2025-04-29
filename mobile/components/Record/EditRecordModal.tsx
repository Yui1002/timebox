import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../../styles/theme';
import ReusableDropdown from '../Common/ReusableDropdown';
import {convertEpochToDate} from '../../helper/DateUtils';
import Button from '../Common/Button';
import {AlignContainer} from '../Common/Container';

interface EditRecordModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  startTime: number;
  endTime: number;
  onConfirmStartTime: (date: Date) => void;
  onConfirmEndTime: (date: Date) => void;
}

const EditRecordModal = ({
  isModalVisible,
  setIsModalVisible,
  startTime,
  endTime,
  onConfirmStartTime,
  onConfirmEndTime,
}: EditRecordModalProps) => {
  const startTimeDate = convertEpochToDate(startTime);
  const endTimeDate = convertEpochToDate(endTime);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Record</Text>
          <ReusableDropdown
            placeholder="Select Start Time"
            boxWidth={'100%'}
            boxHeight={'25%'}
            onPressDropdown={() => {}}
            isDisabled={false}
            mode="time"
            isOpen={isDropdownOpen}
            date={startTimeDate || new Date()}
            onConfirm={onConfirmStartTime}
            onCancel={() => {
              setIsDropdownOpen(false);
            }}
            isArrowIconShown={true}
          />
          <AlignContainer>
            <Button
              title="Save"
              onPress={() => console.log('save button pressed')}
              buttonWidth={'48%'}
              buttonHeight={'25%'}
            />
            <Button
              title="Cancel"
              onPress={() => console.log('cancel button pressed')}
              buttonWidth={'48%'}
              buttonHeight={'25%'}
              buttonColor={COLORS.LIGHT_GREY}
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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

export default EditRecordModal;

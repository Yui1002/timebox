import React, {Dispatch, SetStateAction} from 'react';
import {View, Button, Modal, Text} from 'react-native';
import {edit_user_styles} from '../styles/styles';

interface Props {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

const EditUser = ({modalVisible, setModalVisible}: Props) => {
  return (
    <View style={edit_user_styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={edit_user_styles.centeredView}>
          <View style={edit_user_styles.modalView}>
            <Text onPress={() => setModalVisible(!modalVisible)}>&#x2717;</Text>
            <Text>I am modal</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditUser;

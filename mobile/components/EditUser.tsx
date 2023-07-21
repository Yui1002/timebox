import React, {useState, Dispatch, SetStateAction} from 'react';
import {View, Button, Modal, Text, TextInput} from 'react-native';
import styles, {edit_user_styles} from '../styles/styles';
import DropDownPicker from 'react-native-dropdown-picker';
import constant from '../parameters/constant';

interface Props {
  firstName: string;
  lastName: string;
  username: string;
  rate: number;
  rateType: 'Hourly' | 'Daily';
  status: 'Active' | 'Inactive';
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

const EditUser = ({
  firstName,
  lastName,
  username,
  rate,
  rateType,
  status,
  modalVisible,
  setModalVisible,
}: Props) => {
  console.log('first name: ', firstName);
  const [updatedFirstName, setUpdatedFirstName] = useState(firstName);
  const [updatedLastName, setUpdatedLastName] = useState(lastName);
  const [updatedUsername, setUpdatedUsername] = useState(username);
  const [updatedRate, setUpdatedRate] = useState(rate);
  const [updatedRateType, setUpdatedRateType] = useState(rateType);
  const [updatedStatus, setUpdatedStatus] = useState(status);
  const [rateTypeOpen, setRateTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const saveUser = () => {};

  return (
    <View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={edit_user_styles.centeredView}>
          <View style={edit_user_styles.modalView}>
            <View style={edit_user_styles.close}>
              <Text
                style={edit_user_styles.closeIcon}
                onPress={() => setModalVisible(!modalVisible)}>
                &#x2717;
              </Text>
            </View>
            <View style={edit_user_styles.first_last_name_input}>
              <View style={edit_user_styles.first_name_input}>
                <Text>first name *</Text>
                <TextInput
                  style={edit_user_styles.input_box}
                  onChangeText={text => setUpdatedFirstName(text)}
                  autoCorrect={false}
                  placeholder={updatedFirstName}
                  placeholderTextColor="#808080"
                />
              </View>
              <View style={edit_user_styles.last_name_input}>
                <Text>last name *</Text>
                <TextInput
                  style={edit_user_styles.input_box}
                  onChangeText={text => setUpdatedLastName(text)}
                  autoCorrect={false}
                  placeholder={updatedLastName}
                  placeholderTextColor="#808080"
                />
              </View>
            </View>
            <View style={edit_user_styles.first_last_name_input}>
              <View style={edit_user_styles.first_name_input}>
                <Text>username *</Text>
                <TextInput
                  style={edit_user_styles.input_box}
                  onChangeText={text => setUpdatedUsername(text)}
                  autoCorrect={false}
                  placeholder={updatedUsername}
                  placeholderTextColor="#808080"
                />
              </View>
              <View style={edit_user_styles.last_name_input}>
                <Text>rate *</Text>
                <TextInput
                  style={edit_user_styles.input_box}
                  onChangeText={text => setUpdatedRate(Number(text))}
                  autoCorrect={false}
                  placeholder={updatedRate.toString()}
                  placeholderTextColor="#808080"
                />
              </View>
            </View>
            <View style={edit_user_styles.first_last_name_input}>
              <View style={edit_user_styles.first_name_input}>
                <Text>rate type *</Text>
                <DropDownPicker
                  open={rateTypeOpen}
                  value={rateType}
                  items={constant.rateType}
                  setOpen={() => setRateTypeOpen(!rateTypeOpen)}
                  setValue={val => setUpdatedRateType(val)}
                  placeholderStyle={{color: '#808080'}}
                />
              </View>
              <View style={edit_user_styles.last_name_input}>
                <Text>status *</Text>
                <DropDownPicker
                  open={statusOpen}
                  value={status}
                  items={constant.status}
                  setOpen={() => setStatusOpen(!statusOpen)}
                  setValue={val => setUpdatedStatus(val)}
                />
              </View>
            </View>
            <View style={[styles.add_user_btn, {marginTop: 20}]}>
              <Button title="Save" color="#fff" onPress={saveUser} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditUser;

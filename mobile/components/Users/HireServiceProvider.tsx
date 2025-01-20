import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  ContainerStyle,
  ButtonStyle,
  InputStyle,
  TextStyle,
} from '../../styles';
import InputField from '../InputField';
import Popup from '../Popup';
import {alert} from '../../helper/Alert';
import {navigate} from '../../helper/navigate';
import Error from '../Error';
import {DefaultApiFactory, GetUserRs} from '../../swagger/generated';
import Validator from '../../validator/validator';
import {ErrorModel} from '../../types';
import {Screen, ErrMsg} from '../../enums';

let api = DefaultApiFactory();

const HireServiceProvider = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [error, setError] = useState<ErrorModel>({message: ''});

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const validateInput = () => {
    if (!Validator.isValidEmail(searchInput)) {
      setError({message: ErrMsg.INVALID_EMAIL});
      return false;
    }
    return true;
  };

  const searchEmail = async () => {
    if (!validateInput()) return;

    try {
      const {data} = await api.isRequestValid(userInfo.email, searchInput);
      const serviceProvider = data.serviceProviderUser;
      showConfirmMsg(serviceProvider);
    } catch (e) {
      setError({message: ErrMsg.DUPLICATE_REQUEST});
    }
  };

  const showConfirmMsg = (serviceProvider: GetUserRs | undefined) => {
    alert(
      `Do you want to hire ${searchInput} as a service provider?`,
      '',
      function () {
        navigate(props.navigation, Screen.PERSONAL_INFO, {
          firstName: serviceProvider ? serviceProvider.firstName : '',
          lastName: serviceProvider ? serviceProvider.lastName : '',
          email: serviceProvider ? serviceProvider.email : searchInput,
        });
        clearInput();
      },
      null,
    );
  };

  const clearInput = () => {
    setSearchInput('');
    setError({message: ''});
  };

  let topContainer = ContainerStyle.createTopContainerStyle();
  let container = ContainerStyle.createBasicContainerStyle();
  let btnContainer = ContainerStyle.createButtonContainerStyle();
  let inputText = InputStyle.createBasicInputStyle();
  let button = ButtonStyle.createBasicButtonStyle();
  let buttonText = TextStyle.createButtonTextStyle();

  return (
    <SafeAreaView style={topContainer}>
      {error.message && <Error msg={error.message} />}
      {modalVisible && (
        <Popup modalVisible={modalVisible} setModalVisible={setModalVisible} />
      )}
      <View style={container}>
        <Text>
          Enter the email of a service provider you would like to hire
        </Text>
      </View>
      <View style={container}>
        <Text>Email</Text>
        <TextInput
          value={searchInput}
          style={inputText}
          autoCorrect={false}
          autoCapitalize="none"
          onChangeText={val => setSearchInput(val)}
        />
      </View>
      <View style={btnContainer}>
        <TouchableOpacity style={button} onPress={searchEmail}>
          <Text style={buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HireServiceProvider;

import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {styles} from '../../styles/hireServiceProviderStyles.js';
import InputField from '../InputField';
import Popup from '../Popup';
import {alert} from '../../helper/Alert';
import {navigate} from '../../helper/navigate';
import Error from '../Error';
import {DefaultApiFactory, GetUserRs} from '../../swagger/generated';
import Validator from '../../validator/validator';
import {ErrorModel} from '../../types';

let api = DefaultApiFactory();

const HireServiceProvider = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [error, setError] = useState<ErrorModel>({
    message: '',
    statusCode: 200,
  });

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const validateInput = () => {
    if (!Validator.isValidEmail(searchInput)) {
      setError({
        message: 'invalid email',
        statusCode: 400,
      });
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
      setError({
        message: 'Duplicate request',
        statusCode: 400,
      });
    }
  };

  const showConfirmMsg = (serviceProvider: GetUserRs | undefined) => {
    alert(
      `Do you want to hire ${searchInput} as a service provider?`,
      '',
      function () {
        navigate(props.navigation, 'PersonalInfo', {
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
    setError({
      message: '',
      statusCode: 200,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {modalVisible && (
        <Popup modalVisible={modalVisible} setModalVisible={setModalVisible} />
      )}
      <View>
        <Text>
          Enter the email of a service provider you would like to hire
        </Text>
        {error.message && <Error msg={error.message} />}
      </View>
      <View style={styles.subContainer}>
        <Text>Email</Text>
        <InputField.Outlined
          onChangeText={(val: any) => setSearchInput(val)}
          isEditable={true}
          value={searchInput}
        />
        <TouchableOpacity
          style={[styles.button, {marginTop: 20}]}
          onPress={searchEmail}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HireServiceProvider;

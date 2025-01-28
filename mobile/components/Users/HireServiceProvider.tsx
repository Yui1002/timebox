import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Text} from 'react-native';
import Popup from '../Popup';
import {alert} from '../../helper/Alert';
import {navigate} from '../../helper/navigate';
import {Button, Container, Input, Result, TopContainer} from '../index';
import {DefaultApiFactory, GetUserRs} from '../../swagger';
import Validator from '../../validator/validator';
import {ResultModel} from '../../types';
import {Screen, ErrMsg, StatusModel} from '../../enums';

let api = DefaultApiFactory();

const HireServiceProvider = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: ''
  })

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const validateInput = () => {
    if (!Validator.isValidEmail(searchInput)) {
      setResult({status: StatusModel.ERROR, message: ErrMsg.INVALID_EMAIL});
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
      setResult({status: StatusModel.ERROR, message: ErrMsg.DUPLICATE_REQUEST});
    }
  };

  const showConfirmMsg = (serviceProvider: GetUserRs | undefined) => {
    alert(
      `Do you want to hire ${searchInput} as a service provider?`,
      '',
      function () {
        navigate(props.navigation, Screen.PERSONAL_INFO, {
          firstName: serviceProvider?.firstName ?? '',
          lastName: serviceProvider?.lastName ?? '',
          email: serviceProvider?.email ?? searchInput,
        });
        clearInput();
      },
      null,
    );
  };

  const clearInput = () => {
    setSearchInput('');
    setResult({status: StatusModel.NULL, message: ''});
  };

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      {modalVisible && (
        <Popup modalVisible={modalVisible} setModalVisible={setModalVisible} />
      )}
      <Container>
        <Text>
          Enter the email of a service provider you would like to hire
        </Text>
      </Container>
      <Input
        title="Email"
        secureTextEntry={false}
        onChangeText={val => setSearchInput(val)}
      />
      <Button title="Continue" onPress={searchEmail} />
    </TopContainer>
  );
};

export default HireServiceProvider;

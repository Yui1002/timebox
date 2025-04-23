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
import {getToken} from '../../tokenUtils';

let api = DefaultApiFactory();

const HireServiceProvider = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const validateInput = () => {
    if (!Validator.isValidEmail(searchInput)) {
      setResult({
        status: StatusModel.ERROR,
        message: ErrMsg.INVALID_EMAIL,
      });
      return false;
    }
    if (searchInput === userInfo.email) {
      setResult({
        status: StatusModel.ERROR,
        message: "You can't use your email address",
      });
      return false;
    }
    return true;
  };

  const searchEmail = async () => {
    if (!validateInput()) return;
    console.log('validated');

    const token = await getToken();

    try {
      const {data} = await api.isRequestValid(userInfo.email, searchInput, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('data', data);
      showConfirmMsg(data.serviceProviderUser!);
    } catch (e) {
      setResult({
        status: StatusModel.ERROR,
        message: e.response.data.message,
      });
    } finally {
      setResult({
        status: StatusModel.NULL,
        message: ""
      });
    }
  };

  const showConfirmMsg = ({firstName, lastName, email}: GetUserRs) => {
    alert(
      `Do you want to hire ${firstName} ${lastName} as a service provider?`,
      '',
      function () {
        navigate(props.navigation, Screen.PERSONAL_INFO, {
          firstName,
          lastName,
          email,
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

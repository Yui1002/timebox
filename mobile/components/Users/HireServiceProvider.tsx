import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Text, ActivityIndicator} from 'react-native';
import {alert as Alert} from '../../helper/Alert';
import {navigate} from '../../helper/navigate';
import {Button, Container, Input, Result, TopContainer} from '../index';
import {DefaultApiFactory, GetUserRs} from '../../swagger';
import Validator from '../../validator/validator';
import {ResultModel} from '../../types';
import {Screen, ErrMsg, StatusModel} from '../../enums';
import {getAuthHeader} from '../../tokenUtils';

let api = DefaultApiFactory();

const HireServiceProvider = (props: any) => {
  const userInfo = useSelector((state: any) => state.userInfo);
  const [searchInput, setSearchInput] = useState<string>('');
  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.NULL,
    message: '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const validateInput = () => {
    if (!Validator.isValidEmail(searchInput)) {
      setResult({
        status: StatusModel.ERROR,
        message: ErrMsg.INVALID_EMAIL,
      });
      return false;
    }

    const normalizedEmail = Validator.normalizeEmail(searchInput);
    if (normalizedEmail === userInfo.email) {
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
    setLoading(true);

    try {
      const normalizedEmail = Validator.normalizeEmail(searchInput);
      const {data} = await api.isRequestValid(
        userInfo.email,
        normalizedEmail,
        await getAuthHeader(),
      );
      showConfirmMsg(data.serviceProviderUser!);
    } catch (e) {
      alert(e.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const showConfirmMsg = ({firstName, lastName, email}: GetUserRs) => {
    Alert(
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
      <Container>
        <Text>
          Enter the email of a service provider you would like to hire
        </Text>
      </Container>
      <Input
        title="Email"
        secureTextEntry={false}
        onChangeText={val => setSearchInput(val)}
        value={searchInput}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button
          title="Continue"
          onPress={searchEmail}
          buttonWidth={'80%'}
          buttonHeight={'6%'}
          style={{margin: 'auto', marginVertical: 20}}
        />
      )}
    </TopContainer>
  );
};

export default HireServiceProvider;

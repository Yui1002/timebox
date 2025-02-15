import React from 'react';
import {Text} from 'react-native';
import {ButtonStyle, TextStyle} from '../../styles';
import {Screen} from '../../enums';
import {ListContainer, ListSubContainer, Button} from '../index';

const EmployerList = (props: any) => {
  const {employer, email, navigation} = props;
  let text = TextStyle.createBasicTextStyle();
  let recordBtn = ButtonStyle.createRecordButtonStyle();

  const navigateScreen = (): void => {
    navigation.navigate(Screen.RECORD, {
      employer: employer,
      serviceProviderEmail: email,
    });
  };

  return (
    <ListContainer>
      <ListSubContainer>
        <Text style={text}>
          {employer.firstName} {employer.lastName}
        </Text>
        <Text>{employer.email}</Text>
      </ListSubContainer>
      <Button title="Record" onPress={navigateScreen} style={recordBtn} />
    </ListContainer>
  );
};

export default EmployerList;

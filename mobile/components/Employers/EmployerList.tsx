import React from 'react';
import {Text} from 'react-native';
import {ButtonStyle, TextStyle} from '../../styles';
import {Screen} from '../../enums';
import {ListContainer, ListSubContainer, Button} from '../index';
import {Employer} from '../../swagger';

interface EmployerListProps {
  employer: Employer;
  serviceProviderEmail: string;
  navigation: any;
}

const EmployerList = (props: EmployerListProps) => {
  const {employer, serviceProviderEmail, navigation} = props;
  const {firstName, lastName, email} = employer;
  let text = TextStyle.createBasicTextStyle();
  let recordBtn = ButtonStyle.createRecordButtonStyle();

  const navigateScreen = (): void => {
    navigation.navigate(Screen.RECORD, {
      employer: employer,
      serviceProviderEmail: serviceProviderEmail,
    });
  };

  return (
    <ListContainer>
      <ListSubContainer>
        <Text style={text}>
          {firstName} {lastName}
        </Text>
        <Text>{email}</Text>
      </ListSubContainer>
      <Button title="Record" onPress={navigateScreen} style={recordBtn} />
    </ListContainer>
  );
};

export default EmployerList;

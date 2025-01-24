import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {ContainerStyle, ButtonStyle, TextStyle} from '../../styles';
import {Employer} from '../../swagger/generated';
import {Screen} from '../../enums';

const EmployerList = (props: any) => {
  const {employer, email} = props;
  let listContainer = ContainerStyle.createListContainerStyle();
  let listSubContainer = ContainerStyle.createListSubContainerStyle();
  let text = TextStyle.createBasicTextStyle();
  let recordBtn = ButtonStyle.createRecordButtonStyle();
  let btnText = TextStyle.createButtonTextStyle();

  const navigateScreen = (employer: Employer): void => {
    props.navigation.navigate(Screen.RECORD, {
      employer: employer,
      serviceProviderEmail: email,
    });
  };

  return (
    <View style={listContainer}>
      <View style={listSubContainer}>
        <Text style={text}>
          {employer.firstName} {employer.lastName}
        </Text>
        <Text>{employer.email}</Text>
      </View>
      <TouchableOpacity
        style={recordBtn}
        onPress={() => navigateScreen(employer)}>
        <Text style={btnText}>Record</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmployerList;

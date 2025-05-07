import React from 'react';
import {Text, View} from 'react-native';
import {ContainerStyle, TextStyle} from '../../styles';
import {Button, Title} from '../index';
import {Screen} from '../../enums';
import {GetServiceProviderRsMini} from '../../swagger';

const ServiceProviderList = ({props, navigation}) => {
  let listContainer = ContainerStyle.createListContainerStyle();
  let listSubContainer = ContainerStyle.createListSubContainerStyle();
  let text = TextStyle.createBasicTextStyle();

  const navigateToProfile = (sp: GetServiceProviderRsMini) => {
    navigation.navigate(Screen.PROFILE, {sp});
  };

  return (
    <View style={listContainer}>
      <View style={listSubContainer}>
        <Text style={text}>{props.status.toLowerCase()}</Text>
        <Title title={`${props.firstName ?? 'Not specified'} ${props.lastName?? ''}`} />
        <Text>{props.email}</Text>
      </View>
      <Button
        title="View"
        onPress={() => navigateToProfile(props)}
        buttonWidth={'24%'}
        buttonHeight={'auto'}
      />
    </View>
  );
};

export default ServiceProviderList;

import React from 'react';
import {Text, View} from 'react-native';
import {ContainerStyle, ButtonStyle, TextStyle} from '../../styles';
import {Button} from '../index';
import {Screen} from '../../enums';
import {ServiceProvider} from '../../swagger';

interface ServiceProviderListProps {
  
}

const ServiceProviderList = ({props}) => {
  let listContainer = ContainerStyle.createListContainerStyle();
  let listSubContainer = ContainerStyle.createListSubContainerStyle();
  let text = TextStyle.createBasicTextStyle();
  let titleText = TextStyle.createTitleTextStyle();
  let recordBtn = ButtonStyle.createRecordButtonStyle();

  const navigateToProfile = (sp: ServiceProvider) => {
    props.navigation.navigate(Screen.PROFILE, {
      sp,
    });
  };

  return (
    <View style={listContainer}>
      <View style={listSubContainer}>
        <Text style={text}>{props.status}</Text>
        <Text style={titleText}>
          {props.first_name} {props.last_name}
        </Text>
        <Text>{props.email}</Text>
      </View>
      <Button
        title="View"
        onPress={() => navigateToProfile(props)}
        style={recordBtn}
      />
    </View>
  );
};

export default ServiceProviderList;

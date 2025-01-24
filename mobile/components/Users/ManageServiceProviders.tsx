import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ContainerStyle,
  ButtonStyle,
  TextStyle,
  CheckboxStyle,
} from '../../styles';
import CheckBox from '@react-native-community/checkbox';
import {
  DefaultApiFactory,
  ServiceProvider,
  RequestStatus,
} from '../../swagger/generated';
import {Screen} from '../../enums';
import {Button, Error, Section, NumberInput, RateTypePicker} from '../index';

let api = DefaultApiFactory();

const ManageServiceProviders = (props: any) => {
  const isFocused = useIsFocused();
  const {email} = useSelector(state => state.userInfo);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>();
  const [isBoxChecked, setIsBoxChecked] = useState(true);

  useEffect(() => {
    if (isFocused) {
      getServiceProviders();
    }
  }, [isFocused]);

  const getServiceProviders = async () => {
    try {
      const {data} = await api.getServiceProvider(email);
      console.log('service providers', data.serviceProviders);
      // setServiceProviders(formatData(data.serviceProviders))
      setServiceProviders(data.serviceProviders);
    } catch (e: any) {
      setServiceProviders([]);
    }
  };

  // const formatData = (data: ServiceProvider[]): ServiceProvider[] => {
  //   const formattedData = data.reduce((a, b) => {
  //     const found = a.find((e: ServiceProvider) => e.email == b.email);

  //     const item = {id: b.schedule_id, day: b.day, startTime: b.start_time, endTime: b.end_time};
  //     ['schedule_id', 'day', 'start_time', 'end_time'].forEach(val => delete b[val]);

  //     if (!item.id) {
  //       return (found ? found.schedule.push([]) : a.push({...b, schedule: []}), a)
  //     } else {
  //       return (found ? found.schedule.push(item) : a.push({...b, schedule: [item]}), a)
  //     }
  //   }, []);

  //   return formattedData;
  // };

  const navigateToProfile = (sp: ServiceProvider) => {
    props.navigation.navigate(Screen.PROFILE, {
      sp,
    });
  };

  let topContainer = ContainerStyle.createTopContainerStyle();
  let container = ContainerStyle.createBasicContainerStyle();
  let listContainer = ContainerStyle.createListContainerStyle();
  let listSubContainer = ContainerStyle.createListSubContainerStyle();
  let checkboxContainer = ContainerStyle.createCheckBoxContainer();
  let checkBox = CheckboxStyle.createBasicCheckboxStyle();
  let headerText = TextStyle.createHeaderTextStyle();
  let titleText = TextStyle.createTitleTextStyle();
  let text = TextStyle.createBasicTextStyle();
  let recordBtn = ButtonStyle.createRecordButtonStyle();
  let btnText = TextStyle.createButtonTextStyle();

  return (
    <SafeAreaView style={topContainer}>
      <View style={container}>
        <Text style={headerText}>Service Providers</Text>
      </View>
      <View style={checkboxContainer}>
        <CheckBox
          style={checkBox}
          boxType="square"
          animationDuration={0}
          value={isBoxChecked}
          onChange={() => setIsBoxChecked(!isBoxChecked)}
        />
        <Text style={text}>Show not currently employed</Text>
      </View>
      {serviceProviders == null ? (
        <Text>You don't have service providers</Text>
      ) : (
        <ScrollView>
          {serviceProviders.map((serviceProvider, index) => (
            <View key={index} style={listContainer}>
              <View style={listSubContainer}>
                <Text style={text}>{serviceProvider.status}</Text>
                <Text style={titleText}>
                  {serviceProvider.first_name} {serviceProvider.last_name}
                </Text>
                <Text>{serviceProvider.email}</Text>
              </View>
              <Button
                title="View"
                onPress={() => navigateToProfile(serviceProvider)}
                style={recordBtn}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ManageServiceProviders;

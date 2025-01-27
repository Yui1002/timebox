import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {Text, ScrollView} from 'react-native';
import {TextStyle, CheckboxStyle} from '../../styles';
import CheckBox from '@react-native-community/checkbox';
import {DefaultApiFactory, ServiceProvider} from '../../swagger';
import {Screen} from '../../enums';
import {TopContainer, Container, Header, CheckBoxContainer} from '../index';
import ServiceProviderList from '../ServiceProvider/ServiceProviderList';

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

  let checkBox = CheckboxStyle.createBasicCheckboxStyle();
  let text = TextStyle.createBasicTextStyle();

  return (
    <TopContainer>
      <Container>
        <Header title="Service Providers" />
      </Container>
      <CheckBoxContainer>
        <CheckBox
          style={checkBox}
          boxType="square"
          animationDuration={0}
          value={isBoxChecked}
          onChange={() => setIsBoxChecked(!isBoxChecked)}
        />
        <Text style={text}>Show not currently employed</Text>
      </CheckBoxContainer>
      {serviceProviders == null ? (
        <Text>You don't have service providers</Text>
      ) : (
        <ScrollView>
          {serviceProviders.map((serviceProvider, index) => (
            <ServiceProviderList key={index} props={serviceProvider} />
          ))}
        </ScrollView>
      )}
    </TopContainer>
  );
};

export default ManageServiceProviders;

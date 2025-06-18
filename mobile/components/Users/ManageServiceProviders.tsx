import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {Text, ScrollView, View} from 'react-native';
import {TextStyle, CheckboxStyle} from '../../styles';
import CheckBox from '@react-native-community/checkbox';
import {
  DefaultApiFactory,
  GetServiceProviderRsMini,
  RequestStatus,
  UserSchedule,
} from '../../swagger';
import {TopContainer, Container, Header, CheckBoxContainer} from '../index';
import ServiceProviderList from '../ServiceProvider/ServiceProviderList';
import {getAuthHeader} from '../../tokenUtils';

let api = DefaultApiFactory();

const ManageServiceProviders = (props: any) => {
  const isFocused = useIsFocused();
  const employerEmail = useSelector((state: any) => state.userInfo).email;
  const [serviceProviders, setServiceProviders] =
    useState<GetServiceProviderRsMini[]>();
  const [isBoxChecked, setIsBoxChecked] = useState<boolean>(true);

  useEffect(() => {
    if (isFocused) {
      getServiceProviders();
    }
  }, [isFocused]);

  const sortSchedules = (schedules: UserSchedule[]): UserSchedule[] => {
    const dayOrder = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    return schedules.sort(
      (a: UserSchedule, b: UserSchedule) =>
        dayOrder.indexOf(a.day!) - dayOrder.indexOf(b.day!),
    );
  };

  const getServiceProviders = async () => {
    try {
      const header = await getAuthHeader();
      if (!header) return null;

      const {data} = await api.getServiceProvider(
        employerEmail,
        header,
      );

      const sortedData = data.map(
        (serviceProvider: GetServiceProviderRsMini) => ({
          ...serviceProvider,
          schedules: sortSchedules(serviceProvider.schedules),
        }),
      );
      setServiceProviders(sortedData);
    } catch (e: any) {
      setServiceProviders([]);
    }
  };

  let checkBox = CheckboxStyle.createBasicCheckboxStyle();
  let text = TextStyle.createBasicTextStyle();

  const filteredServiceProviders = isBoxChecked
    ? serviceProviders
    : serviceProviders?.filter(
        sp => sp.status === 'active' || sp.status === RequestStatus.Approved,
      );

  return (
    <TopContainer>
      <Container>
        <Header title="Service Providers" />
      </Container>
      {serviceProviders?.length == 0 ? (
        <Text>
          You don't have service providers. Please use the menu to hire or
          manage service providers
        </Text>
      ) : (
        <View style={{height: '70%'}}>
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
          <ScrollView>
            {filteredServiceProviders?.map((serviceProvider, index) => (
              <ServiceProviderList
                key={index}
                props={serviceProvider}
                navigation={props.navigation}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </TopContainer>
  );
};

export default ManageServiceProviders;

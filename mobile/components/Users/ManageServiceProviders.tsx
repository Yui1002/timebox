import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {Text, ScrollView} from 'react-native';
import {TextStyle, CheckboxStyle} from '../../styles';
import CheckBox from '@react-native-community/checkbox';
import {DefaultApiFactory, GetServiceProviderRsMini, RequestStatus} from '../../swagger';
import {TopContainer, Container, Header, CheckBoxContainer} from '../index';
import ServiceProviderList from '../ServiceProvider/ServiceProviderList';
import {formatData} from '../../helper/formatHelper';

let api = DefaultApiFactory();

const ManageServiceProviders = (props: any) => {
  const isFocused = useIsFocused();
  const {email} = useSelector(state => state.userInfo);
  const [serviceProviders, setServiceProviders] =
    useState<GetServiceProviderRsMini[]>();
  const [isBoxChecked, setIsBoxChecked] = useState(true);

  useEffect(() => {
    if (isFocused) {
      getServiceProviders();
    }
  }, [isFocused]);

  const getServiceProviders = async () => {
    try {
      const {data} = await api.getServiceProvider(email);
      setServiceProviders(data);
    } catch (e: any) {
      setServiceProviders([]);
    }
  };

  let checkBox = CheckboxStyle.createBasicCheckboxStyle();
  let text = TextStyle.createBasicTextStyle();

  const filteredServiceProviders = isBoxChecked ? serviceProviders : serviceProviders?.filter(sp => sp.status === 'active' || sp.status === 'approved');

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
          // onChange={onSelectChange}
        />
        <Text style={text}>Show not currently employed</Text>
      </CheckBoxContainer>
      {serviceProviders == null ? (
        <Text>You don't have service providers</Text>
      ) : (
        <ScrollView>
          {filteredServiceProviders?.map((serviceProvider, index) => (
            <ServiceProviderList
              key={index}
              props={serviceProvider}
              navigation={props.navigation}
            />
          ))}
        </ScrollView>
      )}
    </TopContainer>
  );
};

export default ManageServiceProviders;

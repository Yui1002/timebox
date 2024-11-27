import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {styles} from '../../styles/manageServiceProvidersStyles.js';

enum Status {
  true = 1,
  false = 2,
  null = 3,
}

interface Schedule {
  day: string;
  start_time: string;
  end_time: string;
}

interface ServiceProvider {
  first_name: string;
  last_name: string;
  email_address: string;
  status: Status;
  rate: number;
  rate_type: string;
  schedule: Schedule[] | [];
  allow_edit: boolean;
}

const ManageServiceProviders = (props: any) => {
  const isFocused = useIsFocused();
  const {email} = useSelector(state => state.userInfo);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>(
    [],
  );
  const [isBoxChecked, setIsBoxChecked] = useState(true);

  useEffect(() => {
    if (isFocused) {
      getServiceProviders();
    }
  }, [isFocused]);

  const getServiceProviders = async () => {
    try {
      const response = await axios.post(`${LOCAL_HOST_URL}/getServiceProvider`, {
        employerEmail: email
      });
      if (response?.data?.serviceProviderResult == null) {
        setServiceProviders([]);
      } else {
        setServiceProviders(formatData(response.data.serviceProviderResult.serviceProviders));
      }
    } catch (e: any) {
      console.log(e);
    }
  };
  
  const formatData = (data: any[]): ServiceProvider[] => {
    const formattedData = data.reduce((a, b) => {
      const found = a.find(e => e.email_address == b.email_address);
      const item = {day: b.day, start_time: b.start_time, end_time: b.end_time};
      ['day', 'start_time', 'end_time'].forEach(val => delete b[val]);
      return (
        found ? found.schedule.push(item) : a.push({...b, schedule: [item]}), a
      );
    }, []);
    return formattedData;
  };

  const navigateToProfile = (sp: ServiceProvider) => {
    props.navigation.navigate('Profile', {
      sp,
    });
  };
  
  const sortStatus = (item: ServiceProvider[]): ServiceProvider[] => {
    item.sort((a: ServiceProvider, b: ServiceProvider) => a.status - b.status);
    return item;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Service Providers</Text>
      </View>
      <View style={styles.checkBoxContainer}>
        <CheckBox
          style={styles.checkBox}
          boxType="square"
          animationDuration={0}
          value={isBoxChecked}
          onChange={() => setIsBoxChecked(!isBoxChecked)}
        />
        <Text style={styles.checkBoxText}>Show not currently employed</Text>
      </View>
      <ScrollView style={styles.subContainer}>
        {serviceProviders.length ? (
          serviceProviders?.map((sp: ServiceProvider, index: number) => {
            if (isBoxChecked || sp.status) {
              const {first_name, last_name, email_address, status} = sp;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.listContainer}
                  onPress={status ? () => navigateToProfile(sp) : () => null}>
                  <Text style={styles.statusText}>
                    {status === 1
                      ? 'Active'
                      : status === 2
                      ? 'Declined'
                      : 'Pending'}
                  </Text>
                  <Text style={styles.listText}>
                    {`${
                      first_name
                        ? `${first_name} ${last_name}`
                        : `Name not specified`
                    }`}
                  </Text>
                  <Text>{email_address}</Text>
                </TouchableOpacity>
              );
            }
          })
        ) : (
          <Text>You don't have service providers</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageServiceProviders;

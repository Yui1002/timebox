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

interface Schedule {
  day: string;
  start_time: string;
  end_time: string;
}

interface ServiceProvider {
  first_name: string;
  last_name: string;
  email: string;
  status: string;
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
      const response = await axios.post(
        `${LOCAL_HOST_URL}/getServiceProvider`,
        {
          employerEmail: email,
        },
      );
      setServiceProviders(formatData(response?.data?.serviceProviders));
    } catch (e: any) {
      setServiceProviders([]);
    }
  };

  const formatData = (data: any[]): ServiceProvider[] => {
    const formattedData = data.reduce((a, b) => {
      const found = a.find(e => e.email == b.email);
      const item = {day: b.day, start_time: b.start_time, end_time: b.end_time};
      ['day', 'start_time', 'end_time'].forEach(val => delete b[val]);
      return (
        found && item.day && item.start_time && item.end_time
          ? found.schedule.push(item)
          : a.push({...b, schedule: []}),
        a
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
            console.log('spppppp', sp);
            if (isBoxChecked || sp.status) {
              const {first_name, last_name, email, status} = sp;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.listContainer}
                  onPress={
                    status === 'approved'
                      ? () => navigateToProfile(sp)
                      : () => null
                  }>
                  <Text style={styles.statusText}>{status}</Text>
                  <Text style={styles.listText}>
                    {`${
                      first_name
                        ? `${first_name} ${last_name}`
                        : `Name not specified`
                    }`}
                  </Text>
                  <Text>{email}</Text>
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

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

interface ServiceProvider {
  first_name: string;
  last_name: string;
  email: string;
  status: boolean | null;
  rate: number | null;
  rate_type: string | null;
  workSchedule: WorkSchedule[] | [],
  allow_edit: boolean
}

interface WorkSchedule {
  day: string,
  start_time: string,
  end_time: string
}

const ManageServiceProviders = (props: any) => {
  const isFocused = useIsFocused();
  const {email} = useSelector(state => state.userInfo);
  const [serviceProviders, setServiceProviders] = useState<Array<ServiceProvider>>([]);
  const [isBoxChecked, setIsBoxChecked] = useState<boolean>(false);

  useEffect(() => {
    if (isFocused) {
      getServiceProviders();
    }
  }, [isFocused]);

  const getServiceProviders = (): void => {
    axios
      .get(`${LOCAL_HOST_URL}/serviceProviders`, {
        params: {
          email,
        },
      })
      .then(res => {
        setServiceProviders(sortStatus(res.data));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const formatData = (data: string): ServiceProvider[] => {
    const result = [];
    if ()
  }

  const sortStatus = (item: ServiceProvider[]): ServiceProvider[] => {
    const order = [true, false, null];
    item.sort(
      (a: ServiceProvider, b: ServiceProvider) =>
        order.indexOf(a.status) - order.indexOf(b.status),
    );
    return item;
  };

  const navigateToProfile = (sp: ServiceProvider): void => {
    props.navigation.navigate('Profile', {
      sp,
    });
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Current Service Providers</Text>
      </View>
      <View style={styles.checkBoxContainer}>
        <CheckBox
          style={styles.checkBox}
          boxType="square"
          animationDuration={0}
          onChange={() => setIsBoxChecked(!isBoxChecked)}
        />
        <Text style={styles.checkBoxText}>Show not currently employed</Text>
      </View>
      <ScrollView style={styles.subContainer}>
        {serviceProviders?.length ? (
          serviceProviders.map((sp: ServiceProvider, index: number) => {
            if (isBoxChecked || sp.status) {
              const {first_name, last_name, email, status} = sp;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.listContainer}
                  onPress={status ? () => navigateToProfile(sp) : () => null}>
                  <Text style={styles.statusText}>
                    {status === true
                      ? 'Active'
                      : status === false
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
                  <Text>{email}</Text>
                </TouchableOpacity>
              );
            }
          })
        ) : (
          <Text>You don't have current service providers</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ManageServiceProviders;

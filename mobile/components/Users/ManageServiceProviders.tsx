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
  email_address: string;
  status: string;
}

const ManageServiceProviders = (props: any) => {
  const isFocused = useIsFocused();
  const {email} = useSelector(state => state.userInfo);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [isBoxChecked, setIsBoxChecked] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getServiceProviders();
    }
  }, [isFocused]);

  const getServiceProviders = () => {
    axios
      .get(`${LOCAL_HOST_URL}/serviceProviders`, {
        params: {
          email,
        },
      })
      .then(res => {
        setServiceProviders(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const navigateToProfile = (sp: ServiceProvider) => {
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
        {serviceProviders && serviceProviders.length > 0 ? (
          serviceProviders.map((sp: ServiceProvider, index: number) => {
            if (isBoxChecked || sp.status === 'active') {
              const {first_name, last_name, email_address} = sp;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.listContainer}
                  onPress={() => navigateToProfile(sp)}>
                  <Text style={styles.listText}>
                    {first_name} {last_name}
                  </Text>
                  <Text>{email_address}</Text>
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

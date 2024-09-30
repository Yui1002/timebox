import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../styles/manageServiceProvidersStyles.js';

interface ServiceProvider {
  first_name: string;
  last_name: string;
  email_address: string;
}

const ManageServiceProviders = (props: any) => {
  const isFocused = useIsFocused();
  const [serviceProviders, setServiceProviders] = useState([]);
  const {email} = useSelector(state => state.userInfo);

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

  const navigateToProfile = (user: ServiceProvider) => {
    props.navigation.navigate('Profile', {
      user,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Current Service Providers</Text>
      </View>
      <View style={styles.subContainer}>
        {serviceProviders && serviceProviders.length > 0 ? (
          serviceProviders.map((sp: ServiceProvider, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigateToProfile(sp)}
              style={styles.listContainer}>
              <Text style={styles.listText}>
                {sp.first_name} {sp.last_name}
              </Text>
              <Text>{sp.email_address}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>You don't have current service providers</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ManageServiceProviders;

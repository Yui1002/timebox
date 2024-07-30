import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../styles/manageServiceProvidersStyles.js';

const ManageServiceProviders = (props: any) => {
  const [serviceProviders, setServiceProviders] = useState([]);

  useEffect(() => {
    getServiceProviders();
  }, []);

  const getServiceProviders = () => {
    axios
      .get(`${LOCAL_HOST_URL}/serviceProviders`, {
        params: {
          email: props.params.email,
        },
      })
      .then(res => {
        setServiceProviders(res.data);
      })
      .catch(() => {
        // setUsers([]);
      });
  };

  const navigateToProfile = () => {
    props.navigation.navigate('Profile')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginBottom: 10}}>
        <Text style={{fontSize: 20, fontWeight: 500}}>Service Providers</Text>
      </View>
      <View>
        {serviceProviders.map((sp, index) => (
          <TouchableOpacity key={index} onPress={navigateToProfile} style={styles.listContainer}>
            <Text style={{fontSize: 16, fontWeight: 500}}>{sp.first_name} {sp.last_name}</Text>
            <Text>{sp.email_address}</Text>
            <Text>{`$${sp.rate} / ${sp.rate_type}`}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default ManageServiceProviders;

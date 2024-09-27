import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../styles/manageServiceProvidersStyles.js';

const ManageServiceProviders = (props: any) => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const {email} = useSelector(state => state.userInfo);

  useEffect(() => {
    getServiceProviders();
  }, []);

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
      .catch(() => {
        // setUsers([]);
      });
  };

  const navigateToProfile = user => {
    props.navigation.navigate('Profile', {
      user,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginBottom: 10, height: '5%'}}>
        <Text style={{fontSize: 20, fontWeight: '500'}}>Service Providers</Text>
      </View>
      <View style={{height: '90%'}}>
        {serviceProviders && serviceProviders.length > 0 ? (
          serviceProviders.map((sp, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigateToProfile(sp)}
              style={styles.listContainer}>
              <Text style={{fontSize: 16, fontWeight: '500'}}>
                {sp.first_name} {sp.last_name}
              </Text>
              <Text>{sp.email_address}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text>You don't have any service providers</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ManageServiceProviders;

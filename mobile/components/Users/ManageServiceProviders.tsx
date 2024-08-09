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
        const data = formatData(res.data);
        setServiceProviders(data);
      })
      .catch(() => {
        // setUsers([]);
      });
  };

  const formatData = (users: any) => {
    const data = users.reduce((a, b) => {
      const found = a.find(e => e.email_address == b.email_address);
      const item = {day: b.day, start_time: b.start_time, end_time: b.end_time};
      return (
        found ? found.shifts.push(item) : a.push({...b, shifts: [item]}), a
      );
    }, []);

    for (let i = 0; i < data.length; i++) {
      const obj = data[i];
      if (
        obj.hasOwnProperty('day') ||
        obj.hasOwnProperty('start_time') ||
        obj.hasOwnProperty('end_time')
      ) {
        delete obj['day'];
        delete obj['start_time'];
        delete obj['end_time'];
      }
      sortDays(data[i]);
    }
    return data;
  };

  const sortDays = (data: any) => {
    if (data.shifts == undefined || data.shifts[0].day === null) return;
    const sorter = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };
    return data.shifts.sort((a, b) => {
      return sorter[a.day] - sorter[b.day];
    });
  };

  const navigateToProfile = user => {
    props.navigation.navigate('Profile', {
      user,
      employerEmail: email,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginBottom: 10, height: '5%'}}>
        <Text style={{fontSize: 20, fontWeight: 500}}>Service Providers</Text>
      </View>
      <View style={{height: '90%'}}>
        {serviceProviders.map((sp, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigateToProfile(sp)}
            style={styles.listContainer}>
            <Text style={{fontSize: 16, fontWeight: 500}}>
              {sp.first_name} {sp.last_name}
            </Text>
            <Text>{sp.email_address}</Text>
            <Text>{`$${sp.rate} / ${sp.rate_type}`}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default ManageServiceProviders;

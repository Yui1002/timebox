import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, SafeAreaView, Button, FlatList} from 'react-native';
import {styles} from '../../styles/homeStyles.js';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';

const Home = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const {firstName, lastName, email} = userInfo;
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    getEmployers();
  }, [])

  const getEmployers = () => {
    axios.get(`${LOCAL_HOST_URL}/employers/${email}`)
    .then((res) => {
      setEmployers(res.data);
    })
    .catch((err) => {
      console.log('home error', err)
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{height: '10%'}}>
        <Text style={styles.header}>Hi {firstName}!</Text>
      </View>
      <View style={{height: '80%'}}>
        <Text style={{fontSize: 20, fontWeight: '500'}}>My Employers</Text>
        {employers !== null && employers.length > 0 ? (
          <FlatList
            data={employers}
            renderItem={({item}: any) => (
              <View style={styles.listContainer}>
                <View>
                  <Text>
                    {item.first_name} {item.last_name}
                  </Text>
                  <Text>{item.email_address}</Text>
                </View>
                <View>
                  <View style={styles.button}>
                    <Button
                      title="Record"
                      color="#fff"
                      onPress={() =>
                        props.navigation.navigate('Record', {
                          employer: item,
                          serviceProviderEmail: email,
                        })
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={{marginTop: 10}}>There is no employers</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;

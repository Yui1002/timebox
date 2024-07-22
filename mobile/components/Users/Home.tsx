import React, {useState, useEffect} from 'react';
import {Text, View, SafeAreaView, Button, FlatList} from 'react-native';
import {styles} from '../../styles/homeStyles.js';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';

const Home = ({route, navigation}: any) => {
  const {firstName, lastName, email} = route.params.params;
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    try {
      getEmployers();
    }
    catch (e) {
      console.log("hello world", e)
    }
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
      <View>
        <Text style={styles.header}>Hi {firstName}!</Text>
        <View style={{marginVertical: 10}} />
      </View>
      <View>
        <Text>Employers</Text>
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
                        navigation.navigate('Record', {
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
          <Text>There is no employers</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;

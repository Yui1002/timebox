import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {styles} from '../../styles/homeStyles.js';
import { DefaultApiFactory, GetEmployerRq, GetEmployerRs, Employer } from '../../swagger/generated';

let employerApi = DefaultApiFactory();

const Home = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const {firstName, email} = userInfo;
  const [employers, setEmployers] = useState<Employer[]>();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getEmployers();
    }
  }, [isFocused]);

  const getEmployers = async () => {
    const params: GetEmployerRq = {
      email: email
    }

    try {
      let { data } = await employerApi.getEmployer(params);
      setEmployers(data.employers)
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Hi {firstName}!</Text>
      </View>
      <View>
        <Text style={styles.title}>My Employers</Text>
        {employers != null ? (
          <FlatList
            style={styles.subContainer}
            data={employers}
            renderItem={({item}: any) => (
              <View style={styles.listContainer}>
                <View>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text>{item.email}</Text>
                </View>
                <View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      props.navigation.navigate('Record', {
                        employer: item,
                        serviceProviderEmail: email,
                      })
                    }>
                    <Text style={styles.buttonText}>Record</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <Text style={{marginTop: 10}}>
            Please use the menu to hire or manage service providers
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;

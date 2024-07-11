import React, {useState, useEffect} from 'react';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import {styles} from '../../styles/homeStyles.js';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';

const Home = ({route}: any) => {
  const {firstName, lastName, email} = route.params.params;
  const [menuOpen, setMenuOpen] = useState(false);
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    getEmployers();
  }, []);

  const getEmployers = () => {
    axios.get(`${LOCAL_HOST_URL}/employers/${email}`).then(res => {
      setEmployers(res.data);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Hi {firstName}!</Text>
        <View style={{marginVertical: 10}} />
      </View>
    </SafeAreaView>
  );
};

export default Home;

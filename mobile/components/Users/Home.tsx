import React, {useState} from 'react';
import {Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import {styles} from '../../styles/homeStyles.js';

const Home = ({route}: any) => {
  const {firstName, lastName, email} = route.params;
  const [menuOpen, setMenuOpen] = useState(false);

  const getEmployers = () => {
    // when the page is loaded, get the all employers
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.header}>Hi {firstName}!</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;

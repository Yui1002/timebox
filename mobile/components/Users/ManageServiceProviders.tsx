import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
// import {Box, Text, Heading, ScrollView, VStack, Button} from 'native-base';
import { SafeAreaView, View, Text } from 'react-native';

const ManageServiceProviders = ({employerEmail, setErrors}: any) => {

  return (
    <SafeAreaView>
      <View>
        <Text>ManageServiceProviders</Text>
      </View>
    </SafeAreaView>
  );
};

export default ManageServiceProviders;
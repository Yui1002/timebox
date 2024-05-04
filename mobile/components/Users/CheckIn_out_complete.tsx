import React, {useState, useEffect} from 'react';
import {
  Box,
  Button,
  NativeBaseProvider,
  IconButton,
  Text,
  Center,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CheckIn_out_complete = ({navigation, route}: any) => {
  const {type, time} = route.params;
  return (
    <NativeBaseProvider>
      <Box
        w="100%"
        h="100%"
        backgroundColor={type == 'Checked In' ? '#9acd32' : '#A9A9A9'}>
        <IconButton
          mt={10}
          _icon={{
            as: AntDesign,
            name: 'checkcircleo',
            color: '#fff',
            size: 10,
          }}
        />
        <Text color="#fff" textAlign="center" bold fontSize="lg">
          {type}
        </Text>
        <Text color="#fff" textAlign="center" bold fontSize="sm">
          {time}
        </Text>
        <Center>
          <Button w="60%" m="5%" onPress={() => navigation.goBack()}>
            Back
          </Button>
        </Center>
      </Box>
    </NativeBaseProvider>
  );
};

export default CheckIn_out_complete;

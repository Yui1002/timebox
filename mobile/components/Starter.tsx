import React from 'react';
import {
  NativeBaseProvider,
  Heading,
  Button,
  Image,
  Center,
  VStack,
} from 'native-base';

const Starter = ({navigation}: any) => {
  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <NativeBaseProvider>
      <Center position="relative">
        <Image
          source={{
            uri: 'https://wallpaperaccess.com/full/317501.jpg',
          }}
          alt="Alternate Text"
          size="100%"
          opacity="50"
        />
        <VStack alignItems="center" position="absolute" top="50">
          <Heading size="xl" my="10">
            Time Tracker
          </Heading>
          <Button onPress={navigateToSignIn} w="150" borderRadius="40" my="5">
            Sign In
          </Button>
          <Button onPress={navigateToSignUp} w="150" borderRadius="40" my="5">
            Sign Up
          </Button>
        </VStack>
      </Center>
    </NativeBaseProvider>
  );
};

export default Starter;

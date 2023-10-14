import React from 'react';
import {NativeBaseProvider, Button, HStack} from 'native-base';

const Setup = ({route, navigation}: any) => {
  const ownerEmail = route.params.ownerEmail;

  const navigateToUser = () => {
    navigation.navigate('Users', {ownerEmail});
  };

  const navigateToActivity = () => {
    navigation.navigate('Activities', {ownerEmail});
  };

  return (
    <NativeBaseProvider>
      <HStack space={2} justifyContent="center" my="10">
        <Button onPress={navigateToUser} w="150">
          User
        </Button>
        <Button onPress={navigateToActivity} w="150">
          Activity
        </Button>
      </HStack>
    </NativeBaseProvider>
  );
};

export default Setup;

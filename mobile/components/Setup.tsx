import React, {useContext} from 'react';
import {NativeBaseProvider, Button, HStack} from 'native-base';
import {UserContext} from '../context/UserContext';

const Setup = ({navigation}: any) => {
  const ownerEmail = useContext(UserContext);
  console.log('owner email in setup: ', ownerEmail);

  const navigateToUser = () => {
    navigation.navigate('Users');
  };

  const navigateToActivity = () => {
    navigation.navigate('Activities');
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

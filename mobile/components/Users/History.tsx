import React from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  Button,
  Image,
  Center,
  VStack,
} from 'native-base';

const History = () => {

  return (
    <NativeBaseProvider>
      <Box m="5%">
        <Heading size="lg">History</Heading>
      </Box>
    </NativeBaseProvider>
  );
};

export default History;

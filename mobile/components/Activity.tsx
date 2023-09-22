import React, {useState} from 'react';
import {View, Text, Button, Modal} from 'react-native';
import styles, {edit_user_styles} from '../styles/styles';
import EditUser from './EditUser';
import {Box, HStack, VStack, Spacer, } from 'native-base';

const Activity = ({act, getActivities}) => {
  return (
    <View><Text>yes</Text></View>
    // <Box
    //   width="80%"
    //   marginLeft="auto"
    //   marginRight="auto"
    //   key={item.index}
    //   borderBottomWidth="1"
    //   _dark={{
    //     borderColor: 'muted.50',
    //   }}
    //   borderColor="muted.800"
    //   py="2">
    //   <HStack space={[2, 3]} justifyContent="space-between">
    //     <VStack>
    //       <Text
    //         _dark={{
    //           color: 'warmGray.50',
    //         }}
    //         color="coolGray.800"
    //         bold>
    //         {item.activity_name}
    //       </Text>
    //     </VStack>
    //     <Spacer />
    //     <Text
    //       fontSize="xs"
    //       _dark={{
    //         color: 'warmGray.50',
    //       }}
    //       color="coolGray.800"
    //       alignSelf="flex-start">
    //       {item.status}
    //     </Text>
    //   </HStack>
    // </Box>
  );
};

export default Activity;

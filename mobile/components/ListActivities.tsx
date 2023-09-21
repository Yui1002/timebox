import {View, Text} from 'react-native';
import React from 'react';
import styles, {add_user_styles} from '../styles/styles';
import {UserInterface} from '../interfaces/UserInterface';
import constant from '../parameters/constant';
import User from './User';
import {
  NativeBaseProvider,
  FlatList,
  HStack,
  VStack,
  Box,
  Spacer,
} from 'native-base';

const ListActivities = ({activities, getActivities}) => {
  return (
    <Box style={styles.container}>
      {activities && activities.length < 1 ? (
        <Box>
          <Text>No activity found</Text>
        </Box>
      ) : (
        <Box style={styles.list_user_container}>
          <FlatList
            data={activities}
            renderItem={({item}) => {
              return (
                <Box
                  width="80%"
                  marginLeft="auto"
                  marginRight="auto"
                  key={item.index}
                  borderBottomWidth="1"
                  _dark={{
                    borderColor: 'muted.50',
                  }}
                  borderColor="muted.800"
                  py="2">
                  <HStack space={[2, 3]} justifyContent="space-between">
                    <VStack>
                      <Text
                        _dark={{
                          color: 'warmGray.50',
                        }}
                        color="coolGray.800"
                        bold>
                        {item.activity_name}
                      </Text>
                    </VStack>
                    <Spacer />
                    <Text
                      fontSize="xs"
                      _dark={{
                        color: 'warmGray.50',
                      }}
                      color="coolGray.800"
                      alignSelf="flex-start">
                      {item.status}
                    </Text>
                  </HStack>
                </Box>
              );
            }}
            keyExtractor={item => item.id}
          />
        </Box>
      )}
    </Box>
  );
};

export default ListActivities;

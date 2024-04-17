import React, { useState, useEffect } from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  FlatList,
  Text,
  VStack,
  Spacer,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';

const History = ({ route }: any) => {
  const username = route.params.username;
  const [history, setHistory] = useState([])

  useEffect(() => {
    getHistory();
  }, [history]);

  const getHistory = () => {
    axios.get(`${LOCAL_HOST_URL}/history/${username}`)
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <NativeBaseProvider>
      <Box m="5%">
        <Heading size="lg">History</Heading>
        <Text>Last 7 days history</Text>
        <Box>
          <FlatList data={history} renderItem={({
            item
          }) => <Box borderBottomWidth="1" _dark={{
            borderColor: "muted.50"
          }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
              <VStack>
                <Text _dark={{
                  color: "warmGray.50"
                }} color="coolGray.800" bold>
                  {item.record_date}
                </Text>
                <Text color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }}>
                  {item.record_time}
                </Text>
              </VStack>
              <Spacer />
              <Text fontSize="xs" _dark={{
                color: "warmGray.50"
              }} color="coolGray.800" alignSelf="flex-start">
                {item.record_time}
              </Text>
            </Box>} keyExtractor={item => item.record_time} />
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default History;

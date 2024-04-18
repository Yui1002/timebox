import React, { useState, useEffect } from 'react';
import {
  NativeBaseProvider,
  Box,
  Heading,
  FlatList,
  Text,
  VStack,
  HStack,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';
import moment from 'moment'

console.log('time: ', moment('11:00:35.642444').format('hh:mm:ss'))

const History = ({ route }: any) => {
  const username = route.params.username;
  const [history, setHistory] = useState([])

  useEffect(() => {
    getHistory();
  }, []);

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
        {history.length !== 0 ? <Box>
          <Text>Last 7 days history</Text>
          <Box>
            <HStack space={3} justifyContent='space-between'>
              <Text>Date</Text>
              <Text>Start</Text>
              <Text>End</Text>
            </HStack>
            <FlatList data={history} renderItem={({
              item
            }) => <Box borderBottomWidth="1" _dark={{
              borderColor: "muted.50"
            }} borderColor="muted.800" pl={["0", "4"]} pr={["0", "5"]} py="2">
                {/* <VStack> */}
                <HStack space={3} justifyContent='space-between'>
                  <Text>
                    {`${new Date(item.record_date).getMonth() + 1}/${new Date(item.record_date).getDate()}/${new Date(item.record_date).getFullYear()}`}
                  </Text>
                  <Text>
                    {item.record_time.substring(0, 5)}
                  </Text>
                  <Text>
                    {item.record_time.substring(0, 5)}
                  </Text>
                </HStack>
              </Box>} keyExtractor={item => item.record_time} />

          </Box>
        </Box> : <Text>No history shown</Text>}

      </Box>
    </NativeBaseProvider>
  );
};

export default History;

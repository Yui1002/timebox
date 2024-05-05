import React, {useState, useEffect} from 'react';
import {
  NativeBaseProvider,
  Box,
  Container,
  Heading,
  Button,
  Text,
  HStack,
  Icon,
  VStack,
  Center,
} from 'native-base';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DatePicker from 'react-native-date-picker';

const Account = ({route}: any) => {
  const username = route.params.username;
  const [userInfo, setUserInfo] = useState([]);
  const [history, setHistory] = useState([]);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [to, setTo] = useState<string | undefined>(undefined);

  useEffect(() => {
    getUserInfo();
  }, []);

  // const getHistory = () => {
  //   axios.get(`${LOCAL_HOST_URL}/history/${username}`)
  //     .then((res) => {
  //       setHistory(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  // }

  const getUserInfo = () => {
    axios
      .get(`${LOCAL_HOST_URL}/getUserInfo/${username}`)
      .then(res => {
        setUserInfo(res.data);
      })
      .catch(err => console.log(err));
  };

  return (
    <NativeBaseProvider>
      <Box m="5%">
        <Box
          p={3}
          mb={4}
          borderColor="#babec5"
          borderWidth={1}
          borderRadius={8}>
          <Text bold>Current Shifts</Text>
          {userInfo.map(user => (
            <Text
              fontSize={
                13
              }>{`  ${user.day} ${user.start_time} - ${user.end_time}`}</Text>
          ))}
          <Text bold>Pay</Text>
          {userInfo.length && (
            <Text fontSize={13}>{`$${userInfo[0].rate} / ${
              userInfo[0].rate_type === 'daily' ? 'day' : 'hour'
            }`}</Text>
          )}
        </Box>
        <Box>
          <Heading size="md" mb={2}>
            Timesheets
          </Heading>
          <HStack space={3}>
            <VStack w="45%">
              <Text>From</Text>
              <Button
                backgroundColor="#F5F5F5"
                borderColor="#babec5"
                borderWidth={1}
                onPress={() => setShowFromDatePicker(true)}>
                <HStack space={2}>
                  <Text color="#808080" fontSize="12" backgroundColor="#ddd">
                    {from && `${from}`}
                  </Text>
                  <Icon
                    as={AntDesign}
                    name="down"
                    color="#000"
                    position="relative"
                    left={from ? '4' : '12'}
                  />
                </HStack>
              </Button>
              <DatePicker
                modal
                mode="date"
                open={showFromDatePicker}
                date={new Date()}
                onConfirm={time => {
                  const format = moment(time).format('YYYY-MM-DD');
                  setShowFromDatePicker(false);
                  setFrom(format);
                }}
                onCancel={() => {
                  setShowFromDatePicker(false);
                }}
              />
            </VStack>
            <VStack>
              <Text></Text>
              <Text>&#12316;</Text>
            </VStack>
            <VStack w="45%">
              <Text>To</Text>
              <Button
                backgroundColor="#F5F5F5"
                borderColor="#babec5"
                borderWidth={1}
                onPress={() => setShowToDatePicker(true)}>
                <HStack space={2}>
                  <Text color="#808080" fontSize="12" backgroundColor="#ddd">
                    {to && `${to}`}
                  </Text>
                  <Icon
                    as={AntDesign}
                    name="down"
                    color="#000"
                    position="relative"
                    left={to ? '4' : '12'}
                  />
                </HStack>
              </Button>
              <DatePicker
                modal
                mode="date"
                open={showToDatePicker}
                date={new Date()}
                onConfirm={time => {
                  const format = moment(time).format('YYYY-MM-DD');
                  setShowToDatePicker(false);
                  setTo(format);
                }}
                onCancel={() => {
                  setShowToDatePicker(false);
                }}
              />
            </VStack>
          </HStack>
          <Center>
            <Button w="50%" mt={4}>
              Search
            </Button>
          </Center>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

export default Account;

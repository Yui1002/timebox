import React, { useState, useEffect } from 'react';
import {
    NativeBaseProvider,
    Box,
    Center,
    Button,
    Modal,
    FormControl,
    Input,
    Select,
    Toast,
    Checkbox,
    HStack,
    VStack,
    Heading,
    Text,
    FlatList,
    CheckIcon,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker'

// const AddNanny_1 = ({ ownerEmail }: any) => {
const AddNanny_1 = ({ route, navigation }: any) => {
    const ownerEmail = route.params.ownerEmail;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [rate, setRate] = useState(0);
    const [rateType, setRateType] = useState(null);
    const [startTimeOpen, setStartTimeOpen] = useState(false);
    const [endTimeOpen, setEndTimeOpen] = useState(false);
    const [startTime, setStartTime] = useState(undefined);
    const [endTime, setEndTime] = useState(undefined);

    const validateInput = () => {
        if (!firstName.length || !lastName.length || !username.length) {
            return false;
        }
        
    }

    // const addUser = async () => {
    //     if (await isUserRegistered()) {
    //         Toast.show({
    //             description: 'Username is already registered',
    //             placement: 'top',
    //         });
    //         return;
    //     }

    //     axios
    //         .post(`${LOCAL_HOST_URL}/user`, {
    //             firstName,
    //             lastName,
    //             username,
    //             rate,
    //             rateType,
    //             status: 'active',
    //             updateDate: new Date(),
    //             ownerEmail: ownerEmail,
    //         })
    //         .then(res => {
    //             Toast.show({
    //                 description: 'New user has been added!',
    //                 placement: 'top',
    //             });
    //         })
    //         .catch(() => {
    //             Toast.show({
    //                 description: 'Something is wrong. Try again.',
    //                 placement: 'top',
    //             });
    //         })
    //         .finally(() => {
    //             clearForm();
    //         })
    // };

    const isUserRegistered = async () => {
        try {
            const res = await axios.post(`${LOCAL_HOST_URL}/user/duplicate`, {
                ownerEmail,
                username,
            });
            return res.data;
        } catch (err) { }
    };

    const onDayChange = (val) => {
        setWorkingDays(d => [...d, val])
    }

    return (
        <NativeBaseProvider>
            <Box m='5%'>
                {/* <ScrollView nestedScrollEnabled={true}> */}
                <FormControl isRequired>
                    <FormControl.Label>User Name</FormControl.Label>
                    <Input
                        onChangeText={val => setUsername(val)}
                        autoCapitalize="none"
                    />
                </FormControl>
                <HStack space={2} justifyContent="center">
                    <FormControl w='50%'>
                        <FormControl.Label>Rate($)</FormControl.Label>
                        <Input
                            keyboardType="numeric"
                            onChangeText={val => setRate(val)}
                        />
                    </FormControl>
                    <FormControl w='50%'>
                        <FormControl.Label>Rate Type</FormControl.Label>
                        <Select onValueChange={val => setRateType(val)}>
                            <Select.Item label="hourly" value="hourly" />
                            <Select.Item label="daily" value="daily" />
                        </Select>
                    </FormControl>

                </HStack>
                {/* <FormControl>
                    <FormControl.Label>Working Days</FormControl.Label>
                    <VStack space={5}>
                        <ScrollView>
                            {days.map(d =>
                                <HStack space={3} justifyContent='justify-content'>
                                    <Checkbox value={d} onChange={() => onDayChange(d)}>{d}</Checkbox>
                                </HStack>)}
                        </ScrollView>
                    </VStack>
                </FormControl>
                <FormControl>
                    <FormControl.Label>Working Hours</FormControl.Label>
                    <HStack space={2} justifyContent='space-around'>
                        {startTime
                            ?
                            <Box>
                                <Text>start</Text>
                                <Text>{`${startTime.getHours()}:${startTime.getMinutes()}`}</Text>
                                <Button variant='link' onPress={() => setStartTimeOpen(true)}>Change time</Button>
                            </Box>
                            :
                            <Button variant='link' onPress={() => setStartTimeOpen(true)}>Pick start time</Button>
                        }
                        {endTime
                            ?
                            <Box>
                                <Text>end</Text>
                                <Text>{`${endTime.getHours()}:${endTime.getMinutes()}`}</Text>
                                <Button variant='link' onPress={() => setEndTimeOpen(true)}>Change time</Button>
                            </Box>
                            :
                            <Button variant='link' onPress={() => setEndTimeOpen(true)}>Pick end time</Button>
                        }
                    </HStack>
                    <DatePicker
                        modal
                        mode='time'
                        open={startTimeOpen}
                        date={new Date()}
                        onConfirm={(time) => {
                            console.log("time: ", time)
                            setStartTimeOpen(false)
                            setStartTime(time)
                        }}
                        onCancel={() => {
                            setStartTimeOpen(false)
                        }}
                    />
                    <DatePicker
                        modal
                        mode='time'
                        open={endTimeOpen}
                        date={new Date()}
                        onConfirm={(time) => {
                            setEndTimeOpen(false)
                            setEndTime(time)
                        }}
                        onCancel={() => {
                            setEndTimeOpen(false)
                        }}
                    />
                </FormControl> */}
                <Button mt="4" onPress={() => navigation.navigate('AddNanny_2')}>
                    Next
                </Button>
            </Box>
        </NativeBaseProvider>
    );
};

export default AddNanny_1;

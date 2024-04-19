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
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker'

const AddNanny = ({ ownerEmail }: any) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [rate, setRate] = useState(0);
    const [rateType, setRateType] = useState(null);
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')


    const validateInput = () => {
        if (!firstName.length || !lastName.length || !username.length) {
            return false;
        }
    }

    const addUser = async () => {
        if (await isUserRegistered()) {
            Toast.show({
                description: 'Username is already registered',
                placement: 'top',
            });
            return;
        }

        axios
            .post(`${LOCAL_HOST_URL}/user`, {
                firstName,
                lastName,
                username,
                rate,
                rateType,
                status: 'active',
                updateDate: new Date(),
                ownerEmail: ownerEmail,
            })
            .then(res => {
                Toast.show({
                    description: 'New user has been added!',
                    placement: 'top',
                });
            })
            .catch(() => {
                Toast.show({
                    description: 'Something is wrong. Try again.',
                    placement: 'top',
                });
            })
            .finally(() => {
                clearForm();
            })
    };

    const isUserRegistered = async () => {
        try {
            const res = await axios.post(`${LOCAL_HOST_URL}/user/duplicate`, {
                ownerEmail,
                username,
            });
            return res.data;
        } catch (err) { }
    };

    const clearForm = () => {
        setFirstName('');
        setLastName('');
        setUsername('');
        setRate(0);
        setRateType(null);
    }

    const renderTimePicker = () => [

    ]

    return (
        <NativeBaseProvider>
            <Box m='5%'>
                {/* <ScrollView> */}
                <FormControl isRequired>
                    <FormControl.Label>First Name</FormControl.Label>
                    <Input
                        onChangeText={val => setFirstName(val)}
                        autoCapitalize="none"
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormControl.Label>Last Name</FormControl.Label>
                    <Input
                        onChangeText={val => setLastName(val)}
                        autoCapitalize="none"
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormControl.Label>User Name</FormControl.Label>
                    <Input
                        onChangeText={val => setUsername(val)}
                        autoCapitalize="none"
                    />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Rate($)</FormControl.Label>
                    <Input
                        keyboardType="numeric"
                        onChangeText={val => setRate(val)}
                    />
                </FormControl>
                <FormControl>
                    <FormControl.Label>Rate Type</FormControl.Label>
                    <Select onValueChange={val => setRateType(val)}>
                        <Select.Item label="hourly" value="hourly" />
                        <Select.Item label="daily" value="daily" />
                    </Select>
                </FormControl>
                <FormControl>
                    <FormControl.Label>Working Days</FormControl.Label>
                    <VStack space={5}>
                        {days.map(d =>
                        <HStack space={3} justifyContent='justify-content'>
                            <Checkbox value={d} onChange={() => setStartOpen(true)}>{d}</Checkbox>
                            {/* <Button size='sm' variant='link' onPress={() => setStartOpen(true)}>Pick start time</Button> */}
                            <DatePicker
                                modal
                                date={new Date()}
                                open={startOpen}
                                mode='time'
                                onConfirm={(time) => {
                                    setStartOpen(false)
                                    setStartTime(time)
                                }}
                                onCancel={() => {
                                    setStartOpen(false)
                                }}
                            />
                            {/* <Button size='sm' variant='link' onPress={() => setEndOpen(true)}>Pick end time</Button> */}
                        </HStack>)}
                    </VStack>
                </FormControl>
                <Button mt="4" onPress={() => addUser()}>
                    Add
                </Button>
                {/* <DatePicker
                                        modal
                                        date={new Date()}
                                        open={startOpen}
                                        mode='time'
                                        onConfirm={(time) => {
                                            setStartOpen(false)
                                            setStartTime(time)
                                        }} 
                                        onCancel={() => {
                                            setStartOpen(false)
                                        }} 
                                    /> */}
                {/* </ScrollView> */}
            </Box>
        </NativeBaseProvider>
    );
};



{/* <FlatList data={days} renderItem={({item}) => <HStack><Text>hey</Text></HStack>}/> */ }
export default AddNanny;

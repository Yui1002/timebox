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

const AddNanny = ({ ownerEmail }: any) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [rate, setRate] = useState(0);
    const [rateType, setRateType] = useState(null);
    const [workingDays, setWorkingDays] = useState([]);
    const [endTime, setEndTime] = useState('')
    const [AMOrPM, setAMOrPM] = useState('');


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

    const onDayChange = (val) => {
        setWorkingDays(d => [...d, val])
    }

    return (
        <NativeBaseProvider>
            <Box m='5%'>
                {/* <ScrollView nestedScrollEnabled={true}> */}
                <HStack space={2} justifyContent="center">
                    <FormControl isRequired w='50%'>
                        <FormControl.Label>First Name</FormControl.Label>
                        <Input
                            onChangeText={val => setFirstName(val)}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </FormControl>
                    <FormControl isRequired w='50%'>
                        <FormControl.Label>Last Name</FormControl.Label>
                        <Input
                            onChangeText={val => setLastName(val)}
                            autoCapitalize="words"
                            autoCorrect={false}
                        />
                    </FormControl>
                </HStack>
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
                <FormControl>
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
                    <HStack space={6} justifyContent='center'>
                        <Input variant="underlined" />
                        <Text>:</Text>
                        <Input variant="underlined" />
                        <Text>~</Text>
                        <Input variant="underlined"/>
                        <Text>:</Text>
                        <Input variant="underlined" />
                        <Select accessibilityLabel="Choose AM or PM" placeholder="Choose AM or PM" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="2" />
                        }} mt={1} onValueChange={val => setAMOrPM(val)}>
                            <Select.Item label="AM" value="ux" />
                            <Select.Item label="PM" value="web" />
                        </Select>
                    </HStack>
                </FormControl>
                <Button mt="4" onPress={() => addUser()}>
                    Add
                </Button>
            </Box>
        </NativeBaseProvider>
    );
};

export default AddNanny;

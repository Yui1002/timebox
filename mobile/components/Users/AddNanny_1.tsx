import React, { useState, useEffect } from 'react';
import {
    NativeBaseProvider,
    Box,
    Button,
    FormControl,
    Input,
    Select,
    HStack,
    Alert,
    VStack,
    Text,
    IconButton,
    CloseIcon,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';
import InputError from './InputError';

const AddNanny_1 = ({ route, navigation }: any) => {
    const ownerEmail = route.params.ownerEmail;
    const [username, setUsername] = useState('');
    const [rate, setRate] = useState(0);
    const [rateType, setRateType] = useState('');
    const [inputErrors, setInputErrors] = useState({ isError: false, type: '', msg: '' });

    const validateInput = async () => {
        if (username.length === 0) {
            const updatedValue = { isError: true, type: 'error', msg: 'The username is required' };
            setInputErrors(updatedValue);
            return;
        } else if (await isUserRegistered()) {
            const updatedValue = { isError: true, type: 'error', msg: 'The username is already used' };
            setInputErrors(updatedValue);
            return;
        } else {
            setInputErrors({ isError: false, type: '', msg: '' });
            navigation.navigate('AddNanny_2', {ownerEmail, username, rate, rateType})
        }
    }

    const isUserRegistered = async () => {
        try {
            const res = await axios.post(`${LOCAL_HOST_URL}/user/duplicate`, {
                ownerEmail,
                username,
            });
            return res.data
        } catch (err) {
            return true;
        }
    };

    return (
        <NativeBaseProvider>
            <Box m='5%'>
                <Box mt={10}>
                    <FormControl isRequired isInvalid={inputErrors.isError}>
                        <FormControl.Label>User Name</FormControl.Label>
                        <Input
                            onChangeText={val => setUsername(val)}
                            autoCapitalize="none"
                        />
                        <FormControl.ErrorMessage>{inputErrors.msg}</FormControl.ErrorMessage>
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
                </Box>
                <Button mt="4" onPress={validateInput}>
                    Next
                </Button>
            </Box>
        </NativeBaseProvider>
    );
};

export default AddNanny_1;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';
import {
    NativeBaseProvider,
    Box,
    FormControl,
    Input,
    Button,
    Heading,
    Text,
} from 'native-base';

const OTP = ({ route, navigation }: any) => {
    const ownerEmail = route.params.ownerEmail;
    const [OTP, setOTP] = useState('')
    const [OTPErrors, setOTPErrors] = useState({})

    useEffect(() => {
        console.log('here in use effect')
        try {
            axios.post(`${LOCAL_HOST_URL}/OTP/create`, {
                email: ownerEmail,
            })
            .then((res) => {
                console.log('res: ', res)
            })

        } catch (err) {
            console.log(err);
        }
    })

    // initial check
    const validateOTP = () => {
        if (!OTP.length) {
            setOTPErrors({
                ...OTPErrors,
                msg: 'OTP code is required',
            });
            return false;
        } else if (OTP.length !== 6) {
            setOTPErrors({
                ...OTPErrors,
                msg: 'OTP code must be 6 digits',
            });
            return false;
        } else if (!OTP.match('^[0-9]+$')) {
            setOTPErrors({
                ...OTPErrors,
                msg: 'OTP code must be number',
            });
            return false;
        } else if (!isOTPMatch()) {
            setOTPErrors({
                ...OTPErrors,
                msg: 'OTP is not match',
            });
        }
        setOTPErrors({});
        return true;
    };

    const isOTPMatch = () => {
        try {
            axios.post(`${LOCAL_HOST_URL}/OTP/validate`, {
                ownerEmail, OTP
            })
            .then(() => {

            })
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    return (
        <NativeBaseProvider>
            <Box m="5%">
                <Heading size="lg">Enter OTP code</Heading>
                <Box alignItems="center">
                    <Text>For your security, we've sent the code to your email.</Text>
                    <Box w="100%" maxWidth="300px" my="8">
                        <FormControl isRequired isInvalid={'msg' in OTPErrors}>
                            <FormControl.Label>OTP Code</FormControl.Label>
                            <Input
                                onChangeText={val => setOTP(val)}
                                placeholder="Enter 6 digit code"
                            />
                            <FormControl.ErrorMessage>
                                {OTPErrors.msg}
                            </FormControl.ErrorMessage>
                        </FormControl>
                    </Box>
                    <Button onPress={validateOTP} w="250">
                        Submit code
                    </Button>
                </Box>
                <Box mt="4">
                    <Text fontSize="xs">
                        <Text
                            underline
                            onPress={() => {
                                navigation.navigate('SignIn');
                            }}>
                            Resend OTP code
                        </Text>
                    </Text>
                </Box>
            </Box>
        </NativeBaseProvider>
    );
};

export default OTP;

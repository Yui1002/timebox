import React, { useState, useEffect } from 'react';
import {
    NativeBaseProvider,
    Box,
    Button,
    HStack,
    VStack,
    Heading,
    Text,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';
import moment from 'moment';

const AddNanny_review = ({ route, navigation }: any) => {
    const {username, rate, rateType, lists, ownerEmail} = route.params;
    
    const submitForm = () => {
        axios.post(`${LOCAL_HOST_URL}/user`, {
            ownerEmail, username, rate, rateType, lists
        })
    }

    return (
        <NativeBaseProvider>
            <Box m='5%'>
                <Heading>Review</Heading>
                <VStack>
                    <HStack>
                        <Text>Username: </Text>
                        <Text>{`${username}`}</Text>
                    </HStack>
                    <HStack>
                        <Text>Rate: </Text>
                        <Text>{`${rate}`}</Text>
                    </HStack>
                    <HStack>
                        <Text>Rate Type: </Text>
                        <Text>{`${rateType}`}</Text>
                    </HStack>
                </VStack>
                <Box>
                    <Text>Working Days / Hours</Text>
                    {lists.map((list) => (
                            <Box>
                                <Text>{'\u2B24'} {`${list.day}   ${moment(list.start).format('LT')} - ${moment(list.end).format('LT')}`}</Text>
                            </Box>
                        ))}
                </Box>
                <HStack space={2}>
                    <Button borderRadius={20} onPress={() => navigation.goBack()}>Go Back</Button>
                    <Button borderRadius={20} onPress={submitForm}>Add</Button>
                </HStack>
            </Box>
        </NativeBaseProvider>
    );
};

export default AddNanny_review;

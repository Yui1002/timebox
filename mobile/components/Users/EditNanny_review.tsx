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

const EditNanny_review = ({ route, navigation }: any) => {
    const { username, rate, rateType, lists, ownerEmail, setAddError, getUsers } = route.params;
    
    const submitForm = () => {
        axios.post(`${LOCAL_HOST_URL}/user`, {
            ownerEmail, username, rate, rateType, lists
        })
        .then((res) => {
            setAddError({ status: 'success', msg: `Successfully added ${username}!` });
            getUsers();
            navigation.navigate('Home_admin', {username})
        })
        .catch((err) => {
            setAddError({ status: 'error', msg: `Failed to add ${username}. Please try again.` })
            navigation.navigate('Home_admin', {username})
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
                                <Text>{'\u2B24'} {`${list.day}   ${list.start} - ${list.end}`}</Text>
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

export default EditNanny_review;

import React, { useState, useEffect } from 'react';
import {
    NativeBaseProvider,
    Box,
    HStack,
    Heading,
    Text,
    IconButton,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';

const EditNanny_2 = ({ route, navigation }: any) => {
    const { ownerEmail, updatedUsername, updatedRate, updatedRateType, shifts, setEditError, getUsers } = route.params;

    return (
        <NativeBaseProvider>
            <Box m='5%'>
                <Heading mb={8}>Edit schedule</Heading>
                {shifts.map((item) =>
                    <HStack space={3} justifyContent='center'>
                        <Text pt={3} fontSize={16}>{`${item.day.substring(0, 3)} : ${item.start_time} - ${item.end_time}`}</Text>
                        <Box>
                            <IconButton _icon={{
                                as: AntDesign,
                                name: "delete"
                            }} />
                        </Box>
                        <Box>
                            <IconButton _icon={{
                                as: AntDesign,
                                name: "edit"
                            }} />
                        </Box>
                    </HStack>
                )}
            </Box>

        </NativeBaseProvider>
    );
};

export default EditNanny_2;

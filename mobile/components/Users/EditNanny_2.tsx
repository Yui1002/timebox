import React, { useState, useEffect, useRef } from 'react';
import {
    NativeBaseProvider,
    Box,
    HStack,
    Heading,
    Text,
    IconButton,
    Button,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';

const EditNanny_2 = ({ route, navigation }: any) => {
    const { ownerEmail, user_name, updatedUsername, updatedRate, updatedRateType, updatedStatus, shifts, setEditError, getUsers } = route.params;
    const [finalShifts, setFinalShifts] = useState(shifts);

    const navigateToEditPage = (item) => {
        navigation.navigate('EditNanny_2_1', { item, finalShifts, setFinalShifts })
    }

    const navigateToAddPage = () => {
        navigation.navigate("AddNanny_schedule", { finalShifts, setFinalShifts })
    }

    const navigateToReviewPage = () => {
        navigation.navigate('EditNanny_review', { finalShifts, ownerEmail, user_name, updatedUsername, updatedRate, updatedRateType, updatedStatus, getUsers })
    }

    const deleteList = (item) => {
        const result = finalShifts.filter(s => JSON.stringify(s) !== JSON.stringify(item))
        setFinalShifts(result);
    }

    return (
        <NativeBaseProvider>
            <Box m='5%'>
                <Heading mb={8}>Edit schedule</Heading>
                <Button borderRadius={20} w='50%' mb={6} onPress={navigateToAddPage}>Add new schedule</Button>
                {finalShifts.map((item) =>
                    <HStack space={3} justifyContent='center'>
                        <Text pt={3} fontSize={16}>{`${item.day.substring(0, 3)} : ${item.start_time} - ${item.end_time}`}</Text>
                        <Box>
                            <IconButton _icon={{
                                as: AntDesign,
                                name: "delete"
                            }}
                                onPress={() => deleteList(item)}
                            />
                        </Box>
                        <Box>
                            <IconButton _icon={{
                                as: AntDesign,
                                name: "edit"
                            }} onPress={() => navigateToEditPage(item)} />
                        </Box>
                    </HStack>
                )}
                <Button mt={10} borderRadius={20} onPress={navigateToReviewPage}>Review</Button>
            </Box>

        </NativeBaseProvider>
    );
};

export default EditNanny_2;

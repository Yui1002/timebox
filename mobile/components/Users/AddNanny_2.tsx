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
    Divider,
    CloseIcon,
    Alert,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';

const AddNanny_2 = ({ route, navigation }: any) => {
    const { ownerEmail, username, rate, rateType } = route.params;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const [selectedDay, setSelectedDay] = useState('');
    const [startTimeOpen, setStartTimeOpen] = useState(false);
    const [endTimeOpen, setEndTimeOpen] = useState(false);
    const [startTime, setStartTime] = useState<Date | undefined>(undefined);
    const [endTime, setEndTime] = useState<Date | undefined>(undefined);
    const [lists, setLists] = useState([]);
    const [inputErrors, setInputErrors] = useState({ isError: false, type: '', msg: '' });

    const validateInput = () => {
        if (startTime >= endTime) {
            const updatedValue = { isError: true, type: 'START_END_SET_ERROR', msg: 'Please set the start time before the end time' }
            setInputErrors(updatedValue);
            return false;
        }
        return true;
    }

    const clearInput = () => {
        setSelectedDay('');
        setStartTime(undefined);
        setEndTime(undefined);
        setInputErrors({ isError: false, type: '', msg: '' });
    }

    const addToLists = () => {
        if (!validateInput()) {
            return;
        };
        
        const data = {
            day: selectedDay,
            start: startTime,
            end: endTime
        }
        setLists(l => [...l, data]);
        clearInput();
    }

    const deleteList = (list) => {
        console.log('list: ', list)
        setLists(l => l.filter(item => item.day !== list.day && item.start !== list.start && item.end !== list.end))
    }

    return (
        <NativeBaseProvider>
            <Box m='5%'>
                <Heading>Assign schedule</Heading>
                <Text mt={2}>Select a day, then start time and end time</Text>
                <Center mt={8}>
                    <Box maxW="300">
                        <Center>
                            <FormControl isRequired>
                                <Select mb={4} selectedValue={selectedDay} minWidth="200" accessibilityLabel="Choose Day" placeholder="Choose Day" _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size="5" />
                                }} mt={1} onValueChange={itemValue => setSelectedDay(itemValue)}>
                                    {days.map((d) => <Select.Item label={d} value={d} />)}
                                </Select>
                            </FormControl>
                        </Center>
                        <Center>
                            <FormControl isRequired>
                                <Button variant='link' onPress={() => setStartTimeOpen(true)}>Pick start time</Button>
                                <DatePicker
                                    modal
                                    mode='time'
                                    open={startTimeOpen}
                                    date={new Date()}
                                    onConfirm={(time) => {
                                        setStartTimeOpen(false)
                                        setStartTime(time)
                                    }}
                                    onCancel={() => {
                                        setStartTimeOpen(false)
                                    }}
                                />
                                {startTime &&
                                    <Text textAlign='center'>{moment(startTime).format('LT')}</Text>}
                                <FormControl.ErrorMessage>{inputErrors.msg}</FormControl.ErrorMessage>
                            </FormControl>
                        </Center>
                        <Center>
                            <FormControl isRequired isInvalid={'isError' in inputErrors}>
                                <Button variant='link' onPress={() => setEndTimeOpen(true)}>Pick end time</Button>
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
                                {endTime &&
                                    <Text textAlign='center'>{moment(endTime).format('LT')}</Text>}
                                <FormControl.ErrorMessage>{inputErrors.msg}</FormControl.ErrorMessage>
                            </FormControl>
                        </Center>
                        {selectedDay && startTime && endTime && <Button onPress={addToLists} borderRadius={20} mt={4}>Add</Button>}
                    </Box>
                    <Divider my="2" _light={{
                        bg: "muted.800"
                    }} _dark={{
                        bg: "muted.50"
                    }} />
                    <ScrollView>
                        {lists.map((list) => (
                            <HStack>
                                <Text p={4}>{'\u2B24'} {`${list.day}   ${moment(list.start).format('LT')} - ${moment(list.end).format('LT')}`}</Text>
                                <Text p={4} underline color='#0e7490' onPress={() => deleteList(list)}>Delete</Text>
                            </HStack>
                        ))}
                    </ScrollView>
                    <Button onPress={() => navigation.navigate('AddNanny_review')}>Review</Button>
                </Center>
            </Box>
        </NativeBaseProvider>
    );
};

export default AddNanny_2;

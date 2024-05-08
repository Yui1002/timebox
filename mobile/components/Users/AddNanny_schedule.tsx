import React, { useState, useEffect } from 'react';
import {
    NativeBaseProvider,
    Box,
    Center,
    Button,
    FormControl,
    Select,
    HStack,
    Heading,
    Text,
    CheckIcon,
    Divider,
} from 'native-base';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';

const AddNanny_schedule = ({ route, navigation }: any) => {
    const { finalShifts, setFinalShifts } = route.params;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const [selectedDay, setSelectedDay] = useState('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [startTimeOpen, setStartTimeOpen] = useState(false);
    const [endTimeOpen, setEndTimeOpen] = useState(false);
    const [inputErrors, setInputErrors] = useState({ type: '', title: '', msg: '' });

    const validateInput = () => {
        if (selectedDay.length < 1) {
            const error = { type: 'EMPTY_DAY', title: '', msg: 'Please set the day' }
            setInputErrors(error);
            return false;
        }
        if (startTime.length < 1) {
            const error = { type: 'EMPTY_START_TIME', title: '', msg: 'Please set the start time' }
            setInputErrors(error);
            return false;
        }
        if (endTime.length < 1) {
            const error = { type: 'EMPTY_END_TIME', title: '', msg: 'Please set the end time' }
            setInputErrors(error);
            return false;
        }
        if (startTime >= endTime) {
            const error = { type: 'START_END_SET_ERROR', title: '', msg: 'Please set the start time before the end time' }
            setInputErrors(error);
            return false;
        }
        return true;
    }

    const convertFormat = (time: string | Date) => {
        return typeof time === 'string' ? time : moment(time).format('LT')
    }

    const clearInput = () => {
        setSelectedDay('');
        setStartTime('');
        setEndTime('');
        setInputErrors({ type: '', title: '', msg: '' });
    }

    const addSchedule = () => {
        if (!validateInput()) return;
        const newValue = {day: selectedDay, start_time: convertFormat(startTime), end_time: convertFormat(endTime)}
        setFinalShifts(s => [...s, newValue]);

        navigation.goBack();
    }

    return (
        <NativeBaseProvider>
            <Box m='5%'>
                <Heading>Add Nanny's schedule</Heading>
                <Text mt={2}>Select a day, then start time and end time</Text>
                <Center mt={8}>
                    <Box maxW="300">
                        <Center>
                            <FormControl isRequired isInvalid={inputErrors.type === 'EMPTY_DAY'}>
                                <Select mb={4} selectedValue={selectedDay} minWidth="200" accessibilityLabel="Choose Day" placeholder="Choose Day" _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size="5" />
                                }} mt={1} onValueChange={itemValue => setSelectedDay(itemValue)}>
                                    {days.map((d, index) => <Select.Item key={index} label={d} value={d} />)}
                                </Select>
                                <FormControl.ErrorMessage>{inputErrors.msg}</FormControl.ErrorMessage>
                            </FormControl>
                        </Center>
                        <Center>
                            <FormControl isRequired isInvalid={startTime.length < 1}>
                                <Button variant='link' onPress={() => setStartTimeOpen(true)}>Pick start time</Button>
                                <FormControl.ErrorMessage>{inputErrors.msg}</FormControl.ErrorMessage>
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
                                    <Text textAlign='center'>{convertFormat(startTime)}</Text>}
                            </FormControl>
                        </Center>
                        <Center>
                            <FormControl isRequired isInvalid={inputErrors.type === 'EMPTY_END_TIME' || inputErrors.type == 'START_END_SET_ERROR'}>
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
                                    <Text textAlign='center'>{convertFormat(endTime)}</Text>}
                                <FormControl.ErrorMessage>{inputErrors.msg}</FormControl.ErrorMessage>
                            </FormControl>
                        </Center>
                    </Box>
                    <Divider my="2" _light={{
                        bg: "muted.800"
                    }} _dark={{
                        bg: "muted.50"
                    }} />
                    <HStack space={2} mt={10}>
                        <Button borderRadius={20} onPress={() => navigation.goBack()}>Go Back</Button>
                        <Button borderRadius={20} onPress={addSchedule}>Add</Button>
                    </HStack>
                </Center>
            </Box>
        </NativeBaseProvider>
    );
};

export default AddNanny_schedule;

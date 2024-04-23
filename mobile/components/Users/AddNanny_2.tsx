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
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker'

const AddNanny_2 = ({ route, navigation }: any) => {
    const ownerEmail = route.params.ownerEmail;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const [selectedDay, setSelectedDay] = useState('');
    const [startTimeOpen, setStartTimeOpen] = useState(false);
    const [endTimeOpen, setEndTimeOpen] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [lists, setLists] = useState([]);

    const addToLists = () => {
        const data = {
            day: selectedDay,
            start: startTime,
            end: endTime
        }
        setLists(l => [...l, data]);
        setSelectedDay('');
        setStartTime('');
        setEndTime('');
    }

    const deleteList = (list) => {
        console.log('list: ', list)
        setLists(l => l.filter(item => item.day !== list.day && item.start !== list.start && item.end !== list.end))
    }

    return (
        <NativeBaseProvider>
            <Box m='5%'>
                <Heading>Assign schedule</Heading>
                <Text>Pick a day, then start time and end time</Text>
                <Center mt='10'>
                    <Box maxW="300">
                        <Select selectedValue={selectedDay} minWidth="200" accessibilityLabel="Choose Day" placeholder="Choose Day" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={itemValue => setSelectedDay(itemValue)}>
                            {days.map((d) => <Select.Item label={d} value={d} />)}
                        </Select>

                        <Box>
                            <Button variant='link' onPress={() => setStartTimeOpen(true)}>Pick start time</Button>
                            <DatePicker
                                modal
                                mode='time'
                                open={startTimeOpen}
                                date={new Date()}
                                onConfirm={(time) => {
                                    setStartTimeOpen(false)
                                    setStartTime(`${time.getHours()} : ${time.getMinutes()}`)
                                }}
                                onCancel={() => {
                                    setStartTimeOpen(false)
                                }}
                            />
                            {startTime &&
                                <Text textAlign='center'>{startTime}</Text>}
                        </Box>

                        <Box>
                            <Button variant='link' onPress={() => setEndTimeOpen(true)}>Pick end time</Button>
                            <DatePicker
                                modal
                                mode='time'
                                open={endTimeOpen}
                                date={new Date()}
                                onConfirm={(time) => {
                                    setEndTimeOpen(false)
                                    setEndTime(`${time.getHours()} : ${time.getMinutes()}`)
                                }}
                                onCancel={() => {
                                    setEndTimeOpen(false)
                                }}
                            />
                            {endTime &&
                                <Text textAlign='center'>{endTime}</Text>}
                        </Box>

                        {endTime && <Button onPress={addToLists}>Add</Button>}
                    </Box>
                    <Divider my="2" _light={{
                        bg: "muted.800"
                    }} _dark={{
                        bg: "muted.50"
                    }} />
                    <ScrollView>
                        {lists.map((list) => (
                            <HStack>
                                <Text p={4}>{'\u2B24'} {`${list.day}   ${list.start} - ${list.end}`}</Text>
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

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

const AddNanny_review = ({ ownerEmail }: any) => {

    return (
        <NativeBaseProvider>
            <Box m='5%'>
                <Heading>Review</Heading>
            </Box>
        </NativeBaseProvider>
    );
};

export default AddNanny_review;

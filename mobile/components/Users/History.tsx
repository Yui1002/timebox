import React, { useState, useEffect } from 'react';
import {
  NativeBaseProvider,
  Box,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';
import moment from 'moment'

const History = ({ route }: any) => {
  const username = route.params.username;
  const [history, setHistory] = useState([])

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = () => {
    axios.get(`${LOCAL_HOST_URL}/history/${username}`)
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <NativeBaseProvider>
      <Box m="5%">

      </Box>
    </NativeBaseProvider>
  );
};

export default History;

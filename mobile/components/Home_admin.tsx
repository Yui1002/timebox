import React, { useState } from 'react';
import styles from '../styles/styles';
import {
  Box,
  NativeBaseProvider,
} from 'native-base';
import Users from './Users/Users';
import AlertMsg from './AlertMsg';

const Home_admin = ({ route }: any) => {
  const email = route.params.ownerEmail;
  const [addSuccess, setAddSuccess] = useState(false);

  setTimeout(() => {
    if (addSuccess) {
      setAddSuccess(false);
    }
  }, 5000)

  return (
    <NativeBaseProvider>
      {addSuccess ? <AlertMsg msg="Successfully added!" status='success' /> : null}
      <Box style={styles.container}>
        <Users email={email} setAddSuccess={setAddSuccess} />
      </Box>
    </NativeBaseProvider>
  );
};

export default Home_admin;

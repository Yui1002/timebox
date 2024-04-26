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
  const [addSuccess, setAddSuccess] = useState<boolean | null>(null);
  const [editSuccess, setEditSuccess] = useState<boolean | null>(null);

  setTimeout(() => {
    if (addSuccess) {
      setAddSuccess(null);
    }
    if (editSuccess) {
      setEditSuccess(null);
    }
  }, 5000)

  return (
    <NativeBaseProvider>
      {addSuccess ? <AlertMsg msg="Successfully added!" status='success' /> : null}
      {editSuccess ? <AlertMsg msg="Successfully edited!" status='success' /> : null}
      <Box style={styles.container}>
        <Users email={email} setAddSuccess={setAddSuccess} setEditSuccess={setEditSuccess} />
      </Box>
    </NativeBaseProvider>
  );
};

export default Home_admin;

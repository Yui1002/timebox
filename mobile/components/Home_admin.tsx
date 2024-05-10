import React, {useState} from 'react';
import {Box, NativeBaseProvider} from 'native-base';
import Users from './Users/Users';
import AlertMsg from './AlertMsg';

const Home_admin = ({route}: any) => {
  const email = route.params.ownerEmail;
  const [addError, setAddError] = useState({status: undefined, msg: ''});
  const [editError, setEditError] = useState({status: undefined, msg: ''});

  setTimeout(() => {
    if (addError.status !== undefined) {
      setAddError({status: undefined, msg: ''});
    }
    if (editError.status !== undefined) {
      setEditError({status: undefined, msg: ''});
    }
  }, 5000);

  return (
    <NativeBaseProvider>
      {addError.status == 'success' && (
        <AlertMsg msg={addError.msg} status={addError.status} />
      )}
      {addError.status == 'error' && (
        <AlertMsg msg={addError.msg} status={addError.status} />
      )}
      {editError.status == 'success' && (
        <AlertMsg msg={editError.msg} status={editError.status} />
      )}
      {editError.status == 'error' && (
        <AlertMsg msg={editError.msg} status={editError.status} />
      )}
      <Box m="5%">
        <Users
          email={email}
          setAddError={setAddError}
          setEditError={setEditError}
        />
      </Box>
    </NativeBaseProvider>
  );
};

export default Home_admin;

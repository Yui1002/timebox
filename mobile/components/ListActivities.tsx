import React, {useState} from 'react';
import styles from '../styles/styles';
import {Box, Text} from 'native-base';
import Activity from './Activity';

const ListActivities = ({ownerEmail, activities, getActivities, setShowSuccess}) => {
  return (
    <Box style={styles.container}>
      {activities && activities.length < 1 ? (
        <Box>
          <Text>No activity found</Text>
        </Box>
      ) : (
        <Box style={styles.list_user_container}>
          {activities.map(activity => (
            <Activity
              ownerEmail={ownerEmail}
              activity={activity}
              getActivities={getActivities}
              setShowSuccess={setShowSuccess}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ListActivities;

import React, {useState, useRef} from 'react';
import {
  Box,
  Text,
  Button,
  HStack,
  VStack,
  Spacer,
  IconButton,
  HamburgerIcon,
  AlertDialog,
  Actionsheet,
  Divider,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';
import EditActivity from './EditActivity';

const Activity = ({ownerEmail, activity, getActivities, setShowSuccess}) => {
  const [actionOpen, setActionOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const cancelRef = useRef(null);

  const openDeleteDialog = () => {
    setActionOpen(false);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = () => {
    setActionOpen(false);
    setEditModalOpen(true);
  };

  const deleteActivity = (name: string) => {
    axios
      .delete(`${LOCAL_HOST_URL}/activity/${ownerEmail}/${name}`)
      .then(() => {
        setDeleteDialogOpen(false);
        setShowSuccess({
          category: 'delete activity',
          status: 'success',
          title: 'The activity has been deleted!',
        });
        getActivities();
      })
      .catch(() => {
        setShowSuccess({
          category: 'delete activity',
          status: 'fail',
          title: 'Something is wrong. Try again.',
        });
      });
  };

  return (
    <Box
      width="80%"
      marginLeft="auto"
      marginRight="auto"
      key={activity.index}
      borderBottomWidth="1"
      _dark={{
        borderColor: 'muted.50',
      }}
      borderColor="muted.800"
      py="2">
      <HStack space={[2, 3]} justifyContent="space-between">
        <VStack>
          <Text
            _dark={{
              color: 'warmGray.50',
            }}
            color="coolGray.800">
            {activity.activity_name}
          </Text>
        </VStack>
        <Spacer />
        <VStack>
          <Text
            fontSize="xs"
            _dark={{
              color: 'warmGray.50',
            }}
            color="coolGray.800"
            alignSelf="flex-start">
            {activity.status}
          </Text>
        </VStack>
        <IconButton
          onPress={() => setActionOpen(true)}
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
          }}
          icon={<HamburgerIcon size={4} />}
        />
      </HStack>
      <Actionsheet isOpen={actionOpen} onClose={() => setActionOpen(false)}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={openEditDialog}>Edit</Actionsheet.Item>
          <EditActivity
            editModalOpen={editModalOpen}
            setEditModalOpen={setEditModalOpen}
            activity={activity}
            ownerEmail={ownerEmail}
            setShowSuccess={setShowSuccess}
            getActivities={getActivities}
          />
          <Divider borderColor="gray.300" />
          <Actionsheet.Item onPress={openDeleteDialog}>Delete</Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Activity</AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure to delete the activity?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="danger"
                onPress={() => deleteActivity(activity.activity_name)}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Box>
  );
};

export default Activity;

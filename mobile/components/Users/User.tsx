import React, {useState, useRef} from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Text,
  HStack,
  VStack,
  Spacer,
  IconButton,
  Actionsheet,
  HamburgerIcon,
  Divider,
  AlertDialog,
  Button,
  Toast,
} from 'native-base';
import EditUser from './EditUser';
import axios from 'axios';
import {LOCAL_HOST_URL} from '../../config.js';

const User = ({navigation, user, getUsers, ownerEmail}: any) => {
  const {first_name, last_name, user_name, rate, rate_type, status} = user;
  const [actionOpen, setActionOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const cancelRef = useRef(null);
  const { navigate } = useNavigation();

  const openDeleteDialog = () => {
    setActionOpen(false);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = () => {
    setActionOpen(false);
    setEditModalOpen(true);
  };

  const deleteUser = () => {
    axios
      .delete(`${LOCAL_HOST_URL}/user/${user_name}/${ownerEmail}`)
      .then(() => {
        Toast.show({
          description: 'User has been deleted!',
          placement: 'top',
        });
        getUsers();
      })
      .catch(() => {
        Toast.show({
          description: 'Failed to delete user.',
          placement: 'top',
        });
      })
      .finally(() => {
        setDeleteDialogOpen(false);
      });
  };

  const showRecord = () => {
    navigate('History', {username: user_name})
  }

  return (
    <Box width="100%" borderBottomWidth="1" borderColor="muted.800" py="1.5">
      <HStack space={[2, 3]}>
        <VStack>
          <Text bold fontSize="md">
            {first_name}
          </Text>
        </VStack>
        <VStack>
          <Text bold fontSize="md">
            {last_name}
          </Text>
        </VStack>
        <Spacer />
        <VStack>
          <Text fontSize="xs">{status}</Text>
        </VStack>
        <IconButton
          onPress={() => setActionOpen(true)}
          p="0"
          icon={<HamburgerIcon size={6} />}
        />
      </HStack>
      <HStack justifyContent="space-between">
        <VStack>
          <Text>{user_name}</Text>
        </VStack>
        <VStack>
          <Text fontSize="xs">
            ${rate} - {rate_type}
          </Text>
        </VStack>
      </HStack>
      <Actionsheet isOpen={actionOpen} onClose={() => setActionOpen(false)}>
        <Actionsheet.Content>
          <Actionsheet.Item onPress={openEditDialog}>Edit</Actionsheet.Item>
          <EditUser
            editModalOpen={editModalOpen}
            setEditModalOpen={setEditModalOpen}
            user={user}
            ownerEmail={ownerEmail}
            getUsers={getUsers}
          />
          <Divider borderColor="gray.300" />
          <Actionsheet.Item onPress={openDeleteDialog}>Delete</Actionsheet.Item>
          <Divider borderColor="gray.300" />
          <Actionsheet.Item onPress={showRecord}>Show record</Actionsheet.Item>
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
              <Button colorScheme="danger" onPress={() => deleteUser()}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Box>
  );
};

export default User;

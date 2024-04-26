import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Box,
  Text,
  HStack,
  VStack,
  Spacer,
  HamburgerIcon,
  AlertDialog,
  Button,
  Toast,
  Menu,
  Pressable,
} from 'native-base';
import axios from 'axios';
import { LOCAL_HOST_URL } from '../../config.js';

const User = ({ user, getUsers, ownerEmail, setEditSuccess }: any) => {
  const navigation = useNavigation();
  const cancelRef = React.useRef(null);
  const { first_name, last_name, user_name, rate, rate_type, status, shifts } = user;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  return (
    <Box width="100%" borderBottomWidth="1" borderColor="muted.800" py="1.5">
      <HStack space={[2, 3]}>
        <VStack>
          <Text fontSize={16} bold>{user_name}</Text>
        </VStack>
        <Spacer />
        <VStack>
          <Text fontSize="xs">{status}</Text>
        </VStack>
        <Menu w='190' trigger={triggerProps => {
          return <Pressable accessibilityLabel='More options menu' {...triggerProps}><HamburgerIcon size={6} /></Pressable>
        }}>
          <Menu.Item onPress={() => navigation.navigate("EditNanny", { user, getUsers, ownerEmail, setEditSuccess })}>Edit</Menu.Item>
          <Menu.Item onPress={() => setDeleteDialogOpen(true)}>Delete</Menu.Item>
          <Menu.Item onPress={() => navigation.navigate("History", { usename: user_name })}>Show record</Menu.Item>
        </Menu>
      </HStack>
      <HStack justifyContent="space-between">
        <VStack>
          {shifts.map((s) => <Text fontSize={12}>{`${s.day.substring(0, 3)}: ${s.start_time} - ${s.end_time}`}</Text>)}
        </VStack>
        <VStack>
          <Text fontSize="xs">
            ${rate} - {rate_type}
          </Text>
        </VStack>
      </HStack>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Nanny</AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure to delete the nanny?
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

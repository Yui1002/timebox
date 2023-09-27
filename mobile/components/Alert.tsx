import React, {useState} from 'react';
import {AlertDialog, Button} from 'native-base';

const Alert = ({}) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    
  return (
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
  );
};

export default Alert;

import React, {useState, useEffect, useRef} from 'react';
import {
  NativeBaseProvider,
  Box,
  HStack,
  Heading,
  Text,
  IconButton,
  Button,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface dayTimeObject {
  day: string;
  start_time: string;
  end_time: string;
}

const EditNanny_schedule_home = ({route, navigation}: any) => {
  const {
    ownerEmail,
    user_name,
    updatedUsername,
    updatedRate,
    updatedRateType,
    updatedStatus,
    shifts,
    setEditError,
    getUsers,
  } = route.params;
  const [finalShifts, setFinalShifts] = useState(shifts);

  const navigateToEditPage = (item: dayTimeObject) => {
    navigation.navigate('EditNanny_schedule', {
      item,
      finalShifts,
      setFinalShifts,
    });
  };

  const navigateToAddPage = () => {
    navigation.navigate('AddNanny_schedule', {finalShifts, setFinalShifts});
  };

  const navigateToReviewPage = () => {
    navigation.navigate('EditNanny_review', {
      finalShifts,
      ownerEmail,
      user_name,
      updatedUsername,
      updatedRate,
      updatedRateType,
      updatedStatus,
      getUsers,
    });
  };

  const deleteList = (item: dayTimeObject) => {
    const result = finalShifts.filter(
      (s: dayTimeObject) => JSON.stringify(s) !== JSON.stringify(item),
    );
    setFinalShifts(result);
  };

  return (
    <NativeBaseProvider>
      <Box m="5%">
        <Heading mb={8}>Edit schedule</Heading>
        <Button borderRadius={20} w="50%" mb={6} onPress={navigateToAddPage}>
          Add new schedule
        </Button>
        {finalShifts.length > 0 ? (
          finalShifts.map(f => (
            <HStack space={3} justifyContent="center">
              <Text pt={3} fontSize={16}>{`${f.day.substring(0, 3)} : ${
                f.start_time
              } - ${f.end_time}`}</Text>
              <Box>
                <IconButton
                  _icon={{
                    as: AntDesign,
                    name: 'delete',
                  }}
                  onPress={() => deleteList(f)}
                />
              </Box>
              <Box>
                <IconButton
                  _icon={{
                    as: AntDesign,
                    name: 'edit',
                  }}
                  onPress={() => navigateToEditPage(f)}
                />
              </Box>
            </HStack>
          ))
        ) : (
          <Text>No schedule registered</Text>
        )}
        <Button mt={10} borderRadius={20} onPress={navigateToReviewPage}>
          Review
        </Button>
      </Box>
    </NativeBaseProvider>
  );
};

export default EditNanny_schedule_home;

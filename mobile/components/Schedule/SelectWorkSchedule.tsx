import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {TopContainer, Button, AlignContainer, Title, Result} from '../index';
import DaySelection from '../DaySelection';
import {ResultModel} from '../../types';
import {StatusModel} from '../../enums';
import { DateDropdown } from '../Common/CustomDropdown';
import { COLORS } from '../../styles/theme';

interface SelectWorkScheduleProps {
    route: {
        params: {
            existingStartTime?: string;
            existingEndTime?: string;
            existingDay?: string;
            onPress: any;
        }
    },
    navigation: any
}

const SelectWorkSchedule = ({route, navigation}: SelectWorkScheduleProps) => {
  const { existingStartTime, existingEndTime, existingDay } = route.params || {};
  const { onPress } = route.params;
  const startTime: string = existingStartTime || "";
  const endTime: string = existingEndTime || "";
  const day: string = existingDay || "";

  const [isStartDropdownOpen, setIsStartDropdownOpen] = useState<boolean>(false);
  const [isEndDropdownOpen, setIsEndDropdownOpen] = useState<boolean>(false);

  const [startTimeState, setStartTimeState] = useState<string>(startTime);
  const [endTimeState, setEndTimeState] = useState<string>(endTime);
  const [dayState, setDayState] = useState<string>(day);

  const [result, setResult] = useState<ResultModel>({
    status: StatusModel.ERROR,
    message: '',
  });

  return (
    <TopContainer>
      {result.status && <Result status={result.status} msg={result.message} />}
      <Title title="Select day and time" />
      <DaySelection selectedDay={dayState} setSelectedDay={setDayState} />
      <AlignContainer>
        <DateDropdown
          placeholder={`${setStartTimeState}`}
          boxWidth={'45%'}
          boxHeight={'40%'}
          onPressDropdown={() => setIsStartDropdownOpen(!isStartDropdownOpen)}
          isDisabled={false}
          mode="time"
          isOpen={isStartDropdownOpen}
          date={new Date()}
          onConfirm={(time: Date) => setStartTimeState(time.momentFormat('LT'))}
          onCancel={() => setIsStartDropdownOpen(false)}
          isArrowIconShown={true}
        />
      </AlignContainer>
      <AlignContainer>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          buttonWidth={'45%'}
          buttonHeight={'30%'}
          buttonColor={COLORS.LIGHT_GREY}
        />
        <Button
          title="Continue"
          onPress={onPress}
          buttonWidth={'45%'}
          buttonHeight={'30%'}
        />
      </AlignContainer>
    </TopContainer>
  );
};

export default SelectWorkSchedule;

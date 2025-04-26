import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import moment from 'moment';
import {
  DefaultApiFactory,
  RequestStatus,
  UpdateRequestRq,
  Mode,
  UserSchedule,
} from '../../swagger';
import {AlignContainer, Button} from '../index';
const api = DefaultApiFactory();
import ScheduleList from '../ServiceProvider/ScheduleList';
import {ButtonStyle} from '../../styles';
import {alert, alertError} from '../../helper/Alert';
import { getToken } from '../../tokenUtils';
import LoadingButton from '../LoadingButton';

const NotificationList = ({notification, navigation}: any) => {
  const user = useSelector(state => state.userInfo);
  const {
    firstName,
    lastName,
    rate,
    rateType,
    email,
    requestDate,
    schedules,
    allowEdit,
  } = notification;
  let acceptBtn = ButtonStyle.createContinueButtonStyle();
  let rejectBtn = ButtonStyle.createBackButtonStyle();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const alertConfirm = (status: RequestStatus) => {
    alert(
      `Do you want to ${status.toLowerCase()} \n ${firstName} ${lastName}'s request?`,
      '',
      function () {
        updateRequest(status);
      },
      null,
    );
  };

  const updateRequest = async (status: RequestStatus) => {
    try {
      setIsLoading(true);

      const token = await getToken();

      await api.updateRequest({
        senderEmail: email,
        receiverEmail: user.email,
        status,
        rate,
        rateType,
        schedules: schedules[0].day == null ? [] : schedules,
        mode: allowEdit ? Mode.NUMBER_1 : Mode.NUMBER_0,
      } as UpdateRequestRq, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alertSuccess(status);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false)
    }
  };

  const alertSuccess = (status: RequestStatus) => {
    alertError(
      `You successfully ${status.toLowerCase()}ed ${firstName} ${lastName}'s request!`,
      '',
      function () {
        navigation.goBack();
      },
    );
  };

  return (
    <View>
      <Text>{`Request from ${firstName} ${lastName}`}</Text>
      <Text>{`${moment(requestDate).format('YYYY/MM/DD h:mm')}`}</Text>
      <Text>
        {`Pay: ${
          rate && rateType ? `$${rate} / ${rateType}` : `Not specified`
        }`}
      </Text>
      <View>
        <Text>Schedules:</Text>
        {schedules[0].day !== null ? (
          schedules.map((s: UserSchedule, index: number) => (
            <ScheduleList w={s} key={index} showDeleteLink={false} />
          ))
        ) : (
          <Text>Not specified</Text>
        )}
      </View>
      <AlignContainer>
        <Button
          title="Decline"
          onPress={() => alertConfirm(RequestStatus.Rejected)}
          style={rejectBtn}
        />
        <Button
          title="Accept"
          onPress={() => alertConfirm(RequestStatus.Approved)}
          style={acceptBtn}
        />
      </AlignContainer>
    </View>
  );
};

export default NotificationList;

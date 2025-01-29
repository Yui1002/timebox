import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import moment from 'moment';
import {
  DefaultApiFactory,
  RequestStatus,
  GetUserScheduleRs,
  Request,
  UpdateRequestStatusRq,
  UserStatus,
  Mode,
  SetUserTransactionRq,
  SetUserScheduleRq,
} from '../../swagger';
import {AlignContainer, Button} from '../index';
const api = DefaultApiFactory();
import ScheduleList from '../ServiceProvider/ScheduleList';
import {ButtonStyle} from '../../styles';
import {alert, alertError} from '../../helper/Alert';

const NotificationList = ({notification, navigation}: any) => {
  const {
    senderFirstName,
    senderLastName,
    rate,
    rateType,
    senderEmail,
    receiverEmail,
    requestDate,
    schedules,
    allowEdit,
  }: Request = notification;
  let acceptBtn = ButtonStyle.createContinueButtonStyle();
  let rejectBtn = ButtonStyle.createBackButtonStyle();

  const alertConfirm = (status: RequestStatus) => {
    alert(
      `Do you want to ${status.toLowerCase()} \n ${senderFirstName} ${senderLastName}'s request?`,
      '',
      function () {
        updateRequest(status);
      },
      null,
    );
  };

  const updateRequest = async (status: RequestStatus) => {
    try {
      await api.updateRequestStatus({
        senderEmail,
        receiverEmail,
        status,
      } as UpdateRequestStatusRq);

      if (status === RequestStatus.Approved) {
        Promise.all([
          await api.setUserTransaction({
            rate: rate,
            rateType: rateType,
            employerEmail: senderEmail,
            serviceProviderEmail: receiverEmail,
            status: UserStatus.Active,
            mode: allowEdit ? Mode.NUMBER_1 : Mode.NUMBER_0
          } as SetUserTransactionRq),
          await api.setSchedule({
            employerEmail: senderEmail,
            serviceProviderEmail: receiverEmail,
            schedules: schedules
          } as SetUserScheduleRq)
        ]);
      }
      console.log('success 2')
      alertSuccess(status);
    } catch (e) {
      console.log(e);
    }
  };

  const alertSuccess = (status: RequestStatus) => {
    alertError(
      `You successfully ${status.toLowerCase()}ed ${senderFirstName} ${senderLastName}'s request!`,
      '',
      function () {
        navigation.goBack();
      },
    );
  };

  return (
    <View>
      <Text>{`Request from ${senderFirstName} ${senderLastName}`}</Text>
      <Text>{`${moment(requestDate).format('YYYY/MM/DD h:mm')}`}</Text>
      <Text>
        {`Pay: ${
          rate && rateType ? `$${rate} / ${rateType}` : `Not specified`
        }`}
      </Text>
      <View>
        <Text>Schedules:</Text>
        {schedules?.length ? (
          schedules.map((s: GetUserScheduleRs, index: number) => (
            <ScheduleList w={s} key={index} />
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

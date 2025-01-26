import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {ContainerStyle, ButtonStyle, TextStyle} from '../../styles';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {alert, alertError} from '../../helper/Alert';
import {Days} from '../../enums';
import {
  DefaultApiFactory,
  RequestStatus,
  Request,
  GetUserScheduleRs,
  UpdateRequestStatusRq,
} from '../../swagger/generated';
import {
  TopContainer,
  Button,
  Error,
  DatePickerDropdown,
  AlignContainer,
  Dropdown,
  Title,
} from '../index';
const api = DefaultApiFactory();

const NotificationList = (props: any) => {
  return (
    <View key={index} style={container}>
      <Text style={titleText}>
        {`Request from ${senderFirstName} ${senderLastName}`}
      </Text>
      <Text style={timeText}>{`${moment(requestDate).format(
        'YYYY/MM/DD h:mm',
      )}`}</Text>
      <Text style={text}>
        {`Pay: ${
          rate && rateType ? `$${rate} / ${rateType}` : `Not specified`
        }`}
      </Text>
      <View>
        <Text style={text}>Schedules:</Text>
        {schedules?.length ? (
          schedules.map((s: GetUserScheduleRs, index: number) => (
            <View key={index}>
              <Text style={text}>{`${String.fromCharCode(8226)} ${s.day} ${
                s.startTime
              } - ${s.endTime}`}</Text>
            </View>
          ))
        ) : (
          <Text>Not specified</Text>
        )}
      </View>
      <View style={alignContainer}>
        <TouchableOpacity
          style={declineBtn}
          onPress={() => alertConfirm(r, RequestStatus.Rejected)}>
          <Text style={btnText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={acceptBtn}
          onPress={() => alertConfirm(r, RequestStatus.Approved)}>
          <Text style={btnText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotificationList;

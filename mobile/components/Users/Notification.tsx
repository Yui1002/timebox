import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {alert, alertError} from '../../helper/Alert';
import {Days} from '../../enums';
import {
  DefaultApiFactory,
  RequestStatus,
  Request,
  GetUserScheduleRs,
  UpdateRequestStatusRq,
} from '../../swagger';
import {TopContainer} from '../index';
import NotificationList from './NotificationList';
const api = DefaultApiFactory();

const Notification = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const [requests, setRequests] = useState<Request[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getRequests();
    }
  }, [isFocused]);

  const getRequests = async () => {
    try {
      const {data} = await api.getRequestsByStatus(
        userInfo.email,
        RequestStatus.Pending,
      );
      console.log('data', data.requests);
      setRequests(formatData(data.requests!));
    } catch (e) {
      setRequests([]);
    }
  };

  const formatData = (requests: Request[]): Request[] => {
    let formattedRequests = requests.reduce((r1: Request[], r2: Request) => {
      const found = r1.find((r: Request) => r.senderEmail == r2.senderEmail);
      const item: GetUserScheduleRs = {
        day: r2.day,
        startTime: r2.startTime,
        endTime: r2.endTime,
      };
      Object.keys(item).forEach(
        key => delete r2[key as keyof GetUserScheduleRs],
      );

      return (
        found
          ? found.schedules?.push(item)
          : r1.push({...r2, schedules: [item]}),
        r1
      );
    }, []);

    formattedRequests.forEach(r => sortDays(r));
    return formattedRequests;
  };

  const sortDays = (request: Request): Request => {
    const weekdayOrder: string[] = Object.values(Days);

    request.schedules?.sort(
      (s1: GetUserScheduleRs, s2: GetUserScheduleRs): number => {
        if (!s1.day || !s2.day) return 0;
        return weekdayOrder.indexOf(s1.day) - weekdayOrder.indexOf(s2.day);
      },
    );

    return request;
  };

  const updateRequest = async (r: Request, status: RequestStatus) => {
    try {
      const params: UpdateRequestStatusRq = {
        senderEmail: r.senderEmail,
        receiverEmail: r.receiverEmail,
        status: status,
      };
      await api.updateRequestStatus(params);
      alertSuccess(r, status);
    } catch (e) {
      console.log(e);
    }
  };

  const alertConfirm = (r: Request, status: RequestStatus) => {
    alert(
      `Do you want to ${status.toLowerCase()} \n ${r.senderFirstName} ${
        r.senderLastName
      }'s request?`,
      '',
      function () {
        updateRequest(r, status);
      },
      null,
    );
  };

  const alertSuccess = (r: Request, status: RequestStatus) => {
    alertError(
      `You successfully ${status.toLowerCase()}ed ${r.senderFirstName} ${
        r.senderLastName
      }'s request!`,
      '',
      function () {
        props.navigation.goBack();
      },
    );
  };

  return (
    <TopContainer>
      <View>
        {requests.length ? (
          <View>
            {requests.map((r: Request, index: number) => {
              const {
                senderFirstName,
                senderLastName,
                status,
                rate,
                rateType,
                requestDate,
                schedules,
              } = r;
              if (status == RequestStatus.Approved) return;
              return <NotificationList />;
            })}
          </View>
        ) : (
          <Text>There are no notifications</Text>
        )}
      </View>
    </TopContainer>
  );
};

export default Notification;

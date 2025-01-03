import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {styles} from '../../styles/notificationStyles.js';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import {alert, alertError} from '../../helper/Alert';
import {Days} from '../../enums';
import {
  DefaultApiFactory,
  RequestStatus,
  Request,
  GetUserScheduleRs,
  UpdateRequestStatusRq
} from '../../swagger/generated';
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
      console.log('data', data.requests)
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
      Object.keys(item).forEach(key => delete r2[key as keyof GetUserScheduleRs]);

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

    request.schedules?.sort((s1: GetUserScheduleRs, s2: GetUserScheduleRs): number => {
      if (!s1.day || !s2.day) return 0;
      return weekdayOrder.indexOf(s1.day) - weekdayOrder.indexOf(s2.day);
    });

    return request;
  };

  const updateRequest = async (r: Request, status: RequestStatus) => {
    try {
      const params: UpdateRequestStatusRq = {
        senderEmail: r.senderEmail,
        receiverEmail: r.receiverEmail,
        status: status
      }
      await api.updateRequestStatus(params);
      alertSuccess(r, status);
    } catch (e) {
      console.log(e);
    }
  };

  const alertConfirm = (r: Request, status: RequestStatus) => {
    alert(
      `Do you want to ${status.toLowerCase()} \n ${r.senderFirstName} ${r.senderLastName}'s request?`,
      '',
      function () {
        updateRequest(r, status);
      },
      null,
    );
  };

  const alertSuccess = (r: Request, status: RequestStatus) => {
    alertError(
      `You successfully ${status.toLowerCase()}ed ${r.senderFirstName} ${r.senderLastName}'s request!`,
      '',
      function () {
        props.navigation.goBack();
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {requests.length ? (
          <View style={styles.subContainer}>
            {requests.map((r: Request, index: number) => {
              const {
                senderFirstName,
                senderLastName,
                status,
                rate,
                rateType,
                requestDate,
                schedules
              } = r;
              console.log('status', status)
              if (status == RequestStatus.Approved) return;
              return (
                <View key={index} style={styles.box}>
                  <Text style={styles.title}>
                    {`Request from ${senderFirstName} ${senderLastName}`}
                  </Text>
                  <Text style={styles.timeText}>{`${moment(requestDate).format(
                    'YYYY/MM/DD h:mm',
                  )}`}</Text>
                  <Text style={styles.subText}>
                    {`Pay: ${
                      rate && rateType
                        ? `$${rate} / ${rateType}`
                        : `Not specified`
                    }`}
                  </Text>
                  <View>
                    <Text style={styles.subText}>Schedules:</Text>
                    {schedules?.length ? (
                      schedules.map((s: GetUserScheduleRs, index: number) => (
                        <View key={index}>
                          <Text style={styles.subText}>{`${String.fromCharCode(
                            8226,
                          )} ${s.day} ${s.startTime} - ${s.endTime}`}</Text>
                        </View>
                      ))
                    ) : (
                      <Text>Not specified</Text>
                    )}
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.button_decline]}
                      onPress={() => alertConfirm(r, RequestStatus.Rejected)}>
                      <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.button_accept]}
                      onPress={() => alertConfirm(r, RequestStatus.Approved)}>
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Text>There are no notifications</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notification;

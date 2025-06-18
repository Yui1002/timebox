import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, ActivityIndicator, StyleSheet} from 'react-native';
import moment from 'moment';
import {
  DefaultApiFactory,
  RequestStatus,
  Mode,
  UserSchedule,
} from '../../swagger';
import {Button} from '../index';
const api = DefaultApiFactory();
import ScheduleList from '../ServiceProvider/ScheduleList';
import {alert, alertError} from '../../helper/Alert';
import {getAuthHeader} from '../../tokenUtils';

const NotificationList = ({notification, navigation}: any) => {
  const user = useSelector((state: any) => state.userInfo);
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const alertConfirm = (status: RequestStatus) => {
    let text = '';
    if (status === RequestStatus.Approved) {
      text = 'approve'
    } else if (status === RequestStatus.Rejected) {
      text = 'reject'
    };

    alert(
      `Do you want to ${text} \n ${firstName} ${lastName}'s request?`,
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

      await api.updateRequest(
        {
          senderEmail: email,
          receiverEmail: user.email,
          status,
          rate,
          rateType,
          schedules: schedules[0].day == null ? [] : schedules,
          allowEdit: allowEdit ? Mode.NUMBER_1 : Mode.NUMBER_0,
        },
        await getAuthHeader(),
      );
      alertSuccess(status);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={
            styles.requestText
          }>{`Request from ${firstName} ${lastName}`}</Text>
      </View>
      <View style={styles.request}>
        <Text style={styles.requestDate}>{`${moment(requestDate).format(
          'YYYY/MM/DD h:mm',
        )}`}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Pay:{' '}
          <Text style={styles.payText}>
            {rate && rateType ? `$${rate} / ${rateType}` : `Not specified`}
          </Text>
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schedules:</Text>
        {schedules[0].day !== null ? (
          schedules.map((schedule: UserSchedule, index: number) => (
            <Text style={styles.scheduleItem} key={index}>
              <ScheduleList
                schedule={schedule}
                key={index}
                showDeleteLink={false}
              />
            </Text>
          ))
        ) : (
          <Text style={styles.scheduleItem}>Not specified</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Decline"
          onPress={() => alertConfirm(RequestStatus.Rejected)}
          buttonWidth={'45%'}
          buttonHeight={'50%'}
          buttonColor={'#EF4444'}
          buttonTextColor={'#FFFFFF'}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button
            title="Accept"
            onPress={() => alertConfirm(RequestStatus.Approved)}
            buttonWidth={'45%'}
            buttonHeight={'50%'}
            buttonColor='#10B981'
            buttonTextColor='#FFFFFF'
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  requestText: {
    fontSize: 18,
  },
  request: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  requestDate: {
    fontSize: 14,
    color: '#787878',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  payText: {
    fontSize: 14,
    fontWeight: 'normal'
  },
  scheduleItem: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default NotificationList;

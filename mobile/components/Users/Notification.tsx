import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {DefaultApiFactory, RequestStatus, GetRequestRsMini} from '../../swagger';
import {TopContainer} from '../index';
import NotificationList from './NotificationList';
import {formatData} from '../../helper/formatHelper';
const api = DefaultApiFactory();

const Notification = (props: any) => {
  const userInfo = useSelector(state => state.userInfo);
  const [requests, setRequests] = useState<GetRequestRsMini[]>([]);
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
      const formatted = formatData(data);
      setRequests(formatted);
    } catch (e) {
      setRequests([]);
    }
  };

  return (
    <TopContainer>
      {requests.length ? (
        <View>
          {requests.map((r: GetRequestRsMini, index: number) => (
            <NotificationList key={index} notification={r} navigation={props.navigation} />
          ))}
        </View>
      ) : (
        <Text>There are no notifications</Text>
      )}
    </TopContainer>
  );
};

export default Notification;

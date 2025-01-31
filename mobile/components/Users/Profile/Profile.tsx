import React from 'react';
import {useDispatch} from 'react-redux';
import {Text, Linking, ScrollView} from 'react-native';
import {TextStyle, IconStyle} from '../../../styles';
import {useSelector} from 'react-redux';
import {
  Button,
  Section,
  TopContainer,
  AlignContainer,
  Container,
  Title,
  Icon,
} from '../../index';
import {Screen} from '../../../enums';
import ScheduleList from '../../ServiceProvider/ScheduleList';
import {UserSchedule} from '../../../swagger';

const Profile = ({route, navigation}: any) => {
  const {firstName, lastName, email, status, rate, rateType, schedules} =
    route.params.sp;
  const userInfo = useSelector(state => state.userInfo);
  const dispatch = useDispatch();

  const editProfile = () => {
    navigation.navigate(navigation, Screen.EDIT_PROFILE, null);
  };

  const viewWorkingHistory = () => {
    navigation.navigate(navigation, Screen.VIEW_WORKING_HISTORY, {
      spEmail: email,
    });
  };

  let profileText = TextStyle.createProfileTextStyle();
  let centerText = TextStyle.createCenterTextStyle();
  let icon = IconStyle.createProfileIconStyle();
  let icon2 = IconStyle.createAlignProfileIconStyle();

  return (
    <TopContainer>
      <ScrollView>
        <Container>
          <Icon
            name="account"
            size={46}
            type="MaterialCommunity"
            style={icon}
          />
          <Text style={profileText}>
            {firstName} {lastName}
          </Text>
          <Text style={centerText}>{email}</Text>
        </Container>
        <AlignContainer>
          <Icon
            name="edit"
            size={30}
            type="Material"
            onPress={editProfile}
            style={icon2}
          />
          <Icon
            name="message-processing-outline"
            size={30}
            type="MaterialCommunity"
            style={icon2}
            onPress={() => Linking.openURL(`mailto:${userInfo.email}`)}
          />
        </AlignContainer>
        <Section title="Status" text={status} isAlign={false} />
        <Section
          title="Rate"
          text={!rate && !rateType ? `Not specified` : `$${rate} / ${rateType}`}
        />
        <Container>
          <Title title="Working schedules" />
          {schedules?.length ? (
            schedules?.map((s: UserSchedule, index: number) => (
              <ScheduleList key={index} w={s} />
            ))
          ) : (
            <Text>Not specified</Text>
          )}
        </Container>
        <Button title="View working history" onPress={viewWorkingHistory} />
      </ScrollView>
    </TopContainer>
  );
};

export default Profile;

import React, {useEffect} from 'react';
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
import {RequestStatus, UserSchedule} from '../../../swagger';

const Profile = ({route, navigation}: any) => {
  const { firstName, lastName, email, status, rate, rateType, schedules, allowEdit } = route.params.sp;
  const userInfo = useSelector((state: any) => state.userInfo);

  const editProfile = () => {
    navigation.navigate(Screen.EDIT_PROFILE, {
      firstName,
      lastName,
      email,
      rate,
      rateType,
      schedules,
      status,
      allowEdit,
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
        {status === 'active' && (
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
        )}

        <Section title="Status" text={status} isAlign={false} />
        <Section
          title="Rate"
          text={!rate && !rateType ? `Not specified` : `$${rate} / ${rateType}`}
        />
        <Container>
          <Title title="Working schedules" />
          {schedules?.length ? (
            schedules?.map((schedule: UserSchedule, index: number) => (
              <ScheduleList
                key={index}
                schedule={schedule}
                showDeleteLink={false}
              />
            ))
          ) : (
            <Text>Not specified</Text>
          )}
        </Container>
        <Section
          title="Allow service provider to edit record time"
          text={allowEdit === 0 ? 'No' : 'Yes'}
          isAlign={false}
        />
        {status === RequestStatus.Approved ||
          (status === 'active' && (
            <Button
              title="View Record History"
              onPress={() =>
                navigation.navigate(Screen.RECORD_HISTORY, {
                  employer: userInfo,
                  serviceProviderEmail: email,
                  updatedBy: userInfo.email,
                  allowEdit: allowEdit
                })
              }
              buttonWidth={'100%'}
              buttonHeight={'10%'}
            />
          ))}
      </ScrollView>
    </TopContainer>
  );
};

export default Profile;

import React from 'react';
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

interface Profile {
  
}

const Profile = ({route, navigation}: any) => {
  const {firstName, lastName, email, status, rate, rateType, schedules} =
    route.params.sp;
  const userInfo = useSelector(state => state.userInfo);

  const editProfile = () => {
    navigation.navigate(Screen.EDIT_PROFILE, {
      rate, rateType, schedules, status
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
              <ScheduleList key={index} w={s} showDeleteLink={false} />
            ))
          ) : (
            <Text>Not specified</Text>
          )}
        </Container>
        <Button
          title="View Record History"
          onPress={() => navigation.navigate(Screen.RECORD_HISTORY, {
            employer: userInfo,
            serviceProviderEmail: email,
            updatedBy: userInfo.email
          })}
          buttonWidth={'100%'}
          buttonHeight={'10%'}
        />
      </ScrollView>
    </TopContainer>
  );
};

export default Profile;

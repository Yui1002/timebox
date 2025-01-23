import React, {useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {
  SafeAreaView,
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {ContainerStyle, ButtonStyle, TextStyle, IconStyle} from '../../../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {navigate} from '../../../helper/navigate';
import {Schedule} from '../../../type';
import {updateServiceProvider} from '../../../redux/actions/updateServiceProviderAction.js';
import {COLORS} from '../../../styles/theme';

const Profile = ({route, navigation}: any) => {
  const {first_name, last_name, email, status, rate, rate_type, schedule} =
    route.params.sp;
  console.log(route.params.sp);
  const userInfo = useSelector(state => state.userInfo);
  const dispatch = useDispatch();
  dispatch(
    updateServiceProvider({
      first_name,
      last_name,
      email,
      status,
      rate,
      rate_type,
      schedule,
    }),
  );

  const editProfile = () => {
    navigate(navigation, 'EditProfile', null);
  };

  const viewWorkingHistory = () => {
    navigation.navigate('ViewWorkingHistory', {
      spEmail: email,
    });
  };

  let topContainer = ContainerStyle.createTopContainerStyle();
  let container = ContainerStyle.createBasicContainerStyle();
  let alignTopContainer = ContainerStyle.createAlignTopContainer();
  let alignContainer = ContainerStyle.createAlignContainer();
  let buttonContainer = ContainerStyle.createButtonContainerStyle();
  let button = ButtonStyle.createBasicButtonStyle();
  let headerText = TextStyle.createHeaderTextStyle();
  let titleText = TextStyle.createTitleTextStyle();
  let text = TextStyle.createBasicTextStyle();
  let dayText = TextStyle.createCustomWidthTextStyle('40%');
  let timeText = TextStyle.createCustomWidthTextStyle('60%');
  let buttonText = TextStyle.createButtonTextStyle();
  let profileText = TextStyle.createProfileTextStyle();
  let centerText = TextStyle.createCenterTextStyle();
  let icon = IconStyle.createProfileIconStyle();
  let icon2 = IconStyle.createAlignProfileIconStyle();

  return (
    <SafeAreaView style={topContainer}>
      <ScrollView>
        <View>
          <MaterialCommunityIcons
            name="account"
            size={46}
            color={COLORS.BLACK}
            style={icon}
          />
          <Text style={profileText}>
            {first_name} {last_name}
          </Text>
          <Text style={centerText}>{email}</Text>
        </View>
        <View style={alignTopContainer}>
          <MaterialIcons
            name="edit"
            size={30}
            color={COLORS.BLACK}
            onPress={editProfile}
            style={icon2}
          />
          <MaterialCommunityIcons
            name="message-processing-outline"
            size={30}
            color={COLORS.BLACK}
            style={icon2}
            onPress={() => Linking.openURL(`mailto:${userInfo.email}`)}
          />
        </View>
        <View style={container}>
          <Text style={titleText}>Status</Text>
          <Text>{status}</Text>
        </View>
        <View style={container}>
          <Text style={titleText}>Rate</Text>
          <Text>
            {!rate && !rate_type ? `Not specified` : `$${rate} / ${rate_type}`}
          </Text>
        </View>
        <View>
          <Text style={titleText}>Working schedules</Text>
          {schedule?.length ? (
            schedule.map((s: Schedule, index: number) => (
              <View key={index} style={alignContainer}>
                <Text style={dayText}>{`${String.fromCharCode(8226)} ${
                  s.day
                }`}</Text>
                <Text style={timeText}>{`${s.startTime} - ${s.endTime}`}</Text>
              </View>
            ))
          ) : (
            <Text>Not specified</Text>
          )}
        </View>
        <View style={buttonContainer}>
          <TouchableOpacity style={button} onPress={viewWorkingHistory}>
            <Text style={buttonText}>View working history</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

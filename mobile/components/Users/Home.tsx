import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {ContainerStyle, ButtonStyle, InputStyle, TextStyle} from '../../styles';
import {useIsFocused} from '@react-navigation/native';
import {DefaultApiFactory, Employer} from '../../swagger/generated';
import {UserInfo} from '../../types';
import {Screen} from '../../enums';

let employerApi = DefaultApiFactory();

const Home = (props: any) => {
  const user: UserInfo = useSelector(state => state.userInfo);
  const {firstName, email} = user;
  const [employers, setEmployers] = useState<Employer[]>();
  const isFocused: boolean = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getEmployers();
    }
  }, [isFocused]);

  const getEmployers = async (): Promise<void> => {
    try {
      let {data} = await employerApi.getEmployer(email);
      setEmployers(data.employers);
    } catch (e) {
      console.log(e);
    }
  };

  let topContainer = ContainerStyle.createTopContainerStyle();
  let headerContainer = ContainerStyle.createBasicContainerStyle();
  let listContainer = ContainerStyle.createListContainerStyle();
  let headerText = TextStyle.createHeaderTextStyle();
  let titleText = TextStyle.createTitleTextStyle();
  let recordBtn = ButtonStyle.createRecordButtonStyle();
  let btnText = TextStyle.createButtonTextStyle();

  return (
    <SafeAreaView style={topContainer}>
      <View style={headerContainer}>
        <Text style={headerText}>Hi {firstName}!</Text>
      </View>
      <View>
        <Text style={titleText}>My Employers</Text>
        {employers == null ? (
          <Text>Please use the menu to hire or manage service providers</Text>
        ) : (
          <ScrollView>
            {employers.map((employer, index) => (
              <View key={index} style={{flexDirection: 'row', marginVertical: 8}}>
                <View style={{width: '75%', height: 60, backgroundColor: 'grey', padding: 10, borderRadius: 4}}>
                  <Text style={titleText}>
                    {employer.firstName} {employer.lastName}
                  </Text>
                  <Text>{employer.email}</Text>
                </View> 
                <View style={{width: '25%'}}>
                  <TouchableOpacity style={{backgroundColor: 'blue', height: 60}}>
                    <Text>Record</Text>
                  </TouchableOpacity>
                </View> 
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;

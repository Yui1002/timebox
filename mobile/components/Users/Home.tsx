import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Text, View, SafeAreaView, ScrollView} from 'react-native';
import EmployerList from '../Employers/EmployerList';
import {ContainerStyle, TextStyle} from '../../styles';
import {useIsFocused} from '@react-navigation/native';
import {DefaultApiFactory, Employer} from '../../swagger/generated';
import {UserInfo} from '../../types';

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
  let container = ContainerStyle.createBasicContainerStyle();
  let headerText = TextStyle.createHeaderTextStyle();
  let titleText = TextStyle.createTitleTextStyle();

  return (
    <SafeAreaView style={topContainer}>
      <View style={container}>
        <Text style={headerText}>Hi {firstName}!</Text>
      </View>
      <View>
        <Text style={titleText}>My Employers</Text>
        {employers == null ? (
          <Text>Please use the menu to hire or manage service providers</Text>
        ) : (
          <ScrollView>
            {employers.map((employer, index) => (
              <EmployerList
                key={index}
                employer={employer}
                email={email}
                navigation={props.navigation}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;

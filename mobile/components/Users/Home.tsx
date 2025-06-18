import React, {useState, useEffect} from 'react';
import {
  Container,
  TopContainer,
  Header,
  Title,
  CenterContainer,
} from '../index';
import {useSelector} from 'react-redux';
import {Text, ScrollView} from 'react-native';
import EmployerList from '../Employers/EmployerList';
import {useIsFocused} from '@react-navigation/native';
import {DefaultApiFactory, Employer} from '../../swagger';
import {UserInfo} from '../../types';
import {getAuthHeader, getToken} from '../../tokenUtils';

let employerApi = DefaultApiFactory();

const Home = (props: any) => {
  const user: UserInfo = useSelector((state: any) => state.userInfo);
  const {firstName, email} = user;
  const [employers, setEmployers] = useState<Employer[]>();
  const isFocused: boolean = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getEmployers();
    }
  }, [isFocused]);

  const getEmployers = async () => {
    try {
      const header = await getAuthHeader();
      if (!header) return null;

      let {data} = await employerApi.getEmployer(email, header);
      setEmployers(data.employers);
    } catch (e) {
      setEmployers([]);
    }
  };

  return (
    <TopContainer>
      <CenterContainer>
        <Header title={`Hi ${firstName}!`} />
      </CenterContainer>
      <Container>
        <Title title="Employers" />
        {employers?.length == 0 ? (
          <Text style={{marginVertical: 10}}>
            You currently don't have employers.
          </Text>
        ) : (
          <ScrollView>
            {employers?.map((employer, index) => (
              <EmployerList
                key={index}
                employer={employer}
                serviceProviderEmail={email}
                navigation={props.navigation}
              />
            ))}
          </ScrollView>
        )}
      </Container>
    </TopContainer>
  );
};

export default Home;

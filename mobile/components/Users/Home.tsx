import React, {useState, useEffect} from 'react';
import {Container, TopContainer, Header, Title, CenterContainer} from '../index';
import {useSelector} from 'react-redux';
import {Text, ScrollView} from 'react-native';
import EmployerList from '../Employers/EmployerList';
import {useIsFocused} from '@react-navigation/native';
import {DefaultApiFactory, Employer} from '../../swagger';
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
      setEmployers([]);
    }
  };

  return (
    <TopContainer>
      <CenterContainer>
        <Header title={`Hi ${firstName}!`} />
      </CenterContainer>
      <Container>
        <Title title="My Employers" />
        {!employers?.length ? (
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
      </Container>
    </TopContainer>
  );
};

export default Home;

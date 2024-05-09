/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from './components/Authentication/SignUp';
import SignIn_Admin from './components/Authentication/SignIn_Admin';
import Users from './components/Users/Users';
import Start from './components/Start';
import Home_nanny from './components/Home_nanny';
import ForgotPassword from './components/Authentication/ForgotPassword';
import ResetPassword from './components/Authentication/ResetPassword';
import SignIn_Nanny from './components/Authentication/SignIn_Nanny';
import Home_admin from './components/Home_admin';
import Account from './components/Users/Account';
import AddNanny_1 from './components/Users/AddNanny_1';
import AddNanny_2 from './components/Users/AddNanny_2';
import AddNanny_review from './components/Users/AddNanny_review';
import EditNanny_username from './components/Users/EditNanny_username';
import EditNanny_schedule_home from './components/Users/EditNanny_schedule_home';
import EditNanny_schedule from './components/Users/EditNanny_schedule';
import EditNanny_review from './components/Users/EditNanny_review';
import AddNanny_schedule from './components/Users/AddNanny_schedule';
import User from './components/Users/User';
import CheckIn_out_complete from './components/Users/CheckIn_out_complete';
import {Button} from 'react-native';

function App(): JSX.Element {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Start" component={Start} options={{title: ''}} />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{title: '', headerLeft: () => null}}
        />
        <Stack.Screen
          name="SignIn_Admin"
          component={SignIn_Admin}
          options={{title: ''}}
        />
        <Stack.Screen
          name="SignIn_Nanny"
          component={SignIn_Nanny}
          options={{title: ''}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{title: 'Forgot Password', headerLeft: () => null}}
        />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen
          name="Home_admin"
          component={Home_admin}
          options={({navigation}) => ({
            headerTitle: 'Home',
            headerLeft: () => null,
            headerRight: () => (
              <Button
                title="Sign Out"
                onPress={() => navigation.navigate('Start')}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Users"
          component={Users}
          options={{title: 'Users', headerLeft: () => null}}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{title: 'Account'}}
        />
        <Stack.Screen
          name="Home_nanny"
          component={Home_nanny}
          options={({navigation}) => ({
            headerTitle: 'Home',
            headerLeft: () => null,
            headerRight: () => (
              <Button
                title="Sign Out"
                onPress={() => navigation.navigate('Start')}
              />
            ),
          })}
        />
        <Stack.Screen
          name="AddNanny_1"
          component={AddNanny_1}
          options={{title: 'Add Nanny'}}
        />
        <Stack.Screen
          name="AddNanny_2"
          component={AddNanny_2}
          options={{title: 'Add Nanny', headerLeft: () => null}}
        />
        <Stack.Screen
          name="AddNanny_review"
          component={AddNanny_review}
          options={{title: 'Add Nanny', headerLeft: () => null}}
        />
        <Stack.Screen
          name="EditNanny_username"
          component={EditNanny_username}
          options={{title: 'Edit Nanny', headerLeft: () => null}}
        />
        <Stack.Screen
          name="EditNanny_schedule_home"
          component={EditNanny_schedule_home}
          options={{title: 'Edit Nanny', headerLeft: () => null}}
        />
        <Stack.Screen
          name="EditNanny_schedule"
          component={EditNanny_schedule}
          options={{title: 'Edit Nanny', headerLeft: () => null}}
        />
        <Stack.Screen
          name="EditNanny_review"
          component={EditNanny_review}
          options={{title: 'Edit Nanny', headerLeft: () => null}}
        />
        <Stack.Screen
          name="User"
          component={User}
          options={{title: 'User', headerLeft: () => null}}
        />
        <Stack.Screen
          name="AddNanny_schedule"
          component={AddNanny_schedule}
          options={{title: 'AddNanny_schedule', headerLeft: () => null}}
        />
        <Stack.Screen
          name="CheckIn_out_complete"
          component={CheckIn_out_complete}
          options={{title: '', headerLeft: () => null}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

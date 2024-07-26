/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from './components/Authentication/SignUp';
import SignIn from './components/Authentication/SignIn';
import VerifyOTP from './components/Authentication/VerifyOTP';
import DrawerNav from './components/Users/DrawerNav';
import Record from './components/Users/Record';
import PersonalInfo from './components/Users/StepForms/PersonalInfo';
import WorkShifts from './components/Users/StepForms/WorkShifts';
import RegisterWorkShifts from './components/Users/StepForms/RegisterWorkShifts';
import Review from './components/Users/StepForms/Review';
import ForgotPassword from './components/Authentication/ForgotPassword';
import ResetPassword from './components/Authentication/ResetPassword';

const Stack = createStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{title: 'Sign In', gestureEnabled: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{title: 'Sign Up', gestureEnabled: false, headerLeft: () => null}}
        />
        <Stack.Screen
          name="VerifyOTP"
          component={VerifyOTP}
          options={{
            title: 'Forgot Password',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            title: 'Forgot Password',
            gestureEnabled: false,
            headerLeft: () => null
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="DrawerNav"
          component={DrawerNav}
          options={({navigation}) => ({
            headerShown: false,
            headerTitle: '',
            gestureEnabled: false,
            headerLeft: () => null,
          })}
        />
        <Stack.Screen
          name="Record"
          component={Record}
          options={{gestureEnabled: false}}
        />
        <Stack.Screen
          name="PersonalInfo"
          component={PersonalInfo}
          options={({navigation}) => ({
            headerTitle: '',
            gestureEnabled: false,
          })}
        />
        <Stack.Screen
          name="RegisterWorkShifts"
          component={RegisterWorkShifts}
          options={({navigation}) => ({
            headerTitle: '',
            gestureEnabled: false,
            headerLeft: () => null
          })}
        />
        <Stack.Screen
          name="WorkShifts"
          component={WorkShifts}
          options={({navigation}) => ({
            headerTitle: '',
            gestureEnabled: false,
            headerLeft: () => null
          })}
        />
        <Stack.Screen
          name="Review"
          component={Review}
          options={({navigation}) => ({
            headerTitle: '',
            gestureEnabled: false,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

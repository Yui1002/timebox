/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';
import store from './redux/store';
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
import Profile from './components/Users/Profile/Profile';
import EditProfile from './components/Users/Profile/EditProfile';
import EditWorkShifts from './components/Users/Profile/EditWorkShifts';
import ManageServiceProviders from './components/Users/ManageServiceProviders';
import ViewWorkingHistory from './components/Users/Profile/ViewWorkingHistory';

const Stack = createStackNavigator();

function App(): JSX.Element {
  return (
    <Provider store={store}>
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
            options={{
              title: 'Sign Up',
              gestureEnabled: false,
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name="VerifyOTP"
            component={VerifyOTP}
            options={{
              title: 'Enter Verification code',
              gestureEnabled: false,
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              title: 'Verify Email',
              gestureEnabled: false,
              headerLeft: () => null,
            }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{gestureEnabled: false, headerLeft: () => null}}
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
              headerLeft: () => null,
            })}
          />
          <Stack.Screen
            name="WorkShifts"
            component={WorkShifts}
            options={({navigation}) => ({
              headerTitle: '',
              gestureEnabled: false,
              headerLeft: () => null,
            })}
          />
          <Stack.Screen
            name="Review"
            component={Review}
            options={({navigation}) => ({
              headerTitle: '',
              gestureEnabled: false,
              headerLeft: () => null,
            })}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={({navigation}) => ({
              headerTitle: 'Service Provider Profile',
              gestureEnabled: false,
            })}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={({navigation}) => ({
              headerTitle: 'Edit Profile',
              gestureEnabled: false,
            })}
          />
          <Stack.Screen
            name="EditWorkShifts"
            component={EditWorkShifts}
            options={({navigation}) => ({
              headerTitle: 'Edit Work Shifts',
              gestureEnabled: false,
            })}
          />
          <Stack.Screen
            name="ManageServiceProviders"
            component={ManageServiceProviders}
            options={({navigation}) => ({
              headerTitle: 'Manage Service Providers',
              gestureEnabled: false,
            })}
          />
          <Stack.Screen
            name="ViewWorkingHistory"
            component={ViewWorkingHistory}
            options={({navigation}) => ({
              headerTitle: 'Working History',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;

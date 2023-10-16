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
import SignIn from './components/Authentication/SignIn';
import Setup from './components/Setup';
import Users from './components/Users/Users';
import Starter from './components/Starter';
import HomePage_User from './components/HomePage_User';
import Activities from './components/Activities/Activities';
import ForgotPassword from './components/Authentication/ForgotPassword';
import ResetPassword from './components/Authentication/ResetPassword';

function App(): JSX.Element {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Starter"
          component={Starter}
          options={{title: ''}}
        />
        <Stack.Screen name="SignUp" component={SignUp} options={{title: ''}} />
        <Stack.Screen name="SignIn" component={SignIn} options={{title: ''}} />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{title: ''}}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{title: ''}}
        />
        <Stack.Screen name="Setup" component={Setup} options={{title: ''}} />
        <Stack.Screen name="Users" component={Users} options={{title: ''}} />
        <Stack.Screen
          name="Activities"
          component={Activities}
          options={{title: ''}}
        />
        <Stack.Screen
          name="HomePage_User"
          component={HomePage_User}
          options={{title: ''}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

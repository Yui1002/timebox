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

function App(): JSX.Element {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Starter"
          component={Starter}
          options={{title: 'Time Tracker'}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{title: 'Sign Up'}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{title: 'Sign In'}}
        />
        <Stack.Screen
          name="Setup"
          component={Setup}
          options={{title: 'Setup'}}
        />
        <Stack.Screen
          name="Users"
          component={Users}
          options={{title: 'Users'}}
        />
        <Stack.Screen
          name="Activities"
          component={Activities}
          options={{title: 'Activities'}}
        />
        <Stack.Screen
          name="HomePage_User"
          component={HomePage_User}
          options={{title: 'Home Page'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

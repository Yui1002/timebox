/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
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
import * as Keychain from 'react-native-keychain';
import {UserContext} from './context/UserContext';

const App = () => {
  const Stack = createStackNavigator();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState<{email: null | string}>({email: null});

  useEffect(() => {
    getIsLoggedIn();
  }, []);

  const getIsLoggedIn = async () => {
    try {
      const token = await Keychain.getGenericPassword();
      if (token) {
        setEmail({email: token.username});
        setIsLoggedIn(true);
      } else {
        setEmail({email: null});
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.log('token not found', err);
      setEmail({email: null});
      setIsLoggedIn(false);
    }
  };

  return (
    <UserContext.Provider value={email}>
      <NavigationContainer>
        <Stack.Navigator>
          {isLoggedIn ? (
            <>
              <Stack.Screen
                name="Setup"
                component={Setup}
                options={{title: ''}}
              />
              <Stack.Screen
                name="Users"
                component={Users}
                options={{title: ''}}
              />
              <Stack.Screen
                name="Activities"
                component={Activities}
                options={{title: ''}}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Starter"
                component={Starter}
                options={{title: ''}}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{title: ''}}
              />
              <Stack.Screen
                name="SignIn"
                component={SignIn}
                options={{title: ''}}
              />
              <Stack.Screen
                name="ResetPassword"
                component={ResetPassword}
                options={{title: ''}}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
};

export default App;

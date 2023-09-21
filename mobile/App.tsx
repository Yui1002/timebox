/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from './components/SignUp';
import SignIn_Email from './components/SignIn_Email';
import SignIn_Password from './components/SignIn_Password';
import SignIn_After_SignUp from './components/SignIn_After_SignUp';
import Setup from './components/Setup';
import Users from './components/Users';
import Starter from './components/Starter';
import AddActivity from './components/AddActivity';
import HomePage_User from './components/HomePage_User';

function App(): JSX.Element {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Starter"
          component={Starter}
          options={{title: 'Back'}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{title: 'Sign Up'}}
        />
        <Stack.Screen
          name="SignIn_Email"
          component={SignIn_Email}
          options={{title: 'Sign In'}}
        />
        <Stack.Screen
          name="SignIn_Password"
          component={SignIn_Password}
          options={{title: 'Sign In'}}
        />
        <Stack.Screen
          name="SignIn_After_SignUp"
          component={SignIn_After_SignUp}
          options={{title: 'Back'}}
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
          name="AddActivity"
          component={AddActivity}
          options={{title: 'AddActivity'}}
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

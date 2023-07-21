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
import AddUser from './components/AddUser';
import Starter from './components/Starter';
import AddActivity from './components/AddActivity';

function App(): JSX.Element {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Starter"
          component={Starter}
          options={{title: 'Starter'}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{title: 'SignUp'}}
        />
        <Stack.Screen
          name="SignIn_Email"
          component={SignIn_Email}
          options={{title: 'SignIn - Email'}}
        />
        <Stack.Screen
          name="SignIn_Password"
          component={SignIn_Password}
          options={{title: 'SignIn - Password'}}
        />
        <Stack.Screen
          name="SignIn_After_SignUp"
          component={SignIn_After_SignUp}
          options={{title: 'SignIn'}}
        />
        <Stack.Screen
          name="Setup"
          component={Setup}
          options={{title: 'Setup'}}
        />
        <Stack.Screen
          name="AddUser"
          component={AddUser}
          options={{title: 'AddUser'}}
        />
        <Stack.Screen
          name="AddActivity"
          component={AddActivity}
          options={{title: 'AddActivity'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

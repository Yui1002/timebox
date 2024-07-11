import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Hello from './Hello';
import Yahoo from './Yahoo';
import Home from './Home';

const DrawerNav = ({route, navigation}: any) => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} initialParams={{ params: route.params }}/>
      <Drawer.Screen name="Hello" component={Hello} />
      <Drawer.Screen name="Yahoo" component={Yahoo} />
    </Drawer.Navigator>
  );
};

export default DrawerNav;

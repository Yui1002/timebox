import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import WorkingHistory from './WorkingHistory';
import HireServiceProvider from './HireServiceProvider';
import ManageServiceProviders from './ManageServiceProviders';
import Home from './Home';

const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign Out"
        onPress={() => props.navigation.navigate('SignIn')}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNav = ({route, navigation}: any) => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={Home}
        initialParams={{params: route.params}}
      />
      <Drawer.Screen name="Working History" component={WorkingHistory} />
      <Drawer.Screen
        name="Hire Service Provider"
        component={HireServiceProvider}
      />
      <Drawer.Screen
        name="Manage Service Provider"
        component={ManageServiceProviders}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNav;

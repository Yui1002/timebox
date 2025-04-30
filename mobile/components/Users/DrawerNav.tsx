import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import HireServiceProvider from './HireServiceProvider';
import ManageServiceProviders from './ManageServiceProviders';
import Notification from './Notification';
import Home from './Home';
import {useDispatch} from 'react-redux';
import {signOutUser} from '../../redux/actions/signInAction';
import {resetShift} from '../../redux/actions/workShiftsAction';

const CustomDrawerContent = (props: any) => {
  const dispatch = useDispatch();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign Out"
        onPress={() => {
          props.navigation.navigate('SignIn');
          dispatch(signOutUser());
          dispatch(resetShift());
        }}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Hire Service Provider" component={HireServiceProvider} />
      <Drawer.Screen name="Manage Service Provider" component={ManageServiceProviders} />
      <Drawer.Screen name="Notifications" component={Notification} />
    </Drawer.Navigator>
  );
};

export default DrawerNav;

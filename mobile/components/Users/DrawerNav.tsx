import React, {useState, useEffect} from 'react';
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
import { UseDispatch, useDispatch } from 'react-redux';
import { signOutUser } from '../../redux/actions/signInAction';

const CustomDrawerContent = (props: any) => {
  const dispatch = useDispatch();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign Out"
        onPress={() => {
          props.navigation.navigate('SignIn');
          dispatch(signOutUser())
        }}
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
      <Drawer.Screen name={'My Working Records'}>
        {props => <WorkingHistory params={route.params} />}
      </Drawer.Screen>
      <Drawer.Screen name={'Hire Service Provider'}>
        {props => (
          <HireServiceProvider params={route.params} navigation={navigation} />
        )}
      </Drawer.Screen>
      <Drawer.Screen name={'Manage Service Provider'}>
        {props => (
          <ManageServiceProviders params={route.params} navigation={navigation} />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default DrawerNav;

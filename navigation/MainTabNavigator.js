import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import AccountScreen from '../screens/AccountScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const OrderHistoryStack = createStackNavigator(
  {
    OrderHistory: OrderHistoryScreen,
    OrderDetail: OrderDetailScreen
  },
  config
);

OrderHistoryStack.navigationOptions = {
  tabBarLabel: 'Active Orders',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

OrderHistoryStack.path = '';

const AccountStack = createStackNavigator(
  {
    Account: AccountScreen,
  },
  config
);

AccountStack.navigationOptions = {
  tabBarLabel: 'My Account',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

AccountStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  OrderHistoryStack,
  AccountStack,
});

tabNavigator.path = '';

export default tabNavigator;

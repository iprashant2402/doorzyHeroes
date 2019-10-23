import React from "react";
import { createAppContainer, createSwitchNavigator, createStackNavigator } from "react-navigation";
import {SignInScreen} from '../screens/auth/loginscreen';
import {SignUpScreen} from '../screens/auth/registerscreen';
import MainTabNavigator from "./MainTabNavigator";
import {AuthLoading} from '../screens/auth/authloading';

const AuthLoadingNavigator = createStackNavigator({
  AuthLoading: AuthLoading
});

const AuthNavigator = createStackNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen
  },
  {
    initialRouteName: "SignIn",
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      Main: MainTabNavigator,
      AuthLoading: AuthLoadingNavigator,
      Auth: AuthNavigator
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);

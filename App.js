import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import React, { useState } from 'react'
import Home from './src/screens/Home';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import ForgotPassword from './src/screens/ForgotPassword';
import VerifyOtp from './src/screens/VerifyOtp';
import Settings from './src/screens/Settings';
import AppTabs from './src/components/AppTabs';
import Colors from './src/utils/Colors';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ContactUs from './src/screens/ContactUs';
import Profile from './src/screens/Profile';
import TermsConditions from './src/screens/TermsConditions';
import ContactManagement from './src/screens/ContactManagement';
import PresetMessage from './src/screens/PresetMessage';
import Loader from './src/utils/Loader';
import { EventRegister } from 'react-native-event-listeners';
import ResetPassword from './src/screens/ResetPassword';

const Stack = createStackNavigator();

export default function App() {
  const [loader, setLoader] = useState(false)

  EventRegister.addEventListener('loader', (status) => {
    setLoader(status)
  })

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <StatusBar barStyle='dark-content' backgroundColor={Colors.appBlue} />
      <NavigationContainer>
        <Stack.Navigator headerMode={'none'} initialRouteName={'SignIn'}>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ContactUs" component={ContactUs} />
          <Stack.Screen name="TermsConditions" component={TermsConditions} />
          <Stack.Screen name="ContactManagement" component={ContactManagement} />
          <Stack.Screen name="PresetMessage" component={PresetMessage} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="Tabs" component={Tabs} />
        </Stack.Navigator>
      </NavigationContainer>
      <Loader visible={loader} />
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      backBehavior='initialRoute'
      initialRouteName={"Home"}
      tabBar={props => <AppTabs {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

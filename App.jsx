import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import getTheme from './src/theme';
import RootNavigator from './src/RootNavigator';

import ToastContainer from './src/components/Toast';
import StatusModal from './src/components/StatusModal';
import AppContext from './AppContext';

export default function App() {
  const [token, setToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const userSettings = {
    token,
    refreshToken,
    setToken,
    setRefreshToken,
  };
  const scheme = useColorScheme();

  return (
    <AppContext.Provider value={userSettings}>
      <NavigationContainer theme={getTheme(scheme)}>
        <StatusBar />
        <StatusModal />
        <RootNavigator />
        <ToastContainer />
      </NavigationContainer>
    </AppContext.Provider>
  );
}

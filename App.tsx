import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GamificationProvider, useGamification } from './src/context/GamificationContext';
import { TimerProvider, useTimer } from './src/context/TimerContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Layout } from './src/components/Layout';

type Screen = 'Home' | 'Stats' | 'Shop' | 'Profile' | 'Settings';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Home');
  const { addProgress } = useGamification();

  const handleTimerComplete = (minutes: number) => {
    addProgress(minutes);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Stats':
        return <StatsScreen onBack={() => setCurrentScreen('Home')} />;
      case 'Shop':
        return <ShopScreen />;
      case 'Settings':
        return <SettingsScreen onBack={() => setCurrentScreen('Home')} />;
    }
  };

  return (
    <TimerProvider onComplete={handleTimerComplete}>
      <Layout currentScreen={currentScreen} onNavigate={setCurrentScreen}>
        {renderScreen()}
      </Layout>
    </TimerProvider>
  );
};

export default function App() {
  return (
    <GamificationProvider>
      <AppContent />
    </GamificationProvider>
  );
}

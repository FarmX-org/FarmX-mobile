import { Drawer } from 'expo-router/drawer';
import Navbar from '../components/Navbar';
import React from 'react';

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
      }}
      
      drawerContent={(props) => <Navbar {...props} />}
    >
      <Drawer.Screen name="login" options={{ drawerLabel: 'Home' }} />
      <Drawer.Screen name="signup" options={{ drawerLabel: 'Signup' }} />
      <Drawer.Screen name="home" options={{ drawerLabel: 'Home' }} />
    </Drawer>
  );
}

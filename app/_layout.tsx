import { useSegments } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1]; 

  const hideNavbarRoutes = ['login', 'signup'];
  const shouldHideNavbar = hideNavbarRoutes.includes(currentRoute);

  return (
    <PaperProvider>
      
    <Drawer
      screenOptions={{
        headerShown: !shouldHideNavbar,
      }}
      drawerContent={(props) => (!shouldHideNavbar ? <Navbar {...props} /> : null)}
    >
      <Drawer.Screen name="login" />
      <Drawer.Screen name="signup" />
      <Drawer.Screen name="home" options={{ drawerLabel: 'Home' }} />
      <Drawer.Screen name="store" options={{ drawerLabel: 'Store' }} />
      <Drawer.Screen name="CosumerOrdersPage" options={{ drawerLabel: 'Cosumer Orders' }} />
      <Drawer.Screen name="farms" options={{ drawerLabel: 'Farms' }} />
      <Drawer.Screen name="crops" options={{ drawerLabel: 'Crops' }} />
    </Drawer>
    </PaperProvider>
  );
}

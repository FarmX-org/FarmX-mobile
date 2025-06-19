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
        <Drawer.Screen name="login" options={{ drawerLabel: () => null,  drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="signup" options={{ drawerLabel: () => null,  drawerItemStyle: { display: 'none' } }} />
        <Drawer.Screen name="home" options={{ drawerLabel: 'Home' }} />
        <Drawer.Screen name="store" options={{ drawerLabel: 'Store' }} />
        <Drawer.Screen name="ConsumerOrdersPage" options={{ drawerLabel: 'Consumer Orders' }} />
        <Drawer.Screen name="farms" options={{ drawerLabel: 'Farms' }} />
        <Drawer.Screen name="crops" options={{ drawerLabel: 'Crops' }} />
        <Drawer.Screen name="about" options={{ drawerLabel: 'About' }} />
        <Drawer.Screen name="contact" options={{ drawerLabel: 'Contact' }} />
      </Drawer>
    </PaperProvider>
  );
}

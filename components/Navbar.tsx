import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, TouchableRipple } from 'react-native-paper';

export default function Navbar(props: any) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      if (token && userData) {
        try {
          const decoded: any = jwtDecode(token);
          if (Date.now() > decoded.exp * 1000) {
            await AsyncStorage.clear();
            router.replace('/login');
            return;
          }
          setUser(JSON.parse(userData));
        } catch {
          await AsyncStorage.clear();
          router.replace('/login');
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/login');
  };

  const isFarmer = user?.roles.includes('ROLE_FARMER');
  const isConsumer = user?.roles.includes('ROLE_CONSUMER');
  const isHandler = user?.roles.includes('ROLE_HANDLER');

  const commonLinks = [
    { label: 'Home', href: '/home' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const farmerLinks = [
    { label: 'Crops', href: '/crops' },
    { label: 'Store', href: '/store' },
    { label: 'Farms', href: '/farms' },
  ];

  const consumerLinks = [
    { label: 'Store', href: '/store' },
    { label: 'Orders', href: '/ConsumerOrdersPage' },
  ];

  const handlerLinks = [
    { label: 'Orders', href: '/handler' },
  ];

  const displayedLinks = [
    ...commonLinks,
    ...(isFarmer ? farmerLinks : []),
    ...(isConsumer ? consumerLinks : []),
    ...(isHandler ? handlerLinks : []),
  ];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.header}>
        <TouchableRipple
          onPress={() => router.push('/profile')}
          borderless
          rippleColor="rgba(0, 0, 0, .1)"
          style={{ borderRadius: 30 }}
        >
          <Avatar.Image size={60} source={{ uri: user?.avatarUrl }} />
        </TouchableRipple>
        <Text style={styles.username}>{user?.name}</Text>
      </View>
      <DrawerContentScrollView>
        {displayedLinks.map((link) => (
          <DrawerItem
            key={link.label}
            label={link.label}
            onPress={() => router.push(link.href as any)}
          />
        ))}
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => (
            <Avatar.Icon
              icon="logout"
              color={color}
              size={size}
              style={{ backgroundColor: 'transparent' }}
            />
          )}
          onPress={handleLogout}
        />
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2F855A',
  },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Drawer,
  TouchableRipple,
} from 'react-native-paper';

import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';


export default function Navbar(props: DrawerContentComponentProps) {
  const { navigation } = props;
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
            navigation.navigate('login');
            return;
          }
          setUser(JSON.parse(userData));
        } catch {
          await AsyncStorage.clear();
          navigation.navigate('login');
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('login');
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
    { label: 'Activity', href: '/activites' },
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
      </View>
      <ScrollView style={styles.links}>
        {displayedLinks.map((link) => (
          <Drawer.Item          
            key={link.label}
            label={link.label}
            onPress={() => router.push(link.href as any)}
            
          />
        ))}
        <Drawer.Item label="Logout" icon="logout" onPress={handleLogout} />
      </ScrollView>
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
  links: {
    paddingHorizontal: 10,
  },
 
});

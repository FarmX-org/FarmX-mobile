import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Avatar,
  Drawer,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

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
            navigation.navigate('Login');
            return;
          }
          setUser(JSON.parse(userData));
        } catch {
          await AsyncStorage.clear();
          navigation.navigate('Login');
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };

  const isFarmer = user?.roles.includes('ROLE_FARMER');
  const isAdmin = user?.roles.includes('ROLE_ADMIN');

  const links = [
    { label: 'Home', route: 'Home' },
    ...(isFarmer ? [{ label: 'Farms', route: 'Farms' }] : []),
    ...(isAdmin ? [{ label: 'Dashboard', route: 'Dashboard' }] : []),
  ];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.header}>
        <Avatar.Image size={60} source={{ uri: user?.avatarUrl }} />
        <Text style={styles.username}>{user?.name}</Text>
      </View>
      <ScrollView style={styles.links}>
        {links.map((link) => (
          <Drawer.Item
            key={link.label}
            label={link.label}
            onPress={() => navigation.navigate(link.route)}
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

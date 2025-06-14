import UserModal from '@/components/UserModal';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Avatar, Badge, Card, Paragraph, Title } from 'react-native-paper';
import { apiRequest } from './services/apiRequest';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest('/users/me');
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Failed to load user profile </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Avatar.Image
          size={100}
          source={{
            uri:
              user.avatar ||
              `https://ui-avatars.com/api/?name=${user.name}&background=ffffff&color=000000`,
          }}
        />
        <View style={styles.nameSection}>
          <View style={styles.nameRow}>
            <Title style={styles.name}>{user.name}</Title>
            <MaterialIcons name="verified" size={24} color="green" />
          </View>
          <Text style={styles.role}>{user.role}</Text>
          <Badge style={styles.badge}>{user.roles}</Badge>
        </View>
        <UserModal user={user} onUserUpdate={setUser} />
      </View>

      <View style={styles.infoGrid}>
        {[
          { label: 'Email', value: user.email },
          { label: 'Phone', value: user.phone || 'Not provided' },
          { label: 'Location', value: `${user.city || 'Unknown'} - ${user.street || 'Unknown'}` },
          { label: 'Role', value: user.roles },
        ].map((item, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Paragraph style={styles.cardValue}>{item.value}</Paragraph>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Card style={{ marginVertical: 20 , backgroundColor: '#f9f9f9'}}>
        <Card.Title title="Recent Activity" titleStyle={{ color: 'black' }} />
        <Card.Content>
          <Text style={{color: 'black' }}>No recent activity.</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  nameSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 24,
    color: '#333',
  },
  role: {
    color: 'gray',
    fontSize: 14,
  },
  badge: {
    marginTop: 4,
    backgroundColor: 'green',
    color: 'white',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  cardLabel: {
    fontSize: 12,
    color: 'black',

  },
  cardValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

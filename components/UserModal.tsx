import React, { useState } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { Button, Portal, Provider } from 'react-native-paper';
import { apiRequest } from '../app/services/apiRequest';

interface EditProfileModalProps {
  user: any;
  onUserUpdate: (updatedUser: any) => void;
}

export default function UserModal({ user, onUserUpdate }: EditProfileModalProps) {
  const [visible, setVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    street: user?.street || '',
    email: user?.email || '',
  });

  const openModal = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      city: user?.city || '',
      street: user?.street || '',
      email: user?.email || '',
    });
    setVisible(true);
  };

  const closeModal = () => setVisible(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedUser = await apiRequest('/users/me', 'PUT', formData);
      onUserUpdate(updatedUser);
      Alert.alert('Success', 'Profile updated successfully');
      closeModal();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Provider>
      <Button mode="outlined" onPress={openModal}>
        Edit Profile
      </Button>

      <Portal>
        <Modal visible={visible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle} >Edit Profile</Text>

              {['name', 'phone', 'city', 'street', 'email'].map((field, idx) => (
                <TextInput
                  key={idx}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={(formData as any)[field]}
                  onChangeText={(text) => handleChange(field, text)}
                  style={styles.input}
                />
              ))}

              <View style={styles.buttonRow}>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  loading={isSaving}
                  disabled={isSaving}
                  style={{ marginRight: 10 }}
                >
                  Save
                </Button>
                <Button mode="outlined" onPress={closeModal}>
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,

  },
});

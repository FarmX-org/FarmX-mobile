import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const SignUpScreen = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    phone: '',
    city: '',
    street: '',
    email: '',
    role: 'Farmer',
  });

  const [step, setStep] = useState(1);

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Signup failed');
      }

      Alert.alert('Success', 'Account created!');
      router.replace('/login'); 
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

      {step === 1 ? (
        <>
          <TextInput style={styles.input} placeholder="Username" value={form.username} onChangeText={text => handleChange('username', text)} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={text => handleChange('password', text)} />

          <Text style={styles.label}>Role</Text>
          <Picker selectedValue={form.role} onValueChange={value => handleChange('role', value)} style={styles.picker}>
            <Picker.Item label="Farmer" value="Farmer" />
            <Picker.Item label="Consumer" value="Consumer" />
          </Picker>

          <Button title="Next" onPress={() => setStep(2)} />
        </>
      ) : (
        <>
          <TextInput style={styles.input} placeholder="Full Name" value={form.name} onChangeText={text => handleChange('name', text)} />
          <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={text => handleChange('phone', text)} />
          <TextInput style={styles.input} placeholder="City" value={form.city} onChangeText={text => handleChange('city', text)} />
          <TextInput style={styles.input} placeholder="Street" value={form.street} onChangeText={text => handleChange('street', text)} />
          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={form.email} onChangeText={text => handleChange('email', text)} />

          <View style={styles.row}>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Button title="Sign Up" onPress={handleSubmit} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F7FAFC',
    flexGrow: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2F855A',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: '#CBD5E0',
    borderWidth: 1,
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  picker: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#E2E8F0',
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#2D3748',
  },
});

export default SignUpScreen;

import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SignUpScreen = () => {
  const initialForm = {
    username: '',
    password: '',
    name: '',
    phone: '',
    city: '',
    street: '',
    email: '',
    role: 'Farmer',
  };

  const [form, setForm] = useState(initialForm);
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
      setForm(initialForm); 
      setStep(1); 
      router.replace('/login');

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create Your Account</Text>

      {step === 1 ? (
        <>
          <TextInput style={styles.input} placeholder="Username" value={form.username} onChangeText={text => handleChange('username', text)} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={text => handleChange('password', text)} />

          <Text style={styles.label}>Role</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={form.role} onValueChange={value => handleChange('role', value)} style={styles.picker}>
              <Picker.Item label="Farmer" value="Farmer" />
              <Picker.Item label="Consumer" value="Consumer" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(2)}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput style={styles.input} placeholder="Full Name" value={form.name} onChangeText={text => handleChange('name', text)} />
          <TextInput style={styles.input} placeholder="Phone" keyboardType="phone-pad" value={form.phone} onChangeText={text => handleChange('phone', text)} />
          <TextInput style={styles.input} placeholder="City" value={form.city} onChangeText={text => handleChange('city', text)} />
          <TextInput style={styles.input} placeholder="Street" value={form.street} onChangeText={text => handleChange('street', text)} />
          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={form.email} onChangeText={text => handleChange('email', text)} />

          <View style={styles.row}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(1)}>
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButtonSmall} onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#F0FFF4',
    flexGrow: 1,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 28,
    textAlign: 'center',
    color: '#22543D',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 14,
    borderRadius: 12,
    borderColor: '#C6F6D5',
    borderWidth: 1,
    fontSize: 16,
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600',
    color: '#2F855A',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C6F6D5',
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  primaryButton: {
    backgroundColor: '#38A169',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonSmall: {
    backgroundColor: '#38A169',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E6FFFA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#2C7A7B',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default SignUpScreen;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const initialForm = {
    username: "",
    password: "",
  };
  const [form, setForm] = useState(initialForm);


const handleLogin = async () => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    const token = data.accessToken;
    const roles = data.roles;
    const name = data.username || username;
    const avatarUrl = data.avatarUrl || "https://default-avatar.com/avatar.png"; 

    if (!token) throw new Error("Token not received");

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("roles", JSON.stringify(roles));
    await AsyncStorage.setItem("user", JSON.stringify({ name, avatarUrl, roles }));

    Alert.alert("Login Successful", `Welcome, ${name}`);
    
    setForm(initialForm); 
    router.replace('/home');
  } catch (err: any) {
    setError(err.message || "Invalid username or password");
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don&#39;t have an account?{" "}
          <Text style={styles.signupLink} onPress={() => router.push("/signup")}>
            Sign up
          </Text>
        </Text>
      </View>

      {/* Static Image */}
      <Image
        source={require("../assets/images/logg.png")} 
        style={styles.image}
        resizeMode="contain"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", justifyContent: "center", alignItems: "center" },
  form: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2F855A",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#38A169",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  signupText: {
    marginTop: 16,
    fontSize: 14,
    color: "#333",
  },
  signupLink: {
    color: "#38A169",
    fontWeight: "bold",
  },
  image: {
    width: 300,
    height: 200,
    marginTop: 20,
  },
});

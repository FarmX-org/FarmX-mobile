import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import contactGif from "../assets/images/contact.json";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    alert("Message Sent! We have received your message and will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Contact Us</Text>
          <LottieView
            source={contactGif}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}><MaterialIcons name="person" size={16} /> Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}><MaterialIcons name="email" size={16} /> Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}><MaterialIcons name="message" size={16} /> Message</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={formData.message}
            onChangeText={(text) => handleChange("message", text)}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.contactText}>
            Or reach us at: <Text style={styles.email}>info@farmx.com</Text>
          </Text>
          <View style={styles.socialIcons}>
            <FontAwesome
              name="instagram"
              size={24}
              color="#38A169"
              onPress={() => Linking.openURL("https://instagram.com")}
            />
            <FontAwesome
              name="facebook"
              size={24}
              color="#38A169"
              onPress={() => Linking.openURL("https://facebook.com")}
              style={{ marginLeft: 16 }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0fff4",
  },
  container: {
    padding: 20,
  },
  headingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2f855a",
    textAlign: "center",
  },
  lottie: {
    width: 150,
    height: 150,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#2f855a",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cbd5e0",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#38A169",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  contactText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  email: {
    color: "#38A169",
    fontWeight: "bold",
  },
  socialIcons: {
    flexDirection: "row",
    marginTop: 10,
  },
});

export default ContactPage;
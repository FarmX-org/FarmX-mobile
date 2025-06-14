import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const features = [
  {
    icon: "seedling",
    title: "Smart Crop Management",
    description:
      "Track your crops and optimize their growth using AI-powered insights.",
  },
  {
    icon: "tint",
    title: "Intelligent Irrigation",
    description:
      "Get watering recommendations based on real-time soil and weather data.",
  },
  {
    icon: "tractor",
    title: "Efficient Resource Use",
    description:
      "Manage tools, fertilizers, and resources to maximize productivity.",
  },
];

const AboutPage = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>About Our Smart Farm</Text>
        <Text style={styles.description}>
          Welcome to GreenFarm – a smart solution that helps farmers manage their land,
          crops, and resources efficiently. Our goal is to empower local agriculture
          through modern technology, making farming easier, smarter, and more sustainable.
        </Text>

        {features.map((feature, index) => (
          <View key={index} style={styles.card}>
            <Icon name={feature.icon} size={30} color="#38A169" style={styles.icon} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{feature.title}</Text>
              <Text style={styles.cardDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
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
    paddingBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2f855a",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#2f855a",
  },
  cardDescription: {
    fontSize: 14,
    color: "#444",
  },
});

export default AboutPage;

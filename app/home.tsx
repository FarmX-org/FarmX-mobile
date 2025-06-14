import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [roles, setRoles] = useState<string[]>([]);
  const [isConsumer, setIsConsumer] = useState(false);
  const [isFarmer, setIsFarmer] = useState(false);
  const [isHandler, setIsHandler] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("roles").then((data) => {
      if (data) {
        const parsedRoles = JSON.parse(data);
        console.log("Loaded roles:", parsedRoles); 
        setRoles(parsedRoles);
        setIsConsumer(parsedRoles.includes("ROLE_CONSUMER"));
        setIsFarmer(parsedRoles.includes("ROLE_FARMER"));
        setIsHandler(parsedRoles.includes("ROLE_HANDLER"));
      }
    });
  }, []);

  const handleOrdersPress = () => {
    console.log("isConsumer:", isConsumer, "isFarmer:", isFarmer , "isHandler:", isHandler);
    if (isConsumer) {
      router.push("/ConsumerOrdersPage");
    } else if (isFarmer) {
      router.push("/farms");
    }
    else if (isHandler) {
      router.push("/handler");
    }
     else {
      Alert.alert("Access Denied", "You don't have access to orders.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#2F855A" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20, marginTop: 0 }}>
        <LottieView
          source={require("../assets/images/welcome.json")}
          autoPlay
          loop
          style={{ height: 150 }}
        />

        <Text style={styles.title}>Welcome to FarmX !</Text>

        <View style={{ paddingHorizontal: 20 }}>
         {isFarmer && <TouchableOpacity style={styles.card} onPress={() => router.push("/farms")}>
            <Image
              source={require("../assets/images/log.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>My Farms</Text>
          </TouchableOpacity> }

       {(isFarmer || isConsumer) &&    <TouchableOpacity style={styles.card} onPress={() => router.push("/store")}>
            <Image
              source={require("../assets/images/markett.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>Go to Store  ツ </Text>
          </TouchableOpacity>}

          <TouchableOpacity style={styles.card} onPress={handleOrdersPress}>
            <LottieView
              source={require("../assets/images/activity.json")}
              autoPlay
              loop
              style={{ width: 40, height: 40, marginRight: 20 }}
            />
            <Text style={styles.cardText}> Orders</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#2F855A",
  },
  card: {
    backgroundColor: "#E6F4EA",
    borderRadius: 12,
    padding: 20,
    marginVertical: 30,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2F855A",
  },
});

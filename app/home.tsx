import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
 
import { DrawerActions, useNavigation } from '@react-navigation/native';



export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#2F855A" />
      <TouchableOpacity
  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
  style={{
    padding: 16,
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 100,
  }}
>
  <Image
    source={require('../assets/images/farmerr.png')} 
    style={{ width: 24, height: 24 }}
  />
</TouchableOpacity>


     <ScrollView contentContainerStyle={{ paddingBottom: 20, marginTop: 0 }}>

        <LottieView
          source={require("../assets/images/welcome.json")}
          autoPlay
          loop
          style={{ height: 150 }}
        />

        <Text style={styles.title}>Welcome to FarmX !</Text>

        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity style={styles.card}>
            <Image
              source={require("../assets/images/log.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText}>My Farms</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push("/store")}>
            <Image
              source={require("../assets/images/markett.png")}
              style={styles.icon}
            />
            <Text style={styles.cardText} >Store</Text>

          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <LottieView
              source={require("../assets/images/activity.json")}
              autoPlay
              loop
              style={{ width: 40, height: 40, marginRight: 20 }}
            />
            <Text style={styles.cardText}>Activity</Text>
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
    marginVertical: 0,
    color: "#2F855A",
  },
  card: {
    backgroundColor: "#E6F4EA",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
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

import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Button, Card, Dialog, Paragraph, Portal } from "react-native-paper";
import { apiRequest } from "../services/apiRequest";


const FarmListPage = () => {
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingFarmId, setDeletingFarmId] = useState<number | null>(null);
  const [soilTypes, setSoilTypes] = useState<Record<number, string>>({});
  const [locationNames, setLocationNames] = useState<Record<number, string>>({});
  const router = useRouter();

  const fetchFarms = async () => {
    try {
      const data = await apiRequest("/farms");
      setFarms(data);
    } catch (error: any) {
      Alert.alert("Error", "Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
  useCallback(() => {
    fetchFarms();
  }, [])
);
  

  useEffect(() => {
    const fetchInfo = async () => {
      const updatedLocations: Record<number, string> = {};
      const updatedSoil: Record<number, string> = {};

      await Promise.all(
        farms.map(async (farm) => {
          const { latitude, longitude, id } = farm;

          if (latitude && longitude) {
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await res.json();
              updatedLocations[id] = data.display_name;
            } catch {
              updatedLocations[id] = `${latitude}, ${longitude}`;
            }

            try {
              const soil = await apiRequest(`/soil/type?lat=${latitude}&lon=${longitude}`);
              updatedSoil[id] = soil;
            } catch {
              updatedSoil[id] = "Unknown";
            }
          }
        })
      );

      setLocationNames(updatedLocations);
      setSoilTypes(updatedSoil);
    };

    if (farms.length > 0) fetchInfo();
  }, [farms]);

  const handleDelete = async () => {
    if (!deletingFarmId) return;
    try {
      await apiRequest(`/farms/${deletingFarmId}`, "DELETE");
      setDeletingFarmId(null);
      fetchFarms();
    } catch {
      Alert.alert("Error", "Failed to delete farm");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🌾 Your Smart Farms</Text>
          <Text style={styles.subtitle}>Manage and track all your farms with ease.</Text>
        </View>
        <Button buttonColor="#1d9100" textColor="white" mode="contained" onPress={() => router.push("/farms/create")}>
          + New Farm 
        </Button>

      </View>

      {loading ? (
        <ActivityIndicator size="large" color="green" style={{ marginTop: 50 }} />
      ) : farms.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No farms found.</Text>
      ) : (
        farms.map((farm) => (
          <Card key={farm.id} style={styles.card}>
            {farm.licenseDocumentUrl && (
              <Image
                source={{ uri: farm.licenseDocumentUrl }}
                style={styles.image}
              />
            )}
            <Card.Title title={farm.name}   titleStyle={{ color: 'green', fontWeight: 'bold' }}
/>
            <Card.Content>
              <Text>📍 Location: {locationNames[farm.id] || "Loading..."}</Text>
              <Text>🌱 Soil Type: {soilTypes[farm.id] || "Loading..."}</Text>
              <Text>📏 Area: {farm.areaSize} dunum</Text>
            </Card.Content>
            <Card.Actions style={styles.actions}>
              <Button buttonColor="#1d9100"  textColor="white" onPress={() => router.push(`/farms`)}>View Crops</Button>
              <Button buttonColor="#1d9100"  textColor="white" onPress={() => router.push(`/farms/${farm.id}/orders`)}>Orders</Button>
              <Button
                 buttonColor="#1d9100"
                 textColor="white"
                  onPress={() => router.push(`/farms/${farm.id}`)}
                  >
                     Edit
                 </Button>
              <Button buttonColor="#1d9100"  textColor="white" onPress={() => setDeletingFarmId(farm.id)}>Delete</Button>
            </Card.Actions>
          </Card>
        ))
      )}

      <Portal>
        <Dialog visible={!!deletingFarmId} onDismiss={() => setDeletingFarmId(null)}>
          <Dialog.Title>Delete Farm</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete this farm?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeletingFarmId(null)}>Cancel</Button>
            <Button onPress={handleDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0fdf4",
    flex: 1,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#166534",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
  },
  card: {
    marginBottom: 16,
    backgroundColor: "white",
  },

  image: {
    height: 180,
    width: "100%",
    resizeMode: "cover",
  },
  actions: {
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
 
 
});

export default FarmListPage;

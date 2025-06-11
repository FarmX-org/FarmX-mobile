import { useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { Button } from "react-native-paper";
import { apiRequest } from "../app/services/apiRequest";

const FarmFormScreen = () => {
  const route = useRoute<any>();
  const id = route.params?.id;
  const isEditMode = !!id;

  const [farmName, setFarmName] = useState("");
  const [farmArea, setFarmArea] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      apiRequest(`/farms/${id}`)
        .then((data) => {
          setFarmName(data.name || "");
          setFarmArea(data.areaSize?.toString() || "");
          if (data.latitude && data.longitude) {
            setLocationCoords({ latitude: data.latitude, longitude: data.longitude });
            setLocationName(`${data.latitude.toFixed(4)}, ${data.longitude.toFixed(4)}`);
          }
          if (data.licenseDocumentUrl) {
            setImageUri(data.licenseDocumentUrl);
          }
        })
        .catch((err) => {
          Alert.alert("Error", err?.message || "Failed to load farm data");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocationCoords({ latitude, longitude });

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await res.json();
      setLocationName(data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    } catch {
      setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        setImageUri(`data:image/jpeg;base64,${asset.base64}`);
      } else {
        setImageUri(asset.uri);
      }
    }
  };

  const handleSubmit = async () => {
    if (!farmName || !farmArea || !locationCoords) {
      Alert.alert("Validation Error", "Please fill all fields and select a location.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: farmName,
        areaSize: parseFloat(farmArea),
        locationName,
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
        licenseDocumentUrl: imageUri,
      };

      if (isEditMode) {
        await apiRequest(`/farms/${id}`, "PUT", payload);
        Alert.alert("Success", "Farm updated successfully");
      } else {
        await apiRequest("/farms", "POST", payload);
        Alert.alert("Success", "Farm added successfully");
      }

      

      router.push("/farms");
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to save farm");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEditMode ? "Edit Farm" : "Add New Farm"}</Text>

      <TextInput placeholder="Farm Name" value={farmName} onChangeText={setFarmName} style={styles.input} />
      <TextInput
        placeholder="Area (dunum)"
        keyboardType="numeric"
        value={farmArea}
        onChangeText={setFarmArea}
        style={styles.input}
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>Pick Image</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <TextInput
        placeholder="Location (auto-filled)"
        value={locationName}
        onChangeText={setLocationName}
        style={styles.input}
      />

      <MapView
        style={styles.map}
        onPress={handleMapPress}
        region={{
          latitude: locationCoords?.latitude || 32.0,
          longitude: locationCoords?.longitude || 35.9,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {locationCoords && <Marker coordinate={locationCoords} />}
      </MapView>

      <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 16 }} buttonColor="green">
        {isEditMode ? "Update Farm" : "Add Farm"}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    textAlign: "center",
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  imagePickerText: {
    color: "gray",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  map: {
    height: 300,
    marginVertical: 10,
    borderRadius: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FarmFormScreen;

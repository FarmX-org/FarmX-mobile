import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from "react";
import {
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View
} from "react-native";
import { Dialog, Button as PaperButton, TextInput as PaperInput, Portal } from "react-native-paper";

interface BaseCrop {
  id: number;
  name: string;
  category: string;
}

interface CropModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCrop: any | null;
  onSave: (crop: any) => void;
  farmId?: number | null;
  allCrops: BaseCrop[];
  
}

const CropModal: React.FC<CropModalProps> = ({
  isOpen,
  onClose,
  selectedCrop,
  onSave,
  farmId,
  allCrops,
}) => {
  const [cropData, setCropData] = useState<any>({
    cropId: "",
    name: "",
    category: "",
    quantity: 0,
    status: "planted",
    notes: "",
    imageUrl: "",
    available: true,
    farmId: null,
  });

  useEffect(() => {
    if (selectedCrop) {
      setCropData({
        ...selectedCrop,
        cropId: selectedCrop.cropId || selectedCrop.id,
        farmId: selectedCrop.farmId || farmId,
      });
    } else {
      setCropData({
        cropId: "",
        name: "",
        category: "",
        quantity: 0,
        status: "planted",
        notes: "",
        imageUrl: "",
        available: true,
        farmId: farmId ?? null,
      });
    }
  }, [selectedCrop, isOpen, farmId]);

  const handleImageUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access media library is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: false,
      quality: 0.5,
    });

    if (!result.canceled) {
      setCropData({ ...cropData, imageUrl: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    const cropIdNumber = Number(cropData.cropId);
    if (!cropIdNumber) {
      alert("Please select a crop.");
      return;
    }

    const finalCropData = {
      ...cropData,
      cropId: cropIdNumber,
      farmId: cropData.farmId || farmId,
    };

    onSave(finalCropData);
    onClose();
  };

  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={onClose}>
        <Dialog.Title>{selectedCrop ? "Edit Crop" : "Add New Crop"}</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView style={{ paddingHorizontal: 20 }}>
            <Text style={styles.label}>Select Crop</Text>
            <View style={styles.picker}>
              {allCrops.map((crop) => (
                <Button
                  key={crop.id}
                  title={`${crop.name} (${crop.category})`}
                  onPress={() =>
                    setCropData({
                      ...cropData,
                      cropId: crop.id,
                      name: crop.name,
                      category: crop.category,
                    })
                  }
                  color={cropData.cropId === crop.id ? "green" : "#ccc"}
                />
              ))}
            </View>

            <PaperInput
              label="Quantity"
              mode="outlined"
              keyboardType="numeric"
              value={cropData.quantity.toString()}
              onChangeText={(val) => setCropData({ ...cropData, quantity: Number(val) })}
              style={styles.input}
            />

            <PaperInput
              label="Status"
              mode="outlined"
              value={cropData.status}
              onChangeText={(val) => setCropData({ ...cropData, status: val })}
              style={styles.input}
            />

            <PaperInput
              label="Notes"
              mode="outlined"
              value={cropData.notes}
              onChangeText={(val) => setCropData({ ...cropData, notes: val })}
              style={styles.input}
            />

            <View style={styles.switchContainer}>
              <Text>Available</Text>
              <Switch
                value={cropData.available}
                onValueChange={(val) => setCropData({ ...cropData, available: val })}
              />
            </View>

            <Button title="Upload Image" onPress={handleImageUpload} />
            {cropData.imageUrl ? (
              <Image
                source={{ uri: cropData.imageUrl }}
                style={styles.image}
              />
            ) : null}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <PaperButton onPress={handleSave}>{selectedCrop ? "Update" : "Save"}</PaperButton>
          <PaperButton onPress={onClose}>Cancel</PaperButton>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
  },
  label: {
    marginTop: 8,
    fontWeight: "bold",
  },
  picker: {
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
    alignSelf: "center",
  },
});

export default CropModal;

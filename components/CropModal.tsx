import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Dialog,
  Divider,
  Button as PaperButton,
  TextInput as PaperInput,
  Portal,
  Surface,
} from 'react-native-paper';

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
    cropId: '',
    name: '',
    category: '',
    quantity: 0,
    status: 'planted',
    notes: '',
    imageUrl: '',
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
        cropId: '',
        name: '',
        category: '',
        quantity: 0,
        status: 'planted',
        notes: '',
        imageUrl: '',
        available: true,
        farmId: farmId ?? null,
      });
    }
  }, [selectedCrop, isOpen, farmId]);

  const handleImageUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission to access media library is required.');
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
      alert('Please select a crop.');
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
      <Dialog style={styles.dialog} visible={isOpen} onDismiss={onClose}>
        <Dialog.Title style={styles.title}>
          {selectedCrop ? 'Edit Crop' : 'Add New Crop'}
        </Dialog.Title>
        <Divider />
        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.label}>Choose Crop</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cropList}>
              {allCrops.map((crop) => (
                <TouchableOpacity
                  key={crop.id}
                  style={[
                    styles.cropButton,
                    cropData.cropId === crop.id && styles.selectedCropButton,
                  ]}
                  onPress={() =>
                    setCropData({
                      ...cropData,
                      cropId: crop.id,
                      name: crop.name,
                      category: crop.category,
                    })
                  }
                >
                  <Text
                    style={{
                      color: cropData.cropId === crop.id ? '#fff' : '#444',
                      fontWeight: 'bold',
                    }}
                  >
                    {crop.name}
                  </Text>
                  <Text style={{ color: '#888', fontSize: 12 }}>{crop.category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

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

            <View style={styles.switchRow}>
              <Text style={{ fontWeight: '500' }}>Available:</Text>
              <PaperButton
                mode={cropData.available ? 'contained' : 'outlined'}
                onPress={() => setCropData({ ...cropData, available: !cropData.available })}
                compact
              >
                {cropData.available ? 'Yes' : 'No'}
              </PaperButton>
            </View>

            <PaperButton
              icon="image"
              mode="outlined"
              onPress={handleImageUpload}
              style={styles.uploadBtn}
            >
              Upload Image
            </PaperButton>

            {cropData.imageUrl ? (
              <Surface style={styles.imageWrapper}>
                <Image source={{ uri: cropData.imageUrl }} style={styles.image} />
              </Surface>
            ) : null}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <PaperButton
            mode="contained"
            onPress={handleSave}
            style={styles.actionBtn}
          >
            {selectedCrop ? 'Update' : 'Save'}
          </PaperButton>
          <PaperButton onPress={onClose} style={styles.cancelBtn}>
            Cancel
          </PaperButton>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 15,
    backgroundColor: '#ffffff',
    paddingBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  cropList: {
    marginVertical: 10,
  },
  cropButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  selectedCropButton: {
    backgroundColor: '#4CAF50',
  },
  input: {
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  uploadBtn: {
    marginTop: 10,
  },
  imageWrapper: {
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 60,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: 120,
    height: 120,
  },
  actionBtn: {
    marginRight: 10,
    backgroundColor: '#4CAF50',
  },
  cancelBtn: {
    borderColor: '#888',
  },
});

export default CropModal;

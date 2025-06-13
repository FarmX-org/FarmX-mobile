import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Dialog, Button as PaperButton, Portal } from "react-native-paper";

interface SendToStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  crop: {
    id: number;
    name: string;
    category: string;
    quantity: number;
    imageUrl: string;
    cropId: number;
  } | null;
  onSend: (payload: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    imageUrl: string;
    description: string;
    plantedCropId: number;
    price: number;
  }) => void;
  onQuantityUpdate: (newQuantity: number, cropId: number) => void;
}

const SendToStoreModal: React.FC<SendToStoreModalProps> = ({
  isOpen,
  onClose,
  crop,
  onSend,
  onQuantityUpdate,
}) => {
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");

  const showToast = (message: string) => {
    alert(message); // يمكنك استبدالها بـ Toast حقيقي باستخدام مكتبة خارجية
  };

  const handleSubmit = () => {
    const quantity = parseInt(amount);
    const parsedPrice = parseFloat(price);

    if (!crop || isNaN(quantity) || quantity <= 0) {
      showToast("Please enter a valid quantity.");
      return;
    }

    if (!unit) {
      showToast("Please select a unit.");
      return;
    }

    if (quantity > crop.quantity) {
      showToast("Quantity is greater than available quantity.");
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      showToast("Please enter a valid price.");
      return;
    }

    onSend({
      name: crop.name,
      category: crop.category,
      quantity,
      unit,
      imageUrl: crop.imageUrl,
      description: `send ${quantity} ${unit} of ${crop.name} to store`,
      plantedCropId: crop.id,
      price: parsedPrice,
    });

    const remaining = crop.quantity - quantity;
    onQuantityUpdate(remaining, crop.id);
    setAmount("");
    setPrice("");
    setUnit("");
    onClose();
  };
  
  if (!crop) {
  return (
    <Portal>
      <Dialog visible={isOpen} onDismiss={onClose}>
        <Dialog.Title>No crop selected</Dialog.Title>
        <Dialog.Actions>
          <PaperButton onPress={onClose}>Close</PaperButton>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
  return (
    <Portal>
      
      <Dialog visible={isOpen} onDismiss={onClose}>
        <Dialog.Title>Send to Store</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Unit</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={unit}
              onValueChange={(itemValue) => setUnit(itemValue)}
            >
              <Picker.Item label="Select unit" value="" />
              <Picker.Item label="kg" value="kg" />
              <Picker.Item label="Box" value="box" />
              <Picker.Item label="Piece" value="piece" />
              <Picker.Item label="Liter" value="liter" />
            </Picker>
          </View>

          <Text style={styles.label}>Price per unit</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <PaperButton onPress={handleSubmit}>Send</PaperButton>
          <PaperButton onPress={onClose}>Cancel</PaperButton>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: 8,
    fontWeight: "bold",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 12,
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 12,
  },
});

export default SendToStoreModal;

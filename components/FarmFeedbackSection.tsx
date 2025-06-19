import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { apiRequest } from '../app/services/apiRequest';

interface FarmOrderDTO {
  farmId: number;
  farmName: string;
  items: {
    productName: string;
    productId: number;
  }[];
}

interface Props {
  farmOrders: FarmOrderDTO[];
  orderId: number;
}


const FarmFeedbackSection = ({ farmOrders, orderId }: Props) => {
  const [farmRatings, setFarmRatings] = useState<Record<number, number>>({});
  const [farmFeedbacks, setFarmFeedbacks] = useState<Record<number, string>>({});
  const [productRatings, setProductRatings] = useState<Record<string, number>>({});
  const [productFeedbacks, setProductFeedbacks] = useState<Record<string, string>>({});
  const [submittedFarmIds, setSubmittedFarmIds] = useState<number[]>([]);
  const [submittedProductKeys, setSubmittedProductKeys] = useState<string[]>([]);

  const handleFarmSubmit = async (farmId: number) => {
    if (submittedFarmIds.includes(farmId)) {
      Alert.alert('Already Rated', 'You have already rated this farm.');
      return;
    }

    const farm = farmOrders.find((f) => f.farmId === farmId);
    const payload = {
      orderId,
      feedbackType: 'FARM',
      rating: farmRatings[farmId],
      comment: farmFeedbacks[farmId] || '',
      farmId,
      farmName: farm?.farmName || '',
    };

    try {
      await apiRequest('/feedback', 'POST', payload);
      setSubmittedFarmIds((prev) => [...prev, farmId]);
      Alert.alert('Success', 'Farm rating submitted successfully.');
    } catch {
      Alert.alert('Error', 'Failed to submit farm rating.');
    }
  };

  const handleProductSubmit = async (
    farmId: number,
    productId: number,
    productName: string
  ) => {
    const key = `${farmId}-${productName}`;

    if (submittedProductKeys.includes(key)) {
      Alert.alert('Already Rated', 'You have already rated this product.');
      return;
    }

    const payload = {
      orderId,
      feedbackType: 'PRODUCT',
      rating: productRatings[key],
      comment: productFeedbacks[key] || '',
      farmId,
      productId,
      productName,
    };

    try {
      await apiRequest('/feedback', 'POST', payload);
      setSubmittedProductKeys((prev) => [...prev, key]);
      Alert.alert('Success', 'Product rating submitted successfully.');
    } catch {
      Alert.alert('Error', 'Failed to submit product rating.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {farmOrders.map((farmOrder) => (
        <View key={farmOrder.farmId} style={styles.card}>
          <Text style={styles.heading}>{farmOrder.farmName}</Text>

          {/* Farm Rating */}
          <Text style={styles.label}>Rate the farm:</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                disabled={submittedFarmIds.includes(farmOrder.farmId)}
                onPress={() =>
                  setFarmRatings({ ...farmRatings, [farmOrder.farmId]: star })
                }
              >
                <Icon
                  name="star"
                  size={24}
                  color={
                    star <= (farmRatings[farmOrder.farmId] || 0)
                      ? '#FFD700'
                      : '#E0E0E0'
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Optional comment about the farm..."
            multiline
            editable={!submittedFarmIds.includes(farmOrder.farmId)}
            value={farmFeedbacks[farmOrder.farmId] || ''}
            onChangeText={(text) =>
              setFarmFeedbacks({ ...farmFeedbacks, [farmOrder.farmId]: text })
            }
          />
          {submittedFarmIds.includes(farmOrder.farmId) ? (
            <View style={[styles.button, { backgroundColor: 'lightgreen' }]}>
              <Text style={styles.buttonText}>✅ Rated</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                !farmRatings[farmOrder.farmId] && styles.disabledButton,
              ]}
              disabled={!farmRatings[farmOrder.farmId]}
              onPress={() => handleFarmSubmit(farmOrder.farmId)}
            >
              <Text style={styles.buttonText}>Submit Farm Rating</Text>
            </TouchableOpacity>
          )}

          {/* Product Ratings */}
          <Text style={styles.label}>Rate the products you received:</Text>
          {farmOrder.items.map((item, index) => {
            const key = `${farmOrder.farmId}-${item.productName}`;
            return (
              <View key={index} style={{ marginBottom: 12 }}>
                <Text style={styles.productName}>{item.productName}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      disabled={submittedProductKeys.includes(key)}
                      onPress={() =>
                        setProductRatings({ ...productRatings, [key]: star })
                      }
                    >
                      <Icon
                        name="star"
                        size={20}
                        color={
                          star <= (productRatings[key] || 0)
                            ? '#FFD700'
                            : '#E0E0E0'
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  style={styles.smallTextArea}
                  placeholder="Optional comment..."
                  multiline
                  editable={!submittedProductKeys.includes(key)}
                  value={productFeedbacks[key] || ''}
                  onChangeText={(text) =>
                    setProductFeedbacks({ ...productFeedbacks, [key]: text })
                  }
                />
                {submittedProductKeys.includes(key) ? (
                  <View style={[styles.smallButton, { backgroundColor: 'lightgreen' }]}>
                    <Text style={styles.buttonText}>✅ Rated</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.smallButton,
                      !productRatings[key] && styles.disabledButton,
                    ]}
                    disabled={!productRatings[key]}
                    onPress={() =>
                      handleProductSubmit(
                        farmOrder.farmId,
                        item.productId,
                        item.productName
                      )
                    }
                  >
                    <Text style={styles.buttonText}>Submit Product Rating</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  textArea: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  smallTextArea: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 6,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 10,
    marginTop: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  smallButton: {
    backgroundColor: 'green',
    padding: 8,
    marginTop: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontWeight: '600',
    color: 'black',
  },
  productName: {
    marginBottom: 4,
    fontWeight: '500',
  },
});

export default FarmFeedbackSection;

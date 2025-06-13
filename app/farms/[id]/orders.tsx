import OrderCard from '@/components/OrderCard';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { apiRequest } from '../../services/apiRequest';


interface OrderItemDTO {
  productName: string;
  quantity: number;
  price: number;
}

interface FarmOrderDTO {
  id: number;
  farmId: number;
  farmName: string;
  orderStatus: string;
  deliveryTime: string;
  items: OrderItemDTO[];
}

export default function FarmerOrdersScreen() {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const farmId = parseInt(id);

  const [orders, setOrders] = useState<FarmOrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNaN(farmId)) {
      setError('Invalid farm ID');
      setLoading(false);
      return;
    }

    apiRequest(`/orders/farm/${farmId}`)
      .then((res) => {
        setOrders(res);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setError('Failed to load farm orders');
      })
      .finally(() => setLoading(false));
  }, [farmId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }


return (
  <View style={styles.container}>
    <Text style={styles.heading}>Orders For My Farm</Text>
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <OrderCard type="FARMER" order={item} />}
      ListEmptyComponent={<Text>No orders found for this farm.</Text>}
    />
  </View>
);
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

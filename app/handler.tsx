import OrderCard from '@/components/OrderCard';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { apiRequest } from './services/apiRequest';

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

interface OrderDTO {
  id: number;
  totalAmount: number;
  orderStatus: string;
  estimatedDeliveryTime: string;
  farmOrders: FarmOrderDTO[];
}

const HandlerOrdersPage = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data: OrderDTO[] = await apiRequest('/orders/handler', 'GET');
      console.log(data);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Handler Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => (
          <OrderCard
            type="HANDLER"
            order={item}
            onUpdate={fetchOrders}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HandlerOrdersPage;

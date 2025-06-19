import FarmFeedbackSection from '@/components/FarmFeedbackSection';
import OrderCard from '@/components/OrderCard';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { apiRequest } from './services/apiRequest';

interface OrderItemDTO {
  productName: string;
  productId: number;
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

const ConsumerOrdersPage = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    apiRequest('/orders/consumer')
      .then(setOrders)
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const toggleFeedbackSection = (orderId: number) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderSection}>
            <OrderCard key={item.id} type="CONSUMER" order={item} />
            
           {item.orderStatus === 'DELIVERED' && (
  <>
    <TouchableOpacity
      style={styles.button}
      onPress={() => toggleFeedbackSection(item.id)}
    >
      <Text style={styles.buttonText}>
        {expandedOrderId === item.id ? 'Hide Feedback ' : 'Show Feedback'}
      </Text>
    </TouchableOpacity>

    {expandedOrderId === item.id && (
      <FarmFeedbackSection
        farmOrders={item.farmOrders}
        orderId={item.id}
      />
    )}
  </>
)}

          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    marginTop: 20,
    padding: 16,
  },
  orderSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    color: 'White',
  },
});

export default ConsumerOrdersPage;

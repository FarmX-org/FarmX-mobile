import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import CountDown from 'react-native-countdown-component';

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

interface HandlerOrderDTO {
  id: number;
  orderStatus: string;
  deliveryTime: string;
  totalAmount: number;
  items: OrderItemDTO[];
}

type OrderType = 'CONSUMER' | 'FARMER' | 'HANDLER';

interface OrderCardProps {
  type: OrderType;
  order: OrderDTO | FarmOrderDTO | HandlerOrderDTO;
  onUpdate?: (orderId: number, status: string, deliveryTime?: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ type, order, onUpdate }) => {
  const [status, setStatus] = useState(order.orderStatus);
  const [deliveryTime, setDeliveryTime] = useState(
    'deliveryTime' in order && order.deliveryTime
      ? order.deliveryTime.slice(0, 16)
      : ''
  );

  const getBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'orange';
      case 'ready':
        return 'green';
      case 'delivered':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const renderItem = ({ item }: { item: OrderItemDTO }) => (
    <View style={styles.itemBox}>
      <Text>Product: {item.productName}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Price: {item.price}₪</Text>
    </View>
  );

  if (type === 'CONSUMER' && 'farmOrders' in order) {
    return (
      <View style={styles.card}>
        <Text style={styles.heading}>Order #{order.id}</Text>
        <Text>Status: {order.orderStatus}</Text>
        <Text>Total: {order.totalAmount}₪</Text>
        <Text>
  Estimated Delivery:{' '}
  {order.orderStatus === 'READY' ? (
    <CountDown
      until={
        Math.max(
          0,
          Math.floor(
            (new Date(order.estimatedDeliveryTime).getTime() - Date.now()) /
              1000
          )
        )
      }
      size={12}
      digitStyle={{ backgroundColor: '#FFF', borderColor: 'green' }}
      digitTxtStyle={{ color: 'green' }}
      timeLabelStyle={{ color: 'gray', fontSize: 10 }}
      timeToShow={['H', 'M', 'S']}
      timeLabels={{ h: 'h', m: 'm', s: 's' }}
      showSeparator
      onFinish={() => console.log('Delivery time reached')}
    />
  ) : (
    'Not ready yet'
  )}
</Text>


        {order.farmOrders.map((farm) => (
          <View key={farm.id} style={styles.farmBox}>
            <Text style={styles.subHeading}>Farm: {farm.farmName}</Text>
            <FlatList
              data={farm.items}
              renderItem={renderItem}
              keyExtractor={(_, index) => index.toString()}
            />
          </View>
        ))}
      </View>
    );
  }

  // FARMER & HANDLER (similar logic can be expanded here)
  // To keep things short, I’ll help build these next if you want

  return null;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  farmBox: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  itemBox: {
    padding: 8,
    marginTop: 5,
    backgroundColor: '#e8e8e8',
    borderRadius: 6,
  },
});

export default OrderCard;

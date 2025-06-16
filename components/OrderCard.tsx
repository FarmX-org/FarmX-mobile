import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View
} from 'react-native';
import { apiRequest } from '../app/services/apiRequest';
import CountdownTimer from './CountdownTimer';


const getBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'orange';
    case 'ready': return 'green';
    case 'delivered': return 'blue';
    default: return 'gray';
  }
};

type OrderCardProps = {
  type: 'CONSUMER' | 'HANDLER' | 'FARMER';
  order: any; 
  onUpdate?: (id: number, status: string, time: string) => void;
};

const OrderCard: React.FC<OrderCardProps> = ({ type, order, onUpdate }) => {
  const [status, setStatus] = useState(order.orderStatus);
  const [estimatedTime, setEstimatedTime] = useState(order.estimatedDeliveryTime || '');
  const [deliveryTime, setDeliveryTime] = useState(order.deliveryTime || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState('');
  const showToast = (message: string) => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};


  const handleUpdate = async () => {
    try {
      let url;
      if (type === 'FARMER') {
        url = `/orders/farm-order/${order.id}/status?status=${encodeURIComponent(status)}`;
if (deliveryTime) url += `&deliveryTime=${encodeURIComponent(deliveryTime)}`;
      } else if (type === 'HANDLER') {
        url = `/orders/handler/${order.id}/status?status=${encodeURIComponent(status)}&estimatedDeliveryTime=${encodeURIComponent(estimatedTime)}`;
      }
      if (!url) {
        throw new Error('Invalid URL for apiRequest');
      }
      await apiRequest(url, 'PUT');
      onUpdate?.(order.id, status, deliveryTime || estimatedTime);
      alert('Order updated!');
    } catch (e) {
      console.error(e);
      alert('Failed to update order.');
    }
  };
  const confirmDelivery = async () => {
  setSubmitting(true);
  onUpdate?.(order.id, status, deliveryTime || estimatedTime);

  try {
    await apiRequest(`/orders/handler/${order.id}/deliver?code=${otp}`, 'PUT');
    showToast('Delivery confirmed!');
    onUpdate?.(order.id, 'DELIVERED', deliveryTime || estimatedTime);
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || 'Pin code is incorrect';
    showToast(`Error: ${errorMessage}`);
  } finally {
    setSubmitting(false);
  }
};

const handleRegenerateCode = async () => {
  try {
    await apiRequest(`/orders/consumer/${order.id}/regenerate-code`, 'PUT');
    showToast('New code generated successfully!');
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || 'An error occurred.';
    showToast(`Error: ${errorMessage}`);
  }
};

const showGenerateCode = async () => {
  try {
    const response = await apiRequest(`/orders/consumer/${order.id}/delivery-code`);
    setCode(response);
    console.log(response);
    showToast('Code shown!');
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || 'An error occurred.';
    showToast(`Error: ${errorMessage}`);
  }
};

  const renderItem = ({ item }: { item: { productName: string; quantity: number; price: number } }) => (
    <View style={styles.itemBox}>
      <Text><Text style={styles.bold}>Product:</Text> {item.productName}</Text>
      <Text><Text style={styles.bold}>Quantity:</Text> {item.quantity}</Text>
      <Text><Text style={styles.bold}>Price:</Text> {item.price}₪</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Order #{order.id}</Text>
      {type === 'CONSUMER' && 'farmOrders' in order && (
        <>
          <Text>Status: <Text style={{ color: getBadgeColor(order.orderStatus) }}>{order.orderStatus}</Text></Text>
          <Text>Total: <Text style={styles.bold}>{order.totalAmount}₪</Text></Text>
<Text>Estimated Delivery:</Text>
{order.orderStatus === 'READY' ? (
<CountdownTimer targetDate={order.estimatedDeliveryTime} />
) : (
  <Text>Not ready yet</Text>

)}
{order.orderStatus === 'READY' && (
  <>
    <Button title="Regenerate Code" onPress={handleRegenerateCode} color="green" />
    <Button title="Show Code" onPress={showGenerateCode} color="green" />
    {code !== '' && (
      <Text style={{ marginVertical: 6, fontWeight: 'bold' }}>Delivery Code: {code}</Text>
    )}
  </>
)}

          
         
          {order.farmOrders.map((farm: { id: number; farmName: string; items: { productName: string; quantity: number; price: number }[] }) => (
            <View key={farm.id} style={styles.section}>
              <Text style={styles.subheading}>Farm: {farm.farmName}</Text>
              <FlatList data={farm.items} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
            </View>
          ))}
        </>
      )}

      {type === 'HANDLER' && 'farmOrders' in order && (
        <>
          <Text>Total: {order.totalAmount}₪</Text>
          <Text>Status:</Text>
          <Picker selectedValue={status} onValueChange={setStatus}>
            <Picker.Item label="PENDING" value="PENDING" />
            <Picker.Item label="READY" value="READY" />
            <Picker.Item label="DELIVERED" value="DELIVERED" />
          </Picker>
          <Text>Estimated Delivery Time:</Text>
          <TextInput
            style={styles.input}
            value={estimatedTime}
            placeholder="YYYY-MM-DDTHH:MM"
            onChangeText={setEstimatedTime}
          />
          <Button title="Save"
           onPress={handleUpdate}
            color="green"
            />
          {order.orderStatus === 'READY' && (
  <>
    <Text style={styles.subheading}>Enter Delivery PIN:</Text>
    <View style={styles.pinContainer}>
      {Array(6).fill(0).map((_, index) => (
        <TextInput
          key={index}
          style={styles.pinInput}
          keyboardType="number-pad"
          maxLength={1}
          value={otp[index] || ''}
          onChangeText={(text) => {
            const newOtp = otp.split('');
            newOtp[index] = text;
            setOtp(newOtp.join('').slice(0, 6));
          }}
        />
      ))}
    </View>
    <Button
      title="Confirm Delivery"
      onPress={confirmDelivery}
      color="green"
      disabled={submitting || otp.length < 6}
    />
  </>
)}

          {order.farmOrders.map((farm: { id: number; farmName: string; orderStatus: string; deliveryTime?: string; items: { productName: string; quantity: number; price: number }[] }) => (
            <View key={farm.id} style={styles.section}>
              <Text style={styles.subheading}>Farm: {farm.farmName}</Text>
              <Text>Status: <Text style={{ color: getBadgeColor(farm.orderStatus) }}>{farm.orderStatus}</Text></Text>
<Text>Delivery:</Text>
{farm.orderStatus === 'READY' && farm.deliveryTime ? (
<CountdownTimer targetDate={farm.deliveryTime} />
) : (
  <Text>Not ready yet</Text>
)}
              <FlatList data={farm.items} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
            </View>
          ))}
        </>
      )}

      {type === 'FARMER' && 'farmName' in order && (
        <>
          <Text>Farm: {order.farmName}</Text>
          <Text>Status:</Text>
          <Picker selectedValue={status} onValueChange={setStatus}>
            <Picker.Item label="PENDING" value="PENDING" />
            <Picker.Item label="READY" value="READY" />
            <Picker.Item label="DELIVERED" value="DELIVERED" />
          </Picker>
          <Text>Delivery Time:</Text>
          <TextInput
            style={styles.input}
            value={deliveryTime}
            placeholder="YYYY-MM-DDTHH:MM"
            onChangeText={setDeliveryTime}
          />
          <Button title="Save" onPress={handleUpdate} color="green"/>
          <FlatList data={order.items} renderItem={renderItem} keyExtractor={(item, index) => index.toString()} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginVertical: 6,
  },
  itemBox: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  pinContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 10,
  gap: 5, 
},
pinInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 6,
  width: 45,
  height: 50,
  textAlign: 'center',
  fontSize: 20,
  backgroundColor: '#fff',
},

 

});

export default OrderCard;
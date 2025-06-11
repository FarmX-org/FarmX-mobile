import cartGif from '@/assets/images/cart2.json';
import cart2Gif from '@/assets/images/emptycart.json';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { apiRequest } from './services/apiRequest'; // تأكد من توافق هذا المسار

type CartItem = {
  id: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
};

type Cart = {
  items: CartItem[];
  totalPrice: number;
};

const CartPage = () => {
  const [cart, setCart] = useState<Cart>({ items: [], totalPrice: 0 });

  const showToast = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: message,
    });
  };

  const fetchCartItems = async () => {
    try {
      const cartData = await apiRequest("/cart");
      setCart(cartData);
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const increaseQuantity = async (ItemID: number) => {
    const item = cart.items.find((item) => item.id === ItemID);
    if (!item) return;
    try {
      await apiRequest(`/cart/items/${ItemID}`, "PUT", {
        quantity: item.quantity + 1
      });
      fetchCartItems();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const decreaseQuantity = async (ItemID: number) => {
    const item = cart.items.find((item) => item.id === ItemID);
    if (!item || item.quantity <= 1) return;
    try {
      await apiRequest(`/cart/items/${ItemID}`, "PUT", {
        quantity: item.quantity - 1
      });
      fetchCartItems();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  const clearCart = async () => {
    Alert.alert("Confirm", "Are you sure you want to clear the cart?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await apiRequest("/cart/clear", "DELETE");
            fetchCartItems();
          } catch (err: any) {
            showToast(err.message);
          }
        }
      }
    ]);
  };

  const handleCheckout = async () => {
    try {
      await apiRequest("/orders/from-cart", "POST");
      clearCart();
    } catch (err: any) {
      showToast(err.message);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LottieView
        source={cart.items.length === 0 ? cart2Gif : cartGif}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.heading}>Shopping Cart</Text>

      {cart.items.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty! Please add some items.</Text>
      ) : (
        <>
          {cart.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.row}>
                <Image source={{ uri: item.productImage }} style={styles.image} />
                <Text style={styles.productName}>{item.productName}</Text>
              </View>
              <Text>Price: ${item.productPrice.toFixed(2)}</Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.qtyButton}>
                  <Text>-</Text>
                </TouchableOpacity>
                <TextInput
                  value={item.quantity.toString()}
                  editable={false}
                  style={styles.qtyInput}
                  textAlign="center"
                />
                <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.qtyButton}>
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.totalText}>
                Total: ${(item.productPrice * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.footer}>
            <Button title="Clear Cart" color="red" onPress={clearCart} />
            <View style={{ marginTop: 10 }}>
              <Text style={styles.totalLabel}>Subtotal: ${cart.totalPrice.toFixed(2)}</Text>
              <Text style={styles.totalLabelBold}>Total: ${cart.totalPrice.toFixed(2)}</Text>
              <Button title="Proceed to Checkout" color="green" onPress={handleCheckout} />
            </View>
          </View>
        </>
      )}

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  itemCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    gap: 6,
  },
  qtyButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  qtyInput: {
    width: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    borderRadius: 4,
  },
  totalText: {
    marginTop: 6,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    width: '100%',
  },
  totalLabel: {
    fontSize: 16,
    marginTop: 10,
  },
  totalLabelBold: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default CartPage;

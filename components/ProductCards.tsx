import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


interface Product {
  id: number;
  imageSrc: string;
  title: string;
  category: string;
  quantity: number;
  price: number;
  unit: string;
  description: string;
  rating: number;
  ratingCount: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: number, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [selectedQuantity, setSelectedQuantity] = useState('1');
  const [isConsumer, setIsConsumer] = useState(false);

  const handleQuantityChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '');
    setSelectedQuantity(numeric);
  };

  const handleAdd = () => {
    const qty = parseInt(selectedQuantity, 10);
    if (!isNaN(qty) && qty > 0) {
      onAddToCart(product.id, qty);
    }
  };
  const checkConsumerRole = async () => {
    const roles = await AsyncStorage.getItem('roles');
    if (roles) {
      const parsedRoles = JSON.parse(roles);
      setIsConsumer(parsedRoles.includes('ROLE_CONSUMER'));
    }
  };
  React.useEffect(() => {
    checkConsumerRole();
  }, []);
  
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.imageSrc }} style={styles.image} />

      <View style={styles.info}>
  <Text style={styles.name}>{product.title}</Text>
  <Text style={styles.detail}>Category: {product.category}</Text>
  <Text style={styles.detail}>Available: {product.quantity} {product.unit}</Text>
  <Text style={styles.detail}>Price: ${product.price}</Text>

  <Text style={styles.detail}>
    Rating: {product.rating.toFixed(1)} ⭐ ({product.ratingCount})
  </Text>

  {isConsumer && (
    <View style={styles.quantityRow}>
      <Text style={styles.detail}>Qty:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={selectedQuantity}
        onChangeText={handleQuantityChange}
        placeholder="1"
      />
    </View>
  )}
</View>


      { isConsumer && <TouchableOpacity style={styles.button} onPress={handleAdd}>
       <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>}
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    marginVertical: 10,
    marginHorizontal: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  info: {
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 10,
  },
  input: {
    height: 36,
    width: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    marginLeft: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
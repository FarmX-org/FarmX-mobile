import ProductCard from "@/components/Cards";
import Sidebar from "@/components/Sidebar";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import Toast from "react-native-toast-message";
import { apiRequest } from "./services/apiRequest";


interface Product {
  id: number;
  imageSrc: string;
  title: string;
  price: number;
  available: boolean;
  category: string;
  unit: string;
  quantity: number;
  description: string;
}

const StorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isConsumer, setIsConsumer] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    require("@/assets/images/markett.png"),
    require("@/assets/images/market2.jpg"),
    require("@/assets/images/market3.jpg"),
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiRequest("/products/store");
        const formatted = data.map((product: any) => ({
          id: product.id,
          imageSrc: product.imageUrl || "",
          title: product.cropName || "No description",
          price: product.price ?? 0,
          available: product.available ?? false,
          category: product.category || "Vegetables",
          unit: product.unit || "",
          quantity: product.quantity || 0,
          description: product.description || "",
        }));
        setProducts(formatted);
      } catch (err: any) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err.message || "Failed to fetch products",
        });
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkRole = async () => {
      const roleString = await AsyncStorage.getItem("roles"); 
      if (roleString) {
        try {
          const roles = JSON.parse(roleString);
          setIsConsumer(Array.isArray(roles) && roles.includes("ROLE_CONSUMER"));
        } catch (e) {
          console.error("Error parsing roles", e);
        }
      }
    };
    checkRole();
  }, []);

  const handleAddToCart = async (id: number, quantity: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    if (quantity > product.quantity) {
      Toast.show({
        type: "info",
        text1: "Quantity is greater than available",
        text2: `Only ${product.quantity} units available.`,
      });
      return;
    }

    try {
      await apiRequest("/cart/items", "POST", {
        productId: id,
        quantity,
      });

      Toast.show({
        type: "success",
        text1: "Added to Cart",
        text2: `Product #${id} with quantity ${quantity} added.`,
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <Sidebar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        resetFilters={() => {
          setSearchTerm("");
          setSelectedCategory("");
        }}
      />

      <Image source={images[currentImage]} style={styles.bannerImage} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onAddToCart={handleAddToCart}
          />
        )}
        contentContainerStyle={styles.list}
      />

      {isConsumer && (
        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => router.push("/cart")}
        >
          <MaterialIcons name="shopping-cart" size={28} color="green" />
        </TouchableOpacity>
      )}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cartIcon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    zIndex: 1000,
  },
});

export default StorePage;

import { CropCard } from "@/components/CropCard";
import CropModal from "@/components/CropModal";
import SendToStoreModal from "@/components/SendToStoreModal ";
import Lottie from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import farmGif from "../assets/images/farm.json";
import flowerGif from "../assets/images/flower.json";
import { apiRequest } from "./services/apiRequest";

interface BaseCrop {
  id: number;
  name: string;
  category: string;
}

interface Crop {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  quantity: number;
  available: boolean;
  farmId?: number;
  plantedDate?: string;
  estimatedHarvestDate?: string;
  actualHarvestDate?: string;
  notes?: string;
  status?: string;
  cropId: number;
}

const AllCropsShowcase = () => {
  const [cropsData, setCropsData] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [allCrops, setAllCrops] = useState<BaseCrop[]>([]);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedCropToSend, setSelectedCropToSend] = useState<Crop | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plantedFarms = await apiRequest("/planted-crops/by-farmer", "GET");
        const cropsList = await apiRequest("/crops", "GET");
        setAllCrops(cropsList);
        
        const merged = plantedFarms.flatMap((farm: any) =>
          farm.plantedCrops.map((planted: any) => {
            const cropDetails = cropsList.find((c: BaseCrop) => c.id === planted.cropId);
            return {
              ...planted,
              farmId: farm.farmId,
              name: cropDetails?.name || "Unknown",
              category: cropDetails?.category || "Uncategorized",
              imageUrl: planted.imageUrl || "https://via.placeholder.com/150",
            };
          })
        );

        setCropsData(merged);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCrops = cropsData.filter((crop) => {
const matchesSearch = (crop.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? crop.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleQuantityUpdate = async (newQuantity: number, cropId: number) => {
    try {
      const updatedCrops = cropsData.map(crop => 
        crop.id === cropId ? { ...crop, quantity: newQuantity } : crop
      );
      setCropsData(updatedCrops);
      
      await apiRequest(`/planted-crops/${cropId}`, "PUT", {
        quantity: newQuantity
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleSendToStore = async (data: {
  name: string;
  category: string;
  quantity: number;
  imageUrl: string;
  description: string;
  plantedCropId: number;
  price: number;
  unit: string;
}) => {
  try {
    await apiRequest("/products", "POST", {
      ...data,
      available: true,
    });
    

    Alert.alert("Success", "Crop sent to store successfully!");

    const currentCrop = cropsData.find(c => c.id === data.plantedCropId);
    const newQuantity = (currentCrop?.quantity || 0) - data.quantity;
    if (data.quantity > (currentCrop?.quantity || 0)) {
  Alert.alert("Error", "Not enough quantity to send!");
  return;
}


    await handleQuantityUpdate(newQuantity, data.plantedCropId);
  } catch (err) {
    console.error("Error sending to store:", err);
  }
};

  const handleUpdateCrop = async (updatedCrop: Crop) => {
    try {
      const response = await apiRequest(`/planted-crops/${updatedCrop.id}`, "PUT", updatedCrop);
      
      setCropsData(prev =>
        prev.map(crop => crop.id === updatedCrop.id ? response : crop)
      );
      
      setIsModalVisible(false);
    } catch (err) {
      console.error("Error updating crop:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiRequest(`/planted-crops/${id}`, "DELETE");
      setCropsData(prev => prev.filter(crop => crop.id !== id));
    } catch (err) {
      console.error("Error deleting crop:", err);
    }
  };

  const renderItem = ({ item }: { item: Crop }) => (
    <CropCard
      id={item.id}
      imageSrc={item.imageUrl}
      title={item.name}
      quantity={item.quantity}
      plantedDate={item.plantedDate}
      estimatedHarvestDate={item.estimatedHarvestDate}
      actualHarvestDate={item.actualHarvestDate}
      notes={item.notes}
      status={item.status}
      available={item.available}
      cropId={item.cropId}
      category={item.category}
      onDelete={handleDelete}
      onEdit={() => {
        setSelectedCrop(item);
        setIsModalVisible(true);
      }}
      onSendToStore={() => {
        setSelectedCropToSend(item);
        setIsSendModalOpen(true);
      }}
    />
  );

 return (
  <SafeAreaView style={styles.container}>
    <View style={styles.mainContent}>
      {loading ? (
        <ActivityIndicator size="large" color="#2F855A" />
      ) : (
        <FlatList
          data={filteredCrops}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={1}
          contentContainerStyle={styles.gridContainer}
          ListHeaderComponent={
            <View style={styles.lottieContainer}>
              <Lottie
                source={farmGif}
                autoPlay
                loop
                style={styles.farmAnimation}

              />
            </View>
          }
        />
      )}

      <View style={styles.bottomAnimation}>
        <Lottie source={flowerGif} autoPlay loop style={styles.flowerAnimation} />
      </View>

      <CropModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        selectedCrop={selectedCrop}
        onSave={handleUpdateCrop}
        allCrops={allCrops}
      />

      <SendToStoreModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        crop={selectedCropToSend}
        onSend={handleSendToStore}
        onQuantityUpdate={handleQuantityUpdate}
      />
    </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  lottieContainer: {
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  farmAnimation: {
    width: 400,
    height:80,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  bottomAnimation: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 150,
    height: 100,
  },
  flowerAnimation: {
    width: "100%",
    height: "100%",
  },
});

export default AllCropsShowcase;
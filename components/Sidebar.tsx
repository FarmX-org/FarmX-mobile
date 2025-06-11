import { DrawerContentScrollView } from '@react-navigation/drawer';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SidebarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  resetFilters: () => void;
}

const categories = [
  { label: 'Vegetables', icon: require('../assets/images/vegetable1.png') },
  { label: 'Fruits', icon: require('../assets/images/fruit.png') },
  { label: 'Grains', icon: require('../assets/images/rice.png') },
  { label: 'Herbs', icon: require('../assets/images/rosemary.png') },
];

const Sidebar: React.FC<SidebarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  resetFilters,
}) => {
  return (
    <DrawerContentScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/images/farmerr.png')} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Search"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <TouchableOpacity style={styles.button} onPress={resetFilters}>
        <Text style={styles.buttonText}>View All</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Categories</Text>

      <View style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.label}
            style={[
              styles.categoryButton,
              selectedCategory === cat.label && styles.categorySelected,
            ]}
            onPress={() => setSelectedCategory(cat.label)}
          >
            <Image source={cat.icon} style={styles.icon} />
            <Text style={styles.catLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </DrawerContentScrollView>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  heading: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  categoryButton: {
    width: '30%',
    margin: '1.5%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  categorySelected: {
    backgroundColor: '#cce5cc',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  catLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

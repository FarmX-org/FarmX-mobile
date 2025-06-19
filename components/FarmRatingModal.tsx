import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { apiRequest } from '../app/services/apiRequest';

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  productName?: string | null;
}

interface FarmRatingModalProps {
  isVisible: boolean;
  onClose: () => void;
  farmId: number;
  farmName: string;
}

const FarmRatingModal = ({ isVisible, onClose, farmId, farmName }: FarmRatingModalProps) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isVisible && farmId) {
      setLoading(true);
      apiRequest(`/feedback/farmer`)
        .then((allFeedbacks) => {
          const farmFeedbacks = allFeedbacks.filter((f: any) => f.farmId === farmId);
          setFeedbacks(farmFeedbacks);
        })
        .catch(() => setFeedbacks([]))
        .finally(() => setLoading(false));
    }
  }, [isVisible, farmId]);

  const farmFeedbacks = feedbacks.filter((fb) => !fb.productName);
  const productFeedbacks = feedbacks.filter((fb) => fb.productName);

  const renderStars = (count: number) => (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon
          key={i}
          name="star"
          type="font-awesome"
          size={20}
          color={i <= count ? '#FFD700' : '#ccc'}
        />
      ))}
    </View>
  );

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>🌟 Feedback for {farmName}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : feedbacks.length === 0 ? (
          <Text style={styles.empty}>No feedback available yet.</Text>
        ) : (
          <ScrollView style={styles.scroll}>
            {/* Farm Feedback */}
{farmFeedbacks.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>🏡 Farm Feedback</Text>
   {farmFeedbacks.map((fb, index) => {
  const key = fb.id ? `farm-${fb.id}` : `farm-${index}`;
  return (
    <View key={key} style={styles.card}>
      {renderStars(fb.rating)}
      <Text style={styles.comment}>{fb.comment}</Text>
    </View>
  );
})}

  </View>
)}

{/* Product Feedback */}
{productFeedbacks.length > 0 && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>🛒 Product Feedback</Text>
    {productFeedbacks.map((fb, index) => {
  const key = fb.id ? `product-${fb.id}` : `product-${index}`;
  return (
    <View key={key} style={styles.card}>
      <Text style={styles.productName}>Product: {fb.productName || 'Unnamed Product'}</Text>
      {renderStars(fb.rating)}
      <Text style={styles.comment}>{fb.comment}</Text>
    </View>
  );
})}

  </View>
)}

          </ScrollView>
        )}

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default FarmRatingModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    maxHeight: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  scroll: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  starRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  comment: {
    marginTop: 4,
    color: '#333',
  },
  productName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  closeButton: {
    backgroundColor: '#FFD700',
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeText: {
    fontWeight: '600',
    color: '#000',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
  },
});

import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, Chip } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface CropCardProps {
  id: number;
  imageSrc: string;
  title: string;
  quantity?: number;
  plantedDate?: string;
  estimatedHarvestDate?: string;
  actualHarvestDate?: string;
  notes?: string;
  status?: string;
  cropId?: number;
  available: boolean;
  category?: string;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  onSendToStore?: (data: {
    name: string;
    category: string;
    quantity: number;
    imageUrl: string;
    description: string;
    plantedCropId: number;
  }) => void;
}

export const CropCard: React.FC<CropCardProps> = ({
  id,
  imageSrc,
  title,
  quantity,
  plantedDate,
  estimatedHarvestDate,
  actualHarvestDate,
  notes,
  status,
  cropId,
  available,
  category,
  onDelete,
  onEdit,
  onSendToStore,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const formattedDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : 'N/A';

  const handleSend = () => {
    if (!onSendToStore || cropId === undefined) return;
    const payload = {
      name: title,
      category: category || 'General',
      quantity: quantity || 0,
      imageUrl: imageSrc,
      description: notes || 'No description',
      plantedCropId: id,
    };
    onSendToStore(payload);
  };

 return (
  <Pressable onPress={handleFlip}>
    <View style={styles.container}>
      {/* Front Side */}
      <MotiView
        style={[styles.card, styles.frontCard]}
        from={{ rotateY: isFlipped ? '0deg' : '180deg' }}
        animate={{ rotateY: isFlipped ? '180deg' : '0deg' }}
        transition={{ type: 'timing', duration: 400 }}
      >
        <Chip
          style={[
            styles.badge,
            { backgroundColor: available ? 'green' : 'red' },
          ]}
          textStyle={{ color: 'white' }}
        >
          {available ? 'Available' : 'Unavailable'}
        </Chip>
        <Image source={{ uri: imageSrc }} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
      </MotiView>

      {/* Back Side */}
      <MotiView
        style={[styles.card, styles.backCard]}
        from={{ rotateY: isFlipped ? '180deg' : '0deg' }}
        animate={{ rotateY: isFlipped ? '0deg' : '180deg' }}
        transition={{ type: 'timing', duration: 400 }}
      >
        <Text style={styles.label}>Status: {status}</Text>
        <Text style={styles.label}>Quantity: {quantity} units</Text>
        <Text style={styles.label}>Planted: {formattedDate(plantedDate)}</Text>
        <Text style={styles.label}>Estimated: {formattedDate(estimatedHarvestDate)}</Text>
        <Text style={styles.label}>Harvested: {formattedDate(actualHarvestDate)}</Text>
        {notes && <Text style={styles.label}>Notes: {notes}</Text>}

        <View style={styles.actions}>
          <Button icon="delete" mode="text" textColor="red" onPress={() => onDelete?.(id)}>
            Delete
          </Button>
          <Button icon="pencil" mode="text" onPress={() => onEdit?.(id)}>
            Edit
          </Button>
          {available && (
            <Button icon="truck" mode="text" onPress={handleSend}>
              Send
            </Button>
          )}
        </View>
      </MotiView>
    </View>
  </Pressable>
);

};

const CARD_WIDTH = width / 2 - 24;

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: 340,
    marginVertical: 16,
    marginHorizontal: 8,
    transform: [{ perspective: 1000 }],
  },
  cardFace: {
    flex: 1,
    position: 'relative',
  },
  card: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  padding: 12,
  backfaceVisibility: 'hidden',
},

  showFace: {
    zIndex: 1,
  },
  frontCard: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  backCard: {
    backgroundColor: '#f0fdf4',
    justifyContent: 'space-between',
  },
  image: {
    height: 180,
    width: '100%',
    borderRadius: 12,
  },
  badge: {
    marginBottom: 8,
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F855A',
    marginTop: 8,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
    textAlign: 'left',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

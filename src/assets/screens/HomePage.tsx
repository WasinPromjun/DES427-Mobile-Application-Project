import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get, orderByKey, query, limitToLast } from 'firebase/database';
import { auth } from '../config/firebaseConfig';
import styles from '../styles/styles';
import { FontAwesome } from '@expo/vector-icons';

interface imageDataType {
  data: string;
  timestamp: string;
}

const HomeScreen: React.FC = () => {
  const [images, setImages] = useState<imageDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserImages();
  }, []);

  const fetchUserImages = async () => {
    setIsLoading(true);
    const database = getDatabase();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No current user found");
      setIsLoading(false);
      return;
    }

    const imagesRef = ref(database, `database/${currentUser.uid}/images`);

    try {
      const ImageQuery = query(imagesRef, orderByKey(), limitToLast(3));
      const imagesSnapshot = await get(ImageQuery);

      if (imagesSnapshot.exists()) {
        const imagesData = Object.values(imagesSnapshot.val()) as imageDataType[];
        setImages(imagesData);
      } else {
        console.log("No images found for the user.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchUserImages}>
        <FontAwesome name="refresh" size={24} color="white" />
        <Text style={styles.searchButtonText}>Refresh</Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          {images.length > 0 ? (
            [...images].reverse().map((image, index) => ( //[...images] create copy to prevent modify
              <Image
                key={index}
                source={{ uri: image.data }}
                style={[styles.image, { backgroundColor: 'red', borderWidth: 1 }]}
                onError={(e) => console.error("Error loading image:", e.nativeEvent.error)}
              />
            ))
          ) : (
            <Text>No images uploaded yet.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;

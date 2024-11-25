import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getDatabase, ref, get, query, orderByKey, limitToLast } from 'firebase/database';
import { auth } from '../config/firebaseConfig';
import styles from '../styles/styles';
import { FontAwesome } from '@expo/vector-icons';

interface ImageDataType {
  data: string; // Base64
  timestamp: string;
}

const FeedPage: React.FC = () => {
  const [feedImages, setFeedImages] = useState<ImageDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []); //set state to defualt

  const fetchFeed = async () => {
    setIsLoading(true);
    setFeedImages([]); // Clear the feedImages state to reset the feed

    const database = getDatabase();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error('No current user found');
      setIsLoading(false);
      return;
    }

    const followsRef = ref(database, `database/${currentUser.uid}/follows`);
    const followsSnapshot = await get(followsRef);

    if (followsSnapshot.exists()) {
      const followedHandles = Object.keys(followsSnapshot.val());

      try {
        const images = await Promise.all(
          followedHandles.map(async (handle) => {
            console.log('Fetching images for user:', handle);
            const imagesRef = ref(database, `database/${handle}/images`);
            const imageQuery = query(imagesRef, orderByKey(), limitToLast(3));
            const imagesSnapshot = await get(imageQuery);

            if (imagesSnapshot.exists()) {
              return Object.values(imagesSnapshot.val()) as ImageDataType[];
            } else {
              console.log(`No images found for user: ${handle}`);
              return [];
            }
          })
        );

        const allImages = images
          .flat()
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setFeedImages(allImages);
      } catch (error) {
        console.error('Error fetching feed images:', error);
      }
    } else {
      console.log('No followed users found.');
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchFeed}>
        <FontAwesome name="refresh" size={24} color="white" />
        <Text style={styles.searchButtonText}>Refresh</Text>
      </TouchableOpacity>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : feedImages.length > 0 ? (
        <ScrollView>
          {feedImages.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.data }}
              style={styles.feedImage}
              onError={(e) => console.error('Error loading image:', e.nativeEvent.error)}
            />
          ))}
        </ScrollView>
      ) : (
        <Text>No images in your feed</Text>
      )}
    </View>
  );
};

export default FeedPage;

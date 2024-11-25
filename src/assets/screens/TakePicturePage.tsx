import React, { useState } from 'react';
import { View, Button, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getDatabase, ref as dbRef, set } from 'firebase/database';
import { auth } from '../config/firebaseConfig';
import styles from '../styles/styles';

const TakePictureScreen: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchCameraAsync({
        base64: true, // This ensures the captured image includes a base64 representation
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
  
        // Convert image to Base64
        try {
          const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
  
          const base64Image = `data:image/jpeg;base64,${imageBase64}`; // Add the data URI prefix
          setImage(base64Image); // Store the base64 image in state or upload it directly
  
          console.log("Base64 Image Ready:", base64Image);
        } catch (error) {
          console.error("Error converting image to Base64:", error);
          alert("Failed to process image. Please try again.");
        }
      }
    } else {
      alert("Camera permission is required to take a photo.");
    }
  };

  const uploadPhoto = async () => {
    if (!image) {
      alert("No image selected to upload.");
      return;
    }
  
    setIsUploading(true); // Start loading indicator
    try {
      const db = getDatabase();
      const currentUser = auth.currentUser;
      

      // Generate timestamp and unique image key
      const timestamp = new Date().toISOString();
      const newImageKey = timestamp.replace(/\./g, '_'); // Replace '.' with '_' to make it a valid key


      // Create database reference for the new image
      const newImageRef = dbRef(db, `database/${currentUser.uid}/images/${newImageKey}`);
  
      // Create the image data payload
      const imageData = {
        data: image, // Assuming 'image' is in Base64 format
        timestamp: timestamp,
      };
  
      await set(newImageRef, imageData);// Store image data into Realtime Database
      
      alert("Image uploaded successfully!"); // Notify success
      setImage(null); // Clear the image after successful upload
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false); // Stop loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Take a Photo" onPress={takePhoto} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && !isUploading && <Button title="Upload Photo" onPress={uploadPhoto} />}
      {isUploading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default TakePictureScreen;
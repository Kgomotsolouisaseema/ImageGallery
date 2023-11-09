// Import necessary components and libraries
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as SQLite from 'expo-sqlite';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

// Define the CameraWindow component
export default function CameraWindow() {
  // Ref to the camera component
  let cameraRef = useRef();

  // State variables for camera and media permissions, and captured photo
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaPermission, setHasMediaPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  // Initialize SQLite database
  const database = SQLite.openDatabase('myImagesDatabase.db');

  useEffect(()=>{
    createImageGalleryTable();
  },[])

  // Function to create 'imageGallery' table in the SQLite database
  const createImageGalleryTable = () => {
    database.transaction((transaction) => {
      transaction.executeSql(
        'CREATE TABLE IF NOT EXISTS imageGallery (id INTEGER PRIMARY KEY AUTOINCREMENT, image TEXT, data TEXT)'
      );
    },
    // Error callback
    (error) => {
      console.log("Error creating table: ", error);
    },
    // Success callback
    (transactionObj, success) => {
      console.log("Table created successfully: ", success);
    });
  };

  // Function to save captured image URI into the database
  const saveImageToDatabase = () => {
    const imageURI = capturedPhoto.uri;
    database.transaction((transaction) => {
      transaction.executeSql(
        'INSERT INTO imageGallery (image, data) VALUES (?, ?)',
        [imageURI, "Data"],
        // Success callback
        (_, result) => {
          console.log("Image added to database successfully");
        },
        // Error callback
        (_, error) => {
          console.log("Error adding image to database: ", error);
        }
      );
    });
  };

  // UseEffect to request camera and media permissions when component mounts
  useEffect(() => {
    (async () => {
      // Request camera permissions
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');
      
      // Request media library permissions
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPermission(mediaStatus === 'granted');
    })();
  }, []);

  // Check camera permission status and render appropriate message or camera preview
  if (hasCameraPermission === null) {
    return <Text>Requesting Camera Permissions...</Text>;
  } else if (hasCameraPermission === false) {
    return <Text>Camera permissions have been denied. Please grant permissions to use the camera.</Text>;
  }

  // Function to capture a picture using the camera
  let capturePicture = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPicture = await cameraRef.current.takePictureAsync(options);
    setCapturedPhoto(newPicture);
  };

  // Check if a photo has been captured and display appropriate UI
  if (capturedPhoto) {
    // Function to share the captured image
    let shareCapturedPicture = () => {
      shareAsync(capturedPhoto.uri).then(() => {
        setCapturedPhoto(null);
      });
    };

    // Function to save the captured image to the device and database
    let saveCapturedPicture = () => {
      MediaLibrary.saveToLibraryAsync(capturedPhoto.uri).then(() => {
        setCapturedPhoto(null);
        saveImageToDatabase();
      });
    };

    // Render UI for captured photo
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + capturedPhoto.base64 }} />
        <View style={styles.buttonContainer}>
          {/* Share button */}
          <TouchableOpacity onPress={shareCapturedPicture}>
            <Entypo name="share" size={45} color="black" />
          </TouchableOpacity>
          {/* Save button */}
          {hasMediaPermission && (
            <TouchableOpacity onPress={saveCapturedPicture}>
              <MaterialIcons name="save-alt" size={45} color="black" />
            </TouchableOpacity>
          )}
          {/* Retake button */}
          <TouchableOpacity onPress={() => { setCapturedPhoto(null) }}>
            <MaterialCommunityIcons name="camera-retake-outline" size={45} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render camera preview and capture button
  return (
    <Camera style={styles.cameraContainer} ref={cameraRef}>
      <View style={styles.captureButtonContainer}>

        {/* Capture button */}
        <TouchableOpacity onPress={capturePicture}>
          <FontAwesome5 name="circle" size={60} color="black" />
        </TouchableOpacity>
      </View>
    </Camera>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f25607',  //ORANGE RED COLOUR
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#fff', //white
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    backgroundColor: '#f25607',//ORANGE RED COLOUR
    width: '100%',
  },
  captureButtonContainer: {
    marginBottom: 20,
  },
});

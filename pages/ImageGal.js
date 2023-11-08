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


import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as SQLite from 'expo-sqlite';
import { Feather, MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

// Define the CameraWidow component
 function ImageGal() {
  // Ref to the camera component
  let cameraRef = useRef();

  // State variables for camera and media permissions, and captured photo
  const [cameraPermission, setCameraPermission] = useState();
  const [mediaPermission, setMediaPermission] = useState();
  const [photo, setPhoto] = useState();

  // Initialize SQLite database
  const database = SQLite.openDatabase('myImageDatabase.db');

  // Function to create 'imageGallery' table in the SQLite database
  const createTable = () => {
    database.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS imageGallery (id INTEGER PRIMARY KEY AUTOINCREMENT, image TEXT, data TEXT)'
      );
    },
    // Error callback
    (error) => {
      console.log("error creating table", error);
    },
    // Success callback
    (txObj, success) => {
      console.log("Created ", success);
    });
  };

  // Function to save captured image URI into the database
  const saveImage = () => {
    const imageURI = photo.uri;
    database.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO imageGallery (image, data) values(?, ?)',
        [imageURI, "Data"],
        // Success callback
        (txObj, success) => {
          console.log("Added");
        },
        // Error callback
        (txObj, error) => {
          console.log("Error", error);
        }
      );
    });
  };

  // UseEffect to request camera and media permissions when component mounts
  useEffect(() => {
    (async () => {
      // Request camera permissions
      const hasCameraPermission = await Camera.requestCameraPermissionsAsync()
      // Request media library permissions
      const hasMediaPermission = await MediaLibrary.requestPermissionsAsync();
      // Set camera and media permissions state
      setCameraPermission(hasCameraPermission.status === 'granted');
      setMediaPermission(hasMediaPermission.status === 'granted');
    })();
  }, []);

  // UseEffect to create 'imageGallery' table in the SQLite database when component mounts
  useEffect(() => {
    // Call the function to create the table
    createTable();
    // Query the database to retrieve data from the 'imageGallery' table
    database.transaction((tx) => {
      tx.executeSql('SELECT * FROM imageGallery', null,
        // Success callback
        (txObj, results) => {
          console.log('res', results.rows._array);
        },
        // Error callback
        (txObj, error) => {
          console.log(error);
        }
      );
    });
  }, []);

  // Check camera permission status and render appropriate message or camera preview
  if (cameraPermission === undefined) {
    return <Text>Loading...</Text>;
  } else if (!cameraPermission) {
    return <Text>Permissions have been denied. Please grant permissions in order to use the camera.</Text>;
  }

  // Function to capture a picture using the camera
  let takePicture = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPicture = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPicture);
  };

  // Check if a photo has been captured and display appropriate UI
  if (photo) {
    // Function to share the captured image
    let sharePicture = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    // Function to save the captured image to the device and database
    let savePicture = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
        saveImage();
      });
    };

    // Render UI for captured photo
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} padding={10} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        <View style={styles.lowContainer}>
          <View style={styles.buttonContainer}>
            {/* Share button */}
            <Entypo name="share" size={40} color="#fff" onPress={sharePicture} />
          </View>
          <View style={styles.buttonContainer}>
            {/* Save button */}
            {mediaPermission ? <MaterialIcons name="save-alt" size={40} color="#fff" onPress={savePicture} /> : undefined}
          </View>
          <View style={styles.buttonContainer}>
            {/* Retake button */}
            <MaterialCommunityIcons name="camera-retake-outline" size={40} color="#fff" onPress={() => { setPhoto(undefined) }} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Render camera preview and capture button
  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.TopContainer}>
        <TouchableOpacity>
          {/* Capture button */}
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={takePicture}>
          {/* Capture button */}
          <Feather name="circle" size={60} color="white" />
        </TouchableOpacity>
      </View>
    </Camera>
  );
}

// Styles for the component

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF6F5',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        alignSelf: "stretch",
    
    },

    TopContainer: {
        flex: 1,
        // height: '60%',
        top: 45,
        // backgroundColor: 'orange',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    bottomContainer: {
        flex: 1,
        top: 80,
        width: '100%',
        height: 100,
        // backgroundColor: 'purple',
        alignItems: 'center',
        justifyContent: 'center',

    },
    preview: {
        alignSelf: "stretch",
        flex: 1,
        width: '100%',
        padding: 10,

    },
    buttonContainer: {
        flex: 1,
        backgroundColor:"#7b9acc",
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
       
    },
    lowContainer: {
        flex: 0.1,
        flexDirection: 'row',


    },
});

export default ImageGal ;

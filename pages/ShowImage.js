import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
// import { MaterialIcons } from '@expo/vector-icons'; 
import * as SQLite from "expo-sqlite";

// import ImageGallery from "./ImageGalleria";
import ImageGalleria from "./ImageGalleria";


export default function ShowImage() {
  const database = SQLite.openDatabase("myImageStore.db");

  const navigation = useNavigation();
  const route = useRoute();
  const { value } = route.params;
  console.log("value",value)

  useEffect(() => {
    console.log(value);
  }, []);

  function deleteImage(id) {
    console.log(id);
    database.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM imageObject WHERE id = ? ",
        [id],
        (txObj, res) => {
          navigation.navigate("Image Galleria", ImageGalleria);
        },
        (txObj, error) => {
          console.log(error);
        }
      );
    });
  }

  return (
    <View style={styles.container}>
     
      <Image
        source={{ uri: value.image }}
        style={{ height: "85%", width: "100%" }}
      />

       <View style={styles.lowContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Image Gallery", ImageGalleria)}
            style={{ width: "47%", margin: 2 }}
          >
            <Ionicons
              style={{
                alignContent: "center",
                paddingTop: 20,
                position: "relative",
              }}
              name="chevron-back-circle-outline"
              size={55}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => deleteImage(value.id)}>
            <MaterialIcons
              style={{ alignContent: "flex-end", paddingTop: 20 }}
              name="delete-forever"
              size={55}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FCF6F5',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
  buttonContainer: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  },
  lowContainer: {
    flexDirection: "row",
    backgroundColor: "white"
  },
});

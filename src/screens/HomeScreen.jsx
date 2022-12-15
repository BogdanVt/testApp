import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, FlatList } from "react-native";
import axios from "axios";
import Snackbar from "react-native-snackbar";
import { CommentsModal } from "../components/CommentsModal";
import Modal from "react-native-modal";
import {useNetInfo} from "@react-native-community/netinfo";
// import { Dirs, FileSystem } from 'react-native-file-access';


export const HomeScreen = ({ navigation }) => {
  const netInfo = useNetInfo();

  const [posts, setPosts] = useState();
  const [comments, setComments] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const getPosts = () => {
    Snackbar.dismiss();
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => setPosts(response.data))
      .catch(() => Snackbar.show({
        text: "Сталась помилка",
        duration: Snackbar.LENGTH_INDEFINITE,
        action: {
          text: "Повторити запит",
          textColor: "green",
          onPress: () => {
            getPosts();
          },
        },
      }));
  };

  const getComments = (postId) => {
    Snackbar.dismiss();
    axios
      .get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
      .then((response) => setComments(response.data))
      .catch(() => {
        setModalVisible(false)
        Snackbar.show({
          text: "Помилка загрузки коментарів",
          duration: Snackbar.LENGTH_LONG,
        });

      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleSelect = (id) => {
    getComments(id);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false)
    setComments('')
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.postItem}
        onPress={() => handleSelect(item.id)}>
        <Text style={{ fontWeight: "700" }}>{item.title}</Text>
        <Text style={{ marginTop: 15 }}>{item.body}</Text>
      </TouchableOpacity>);
  };


  return (
    <SafeAreaView style={{ backgroundColor: "#338beb" }}>

      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{paddingHorizontal:5}}>
            {netInfo.isConnected
              ?(<Text style={{color:"#2d3d23"}}>{`Є підключення до ${netInfo.type}`}</Text>)
              :(<Text style={{color:"red"}}>нема підключення до інтернету</Text>)}
          </View>
          <TouchableOpacity
            style={styles.btnBack}
            onPress={navigation.goBack}
          >
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>

        {!posts
          ? (<View style={styles.loadingText}>
            <Text style={{ color: "white", fontSize: 20 }}>LOADING...</Text>
          </View>)
          : (
            <View style={styles.postItemContainer}>
              <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
            </View>
          )}

        <Modal
          animationIn={'zoomIn'}
          isVisible={modalVisible}
          backdropOpacity={0.7}
          animationInTiming={1000}
          animationOutTiming={1000}
          onBackdropPress={ handleCloseModal}
        >
          <View style={styles.modal}
          >
            <CommentsModal comments={comments} />
          </View>
        </Modal>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  header: {
    width: "100%",
    height: 30,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom:5
  },
  btnBack: {
    width: "20%",
    height: 30,
    backgroundColor: "#e94f17",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  loadingText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  postItemContainer: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  postItem: {
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#b9cbcb",
    marginVertical: 10,
    borderRadius: 15,
  },
  modal: {
    position: "absolute",
    width: "100%",
    height: "50%",
    zIndex: 111,
    bottom: 100,
    justifyContent: "center",
    backgroundColor: "#bdcf95",
    borderRadius: 25,
    padding: 10,
  },
});

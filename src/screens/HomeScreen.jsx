/* eslint-disable */
import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, FlatList } from "react-native";
import axios from "axios";
import Snackbar from "react-native-snackbar";
import { CommentsModal } from "../components/CommentsModal";
import Modal from "react-native-modal";
import { useNetInfo } from "@react-native-community/netinfo";
import { Dirs, FileSystem } from "react-native-file-access";
import * as NetInfo from "@react-native-community/netinfo";


export const HomeScreen = ({ navigation }) => {
  const netInfo = useNetInfo();

  const [internet, setInternet] = useState(netInfo);
  const [posts, setPosts] = useState();
  const [comments, setComments] = useState();
  const [modalVisible, setModalVisible] = useState(false);


  // загрузка постів з файла
  const readFile = async () => {
    await FileSystem.readFile(Dirs.CacheDir + "/test.json", "utf8")
      .then((res) => {
        setPosts(JSON.parse(res));
      })
      .catch(() => {
        console.log("read not complete");
        refreshLoad();
      });
  };

  // модальне вікно помилки загрузки з перезапуском
  const refreshLoad = () => {
    Snackbar.show({
      text: "Сталась помилка",
      duration: Snackbar.LENGTH_INDEFINITE,
      action: {
        text: "Повторити запит",
        textColor: "green",
        onPress: () => {
          getPosts();
        },
      },
    });
  };

  // оновлення статусу інтернета
  // бібліотека має баг на симуляторах ios. не оновлює статус при перемиканні wifi
  const refreshInternetStatus = () => {
    NetInfo.refresh().then(state => {
      setInternet(state);
    });
  };

  const getPosts = async () => {
    refreshInternetStatus();
    await axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
          setPosts(response.data);
          FileSystem.writeFile(Dirs.CacheDir + "/test.json", JSON.stringify(response.data), "utf8")
            .then(() => console.log("записано у файл"))
            .catch(() => console.log("не записано у файл"));
        },
      )
      .catch(() => {
        readFile()
          .then(() => console.log("запрос з файла"))
          .catch(() => {
            refreshLoad();
          });

      });
  };

  const getComments = async (postId) => {
    Snackbar.dismiss();
    await axios
      .get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
      .then((response) => setComments(response.data))
      .catch(() => {
        setModalVisible(false);
        Snackbar.show({
          text: "Помилка загрузки коментарів",
          duration: Snackbar.LENGTH_LONG,
        });

      });
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleSelectPost = (id) => {
    getComments(id);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setComments("");
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.postItem}
        onPress={() => handleSelectPost(item.id)}>
        <Text style={{ fontWeight: "700" }}>{item.title}</Text>
        <Text style={{ marginTop: 15 }}>{item.body}</Text>
      </TouchableOpacity>);
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#338beb" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ paddingHorizontal: 5 }}>
            {
              internet.isConnected
                ? (<Text style={{ color: "#2d3d23" }}>{`Є підключення до  ${internet.type}`}</Text>)
                : (<Text style={{ color: "red" }}>нема підключення до інтернету</Text>)
            }
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
          animationIn={"zoomIn"}
          isVisible={modalVisible}
          backdropOpacity={0.7}
          animationInTiming={1000}
          animationOutTiming={800}
          onBackdropPress={handleCloseModal}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  btnBack: {
    width: "20%",
    height: 30,
    backgroundColor: "#e94f17",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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
    backgroundColor: "#60a6bf",
    borderRadius: 25,
    padding: 10,
  },
});

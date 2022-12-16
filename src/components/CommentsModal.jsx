/* eslint-disable */
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export const CommentsModal = ({ comments }) => {

  return (
    <>
      {!comments ? (<View style={styles.loadingText}>
        <Text style={{ fontSize: 20 }}>Loading...</Text>
      </View>) : (
        <FlatList
          data={comments}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text>
                {item.body}
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    borderRadius: 15,
    backgroundColor: "#e1f0d8",
    marginVertical: 10,
    padding: 5,
  },
  loadingText: {
    justifyContent: "center",
    alignItems: "center",
  },

});

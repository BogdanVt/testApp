import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard, TextInput, SafeAreaView, TouchableOpacity,
} from "react-native";
import { useLinkTo } from "@react-navigation/native";


const fakeUsers=[
  {login:"user1@email.com", password:"111111"},
  {login:"user2@email.com", password:"222222"},
  {login:"user3@email.com", password:"333333"},
  {login:"user4@email.com", password:"444444"},
  {login:"user5@email.com", password:"555555"},
]


export const LoginScreen = ({ navigation }) => {
  const linkTo = useLinkTo();
  const [mail, setMail]= useState('user1@email.com');
  const [password, setPassword]= useState('111111');
  const [error, setError]= useState(false);


  const handleLogin = () => {
    const isValidLogin=fakeUsers.filter(item=> item.login === mail).filter(item=> item.password === password)
    if (isValidLogin.length > 0){
      linkTo({ screen: "Home" });
      setError(false);
    }else {
      setError(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
      >
        <SafeAreaView  style={{backgroundColor: "#338beb"}}>
          <View style={styles.container}>
            <View style={{height:20}}>
            {error &&
              <Text style={{color:"red", fontSize:16}}>
                Невірний логін або пароль
            </Text>
            }
            </View>
            <View style={styles.textInputWrapper}>
              <TextInput
                value={mail}
                onChangeText={(e) => setMail(e)}
                placeholder={"Email"}
                 style={{ fontSize: 18, flex:1 }}
              />
            </View>
            <View style={styles.textInputWrapper}>
              <TextInput
                value={password}
                onChangeText={(e) => setPassword(e)}
                secureTextEntry
                placeholder={"Пароль"}
                style={{ fontSize: 18, flex:1 }}
              />
            </View>
          <View style={styles.btnContainer}>
          {(mail && password) && (

          <TouchableOpacity
            onPress={() => {
              handleLogin();
            }}
            style={styles.btn}
          >
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                }}
              >
                Login
              </Text>
            </View>
          </TouchableOpacity>)}
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width:"100%",
    height:"100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

  },
  textInputWrapper: {
    marginTop: 16,
    width: "90%",
    marginHorizontal: 16,
    backgroundColor: "#dbe8f6",
    borderRadius: 12,
    height: 60,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  btn: {
    borderRadius: 30,
    width: "40%",
    paddingVertical: 5,
    minHeight: 48,
    backgroundColor:"#34d567" ,
    alignItems: "center",
    justifyContent:"center"
  },
  btnContainer:{
    height: 48,
    width:"100%",
    justifyContent:"center",
    display:"flex",
    alignItems:"center",
    marginTop: 16,
  },
});

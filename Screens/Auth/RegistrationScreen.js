import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import * as ImagePicker from "expo-image-picker";

import { AntDesign } from "@expo/vector-icons";
import {
  StyleSheet,
  ImageBackground,
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { authSignUpUser } from "../../redux/auth/operations";

const initialState = {
  login: "",
  email: "",
  password: "",
  avatar: "",
};

export const RegistrationScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [state, setState] = useState(initialState);
  const [hasPermission, setHasPermission] = useState(null);
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const onSubmit = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    dispatch(authSignUpUser(state));
    setState(initialState);
  };

  const onPress = () => setIsShowPassword(!isShowPassword);

  useEffect(() => {
    const statusSetter = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to gallery access was denied");
        return;
      }
      setHasPermission(status === "granted");
    };
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    const userImgUri = result.assets[0].uri;

    if (!result.canceled) {
      setImage(userImgUri);
      setState((prevState) => ({ ...prevState, avatar: userImgUri }));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.img}
          source={require("../../assets/images/BG.jpg")}
        >
          <KeyboardAvoidingView
            style={styles.wrapper}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View
              style={{
                ...styles.registerWrapper,
                marginBottom: isShowKeyboard ? -140 : 0,
              }}
            >
              <View
                style={[
                  styles.userImg,
                  {
                    transform: [{ translateX: -60 }],
                  },
                ]}
              >
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </View>
              <TouchableOpacity
                style={[
                  styles.addPhotoBtn,
                  {
                    transform: [{ translateX: 48 }],
                  },
                ]}
                activeOpacity={0.8}
                onPress={pickImage}
              >
                <AntDesign name="pluscircleo" size={25} color="#ff6c00" />
              </TouchableOpacity>

              <Text style={styles.registerTittle}>Регистрация</Text>
              <View style={styles.form}>
                <TextInput
                  style={{
                    ...styles.input,
                    marginBottom: 16,
                    backgroundColor: state.login ? "#fff" : "#f6f6f6",
                    borderColor: state.login ? "#ff6c00" : "#e8e8e8",
                  }}
                  placeholder="Логин"
                  placeholderTextColor="#bdbdbd"
                  value={state.login}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                  }}
                  onChangeText={(value) => {
                    setState((prevState) => ({ ...prevState, login: value }));
                  }}
                ></TextInput>
                <TextInput
                  style={{
                    ...styles.input,
                    marginBottom: 16,
                    backgroundColor: state.email ? "#fff" : "#f6f6f6",
                    borderColor: state.email ? "#ff6c00" : "#e8e8e8",
                  }}
                  placeholder="Адрес электронной почты"
                  placeholderTextColor="#bdbdbd"
                  value={state.email}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                  }}
                  onChangeText={(value) => {
                    setState((prevState) => ({
                      ...prevState,
                      email: value,
                    }));
                  }}
                ></TextInput>
                <View style={{ position: "relative" }}>
                  <TextInput
                    style={{
                      ...styles.input,
                      backgroundColor: state.password ? "#fff" : "#f6f6f6",
                      borderColor: state.password ? "#ff6c00" : "#e8e8e8",
                    }}
                    placeholder="Пароль"
                    placeholderTextColor="#bdbdbd"
                    secureTextEntry={!isShowPassword}
                    value={state.password}
                    onFocus={() => {
                      setIsShowKeyboard(true);
                    }}
                    onChangeText={(value) => {
                      setState((prevState) => ({
                        ...prevState,
                        password: value,
                      }));
                    }}
                  ></TextInput>
                  <Text
                    style={{
                      ...styles.showPaswordTxt,
                      transform: [{ translateY: -10 }],
                    }}
                    onPress={onPress}
                  >
                    {!isShowPassword ? "Показать" : "Скрыть"}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{ ...styles.button, marginTop: 43 }}
                  onPress={onSubmit}
                >
                  <Text style={styles.btnTxt}>Зарегистрироваться</Text>
                </TouchableOpacity>
                <View style={styles.registerTxtWrapper}>
                  <Text style={styles.registerTxt}>Уже есть аккаунт?</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.registerTxt}> Войти</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  img: {
    flex: 1,
    resizeMode: "cover",
  },

  wrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },

  registerWrapper: {
    position: "relative",
    paddingTop: 92,
    paddingBottom: 45,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#fff",
  },

  userImg: {
    position: "absolute",
    top: -60,
    left: "50%",
    width: 120,
    height: 120,
    backgroundColor: "#f6f6f6",
    borderRadius: 16,
  },

  addPhotoBtn: {
    position: "absolute",
    top: 21,
    left: "50%",
  },

  registerTittle: {
    fontFamily: "Roboto-Medium",
    paddingBottom: 32,
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
    color: "#212121",
  },

  form: { paddingHorizontal: 16 },

  input: {
    fontFamily: "Roboto-Regular",
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 19,
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    color: "#212121",
  },

  showPaswordTxt: {
    position: "absolute",
    fontFamily: "Roboto-Regular",
    right: 16,
    top: "50%",
    fontSize: 16,
    lineHeight: 19,
    color: "#1b4371",
  },

  text: {
    color: "#000",
    fontSize: 18,
  },

  button: {
    height: 51,
    backgroundColor: "#ff6c00",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  btnTxt: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#fff",
  },

  registerTxtWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  registerTxt: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#1b4371",
  },
});

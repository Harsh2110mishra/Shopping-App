import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";

import { useDispatch } from "react-redux";

import * as authActions from "../store/actions/Auth";
import Colors from "../constants/Colors";

const StartingScreen = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        props.navigation.navigate("Auth");
        return;
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirtationDate = new Date(expiryDate);
      console.log(userId);

      if (expirtationDate <= new Date() || !token || !userId) {
        props.navigation.navigate("Auth");
        return;
      }
      const expirationTime = expirtationDate.getTime() - new Date().getTime();
      props.navigation.navigate("Shop");
      dispatch(authActions.Authenticate(userId, token, expirationTime));
    };
    tryLogin();
  }, [dispatch]);
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartingScreen;

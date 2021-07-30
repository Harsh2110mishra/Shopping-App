import React, { useState, useReducer, useEffect, useCallback } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/Auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedIsFormValid = true;
    for (const key in updatedIsFormValid) {
      updatedIsFormValid = updatedIsFormValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedIsFormValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AuthenticationScreen = (props) => {
  const [Isloading, setIsloading] = useState(false);
  const [error, setError] = useState();
  const [IsSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  const authHandler = async () => {
    let action;
    if (IsSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsloading(true);
    try {
      await dispatch(action);
      props.navigation.navigate("Shop");
    } catch (error) {
      setError(error.message);
      setIsloading(false);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred ", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValues, inputValidities) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValues,
        isValid: inputValidities,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );
  return (
    <KeyboardAvoidingView
      behaviour="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <Card style={styles.auth}>
        <ScrollView>
          <Input
            id="email"
            label="E-mail"
            keyboardType="email-address"
            required
            email
            autoCapitalize="none"
            warningText="Please enter valid Email Address"
            onInputChange={inputChangeHandler}
            intialValue=""
          />
          <Input
            id="password"
            label="Password"
            keyboardType="default"
            secureTextEntry
            required
            minLength={5}
            autoCapitalize="none"
            warningText="Please enter valid Password"
            onInputChange={inputChangeHandler}
            intialValue=""
          />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              {Isloading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
              ) : (
                <Button
                  title={IsSignup ? "Sign up" : "Login"}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.button}>
              <Button
                title={`Switch to ${IsSignup ? "Login" : "Sign Up"}`}
                color={Colors.secondary}
                onPress={() => {
                  setIsSignup((prevState) => !prevState);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </Card>
    </KeyboardAvoidingView>
  );
};

AuthenticationScreen.navigationOptions = {
  headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  auth: {
    width: "80%",
    maxWidth: 400,
    maxWidth: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    margin: 5,
  },
});

export default AuthenticationScreen;

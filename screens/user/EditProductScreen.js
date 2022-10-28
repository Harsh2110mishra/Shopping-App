import React, { useState, useCallback, useEffect, useReducer } from "react";
import {
  View,
  ScrollView,
  Platform,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../../components/UI/HeaderButton";
import * as productActions from "../../store/actions/products";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

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

const EditProductScreen = (props) => {
  const [Isloading, setIsloading] = useState(false);
  const [error, seterror] = useState();
  const dispatch = useDispatch();
  const prodId = props.navigation.getParam("productId");
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: "",
    },
    formIsValid: editedProduct ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred !", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong Input", "Please enter Valid Details! ", [
        {
          text: "Okay",
        },
      ]);
      return;
    }
    seterror(null);
    setIsloading(true);
    try {
      if (editedProduct) {
        await dispatch(
          productActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        );
      } else {
        await dispatch(
          productActions.createProduct(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl,
            Number(formState.inputValues.price)
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      seterror(err.message);
    }
    setIsloading(false);
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

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

  if (Isloading) {
    return (
      <View style={styles.loadingSpiner}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behaviour="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            warningText="Please Enter Valid Title!"
            onInputChange={inputChangeHandler}
            required
            intialValue={editedProduct ? editedProduct.title : ""}
            initiallyValid={!!editedProduct}
          />
          <Input
            id="imageUrl"
            label="Image URL"
            warningText="Please Enter Valid Image URL!"
            onInputChange={inputChangeHandler}
            required
            intialValue={editedProduct ? editedProduct.imageUrl : ""}
            initiallyValid={!!editedProduct}
          />
          {editedProduct ? null : (
            <Input
              id="price"
              label="Price"
              warningText="Please Enter Valid Price!"
              keyboardType="numeric"
              onInputChange={inputChangeHandler}
              required
              intialValue={editedProduct ? editedProduct.price : ""}
              initiallyValid={!!editedProduct}
              min={0.1}
            />
          )}
          <Input
            id="description"
            label="Description"
            warningText="Please Enter Valid Description!"
            multiline
            required
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            intialValue={editedProduct ? editedProduct.description : ""}
            initiallyValid={!!editedProduct}
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditProductScreen.navigationOptions = (navigationData) => {
  const submitFN = navigationData.navigation.getParam("submit");
  return {
    headerTitle: navigationData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFN}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  loadingSpiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
  },
});

export default EditProductScreen;

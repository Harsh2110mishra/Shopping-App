import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import ReduxThunk from "redux-thunk";

import NavigationContainer from "./navigation/NavigationContainer";

import productReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import orderReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/Auth";

const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  orders: orderReducer,
  Auth: authReducer,
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [loaded] = useFonts({
    openSans: require("./assets/fonts/OpenSans-Regular.ttf"),
    openSansBold: require("./assets/fonts/OpenSans-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}

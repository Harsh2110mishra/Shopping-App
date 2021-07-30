import PRODUCTS from "../../data/dummy-data";
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  SET_PRODUCT,
} from "../actions/products";

import Product from "../../models/Product";

const intialState = {
  availableProducts: [],
  userProducts: [],
};

export default (state = intialState, action) => {
  switch (action.type) {
    case SET_PRODUCT:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.pid
        ),
      };
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };
    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price
      );
      const updatedUserProduct = [...state.userProducts];
      updatedUserProduct[productIndex] = updatedProduct;
      const availableProductIndex = state.availableProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedAvailableProduct = [...state.availableProducts];
      updatedAvailableProduct[availableProductIndex] = updatedProduct;
      return {
        ...state,
        availableProducts: updatedAvailableProduct,
        userProducts: updatedUserProduct,
      };
  }
  return state;
};

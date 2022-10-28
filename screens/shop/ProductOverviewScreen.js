import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  View,
  Button,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cart";
import * as productActions from "../../store/actions/products";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

const ProductOverviewScreen = (props) => {
  const [IsLoading, setIsLoading] = useState(true);
  const [IsRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadedProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    dispatch(productActions.fetchProducts())
      .then(setIsLoading(false))
      .catch((err) => {
        setError(err.message);
      });
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadedProducts
    );
    return () => {
      willFocusSub.remove();
    };
  }, [loadedProducts]);

  useEffect(() => {
    loadedProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadedProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  const addToCartHandler = async (itemData) => {
    setIsLoading(true);
    await dispatch(cartActions.addToCart(itemData.item));
    setIsLoading(false);
  };

  if (error) {
    return (
      <View style={styles.loadingSpiner}>
        <Text>An Error occurred! </Text>
        <Button
          title="Try Again"
          onPress={loadedProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (IsLoading) {
    return (
      <View style={styles.loadingSpiner}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!IsLoading && products.length === 0) {
    return (
      <View style={styles.loadingSpiner}>
        <Text>No Product Found!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      onRefresh={loadedProducts}
      refreshing={IsRefreshing}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          {IsLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Button
              color={Colors.primary}
              title="To Cart"
              onPress={() => {
                addToCartHandler(itemData);
              }}
            />
          )}
        </ProductItem>
      )}
    />
  );
};

ProductOverviewScreen.navigationOptions = (navigationData) => {
  return {
    headerTitle: "All Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          color={Platform.OS === "android" ? Colors.primary : "white"}
          onPress={() => {
            navigationData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navigationData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  loadingSpiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
  },
});

export default ProductOverviewScreen;

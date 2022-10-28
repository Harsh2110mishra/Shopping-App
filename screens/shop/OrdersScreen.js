import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import * as orderActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";

const OrdersScreen = (props) => {
  const [IsLoading, setIsLoading] = useState(false);
  const [IsRefreshing, setIsRefreshing] = useState(false);
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch(orderActions.getOrders());
    setIsLoading(false);
  }, [dispatch]);

  if (IsLoading) {
    return (
      <View style={styles.loadingSpiner}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No Orders Found!...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  );
};

OrdersScreen.navigationOptions = (navigationData) => {
  return {
    headerTitle: "Your Orders",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navigationData.navigation.toggleDrawer();
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

export default OrdersScreen;

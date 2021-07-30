import React from "react";
import { Platform, View, SafeAreaView, Button } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import ProductOverviewScreen from "../screens/shop/ProductOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UserProductScreen from "../screens/user/UserProductScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthenticationScreen from "../screens/user/AuthenticationScreen";
import StartingScreen from "../screens/StartingScreen";

import * as authActions from "../store/actions/Auth";

import Colors from "../constants/Colors";

const navOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
  },
  headerTitleStyle: {
    fontFamily: "openSansBold",
  },
  headerBackTitleStyle: {
    fontFamily: "openSans",
  },
  headerTintColor: "black",
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: navOptions,
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-list" : "ios-list"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },

    defaultNavigationOptions: navOptions,
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductScreen,
    EditProduct: EditProductScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === "android" ? "md-create" : "ios-create"}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },

    defaultNavigationOptions: navOptions,
  }
);

const AuthNavigator = createStackNavigator(
  {
    Authenticate: AuthenticationScreen,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
      itemsContainerStyle: {
        marginVertical: 35,
      },
    },
    defaultNavigationOptions: navOptions,
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
      itemsContainerStyle: {
        marginVertical: 35,
      },
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout());
                // props.navigation.navigate("Auth");
              }}
            />
          </SafeAreaView>
        </View>
      );
    },
    defaultNavigationOptions: navOptions,
  }
);

const mainNavigator = createSwitchNavigator({
  Start: StartingScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator,
});

export default createAppContainer(mainNavigator);

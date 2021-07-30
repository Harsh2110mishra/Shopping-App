import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CartItem = (props) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{props.quantity}</Text>
        <Text style={styles.mainText}>
          {props.title.length > 15
            ? props.title.substring(0, 15) + "..."
            : props.title}
        </Text>
      </View>
      <View style={styles.itemData}>
        <Text style={styles.mainText}>${props.amount.toFixed(2)}</Text>
        {props.deletable && (
          <TouchableOpacity
            onPress={props.onRemove}
            style={styles.deleteButton}
          >
            <Ionicons
              name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
              size={23}
              color="red"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
  },
  itemData: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantity: {
    fontFamily: "openSans",
    color: "#888",
    fontSize: 16,
    marginRight: 4,
  },
  mainText: {
    fontFamily: "openSansBold",
    fontSize: 16,
    marginLeft: 5,
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default CartItem;

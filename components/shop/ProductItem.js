import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";

import Card from "../UI/Card";

const ProductItem = (props) => {
  return (
    <Card style={styles.product}>
      <View style={styles.Touchable}>
        <TouchableNativeFeedback onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>
                ${Number(props.price).toFixed(2)}
              </Text>
            </View>
            <View style={styles.actions}>{props.children}</View>
          </View>
        </TouchableNativeFeedback>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 20,
  },
  Touchable: {
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  details: {
    alignItems: "center",
    height: "15%",
    padding: 10,
  },
  title: {
    fontFamily: "openSansBold",
    fontSize: 18,
    marginVertical: 2,
  },
  price: {
    fontFamily: "openSans",
    fontSize: 14,
    color: "#888",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "25%",
    paddingHorizontal: 20,
  },
});

export default ProductItem;

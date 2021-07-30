import { ADD_ORDER, GET_ORDER } from "../actions/orders";
import Order from "../../models/orders";

const intialState = {
  orders: [],
};

export default (state = intialState, action) => {
  switch (action.type) {
    case GET_ORDER:
      return { orders: action.orders };
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder),
      };
  }
  return state;
};

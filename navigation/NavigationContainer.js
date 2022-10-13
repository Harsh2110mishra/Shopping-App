import React, { useEffect, useRef } from "react";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import ShopNavigator from "./ShopNavigator";

const NavigationContainer = (props) => {
  const navRef = useRef();
  const isAuth = useSelector((state) => !!state.Auth.token);

  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({
          routeName: "Auth",
        })
      );
    }
  }, [isAuth]);

  return <ShopNavigator ref={navRef} />;
};

export default NavigationContainer;

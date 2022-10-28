import { AsyncStorage } from "react-native";

let timer;

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

export const Authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAnaJyjjGppk9-FiWocva_cP0vaMrKp4_4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage = responseData.error.message;
      if (errorMessage === "EMAIL_EXISTS") {
        throw new Error("Email already exists");
      }
    }
    const resData = await response.json();
    console.log(resData);
    dispatch(
      Authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAnaJyjjGppk9-FiWocva_cP0vaMrKp4_4",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    if (!response.ok) {
      const responseData = await response.json();
      const errorMessage = responseData.error.message;
      if (
        errorMessage === "EMAIL_NOT_FOUND" ||
        errorMessage === "INVALID_PASSWORD"
      ) {
        throw new Error("Email or Password is wrong!!");
      }
    }
    const resData = await response.json();
    console.log(resData);
    dispatch(
      Authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirtationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirtationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirtationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirtationDate.toISOString(),
    })
  );
};

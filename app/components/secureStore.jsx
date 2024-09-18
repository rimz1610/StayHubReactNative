import * as SecureStore from "expo-secure-store";
import { CARTMODEL } from "./../screen/constant";
import { useState } from "react";
const CART_KEY = "stayhubcart";
const LOGIN_KEY = "stayhublogin";

const saveLoginDataToSecureStore = async (loginModel) => {
  try {
    await SecureStore.setItemAsync(LOGIN_KEY, JSON.stringify(loginModel));
  } catch (error) {
    console.error("Error saving details to secure store:", error);
  }
};
const saveCartToSecureStore = async (cartModel) => {
  try {
    await SecureStore.setItemAsync("stayhubcart", JSON.stringify(cartModel));
  } catch (error) {
    console.error("Error saving cart to secure store:", error);
  }
};
const getCartFromSecureStore = async () => {
  try {
    const cartJson = await SecureStore.getItemAsync("stayhubcart");
    if (cartJson) {
      return JSON.parse(cartJson);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting cart from secure store:", error);
    return null;
  }
};

const getCartDataFromSecureStore = async (type) => {
  try {
    const json = await SecureStore.getItemAsync(CART_KEY);
    if (json) {
      const model = JSON.parse(json);
      const cart = CARTMODEL;
      cart.bookingModel = model.bookingModel;
      cart.paymentDetail = model.paymentDetail;
      cart.lstRoom = model.lstRoom;
      cart.lstRoomService = model.lstRoomService;
      cart.lstGym = model.lstGym;
      cart.lstEvent = model.lstEvent;
      cart.lst = model.Currency;

      switch (type) {
        case "B":
          return cart.bookingModel;
        case "P":
          return cart.paymentDetail;
        case "R":
          return cart.lstRoom;
        case "RS":
          return cart.lstRoomService;
        case "G":
          return cart.lstGym;
        case "S":
          return cart.lstSpa;
        case "E":
          // ReIndexing(cart.lstEvent);
          return cart.lstEvent;
        default:
          return cart;
      }
    }
  } catch (error) {
    console.error("Error getting cart data from secure store:", error);
  }
  return new Cart();
};

const putDataIntoCartAndSaveSecureStore = async (obj, type) => {
  try {
    const cart = await getCartFromSecureStore();

    const updatedCart = { ...cart }; // Create a new copy of the cart object
    switch (type) {
      case "R":
        if (
          updatedCart.lstRoom == undefined ||
          updatedCart.lstRoom == null ||
          updatedCart.lstRoom.length == 0
        ) {
          updatedCart.lstRoom = [];
        }
        updatedCart.lstRoom.push(obj);
        break;
      case "RS":
        if (
          updatedCart.lstRoomService == undefined ||
          updatedCart.lstRoomService == null ||
          updatedCart.lstRoomService.length == 0
        ) {
          updatedCart.lstRoomService = [];
        }
        updatedCart.lstRoomService.push(obj);
        break;
      case "G":
        if (
          updatedCart.lstEvent == undefined ||
          updatedCart.lstEvent == null ||
          updatedCart.lstEvent.length == 0
        ) {
          updatedCart.lstEvent = [];
        }
        updatedCart.lstEvent.push(obj);
        break;
      case "B":
        updatedCart.bookingModel = obj;
        break;
      case "p":
        updatedCart.paymentDetail = obj;
        break;
      case "S":
        if (
          updatedCart.lstSpa == undefined ||
          updatedCart.lstSpa == null ||
          updatedCart.lstSpa.length == 0
        ) {
          updatedCart.lstSpa = [];
        }
        updatedCart.lstSpa.push(obj);
        break;
      case "E":
        if (
          updatedCart.lstEvent == undefined ||
          updatedCart.lstEvent == null ||
          updatedCart.lstEvent.length == 0
        ) {
          updatedCart.lstEvent = [];
        }
        updatedCart.lstEvent.push(obj);
        break;
      default:
        break;
    }
    await saveCartToSecureStore(updatedCart);
  } catch (error) {
    console.error(
      "Error putting data into cart and saving secure store:",
      error
    );
  }
};

const reIndexing = (lstObj) => {
  return lstObj.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
};

const deleteCartFromSecureStore = async () => {
  try {
    await SecureStore.deleteItemAsync(CART_KEY);
  } catch (error) {
    console.error("Error deleting cart from secure store:", error);
  }
};

const updateCart = async (obj) => {
  try {
    const cart = await getCartFromSecureStore();
    if (cart) {
      if (obj.lstRoom != null && obj.lstRoom.length > 0) {
        cart.lstRoom = obj.lstRoom;
      }
      if (obj.lstRoomService != null && obj.lstRoomService.length > 0) {
        cart.lstRoomService = obj.lstRoomService;
      }
      if (obj.lstGym != null && obj.lstGym.length > 0) {
        cart.lstGym = obj.lstGym;
      }
      if (obj.lstSpa != null && obj.lstSpa.length > 0) {
        cart.lstSpa = obj.lstSpa;
      }
      if (obj.lstEvent != null && obj.lstEvent.length > 0) {
        cart.lstEvent = obj.lstEvent;
      }

      await saveCartToSecureStore(cart);
    }
  } catch (error) {
    console.warn(error);
  }
};

const removeDataFromCartAndSaveLocalStorage = async (Index, type) => {
  try {
    const cart = await getCartFromSecureStore();
    if (cart) {
      switch (type) {
        case "R":
          cart.lstRoom = cart.lstRoom.filter(function (data) {
            return data.index !== Index;
          });
          cart.lstRoom = reIndexing(cart.lstRoom);
          break;
        case "RS":
          cart.lstRoomService = cart.lstRoomService.filter(function (data) {
            return data.index !== Index;
          });
          cart.lstRoomService = reIndexing(cart.lstRoomService);
          break;
        case "G":
          cart.lstGym = cart.lstGym.filter(function (data) {
            return data.index !== Index;
          });
          cart.lstGym = reIndexing(cart.lstGym);
          break;
        case "S":
          cart.lstSpa = cart.lstSpa.filter(function (data) {
            return data.index !== Index;
          });
          cart.lst9DayTour = reIndexing(cart.lst9DayTour);
          break;
        case "E":
          cart.lstEvent = cart.lstEvent.filter(function (data) {
            return data.index !== Index;
          });
          cart.lstEvent = reIndexing(cart.lstEvent);
          break;
        default:
          return cart;
      }
      await saveCartToSecureStore(cart);
    }
  } catch (error) {
    console.error("Error removing data from cart:", error);
  }
};

const validateDatesFromSecureStore = async (roomId, startDate, endDate) => {
  var json = await getCartFromSecureStore().lstRoom;
  const roomsInCart = json?.filter((s) => s.RoomId == roomId);
  if (roomsInCart && roomsInCart.length > 0) {
    const filteredItems = roomsInCart.filter(
      (s) =>
        Date.parse(s.checkInDate) >= Date.parse(startDate) &&
        Date.parse(s.checkOutDate) <= Date.parse(endDate)
    );
    return !(filteredItems.length > 0);
  } else {
    return true;
  }
};

const getCartItemCount = async () => {
  const count = 0;
  const cart = await getCartFromSecureStore();
  if (cart.lstRoom != null && cart.lstRoom.length > 0) {
    count += cart.lstRoom.length;
  }
  if (cart.lstRoomService != null && cart.lstRoomService.length > 0) {
    count += cart.lstRoomService.length;
  }
  if (cart.lstGym != null && cart.lstGym.length > 0) {
    count += cart.lstGym.length;
  }
  if (cart.lstSpa != null && cart.lstSpa.length > 0) {
    count += cart.lstSpa.length;
  }
  if (cart.lstEvent != null && cart.lstEvent.length > 0) {
    count += cart.lstEvent.length;
  }
  return count;
};

export {
  getCartItemCount,
  updateCart,
  removeDataFromCartAndSaveLocalStorage,
  saveLoginDataToSecureStore,
  putDataIntoCartAndSaveSecureStore,
  saveCartToSecureStore,
  getCartDataFromSecureStore,
  getCartFromSecureStore,
  deleteCartFromSecureStore,
  validateDatesFromSecureStore,
};

import * as SecureStore from 'expo-secure-store';

const CART_KEY = 'cart';

const saveCartToSecureStore = async (cartModel) => {
  try {
    await SecureStore.setItemAsync(CART_KEY, JSON.stringify(cartModel));
  } catch (error) {
    console.error('Error saving cart to secure store:', error);
  }
};

const getCartFromSecureStore = async () => {
  try {
    const cartJson = await SecureStore.getItemAsync(CART_KEY);
    if (cartJson) {
      return JSON.parse(cartJson);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting cart from secure store:', error);
    return null;
  }
};

const deleteCartFromSecureStore = async () => {
  try {
    await SecureStore.deleteItemAsync(CART_KEY);
  } catch (error) {
    console.error('Error deleting cart from secure store:', error);
  }
};

export { saveCartToSecureStore, getCartFromSecureStore, deleteCartFromSecureStore };
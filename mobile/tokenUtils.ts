import * as Keychain from 'react-native-keychain';

export const storeToken = async (token: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword('authToken', token);
  } catch (err) {
    console.log('Failed to store token');
  }
};

export const getToken = async () => {
  try {
    const token = await Keychain.getGenericPassword();
    if (token) {
      return token.password;
    }
    return null;
  } catch (err) {
    console.log('Failed to retrieve token', err);
  }
};

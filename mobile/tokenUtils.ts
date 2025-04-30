import * as Keychain from 'react-native-keychain';

export const storeToken = async (token: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword('authToken', token);
  } catch (err) {
    console.log('Failed to store token');
  }
};

export const getToken = async (): Promise<string | null | undefined> => {
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

export const removeToken = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword();
    console.log('Token removed successfully');
  } catch (err) {
    console.log('Failed to remove token', err);
  }
}

export const getAuthHeader = async () => {
  const token = await getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

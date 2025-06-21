import * as Keychain from 'react-native-keychain';

interface TokenData {
  id: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  issuedAt: number;
}

export const storeToken = async (
  id: number,
  accessToken: string,
  refreshToken: string,
  expiresIn: number = 3600,
): Promise<void> => {
  const now = Date.now();
  const tokenData: TokenData = {
    id,
    accessToken,
    refreshToken,
    expiresAt: now + expiresIn * 1000,
    issuedAt: now,
  };

  try {
    await Keychain.setGenericPassword('authToken', JSON.stringify(tokenData), {
      service: 'Clockly App',
    });
  } catch (error) {
    console.log('Error string tokens: ', error);
  }
};

export const getToken = async (): Promise<TokenData | null> => {
  try {
    const token = await Keychain.getGenericPassword({
      service: 'Clockly App',
    });

    if (!token) {
      return null;
    }

    const tokenData: TokenData = JSON.parse(token.password);
    return tokenData;
  } catch (error) {
    console.log('Error getting stored token: ', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({
      service: 'Clockly App',
    });
  } catch (err) {
    console.log('Failed to remove token', err);
  }
};

export const getValidAccessToken = async (): Promise<{
  id: number;
  accessToken: string;
} | null> => {
  try {
    const tokenData = await getToken();
    if (!tokenData) return null;

    if (Date.now() > tokenData.expiresAt) {
      return null;
    }

    return {id: tokenData.id, accessToken: tokenData.accessToken};
  } catch (error) {
    console.log('Error getting valid access token: ', error);
    return null;
  }
};

export const getFreshToken = async (): Promise<string | null> => {
  try {
    const tokenData = await getToken();
    return tokenData?.refreshToken || null;
  } catch (error) {
    console.log('Error getting refresh token: ', error);
    return null;
  }
};

export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const tokenData = await getToken();
    if (!tokenData) return true;

    return Date.now() > tokenData.expiresAt;
  } catch (error) {
    return true;
  }
};

export const shouldRefreshToken = async (): Promise<boolean> => {
  try {
    const tokenData = await getToken();
    if (!tokenData) return false;

    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
    return tokenData.expiresAt < fiveMinutesFromNow;
  } catch (error) {
    return false;
  }
};

export const getAuthHeader = async (): Promise<{
  headers: {Authorization: string};
} | null> => {
  try {
    const tokenData = await getToken();
    if (!tokenData || !tokenData.accessToken) {
      return null;
    }

    return {
      headers: {
        Authorization: `Bearer ${tokenData.accessToken}`,
      },
    };
  } catch (error) {
    console.log('Error getting auth header: ', error);
    return null;
  }
};

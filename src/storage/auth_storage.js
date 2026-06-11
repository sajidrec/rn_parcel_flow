import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_INFO_KEY = 'userInfo';

export const saveUserInfo = async (userInfo) => {
  await AsyncStorage.setItem(
    USER_INFO_KEY,
    JSON.stringify(userInfo)
  );
};

export const getUserInfo = async () => {
  const data = await AsyncStorage.getItem(
    USER_INFO_KEY
  );

  return data ? JSON.parse(data) : null;
};

export const getToken = async () => {
  const userInfo = await getUserInfo();
  return userInfo?.access_token ?? null;
};

export const getUserType = async () => {
  const userInfo = await getUserInfo();
  return userInfo?.user_type ?? null;
};

export const logout = async () => {
  await AsyncStorage.removeItem(
    USER_INFO_KEY
  );
};
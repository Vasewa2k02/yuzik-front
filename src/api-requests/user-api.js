import Cookies from "js-cookie";

import { $authHost, $host } from "./index";
import { ROUTES } from "../utils/urls";
import axios from "axios";

export const registration = async (email, name) => {
  await $host.post(ROUTES.REGISTRATION_ROUTE, {
    email,
    name,
  });
};

export const login = async (email, password) => {
  const { data } = await $host.post(ROUTES.LOGIN_ROUTE, { email, password });
  localStorage.setItem("token", data.accessToken);
  return data.user;
};

export const logout = async () => {
  await $authHost.post(ROUTES.LOGOUT_ROUTE);
  localStorage.setItem("token", "");
};

export const getCurrentUser = async () => {
  try {
    const { data } = await $authHost.get(ROUTES.AUTH_ROUTE);
    return data;
  } catch (err) {
    if (
      err.response &&
      (err.response.status === 401 || err.response.status === 403)
    ) {
      try {
        const { data } = await axios.post(ROUTES.REFREASH_ROUTE, null, {
          withCredentials: true,
        });

        // localStorage.setItem("token", accessToken);
        //const { data } = await $authHost.get(ROUTES.AUTH_ROUTE);
        return data.user;
      } catch (err) {}
    } else {
    }
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  await $authHost.patch(ROUTES.USER_ROUTE, { oldPassword, newPassword });
};

export const getUserSettings = async () => {
  const { data } = await $authHost.get(ROUTES.USER_SETTINGS_ROUTE);
  return data;
};

export const updateUserSettings = async (userSettings) => {
  await $authHost.patch(ROUTES.USER_SETTINGS_ROUTE, { ...userSettings });
};

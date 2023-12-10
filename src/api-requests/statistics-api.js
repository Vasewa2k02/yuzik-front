import { $authHost } from "./index";
import { ROUTES } from "../utils/urls";

export const createOrUpdateStatistics = async (statisticsDto) => {
  const { data } = await $authHost.post(ROUTES.STATISTICS_ROUTE, statisticsDto);
  return data;
};

export const getAllStatistics = async () => {
  const { data } = await $authHost.get(ROUTES.STATISTICS_ALL_ROUTE);
  return data;
};

export const getUserAllStatistics = async () => {
  const { data } = await $authHost.get(ROUTES.STATISTICS_USER_ALL_ROUTE);
  return data;
};

export const getUserTodayStatistics = async () => {
  const { data } = await $authHost.get(ROUTES.STATISTICS_USER_TODAY_ROUTE);
  return data;
};

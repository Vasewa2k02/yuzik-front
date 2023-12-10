import { $authHost } from "./index";
import { ROUTES } from "../utils/urls";

export const getAllTopics = async () => {
  const { data } = await $authHost.get(ROUTES.TOPIC_ROUTE);

  return data;
};

export const createTopic = async ({ name }) => {
  const { data } = await $authHost.post(ROUTES.TOPIC_ROUTE, {
    name,
  });

  return data;
};

export const deleteDictionary = async (id) => {
  const { data } = await $authHost.delete(`${ROUTES.DICTIONARY_ROUTE}/${id}`);
  return data;
};

export const updateDictionary = async (id, { name, description }) => {
  const { data } = await $authHost.patch(`${ROUTES.DICTIONARY_ROUTE}/${id}`, {
    name,
    description,
  });
  return data;
};

import { $authHost } from "./index";
import { ROUTES } from "../utils/urls";

export const createWord = async (dictionaryId, word) => {
  const { data } = await $authHost.post(
    `${ROUTES.WORD_ROUTE}/${dictionaryId}`,
    {
      ...word,
    }
  );

  return data;
};

export const createWordArray = async (dictionaryId, words) => {
  const { data } = await $authHost.post(
    `${ROUTES.WORD_IMPORT_ROUTE}/${dictionaryId}`,
    { wordArray: words }
  );

  return data;
};

export const updateWord = async (wordId, word) => {
  const { data } = await $authHost.patch(`${ROUTES.WORD_ROUTE}/${wordId}`, {
    ...word,
  });

  return data;
};

export const deleteWord = async (wordId, dictionaryId) => {
  const { data } = await $authHost.delete(
    `${ROUTES.WORD_ROUTE}/${wordId}/dictionary/${dictionaryId}`
  );

  return data;
};

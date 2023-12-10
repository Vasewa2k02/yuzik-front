import { $authHost } from "./index";
import { ROUTES } from "../utils/urls";

export const giveLexiconProgressAnswer = async (lexiconProgressDto) => {
  const { data } = await $authHost.post(
    ROUTES.LEXICON_PROGRESS_ROUTE,
    lexiconProgressDto
  );
  return data;
};

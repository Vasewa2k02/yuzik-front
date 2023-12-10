import { $authHost } from "./index";
import { ROUTES } from "../utils/urls";

export const getLessons = async () => {
  const { data } = await $authHost.get(ROUTES.LESSON_ROUTE);
  return data;
};

export const getStudyLessons = async () => {
  const { data } = await $authHost.get(ROUTES.LESSON_LEARN_ROUTE);
  return data;
};

export const createLesson = async (createLessonDto) => {
  const { data } = await $authHost.post(ROUTES.LESSON_ROUTE, createLessonDto);
  return data;
};

export const updateLesson = async (id, updateLessonDto) => {
  const { data } = await $authHost.patch(
    `${ROUTES.LESSON_ROUTE}/${id}`,
    updateLessonDto
  );
  return data;
};

export const deleteLesson = async (id) => {
  const { data } = await $authHost.delete(`${ROUTES.LESSON_ROUTE}/${id}`);
  return data;
};

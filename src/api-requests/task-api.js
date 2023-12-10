import { $authHost } from "./index";
import { ROUTES } from "../utils/urls";

export const createTask = async (createTaskDto) => {
  const { data } = await $authHost.post(ROUTES.TASK_ROUTE, createTaskDto);
  return data;
};

export const updateTask = async (id, updateTaskDto) => {
  const { data } = await $authHost.patch(
    `${ROUTES.TASK_ROUTE}/${id}`,
    updateTaskDto
  );
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await $authHost.delete(`${ROUTES.TASK_ROUTE}/${id}`);
  return data;
};

import { apiRequest } from "../services/apiRequest";

export const getAllUsers = async (): Promise<any[]> => {
  return await apiRequest("/users", "GET");
};

export const getFarmers = async (): Promise<any[]> => {
  const users = await getAllUsers();
  return users.filter((user) =>
    user.roles?.some((role: string) => role.includes("Farmer"))
  );
};

export const getConsumers = async (): Promise<any[]> => {
  const users = await getAllUsers();
  return users.filter((user) =>
    user.roles?.some((role: string) => role.includes("Consumer"))
  );
};

export const getHandlers = async (): Promise<any[]> => {
  const users = await getAllUsers();
  return users.filter((user) =>
    user.roles?.some((role: string) => role.includes("Handler"))
  );
};

export const getAllExceptCurrentUser = async (
  currentUsername: string
): Promise<any[]> => {
  const users = await getAllUsers();
  return users.filter((user) => user.username !== currentUsername);
};

import apiRequest from "./api";

export const registerUser = async (formData) => {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(formData),
  });

  localStorage.setItem("citypulse_token", data.token);
  localStorage.setItem("citypulse_user", JSON.stringify(data.user));

  return data;
};

export const loginUser = async (formData) => {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });

  localStorage.setItem("citypulse_token", data.token);
  localStorage.setItem("citypulse_user", JSON.stringify(data.user));

  return data;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("citypulse_user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("citypulse_token"));
};

export const logoutUser = () => {
  localStorage.removeItem("citypulse_token");
  localStorage.removeItem("citypulse_user");
};

export const createDemoAdmin = async () => {
  const data = await apiRequest("/auth/create-demo-admin", {
    method: "POST",
    body: JSON.stringify({}),
  });

  localStorage.setItem("citypulse_token", data.token);
  localStorage.setItem("citypulse_user", JSON.stringify(data.user));

  return data;
};
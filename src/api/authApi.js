import instance from ".";

export const loginUser = (user) => instance.post("auth/login/", user);

export const refreshToken = (token) =>
  instance.post("auth/refresh/", {
    refreshToken: token,
  });

export const logoutUser = (userId) =>
  instance.delete(`auth/logout/${userId}`);

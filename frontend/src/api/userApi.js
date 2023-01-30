import instance from ".";

export const fetchAuthor = (authorName) => instance.get(`user/${authorName}`);

export const registerUser = (user) => instance.post("user/register", user);

export const editUser = (userId, editedUser) =>
  instance.patch(`user/edit/${userId}`, editedUser);

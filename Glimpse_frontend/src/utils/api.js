import { api } from '../api/client';

export const upsertUser = (user) => api.post('/users', user);
export const getUser = (googleId) => api.get(`/users/${googleId}`);
export const getUserCreatedPins = (googleId) => api.get(`/users/${googleId}/created-pins`);
export const getUserSavedPins = (googleId) => api.get(`/users/${googleId}/saved-pins`);

export const ensureUserExists = async (user) => {
  if (!user?.googleId || !user?.userName || !user?.image) {
    return null;
  }

  const restoredUser = await upsertUser({
    googleId: user.googleId,
    userName: user.userName,
    image: user.image,
  });

  return user.isGuest ? { ...restoredUser, isGuest: true } : restoredUser;
};

export const getPins = ({ category, search } = {}) => api.get('/pins', { category, search });
export const getPinDetails = (pinId) => api.get(`/pins/${pinId}`);

export const createPin = (formData) => api.post('/pins', formData);
export const savePin = (pinId, userId) => api.patch(`/pins/${pinId}/save`, { userId });
export const deletePin = (pinId, userId) => api.delete(`/pins/${pinId}`, { userId });
export const addComment = (pinId, payload) => api.post(`/pins/${pinId}/comments`, payload);
export const deleteComment = (pinId, commentId, userId) =>
  api.delete(`/pins/${pinId}/comments/${commentId}`, { userId });

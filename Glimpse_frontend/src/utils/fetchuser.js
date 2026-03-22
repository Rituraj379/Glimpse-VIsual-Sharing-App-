export const fetchUser = () => {
  try {
    const userInfo = sessionStorage.getItem('user') || localStorage.getItem('user');

    if (!userInfo || userInfo === 'undefined') {
      return null;
    }

    return JSON.parse(userInfo);
  } catch {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    return null;
  }
};

export const isGuestUser = (user) => Boolean(user?.isGuest);

export const persistUser = (user) => {
  if (!user) {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    return;
  }

  if (isGuestUser(user)) {
    sessionStorage.setItem('user', JSON.stringify(user));
    localStorage.removeItem('user');
    return;
  }

  localStorage.setItem('user', JSON.stringify(user));
  sessionStorage.removeItem('user');
};

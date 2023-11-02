const LOCAL_STORAGE_KEY = 'authorizedUser';

const setAuthorizedUser = (user: IAuthorizedUser | null) => {
  if (user === null) {
    return localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  const jsonData = JSON.stringify(user);
  localStorage.setItem(LOCAL_STORAGE_KEY, jsonData);
};

const useAuth = () => {
  const jsonData = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!jsonData) {
    return { authorizedUser: null, setAuthorizedUser };
  }

  try {
    const authorizedUser = JSON.parse(jsonData) as IAuthorizedUser;
    return { authorizedUser, setAuthorizedUser };
  } catch {
    return { authorizedUser: null, setAuthorizedUser };
  }
};

export { useAuth };
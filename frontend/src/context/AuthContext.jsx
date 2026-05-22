import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  /*
     load user from localStorage
  */
  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {

      setUser(JSON.parse(storedUser));

    }

    setLoading(false);

  }, []);


  const login = (userData) => {

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);

  };

  const updateUser = (updatedData) => {

    const updatedUser = {
      ...user,
      ...updatedData
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

  };


  const logout = () => {

    localStorage.removeItem("user");

    setUser(null);

  };


  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        loading
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};


export const useAuth = () => {

  return useContext(AuthContext);

};
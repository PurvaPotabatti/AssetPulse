import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/*
    AuthProvider wraps entire app
    provides login/logout functionality
*/
export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  /*
      Load user from localStorage
      when app starts
  */
  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if(storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);


  /*
      login function
      stores user in localStorage
  */
  const login = (userData) => {

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);

  };


  /*
      logout function
      clears localStorage
  */
  const logout = () => {

    localStorage.removeItem("user");

    setUser(null);

  };


  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};


/*
    custom hook
*/
export const useAuth = () => {

  return useContext(AuthContext);

};
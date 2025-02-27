export const isAuthenticated = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("token") ? true : false;
  };
  
  export const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login page
    }
  };
  
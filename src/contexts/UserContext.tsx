import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  bio?: string;
  mobileNumber?: string;
  gender?: string;
  profileImageUrl?: string;
  interests?: string[];
  isAuthenticated: boolean;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// For development purposes - set to true if you want to skip login for testing
const defaultUser: User = {
  id: "1",
  username: "demo_user",
  fullName: "Demo User",
  isAuthenticated: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for existing user data on initialization
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        // Create a user object from the stored data
        setUser({
          id: userData.id || Math.random().toString(36).substr(2, 9),
          username: userData.username,
          fullName: userData.fullName,
          email: userData.email,
          bio: userData.bio,
          mobileNumber: userData.mobileNumber,
          gender: userData.gender,
          profileImageUrl: userData.profileImageUrl,
          interests: userData.interests,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Failed to parse user data:", error);
        setUser(defaultUser); // Fallback to demo user
      }
    } else {
      setUser(defaultUser); // Set demo user for development
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // Store user data in localStorage for persistence
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Clear user-related data
    localStorage.removeItem("userData");
    localStorage.removeItem("signupData");
    localStorage.removeItem("emailVerified");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
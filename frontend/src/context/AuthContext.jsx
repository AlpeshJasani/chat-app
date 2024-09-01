import { createContext, useContext, useState } from "react";

// Create a new context for authentication
export const AuthContext = createContext();

// Custom hook to use the AuthContext
// This simplifies access to the context data for components
// It provides a way to access the current auth context value
export const useAuthContext = () => {
	return useContext(AuthContext);
};

// The AuthContextProvider component
// This component wraps around parts of your app that need access to the auth context
export const AuthContextProvider = ({ children }) => {
	// Initialize authUser state
	// Set the initial state from localStorage if available, or null if not
	const [authUser, setAuthUser] = useState(
		JSON.parse(localStorage.getItem("chat-user")) || null
	);

	// Return the provider component
	// The provider component makes the auth context value available to all children
	// It provides the authUser and setAuthUser values through the context
	return (
		<AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
};


// useAuthContext() is a custom hook that likely provides access to authentication-related values and methods. 
// Here, setAuthUser is a function used to update the authenticated user in your app's global state (likely through React's Context API).

// This code  sets up an authentication context in a React application using the Context API. 
// It provides a way to manage and access the authenticated user’s data across the app without passing props down 
// through multiple levels of components.


// For Detail Undersatnding...

// Creating the Context (AuthContext):
// export const AuthContext = createContext();
// This line creates a context object using createContext. The AuthContext will hold and provide the authentication-related data, such as the authenticated user, to the rest of the application.

// Custom Hook (useAuthContext):
// export const useAuthContext = () => { return useContext(AuthContext); };
// This is a custom hook that simplifies the use of AuthContext by returning the current context value. It makes it easy for components to access the authentication data without needing to import useContext and AuthContext separately.

// Context Provider (AuthContextProvider):
// export const AuthContextProvider = ({ children }) => { ... };
// The AuthContextProvider is a component that wraps around the parts of the app that need access to the authentication context.
// Inside this provider:
// authUser and setAuthUser are managed using useState.
// The initial state of authUser is either the parsed user data from localStorage (if it exists) or null. This means that when the app loads, it checks if there’s already a user stored in localStorage and sets it as the initial state if available.
// The AuthContext.Provider component wraps the children components and provides the authUser and setAuthUser as context values. This allows any child component to access or update the authenticated user data.
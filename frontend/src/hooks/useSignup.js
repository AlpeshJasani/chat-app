import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
	const [loading, setLoading] = useState(false); // Manages loading state // for showing a loading spinner or disabling 
	const { setAuthUser } = useAuthContext(); // Gets the setAuthUser function from the authentication context

	const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
		if (!success) return;

		setLoading(true); // Sets loading to true when signup starts
		try {
			// Makes the signup request to the backend
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
			});

			const data = await res.json(); // Parses the response JSON
			if (data.error) {
				throw new Error(data.error); // If there's an error, throw it to be caught by the catch block
			}
			// Stores user data in localStorage and updates the auth context
			localStorage.setItem("chat-user", JSON.stringify(data)); // (key,value)
			setAuthUser(data); // Updates the auth context with the new user
		} catch (error) {
			toast.error(error.message);  // Displays an error message to the user if something goes wrong
		} finally {
			setLoading(false); // Sets loading to false when signup completes (either success or failure)
		}
	};

	return { loading, signup }; // Exposes the loading state and signup function to the component
};
export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields"); // library called React Hot Toast // for show error message on client's pc
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}

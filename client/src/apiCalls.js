import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
    });

    try {
        const res = await axiosInstance.post("/auth/login", userCredential);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err });
    }
}

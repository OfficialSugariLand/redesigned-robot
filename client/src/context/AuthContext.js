import { useReducer, createContext, useEffect, useState } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
    const [modal, setModal] = useState({ isOpen: false, title: '', content: '' });
    const [alert, setAlert] = useState({
        isAlert: false,
        severity: 'info',
        message: '',
        timeout: null,
        location: '',
    });

    //https://www.youtube.com/watch?v=RKtIr4PYLro {Update user info in local storage}
    const updateUserIsVerified = (isVerified, next) => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user')) {
                let auth = JSON.parse(localStorage.getItem('user'));
                auth.isVerified = isVerified;
                localStorage.setItem('user', JSON.stringify(auth));
                next();
            }
        }
    };

    const updateUserPic = (profilePicture, next) => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user')) {
                let auth = JSON.parse(localStorage.getItem('user'));
                auth.profilePicture = profilePicture;
                localStorage.setItem('user', JSON.stringify(auth));
                next();
            }
        }
    };

    const updateUser = (username, next) => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user')) {
                let auth = JSON.parse(localStorage.getItem('user'));
                auth.username = username;
                localStorage.setItem('user', JSON.stringify(auth));
                next();
            }
        }
    };

    const updateUserPassword = (password, next) => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user')) {
                let auth = JSON.parse(localStorage.getItem('user'));
                auth.password = password;
                localStorage.setItem('user', JSON.stringify(auth));
                next();
            }
        }
    };
    const updateUserDesc = (desc, next) => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user')) {
                let auth = JSON.parse(localStorage.getItem('user'));
                auth.desc = desc;
                localStorage.setItem('user', JSON.stringify(auth));
                next();
            }
        }
    };

    const updateUserGender = (gender, next) => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user')) {
                let auth = JSON.parse(localStorage.getItem('user'));
                auth.gender = gender;
                localStorage.setItem('user', JSON.stringify(auth));
                next();
            }
        }
    };

    const updateUserInterest = (interest, next) => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user')) {
                let auth = JSON.parse(localStorage.getItem('user'));
                auth.interest = interest;
                localStorage.setItem('user', JSON.stringify(auth));
                next();
            }
        }
    };

    const updateUserSexuality = (sexuality, next) => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user')) {
                let auth = JSON.parse(localStorage.getItem('user'));
                auth.sexuality = sexuality;
                localStorage.setItem('user', JSON.stringify(auth));
                next();
            }
        }
    };
    
    const updateUserRelate = (relationship, next) => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user')) {
                let auth = JSON.parse(localStorage.getItem('user'));
                auth.relationship = relationship;
                localStorage.setItem('user', JSON.stringify(auth));
                next();
            }
        }
    };

    const updateUserAge = (dob, next) => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user')) {
                let auth = JSON.parse(localStorage.getItem('user'));
                auth.dob = dob;
                localStorage.setItem('user', JSON.stringify(auth));
                next();
            }
        }
    };

    const updateUserLocation = (country, state, city, next) => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('user')) {
                let auth = JSON.parse(localStorage.getItem('user'));
                auth.country = country;
                auth.state = state;
                auth.city = city;
                localStorage.setItem('user', JSON.stringify(auth));
                next();
            }
        }
    };

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user))
    }, [state.user])

    return (
        <AuthContext.Provider value={{
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            modal,
            setModal,
            alert,
            setAlert,
            loading,
            setLoading,
            dispatch,
            updateUserIsVerified,
            updateUserPic,
            updateUser,
            updateUserDesc,
            updateUserPassword,
            updateUserGender,
            updateUserSexuality,
            updateUserInterest,
            updateUserRelate,
            updateUserAge,
            updateUserLocation,
        }}>
            {children}

        </AuthContext.Provider>
    )
};
import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User, InitialUserState } from "@/types";

export const initializeUserFromLocalStorage = () => (dispatch: Dispatch) => {
    if (typeof window === "undefined") return;
    const storedData = window.localStorage.getItem("firm_client");
    let userInLocalStorage = null;
    try {
        userInLocalStorage = storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
    }
    if (userInLocalStorage) {
        dispatch(setUser(userInLocalStorage));
    }
};

const initialState = {
    isLoading: false,
    isError: false,
    user: null
} as InitialUserState;

const authSlice = createSlice({
    name: 'Auth Slice',
    initialState,
    reducers: {
        setUser(state, payload: PayloadAction<User>) {
            state.user = payload.payload;
            localStorage.setItem('firm_client', JSON.stringify(payload.payload));
        },
        logOut(state) {
            state.user = null;
            localStorage.removeItem('firm_client');
        },
    },
});

export const authReducer = authSlice.reducer;
export const { setUser, logOut } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.authReducer.user;
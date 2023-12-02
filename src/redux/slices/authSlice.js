import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    role: localStorage.getItem("role") || "",
    data: JSON.parse(localStorage.getItem("data")) || {}
}

export const createAccount = createAsyncThunk("/auth/register" , async (data) => {
    try {
        const response = axiosInstance.post("user/register" , data);

        toast.promise(response , {
            loading: 'Wait! creating your account',
            success: (data) => {
                return data?.data?.message;
            },
            error: 'Failed to create your account'
        });

        return await response;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const login = createAsyncThunk("auth/login" , async (data) => {

    try {
        const response = axiosInstance.post("user/login" , data);

        toast.promise(response , {
            loading: 'Wait! authenticating your account',
            success: (data) => {
                return data?.data?.message;
            },
            error: 'Failed to authenticate your account'
        });

        return await response;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const logout = createAsyncThunk("/auth/logout" , async () => {
    try {
        const response = axiosInstance.get("user/logout");

        toast.promise(response , {
            loading: "Wait! logging out your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to logout your account"
        })
        return await response;

    } catch (error) {
        toast.error(error);        
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
                .addCase(login.fulfilled , (state , action) => {
                    localStorage.setItem("data" , JSON.stringify(action?.payload?.data));
                    localStorage.setItem('isLoggedIn' , true);
                    localStorage.setItem('role' , action?.payload?.data?.user?.role);

                    state.isLoggedIn = true;
                    state.data = action?.payload?.data;
                    state.role = action?.payload?.data?.user?.role;
                })
                .addCase(logout.fulfilled , (state) => {
                    localStorage.clear();

                    state.isLoggedIn = false;
                    state.role = "";
                    state.data = {};
                })
    }
});

export default authSlice.reducer;
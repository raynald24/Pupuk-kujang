import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
};

// Fungsi untuk login
export const LoginUser = createAsyncThunk("user/LoginUser", async (user, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:5000/login', {
            email: user.email,
            password: user.password
        }, { withCredentials: true }); // pastikan denganCredentials diaktifkan
        return response.data;
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        } else {
            return thunkAPI.rejectWithValue("Terjadi kesalahan jaringan.");
        }
    }
});

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
    try {
        const response = await axios.get('http://localhost:5000/me', { withCredentials: true }); // pastikan denganCredentials diaktifkan
        return response.data; 
    } catch (error) {
        if (error.response) {
            const message = error.response.data.msg;
            return thunkAPI.rejectWithValue(message);
        } else {
            return thunkAPI.rejectWithValue("Terjadi kesalahan jaringan.");
        }
    }
});

export const Logout = createAsyncThunk("user/Logout", async () => {
    await axios.delete('http://localhost:5000/logout', { withCredentials: true }); // pastikan denganCredentials diaktifkan
});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(LoginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload; 
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });

        builder
            .addCase(getMe.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload; 
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; 
            });
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;

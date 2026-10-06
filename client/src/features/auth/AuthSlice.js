import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false,
}


const authSlice = createSlice({
    name: "auth",
    initialState,


    reducers: {
        setUser: (state, action) => { 
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
            state.error = null;
        },

        setCredentials: (state, action) => { 
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
            state.loading = false;
        },

        setAccessToken: ( state, action ) => { 
            state.accessToken = action.payload;
            state.isAuthenticated = true;
        },

        clearUser: (state) => { 
            state.user = null;
            state.isAuthenticated = false;
        },

        setLoading: (state, action) => { 
            state.loading = action.payload;
        },

        setError: (state, action) => { 
            state.error = action.payload;
        },

        setInitialized: (state) => { 
            state.initialized = true;
        }
    }
})



export const {
    setUser,
    clearUser,
    setLoading,
    setError,
    setAccessToken,
    clearCredentials,
    setCredentials,
    setInitialized,
} = authSlice.actions;

export default authSlice.reducer;
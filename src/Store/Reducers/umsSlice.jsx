import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import makeApiRequest from '../../Utils/makeAPIRequest';
import { apiUrls } from '../../Utils/APIEndPoints';

export const fetchUsers = createAsyncThunk(
  'user/fetchusers',
  async (_, { getState, dispatch }) => {
    const state = getState()
    console.log(state)
    const options = { method: 'GET' };
    const token = state.auth?.user?.data?.token
    const response = await makeApiRequest(
      apiUrls.UserList,
      options,
      'application/json',
      dispatch,
      token,
      true
    );
    
    return response?.data?.users;
  }
  
);

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData, { getState, dispatch }) => {
    const state = getState()
    const token = state.auth?.user?.data?.token
    const options = {
      method: 'POST',
      data: userData,
    };
    const response = await makeApiRequest(
      apiUrls.CreateUser,
      options,
      'application/json',
      dispatch,
      token,
      true
    );
    return response?.data?.users;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ userId, userData }, { getState, dispatch }) => {
    const state = getState()
    const token = state.auth?.user?.data?.token
    const options = {
      method: 'PUT',
      data: userData,
    };
    const response = await makeApiRequest(
      `${apiUrls.UpdateUser}/${userId}`,
      options,
      'application/json',
      dispatch,
      token,
      true
    );
    return response?.data?.users;
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { getState, dispatch }) => {
    const state = getState()
    const token = state.auth?.user?.data?.token
    const options = {
      method: 'DELETE',
    };
    await makeApiRequest(
      `${apiUrls.DeleteUser}/${userId}`,
      options,
      'application/json',
      dispatch,
      token,
      true
    );
    return userId;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        // state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        // const index = state.users.findIndex(u => u.id === action.payload.id);
        // if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
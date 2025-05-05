import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import makeApiRequest from '../../Utils/makeAPIRequest';
import { apiUrls } from '../../Utils/APIEndPoints';

export const createTicket = createAsyncThunk(
  'ticket/createTicket',
  async (ticketData, { getState, dispatch }) => {
    const state = getState();
    const token = state.auth?.user?.data?.token;
    const userId = state.auth?.user?.data?.user?.id;
    
    const payload = {
      ...ticketData,
      updated_by: userId
    };

    const options = {
      method: 'POST',
      data: payload,
    };
    
    const response = await makeApiRequest(
      apiUrls.CreateTicket,
      options,
      'application/json',
      dispatch,
      token,
      true
    );
    return response?.data?.ticket;
  }
);

const ticketSlice = createSlice({
  name: 'ticket',
  initialState: {
    tickets: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        // state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ticketSlice.reducer;
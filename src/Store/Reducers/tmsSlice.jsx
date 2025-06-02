import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import makeApiRequest from "../../Utils/makeAPIRequest";
import { apiUrls } from "../../Utils/APIEndPoints";
import axios from "axios";

export const fetchTicketReplies = createAsyncThunk(
  "tms/fetchTicketReplies",
  async (ticket_id, { getState, dispatch }) => {
    const state = getState();
    const token = state.auth?.user?.data?.token;

    const response = await makeApiRequest(
      `${apiUrls.TicketReply}/${ticket_id}/replies`,
      { method: "GET" },
      "application/json",
      dispatch,
      token,
      true
    );
    return response?.ticket;
  }
);

export const addTicketReply = createAsyncThunk(
  "tms/addTicketReply",
  async ({ ticket_id, data }, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const token = state.auth?.user?.data?.token;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        `${apiUrls.TicketReply}/${ticket_id}/replies`,
        data,
        config
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      if (response.data.status === "failure") {
        const errorMsg = response.data.message || "Reply submission failed";
        throw new Error(errorMsg);
      }

      return response.data;
    } catch (error) {
      let errorMessage = "Failed to submit reply";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.errors?.[0]?.msg ||
          errorMessage;
      } else if (error.request) {
        errorMessage = "No response from server";
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const changeTicketStatus = createAsyncThunk(
  "tms/changeTicketStatus",
  async (data, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const token = state.auth?.user?.data?.token;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        apiUrls.TicketStatus,
        data,
        config
      );

      if (!response.data) {
        throw new Error("No data received from server");
      }

      if (response.data.status === "failure") {
        const errorMsg = response.data.message || "Status change failed";
        throw new Error(errorMsg);
      }

      return response.data;
    } catch (error) {
      let errorMessage = "Failed to change ticket status";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.errors?.[0]?.msg ||
          errorMessage;
      } else if (error.request) {
        errorMessage = "No response from server";
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const createTicket = createAsyncThunk(
  "tms/createTicket",
  async (formData, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const token = state.auth?.user?.data?.token;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "multipart/form-data",
        },
      };

      const response = await axios.post(apiUrls.CreateTicket, formData, config);

      if (!response.data) {
        throw new Error("No data received from server");
      }

      if (response.data.status === "failure") {
        const errorMsg = response.data.message || "Ticket creation failed";
        throw new Error(errorMsg);
      }

      return response.data?.ticket;
    } catch (error) {
      // Handle different error scenarios
      console.log(error);
      let errorMessage = "Failed to create ticket";

      if (error.response) {
        // Server responded with error status
        errorMessage =
          error.response.data?.message ||
          error.response.data?.errors?.[0]?.msg ||
          errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server";
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTickets = createAsyncThunk(
  "tms/fetchTickets",
  async (
    { page = 1, limit = 50, startDate, endDate },
    { getState, dispatch }
  ) => {
    const state = getState();
    const token = state.auth?.user?.data?.token;

    const params = new URLSearchParams({
      page,
      limit,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const options = {
      method: "GET",
    };

    const response = await makeApiRequest(
      `${apiUrls.TicketList}?${params.toString()}`,
      options,
      "application/json",
      dispatch,
      token,
      true
    );
    // console.log(response)
    // return response?.data;
    return {
      tickets: response.data,
      pagination: response.pagination,
    };
  }
);

const tmsSlice = createSlice({
  name: "tms",
  initialState: {
    tickets: [],
    currentTicket: null,
    replies: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      limit: 25,
    },
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setCurrentTicket: (state, action) => {
      state.currentTicket = action.payload;
    },
    clearReplies: (state) => {
      state.replies = [];
    },
  },
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
      })
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.tickets;
        state.pagination = {
          currentPage: action.payload.current_page || 1,
          totalPages: action.payload.total_pages || 1,
          totalItems: action.payload.total_items || 0,
          limit: action.payload.limit || 50,
        };
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // fetch ticket reply..
      .addCase(fetchTicketReplies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketReplies.fulfilled, (state, action) => {
        state.loading = false;
        state.replies = action.payload;
      })
      .addCase(fetchTicketReplies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
       // Add ticket reply
       .addCase(addTicketReply.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTicketReply.fulfilled, (state, action) => {
        state.loading = false;
        // state.replies.push(action.payload);
      })
      .addCase(addTicketReply.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Change ticket status
      .addCase(changeTicketStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeTicketStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentTicket) {
          state.currentTicket.status = action.payload.status;
        }
      })
      .addCase(changeTicketStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentPage,setCurrentTicket, clearReplies } = tmsSlice.actions;
export default tmsSlice.reducer;

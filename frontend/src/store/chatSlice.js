import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Initialize or resume session
const loadSessionId = () => {
  const existing = localStorage.getItem('agrisense_chat_session');
  if (existing) return existing;
  const newSession = uuidv4();
  localStorage.setItem('agrisense_chat_session', newSession);
  return newSession;
};

// Async Thunks
export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async ({ userId, sessionId }, { rejectWithValue }) => {
    try {
      const userStr = localStorage.getItem('agrisense_user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const response = await axios.get(`${BACKEND_URL}/api/rag/history/${userId}/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data; // array of messages
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ userId, sessionId, message, language }, { rejectWithValue }) => {
    try {
      const userStr = localStorage.getItem('agrisense_user');
      const token = userStr ? JSON.parse(userStr).token : '';
      const response = await axios.post(`${BACKEND_URL}/api/rag/chat`, {
        userId,
        sessionId,
        message,
        language,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data.response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

// We define an upload PDF thunk separately, even though we could use Axios directly in the UI.
export const uploadPDF = createAsyncThunk(
  'chat/uploadPDF',
  async ({ file, userId, sessionId, language }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('sessionId', sessionId);
      formData.append('language', language || 'en');

      const userStr = localStorage.getItem('agrisense_user');
      const token = userStr ? JSON.parse(userStr).token : '';

      const response = await axios.post(`${BACKEND_URL}/api/rag/uploadpdf`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload PDF');
    }
  }
);


const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sessionId: loadSessionId(),
    messages: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    uploadStatus: 'idle', // 'idle' | 'uploading' | 'success' | 'failed'
    error: null,
  },
  reducers: {
    // Optimistic UI update before waiting for backend
    addOptimisticMessage: (state, action) => {
      state.messages.push({
        role: 'user',
        content: action.payload,
        timestamp: new Date().toISOString()
      });
    },
    resetUploadStatus: (state) => {
      state.uploadStatus = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // History fetch
      .addCase(fetchChatHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload; // populate history
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages.push({
          role: 'ai',
          content: action.payload,
          timestamp: new Date().toISOString()
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Upload PDF
      .addCase(uploadPDF.pending, (state) => {
        state.uploadStatus = 'uploading';
      })
      .addCase(uploadPDF.fulfilled, (state) => {
        state.uploadStatus = 'success';
      })
      .addCase(uploadPDF.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addOptimisticMessage, resetUploadStatus } = chatSlice.actions;
export default chatSlice.reducer;

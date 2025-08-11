import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../lib/axiosInstance';

const API_BASE_URL = 'http://localhost:8082';

export interface Defect {
  id: number;
  defect: string;
}

export interface AnnonceImage {
  id: number;
  image: string;
}

export interface Annonce {
  id: number;
  brand: string;
  model: string;
  fuelType: string;
  location: string;
  price: number;
  year: number;
  mileage: number;
  transmission: string;
  description: string;
  images?: AnnonceImage[];
  defects?: Defect[];
  user?: { id: number };
}

export interface AnnonceState {
  annonces: Annonce[];
  userAnnonces: Annonce[];
  currentAnnonce: Annonce | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

const initialState: AnnonceState = {
  annonces: [],
  userAnnonces: [],
  currentAnnonce: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

// Async thunks
/*export const createAnnonce = createAsyncThunk(
  'annonces/create',
  async (annonceData: Omit<Annonce, 'id'>, { rejectWithValue }) => {
    console.log('[createAnnonce] Appel du thunk pour /annonce/create');
    console.log('Données envoyées:', annonceData);
    console.log('Token dans localStorage:', localStorage.getItem('token'));
    try {
      const response = await axios.post(`${API_BASE_URL}/annonce/create`, annonceData);
      console.log('[createAnnonce] Réponse:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[createAnnonce] Erreur:', error);
      return rejectWithValue(error.response?.data || 'Failed to create listing');
    }
  }
);*/

export const createAnnonce = createAsyncThunk(
  'annonces/create',
  async (formData: FormData, { rejectWithValue }) => {
    console.log('[createAnnonce] Envoi du FormData au backend');
    const token = localStorage.getItem('token');
    console.log('les donnes a envoyeer:', formData.get('annonce'));
    try {
      const response = await axios.post(`${API_BASE_URL}/annonce/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('[createAnnonce] Réponse:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[createAnnonce] Erreur:', error);
      return rejectWithValue(error.response?.data || 'Failed to create listing');
    }
  }
);


export const getAllAnnonces = createAsyncThunk(
  'annonces/getAll',
  async (_, { rejectWithValue }) => {
    console.log('[getAllAnnonces] Appel du thunk pour /annonce/getall');
    console.log('Token dans localStorage:', localStorage.getItem('token'));
    try {
      const response = await axios.get(`${API_BASE_URL}/annonce/getall`);
      console.log('tous a passer avec succees ', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[getAllAnnonces] Erreur:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch listings');
    }
  }
);

export const getUserAnnonces = createAsyncThunk(
  'annonces/getUserAnnonces',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/annonce/getall/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch user listings');
    }
  }
);

export const updateAnnonce = createAsyncThunk(
  'annonces/update',
  async ({ id, data }: { id: number; data: Partial<Annonce> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/annonce/update/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update listing');
    }
  }
);

export const deleteAnnonce = createAsyncThunk(
  'annonces/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/annonce/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete listing');
    }
  }
);

const annonceSlice = createSlice({
  name: 'annonces',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAnnonce: (state, action: PayloadAction<Annonce | null>) => {
      state.currentAnnonce = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create annonce
      .addCase(createAnnonce.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAnnonce.fulfilled, (state, action) => {
        state.isLoading = false;
        state.annonces.unshift(action.payload);
        state.userAnnonces.unshift(action.payload);
      })
      .addCase(createAnnonce.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get all annonces
      .addCase(getAllAnnonces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllAnnonces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.annonces = action.payload;
      })
      .addCase(getAllAnnonces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get user annonces
      .addCase(getUserAnnonces.fulfilled, (state, action) => {
        state.userAnnonces = action.payload;
      })
      // Update annonce
      .addCase(updateAnnonce.fulfilled, (state, action) => {
        const index = state.annonces.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.annonces[index] = action.payload;
        }
        const userIndex = state.userAnnonces.findIndex(a => a.id === action.payload.id);
        if (userIndex !== -1) {
          state.userAnnonces[userIndex] = action.payload;
        }
      })
      // Delete annonce
      .addCase(deleteAnnonce.fulfilled, (state, action) => {
        state.annonces = state.annonces.filter(a => a.id !== action.payload);
        state.userAnnonces = state.userAnnonces.filter(a => a.id !== action.payload);
      });
  },
});

export const { clearError, setCurrentAnnonce, setCurrentPage } = annonceSlice.actions;
export default annonceSlice.reducer;
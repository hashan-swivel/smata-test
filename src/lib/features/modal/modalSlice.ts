import { createSlice } from '@reduxjs/toolkit';

// Define the type for the counter state
interface ModalState {
  addInvoiceModal: boolean;
}

const initialState: ModalState = {
  addInvoiceModal: false
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showAddInvoiceModal: (state) => {
      state.addInvoiceModal = true;
    },
    hideAddInvoiceModal: (state) => {
      state.addInvoiceModal = false;
    }
    // Additional actions can be defined here
  }
});

// Export actions with type annotations
export const { showAddInvoiceModal, hideAddInvoiceModal } = modalSlice.actions;

// Export the reducer function with type annotations
export const modalReducer = modalSlice.reducer;

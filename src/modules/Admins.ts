import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '.';
import Api from 'Api';
import Admin from 'types/Admin';

export interface AdminsState {
  admins: Admin[];
}

const initialState: AdminsState = {
  admins: [],
};
export const adminsSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    setAdmins: (state: AdminsState, action: { payload: Admin[] }) => {
      state.admins = action.payload;
    },
    setAdmin(state: AdminsState, action: { payload: Admin }) {
      state.admins.push(action.payload);
    },
  },
});

export const { setAdmins, setAdmin } = adminsSlice.actions;

export default adminsSlice.reducer;

export function getAdmins() {
  return async (dispatch: AppDispatch) => {
    return Api.getAdmins().then((data) => {
      dispatch(setAdmins(data));
    });
  };
}
export function createAdmin(adminData: Partial<Admin>) {
  return async (dispatch: AppDispatch) => {
    return Api.createAdmin(adminData).then((data) => {
      dispatch(setAdmin(data));
    });
  };
}

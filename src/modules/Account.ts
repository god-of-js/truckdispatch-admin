import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '.';
import Api from 'Api';
import User from '../types/User';
import BankAccount from 'types/BankDetails';
import { saveTokenVerificationInfo } from 'utils/helpers';
import {
  saveAuthSessionId,
  saveUserSessionId,
} from 'utils/localStorageMethods';
import Payment from 'types/Payment';
import WithdrawalDetails from 'types/WithdrawalDetails';

export interface AccountState {
  user: User | null;
}

const initialState: AccountState = {
  user: null,
};
export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUser: (state: AccountState, action: { payload: User | null }) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = accountSlice.actions;

export default accountSlice.reducer;

export function registerUser(AuthUser: Partial<User>) {
  return async () => {
    await Api.createUser(AuthUser);
  };
}

export function sendOTP(phone: string) {
  return () => {
    return Api.requestVerificationCode({ phone }).then((data) => {
      saveTokenVerificationInfo(data);
    });
  };
}

export function verifyOtp(pin: string) {
  return async () => {
    const otpPhone = localStorage.getItem('otp-phone-number');

    if (!otpPhone)
      throw new Error(
        'Something went wrong. Kindly request a new OTP for verification',
      );

    const data = {
      pin,
      phone: otpPhone,
    };

    return Api.verifyPhone(data)
      .then(() => {
        localStorage.removeItem('otp-phone-number');
      })
      .catch((err) => Promise.reject(err.data));
  };
}
export function verifyEmail(token: string) {
  return () => {
    return Api.verifyEmail({
      token,
    })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  };
}

export function updateUser(data: FormData) {
  return (dispatch: AppDispatch) => {
    return Api.updateUser(data).then((user) => {
      dispatch(setUser(user));
      return user;
    });
  };
}

export function getUserDetailsById(userId: string) {
  return () => {
    return Api.getUserDetailsById(userId).then((user) => {
      return user;
    });
  };
}

export function updatePassword(data: { password: string }) {
  return () => {
    return Api.updatePassword(data);
  };
}

export function loginUser(AuthUser: { email: string; password: string }) {
  return () => {
    return Api.signInWithEmailAndPassword(AuthUser)
      .then(({ jwt }) => {
        saveUserSessionId(jwt);
      })
      .catch((err) => {
        if (err.message === 'Phone has not been verified') {
          saveTokenVerificationInfo(err.data);
        }
        return Promise.reject(err);
      });
  };
}

export function requestForgotPasswordLink(AuthUser: { email: string }) {
  return () => {
    return Api.requestResetPasswordLink(AuthUser);
  };
}

export function resetUserPassword(passwordDetails: {
  password: string;
  token: string;
}) {
  return () => {
    return Api.resetUserPassword(passwordDetails);
  };
}

export function getDashboardUser() {
  return (dispatch: AppDispatch) => {
    return Api.getUser().then((data) => {
      dispatch(setUser(data));
      return data;
    });
  };
}

export const createUserBankAccount = (accountDetails: BankAccount) => {
  return (dispatch: AppDispatch) => {
    return Api.saveAccountNumber(accountDetails).then((user) => {
      dispatch(setUser(user));
    });
  };
};

export const requestEmailVerification = () => {
  return () => {
    return Api.requestEmailVerification();
  };
};

export const topupBalance = (paymentDetails: Payment) => {
  return (dispatch: AppDispatch) => {
    return Api.topupWallet(paymentDetails).then((user) => {
      dispatch(setUser(user));
    });
  };
};

export const withdrawFromBalance = (withdrawalDetails: WithdrawalDetails) => {
  return (dispatch: AppDispatch) => {
    return Api.withdrawFromBalance(withdrawalDetails).then((user) => {
      dispatch(setUser(user));
    });
  };
};

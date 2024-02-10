import axios from 'axios';
import { BACKEND_URL } from 'utils/privateKeys';
import { Toast } from 'utils/toast';
import {
  getAuthSessionId,
  getUserSessionId,
  removeUserSessionId,
} from 'utils/localStorageMethods';

let isRedirecting = false;
const instance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 240000,
});

instance.interceptors.response.use(
  (response) => response,
  (err) => {
    if (!err.response && err.request) {
      Toast.error({
        msg: 'Something went wrong. Kindly check your connection and inform the team if the issue persists.',
      });
    }

    const errorData = err.response && err.response.data;

    // if (errorData) {
    //   const errorMessage = errorData.message;
    //   if (
    //     (errorMessage === 'jwt expired' ||
    //       errorMessage === 'invalid signature' ||
    //       errorMessage === 'No JWT was provided' ||
    //       errorMessage === 'User does not exist' ||
    //       // errorMessage === 'Admin does not exist' ||
    //       errorMessage === 'Invalid JWT') &&
    //     !isRedirecting
    //   ) {
    //     isRedirecting = true;
    //     removeUserSessionId();
    //     window.location.href = '/auth/login';
    //     window.location.reload();
    //   }
    // }
    return Promise.reject(err);
  },
);

function authorizedInstance() {
  if (!instance.defaults.headers.Authorization) {
    // Auth session ID is in case of authentications.
    const token = getUserSessionId() || getAuthSessionId();
    if (token) instance.defaults.headers.Authorization = `Bearer ${token}`;
  }
  return instance;
}
export default authorizedInstance;

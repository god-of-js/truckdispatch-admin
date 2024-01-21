import User from '../types/User';
import axiosInstance from './AxiosInstance';
import Trip from 'types/Trip';
import Bid from 'types/Bid';
import Rating from 'types/Rating';
import PaymentRequest from 'types/PaymentRequest';
import Chat from 'types/Chat';
import Verification from 'types/Verification';
import VerifyPhoneData from 'types/VerifyPhoneData';
import NewTrip from 'types/NewTrip';
import { Toast } from 'utils/toast';
import AssignTripFormData from 'types/AssignTripFormData';
import { Bank } from './paystackIntegrations';
import AccountDetails from 'types/AccountDetails';
import BankDetails from 'types/BankDetails';
import TokenVerificationData from 'types/TokenVerificationData';
import LoginResponse from 'types/LoginResponse';
import ChatLogData from 'types/CreateChatLog';
import ChatLog from 'types/ChatLog';
import Vehicle from 'types/Vehicle';
import CreateBid from 'types/CreateBid';
import ResetUserPassword from 'types/ResetUserPassword';
import UserFullProfile from 'types/UserFullProfile';
import Payment from 'types/Payment';
import WithdrawalDetails from 'types/WithdrawalDetails';
import Admin from 'types/Admin';

class ApiService {
  createUser(userData: Partial<User>) {
    return this.post<{ smsData: TokenVerificationData; token: string }>(
      '/admin/auth/join',
      userData,
    );
  }

  signInWithEmailAndPassword(data: { email: string; password: string }) {
    return this.post<LoginResponse>('/admin/auth/login', data);
  }

  requestResetPasswordLink(data: { email: string }) {
    return this.post('/auth/request-reset-password', data);
  }
  resetUserPassword(data: ResetUserPassword) {
    return this.post('/auth/reset-password', data);
  }

  requestVerificationCode(data: { phone: string }) {
    return this.post<TokenVerificationData>('/auth/request-sms', data);
  }

  requestEmailVerification() {
    return this.post('/auth/request-email-verification');
  }

  verifyPhone(data: VerifyPhoneData) {
    return this.post<{ token: string }>('/auth/verify-phone', data);
  }

  verifyEmail(data: { token: string }) {
    return this.post<User>('/auth/verify-email', data);
  }

  updateUser(data: FormData) {
    return this.patch<User>('/user', data);
  }

  createTrip(data: NewTrip): Promise<Trip> {
    return this.post('/trips', data);
  }

  updateTrip(data: Partial<Trip>): Promise<Trip> {
    return this.patch(`/trips/${data._id}`, data);
  }

  getTrip(tripId: string): Promise<Trip> {
    return this.get(`/trips/${tripId}`, true);
  }

  getJob(jobId: string): Promise<Trip> {
    return this.get(`/trips/jobs/${jobId}`);
  }

  updateTripStatus(tripId: string, status: string): Promise<Trip> {
    return this.patch(`/trips/${tripId}/change-status/${status}`);
  }

  async getTrips({
    page,
    limit,
    status,
  }: {
    page: number;
    limit: number;
    status?: string | null;
  }) {
    const data = await this.get(
      `/trips?&page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
    );

    return {
      data: data.data as Trip[],
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalItems: data.totalItems,
      inProgress: data.inProgress,
      completed: data.completed,
      pending: data.pending,
    };
  }

  getUser() {
    return this.get<User>('/admin');
  }

  getAdmins(): Promise<Admin[]> {
    return this.get(`/admin/admins`);
  }

  getUserDetailsById(userId: string) {
    return this.get<UserFullProfile>(`/user/${userId}`);
  }

  startVerificationProcess(data: FormData) {
    return this.post<Verification>('/verification', data);
  }

  startCompanyUpgradeVerificationProcess(data: FormData) {
    return this.post('/verification/company', data);
  }

  updateVerification(data: FormData) {
    return this.patch<Verification>('/verification', data);
  }

  getVerificationByUserId() {
    return this.get<Verification>('/verification');
  }

  assignTrip(data: AssignTripFormData) {
    return this.post<{ trip: Trip; user: User }>(
      `/trips/${data.tripId}/assign-trip`,
      data,
    );
  }

  saveAccountNumber(accountDetails: BankDetails) {
    return this.post<User>('/user/bank-details', accountDetails);
  }

  updatePassword(data: { password: string }) {
    return this.post<User>('/user/update-password', data);
  }

  async getJobs({
    page,
    limit,
    senderType,
  }: {
    page?: number;
    limit?: number;
    senderType?: string;
  }) {
    const data = await this.get(
      `/trips/jobs?page=${page}&limit=${limit}${
        senderType ? `&senderType=${senderType}` : ''
      }`,
    );

    return {
      data: data.data as Trip[],
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalItems: data.totalItems,
      byCompany: data.byCompany,
      byShipper: data.byShipper,
    };
  }

  uploadTDO(formData: FormData, tripId: string) {
    return this.post<Trip>(`/trips/${tripId}/upload-tdo`, formData);
  }

  unassignTrip(tripId: string) {
    return this.post<{ trip: Trip; user: User }>(
      `/trips/${tripId}/unassign-trip`,
    );
  }

  cancelTripByTripCreator(tripId: string) {
    return this.delete<User | undefined>(
      `/trips/${tripId}/cancel-trip-by-trip-owner`,
    );
  }

  cancelTripByTransporter(tripId: string) {
    return this.patch<{ trip: Trip; user: User }>(
      `/trips/${tripId}/cancel-trip-by-transporter`,
    );
  }

  createBid(data: CreateBid) {
    return this.post<Bid>(`/bids/${data.tripId}`, data);
  }

  updateBid(data: CreateBid): Promise<Bid> {
    return this.patch<Bid>(`/bids/${data.tripId}`, data);
  }

  deleteBid(bidId: string, tripId: string): Promise<Bid> {
    return this.delete<Bid>(`/bids/${tripId}/${bidId}`);
  }

  requestPaymentByTransporter(data: FormData, tripId: string): Promise<Trip> {
    return this.post(`/payment/request-payment/trip/${tripId}`, data);
  }

  updatePaymentRequest(
    data: FormData,
    tripId: string,
    paymentRequestId: string,
  ): Promise<Trip> {
    return this.patch(
      `/payment/request-payment/trip/${tripId}/update/${paymentRequestId}`,
      data,
    );
  }

  getPaymentRequestsOfDriver() {
    return this.get<PaymentRequest[]>('/payment/payment-requests');
  }

  rejectPaymentRequest(
    tripId: string,
    paymentRequestId: string,
    data: { reasonForReject: string },
  ) {
    return this.post<Trip>(
      `/payment/payment-request/trip/${tripId}/reject/${paymentRequestId}`,
      data,
    );
  }

  approvePaymentRequest(tripId: string, paymentRequestId: string) {
    return this.post<{ trip: Trip; user: User }>(
      `/payment/payment-request/trip/${tripId}/approve/${paymentRequestId}`,
    );
  }

  getBidsWithTripId(tripId: string) {
    return this.get<Bid[]>(`/bids/${tripId}`);
  }

  getTransporterBids() {
    return this.get<Bid[]>(`/bids`);
  }

  createChat(chat: Chat) {
    return this.post('/chat', chat, true);
  }

  createOrFetchChatLog(chat: ChatLogData) {
    return this.post<ChatLog>('/chat/log', chat, true);
  }

  publishUserRating(data: Rating) {
    return this.post(`/rating/${data.tripId}`, data);
  }

  getUserChats() {
    return this.get<Chat[]>(`/chat`);
  }

  getChatLogs() {
    return this.get<ChatLog[]>(`/chat/logs`);
  }

  setChatHasBeenRead(chatLog: string) {
    return this.patch<Chat>(`/chat/read/${chatLog}`, {}, true);
  }

  getBanks(): Promise<Bank[]> {
    return this.get('/externals/banks');
  }

  getRating(tripId: string) {
    return this.get<Rating>(`/rating/${tripId}`);
  }

  createVehicle(vehicleData: FormData) {
    return this.post<Vehicle>(`/vehicle`, vehicleData);
  }

  updateVehicle(vehicleData: FormData, vehicleId: string) {
    return this.patch<Vehicle>(`/vehicle/${vehicleId}`, vehicleData);
  }
  deleteVehicle(vehicleId: string) {
    return this.delete(`/vehicle/${vehicleId}`);
  }

  async getVehicles({ page, limit }: { page: number; limit: number }) {
    const data = await this.get(`/vehicle?page=${page}&limit=${limit}`);

    return {
      data: data.data as Vehicle[],
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      totalItems: data.totalItems,
    };
  }

  loadAccountDetails(
    bankCode: string,
    accountNumber: string,
  ): Promise<AccountDetails> {
    return this.get(
      `/externals/banks/account?account_number=${accountNumber}&bank_code=${bankCode}`,
    );
  }

  topupWallet(paymentDetails: Payment): Promise<User> {
    return this.post('/wallet/top-up', paymentDetails);
  }
  withdrawFromBalance(paymentDetails: WithdrawalDetails): Promise<User> {
    return this.post('/wallet/withdraw', paymentDetails);
  }

  private get<T = any>(url: string, allowRawError?: boolean): Promise<T> {
    return axiosInstance()
      .get(url)
      .then(({ data }) => data.data)
      .catch((err) => {
        if (allowRawError) {
          return Promise.reject(err.response);
        }
        return Promise.reject(err.response.data);
      });
  }

  private post<T>(url: string, data?: unknown, silent = false): Promise<T> {
    return axiosInstance()
      .post(url, data)
      .then(({ data }) => {
        if (!silent) Toast.success({ msg: data.message });
        return data.data;
      })
      .catch(({ response }) => {
        Toast.error({ msg: response.data.message });
        return Promise.reject(response.data);
      });
  }

  private patch<T>(url: string, data?: unknown, silent = false): Promise<T> {
    return axiosInstance()
      .patch(url, data)
      .then(({ data }) => {
        if (!silent) Toast.success({ msg: data.message });
        return data.data;
      })
      .catch(({ response }) => {
        Toast.error({ msg: response.data.message });
        return Promise.reject(response.data);
      });
  }

  private delete<T>(url: string, silent = false): Promise<T> {
    return axiosInstance()
      .delete(url)
      .then(({ data }) => {
        if (!silent) Toast.success({ msg: data.message });
        return data.data;
      })
      .catch(({ response }) => {
        Toast.error({ msg: response.data.message });
        return Promise.reject(response.data);
      });
  }
}

export default new ApiService();

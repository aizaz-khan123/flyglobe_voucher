export const BASE_URL_V1 = process.env.NEXT_PUBLIC_API_BASE_URL

// export const BASE_URL_V1 = "https://73b4-2400-adc5-482-c800-b40f-b5dd-83be-9956.ngrok-free.app/api/v1";
// export const NEXT_PUBLIC_BACKEND_URL = "https://73b4-2400-adc5-482-c800-b40f-b5dd-83be-9956.ngrok-free.app";
export const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const API_END_POINTS = {
  login: BASE_URL_V1 + '/auth/login',
  resend: BASE_URL_V1 + '/auth/re-send',
  verify: BASE_URL_V1 + '/auth/verify',
  logout: BASE_URL_V1 + '/auth/logout',
  sendResetRequest: BASE_URL_V1 + '/auth/forgot-password',
  register: BASE_URL_V1 + '/auth/register',
  resetPassword: BASE_URL_V1 + '/auth/reset-password',
  forgotPassword: BASE_URL_V1 + '/auth/forgot-password',
  adminChangePassword: BASE_URL_V1 + '/auth/admin-change-password',
  locations: BASE_URL_V1 + '/locations',
  flightSearch: BASE_URL_V1 + '/flight/search',
  initiating: BASE_URL_V1 + '/booking/initiating',
  bookingAvailabilityConfirmation: BASE_URL_V1 + '/booking/confirm-availability',
  bookingConfirm: BASE_URL_V1 + '/booking/booking-confirm',
  bookingList: BASE_URL_V1 + '/booking/bookings-list',
  bookingCancel: BASE_URL_V1 + '/booking/cancel-booking',
  downloadBooking: BASE_URL_V1 + '/booking/download-booking',
  bookingById: BASE_URL_V1 + '/booking/getById',
  ticketOtpEmail: BASE_URL_V1 + '/booking/ticket-otp-email',
  issueTicket: BASE_URL_V1 + '/booking/issue-ticket',
  bookingEmail: BASE_URL_V1 + '/booking/email-booking',
  branchDropDown: BASE_URL_V1 + '/organization/branch/drop-down',
  dropDownByType: BASE_URL_V1 + '/organization/branch/drop-down-by-type',
  voidTicket: BASE_URL_V1 + '/booking/void-ticket',


}

export const BASE_URL_V1 = process.env.NEXT_PUBLIC_API_BASE_URL

// export const BASE_URL_V1 = "https://73b4-2400-adc5-482-c800-b40f-b5dd-83be-9956.ngrok-free.app/api/v1";
// export const NEXT_PUBLIC_BACKEND_URL = "https://73b4-2400-adc5-482-c800-b40f-b5dd-83be-9956.ngrok-free.app";
export const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const API_END_POINTS = {
  getUser: NEXT_PUBLIC_BACKEND_URL + '/api/user',
  login: BASE_URL_V1 + '/auth/login',
  resend: BASE_URL_V1 + '/auth/re-send',
  verify: BASE_URL_V1 + '/auth/verify',
  logout: BASE_URL_V1 + '/auth/logout',
  sendResetRequest: BASE_URL_V1 + '/auth/forgot-password',
  register: BASE_URL_V1 + '/auth/register',
  resetPassword: BASE_URL_V1 + '/auth/reset-password',
  forgotPassword: BASE_URL_V1 + '/auth/forgot-password',
  adminChangePassword: BASE_URL_V1 + '/auth/admin-change-password',
  getProfile: BASE_URL_V1 + '/profile',

  // Banks Accounts
  getBankAccounts: BASE_URL_V1 + '/settings/bank-account/index',
  createBankAccount: BASE_URL_V1 + '/settings/bank-account/store',
  showBankAccount: BASE_URL_V1 + '/settings/bank-account/show',
  deleteBankAccount: BASE_URL_V1 + '/settings/bank-account/delete',
  updateBankAccount: BASE_URL_V1 + '/settings/bank-account/update',

  // Airlines
  getAirlines: BASE_URL_V1 + '/settings/airline/index',
  createAirline: BASE_URL_V1 + '/settings/airline/store',
  showAirline: BASE_URL_V1 + '/settings/airline/show',
  deleteAirline: BASE_URL_V1 + '/settings/airline/delete',
  updateAirline: BASE_URL_V1 + '/settings/airline/update',
  getCountryDropDown: BASE_URL_V1 + '/settings/country/drop-down',

  // Airports
  getAirports: BASE_URL_V1 + '/settings/airport/index',
  createAirport: BASE_URL_V1 + '/settings/airport/store',
  showAirport: BASE_URL_V1 + '/settings/airport/show',
  deleteAirport: BASE_URL_V1 + '/settings/airport/delete',
  updateAirport: BASE_URL_V1 + '/settings/airport/update',

  // Countries
  getCountries: BASE_URL_V1 + '/settings/country/index',
  createCountry: BASE_URL_V1 + '/settings/country/store',
  showCountry: BASE_URL_V1 + '/settings/country/show',
  deleteCountry: BASE_URL_V1 + '/settings/country/delete',
  updateCountry: BASE_URL_V1 + '/settings/country/update',

  // News
  getNews: BASE_URL_V1 + '/settings/news/index',
  createNews: BASE_URL_V1 + '/settings/news/store',
  showNews: BASE_URL_V1 + '/settings/news/show',
  deleteNews: BASE_URL_V1 + '/settings/news/delete',
  updateNews: BASE_URL_V1 + '/settings/news/update',

  // Suppliers
  getSuppliers: BASE_URL_V1 + '/settings/supplier/index',
  createSupplier: BASE_URL_V1 + '/settings/supplier/store',
  showSupplier: BASE_URL_V1 + '/settings/supplier/show',
  updateSupplier: BASE_URL_V1 + '/settings/supplier/update',
  deleteSupplier: BASE_URL_V1 + '/settings/supplier/delete',
  supplierDropDownList: BASE_URL_V1 + '/settings/supplier/drop-down',

  // Connectors
  showConnector: BASE_URL_V1 + '/settings/connector/show',
  updateConnector: BASE_URL_V1 + '/settings/connector/update',
  airlineDropDown: BASE_URL_V1 + '/settings/airline/drop-down',
  connectorDropDown: BASE_URL_V1 + '/settings/connector/drop-down',

  // Airline Margins
  getAirlineMargins: BASE_URL_V1 + '/settings/airline-margin/index',
  createAirlinMargin: BASE_URL_V1 + '/settings/airline-margin/store',
  showAirlinMargin: BASE_URL_V1 + '/settings/airline-margin/show',
  updateAirlinMargin: BASE_URL_V1 + '/settings/airline-margin/update',
  deleteAirlinMargin: BASE_URL_V1 + '/settings/airline-margin/delete',

  // Branches
  createBranch: BASE_URL_V1 + '/organization/branch/store',
  getBranches: BASE_URL_V1 + '/organization/branch/index',
  deleteBranch: BASE_URL_V1 + '/organization/branch/delete',
  updateBranch: BASE_URL_V1 + '/organization/branch/update',
  statusUpdate: BASE_URL_V1 + '/organization/branch/status-change',
  branchDropDown: BASE_URL_V1 + '/organization/branch/drop-down',
  dropDownByType: BASE_URL_V1 + '/organization/branch/drop-down-by-type',

  // Set Password Link
  verifySetPasswordLink: BASE_URL_V1 + '/verify-set-password-link',

  // Agency
  createAgency: BASE_URL_V1 + '/organization/agency/store',
  getAgencies: BASE_URL_V1 + '/organization/agency/index',
  deleteAgency: BASE_URL_V1 + '/organization/agency/delete',
  updateAgency: BASE_URL_V1 + '/organization/agency/update',
  agencystatusUpdate: BASE_URL_V1 + '/organization/agency/status-change',

  // Employee
  createEmployee: BASE_URL_V1 + '/organization/employee/store',
  getEmployees: BASE_URL_V1 + '/organization/employee/index',
  deleteEmployee: BASE_URL_V1 + '/organization/employee/delete',
  updateEmployee: BASE_URL_V1 + '/organization/employee/update',
  employeeStatusUpdate: BASE_URL_V1 + '/organization/employee/status-change',

  //////////////////////////////
  locations: BASE_URL_V1 + '/locations',

  permissionList: BASE_URL_V1 + '/permission-list',
  permissionUpdate: BASE_URL_V1 + '/update-permission',

  ///////// fight /////////
  flightSearch: BASE_URL_V1 + '/flight/search',

  ///////// booking /////////
  initiating: BASE_URL_V1 + '/booking/initiating',
  bookingAvailabilityConfirmation: BASE_URL_V1 + '/booking/confirm-availability',
  bookingConfirm: BASE_URL_V1 + '/booking/booking-confirm',
  bookingById: BASE_URL_V1 + '/booking/getById',
  bookingCancel: BASE_URL_V1 + '/booking/cancel-booking',
  issueTicket: BASE_URL_V1 + '/booking/issue-ticket',
  voidTicket: BASE_URL_V1 + '/booking/void-ticket',
  searchBooking: BASE_URL_V1 + '/booking/search',
  bookingEmail: BASE_URL_V1 + '/booking/email-booking',
  ticketOtpEmail: BASE_URL_V1 + '/booking/ticket-otp-email',
  bookingList: BASE_URL_V1 + '/booking/bookings-list',
  downloadBooking: BASE_URL_V1 + '/booking/download-booking',

  //// settings //////
  temporaryLimit: BASE_URL_V1 + '/setting/temporary-limit',
  generalSetting: BASE_URL_V1 + '/setting/general-setting',
  finanicalProfile: BASE_URL_V1 + '/setting/finanical-profile',
  dashboardStats: BASE_URL_V1 + '/dashboard/stats',
  dashboardSaleStatics: BASE_URL_V1 + '/dashboard/sale-statistics',
  assignToBranchByAirline: BASE_URL_V1 + '/margin/assign-to-branch-by-airline',
  branchMargins: BASE_URL_V1 + '/margin/branch-margins',
  agenciesMargins: BASE_URL_V1 + '/margin/agencies-margins',
  agencyMarginAssign: BASE_URL_V1 + '/margin/agency-margin-assign',
  branchMargin: BASE_URL_V1 + '/margin/branch-margin',
  assignMarginBranch: BASE_URL_V1 + '/margin/assign-margin-branch',
}

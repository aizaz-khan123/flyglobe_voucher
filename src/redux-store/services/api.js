import { API_END_POINTS } from './ApiEndPoints';
import { emptySplitApi } from './emptySplitApi';

export const api = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: API_END_POINTS.login,
        method: 'POST',
        body,
      }),
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: API_END_POINTS.resetPassword,
        method: 'POST',
        body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: API_END_POINTS.forgotPassword,
        method: 'POST',
        body,
      }),
    }),

    resend: builder.mutation({
      query: (body) => ({
        url: API_END_POINTS.resend,
        method: 'POST',
        body,
      }),
    }),
    verify: builder.mutation({
      query: (body) => ({
        url: API_END_POINTS.verify,
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation({
      query: (body) => ({
        url: API_END_POINTS.logout,
        method: 'POST',
      }),
    }),
    locationsLookup: builder.query({
      query: (params) => ({
        url: API_END_POINTS.locations,
        method: 'GET',
        params,
      }),
    }),
    flightSearch: builder.mutation({
      query: (body) => ({
        url: `${API_END_POINTS.flightSearch}`,
        method: "POST",
        body
      }),
    }),
    initiating: builder.mutation({
      query: (body) => ({
        url: `${API_END_POINTS.initiating}`,
        method: "POST",
        body
      }),
    }),

    bookingAvailabilityConfirmation: builder.query({
      query: (bookingId) => ({
        url: `${API_END_POINTS.bookingAvailabilityConfirmation}?confirmation_id=${bookingId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
    bookingConfirm: builder.mutation({
      query: (body) => ({
        url: `${API_END_POINTS.bookingConfirm}`,
        method: "POST",
        body
      }),
    }),
    bookingList: builder.query({
      query: ({ pageUrl, searchText, ...filters }) => ({
        url: pageUrl || API_END_POINTS.bookingList,
        method: "GET",
        params: {
          q: searchText,
          ...filters

        }
      }),
      providesTags: ["Agencies"],
      transformResponse: (response) => response.data,
    }),
    bookingCancel: builder.mutation({
      query: ({ bookingPnr }) => ({
        url: `${API_END_POINTS.bookingCancel}`,
        method: "POST",
        body: {
          'reservation_id': bookingPnr,
        }
      }),
    }),
    downloadBooking: builder.mutation({
      query: (body) => ({
        url: API_END_POINTS.downloadBooking,
        method: "POST",
        body
      }),
      transformResponse: (response) => response.data,
    }),
    bookingById: builder.query({
      query: (bookingId) => ({
        url: `${API_END_POINTS.bookingById}/${bookingId}`,
        method: 'GET',
      }),
      transformResponse: (response) => response.data,
    }),
    ticketOtpEmail: builder.mutation({
      query: () => ({
        url: API_END_POINTS.ticketOtpEmail,
        method: "GET",
      }),
    }),
    issueTicket: builder.mutation({
      query: ({ bookingId, otpCode }) => ({
        url: `${API_END_POINTS.issueTicket}`,
        method: "POST",
        body: {
          'reservation_id': bookingId,
          otp: otpCode,
        }
      }),
    }),
    bookingEmail: builder.mutation({
      query: (body) => ({
        url: API_END_POINTS.bookingEmail,
        method: "POST",
        body
      }),
    }),
    branchDropDown: builder.query({
      query: () => ({
        url: API_END_POINTS.branchDropDown,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
    dropDownByType: builder.query({
      query: ({ roleType }) => ({
        url: API_END_POINTS.dropDownByType,
        method: 'POST',
        body: {
          type: roleType
        },
      }),
    }),
    voidTicket: builder.mutation({
      query: (body) => ({
        url: `${API_END_POINTS.voidTicket}`,
        method: "POST",
        body
      }),
    }),

  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useResendMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
  useVerifyMutation,
  useLogoutMutation,
  useLazyLocationsLookupQuery,
  useFlightSearchMutation,
  useInitiatingMutation,
  useBookingConfirmMutation,
  useBookingAvailabilityConfirmationQuery,
  useBookingListQuery,
  useBookingCancelMutation,
  useDownloadBookingMutation,
  useBookingByIdQuery,
  useTicketOtpEmailMutation,
  useIssueTicketMutation,
  useBookingEmailMutation,
  useBranchDropDownQuery,
  useDropDownByTypeQuery,
  useVoidTicketMutation,



} = api;

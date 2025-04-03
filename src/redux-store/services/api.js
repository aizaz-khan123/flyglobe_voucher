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

} = api;

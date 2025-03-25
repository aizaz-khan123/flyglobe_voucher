import { API_END_POINTS } from './ApiEndPoints';
import { emptySplitApi } from './emptySplitApi';

export const api = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
  overrideExisting: false,
});

export const {

  useLazyLocationsLookupQuery,
  useFlightSearchMutation,
  useInitiatingMutation,


} = api;

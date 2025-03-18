import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Api_End_Parameters } from "./ApiEndParameters";


const ApiEndParameters = Api_End_Parameters;

export const EndPointsApis = createApi({
  reducerPath: 'EndPointsApis',
  baseQuery: async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      // baseUrl: "https://afdapidev.azurewebsites.net/api/",
      baseUrl: "https://afdapiuat.azurewebsites.net/api/",


      prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
          headers.set('authorization', `Bearer ${token}`);
        }
        if (!(args.body instanceof FormData)) {
          headers.set('Content-Type', 'application/json');
        }
        // headers.set('Content-Type', 'application/json');
        return headers;
      },
    });

    const result = await baseQuery(args, api, extraOptions);

    // Check for 401 Unauthorized response
    if (result.error && result.error.status === 401) {
      // Dispatch logout action
    }

    return result;
  },
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body) => {
        return {
          url: ApiEndParameters.LoginUser,
          method: "POST",
          body,
        }
      },
    }),
  }),
})

export const {
  useLoginUserMutation,
} = EndPointsApis

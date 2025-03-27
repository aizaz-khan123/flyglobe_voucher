import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLogout } from "../Features/authslice";
import { toast } from 'react-toastify'

const baseQuery = fetchBaseQuery({
    prepareHeaders: async (headers, api) => {
        const state = api.getState();
        const token = state?.auth?.token; // ✅ Corrected path

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        // headers.set("authorization", `Bearer 235|deTA7uKQ4x7WFalXsTHqnfy0myZyQDtu6fLhOpBJ4345aa58`);

        headers.set("Accept", "application/json");

        if (typeof api.arg === "object" && "body" in api.arg && !(api.arg.body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
        }

        return headers;
    },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result?.error) {
        if (result?.error?.status === 401) {
            toast.error("Session out please login again...");
            api.dispatch(userLogout());
            // window.location.href = "/";
        }
    }

    return result;
};

export const emptySplitApi = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: () => ({}),
    tagTypes: [
        "BankAccounts", "Airlines", "Airports", "Countries", "News", "Suppliers",
        "AirlineMargins", "Branches", "Agencies"
    ],
});

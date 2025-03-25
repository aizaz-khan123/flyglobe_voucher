export const BASE_URL_V1 = process.env.NEXT_PUBLIC_API_BASE_URL;
// export const BASE_URL_V1 = "https://73b4-2400-adc5-482-c800-b40f-b5dd-83be-9956.ngrok-free.app/api/v1";
// export const NEXT_PUBLIC_BACKEND_URL = "https://73b4-2400-adc5-482-c800-b40f-b5dd-83be-9956.ngrok-free.app";
export const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const API_END_POINTS = {
    locations: BASE_URL_V1 + '/locations',
    flightSearch: BASE_URL_V1 + '/flight/search',
    initiating: BASE_URL_V1 + '/booking/initiating',
};

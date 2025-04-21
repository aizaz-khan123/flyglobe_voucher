import { API_END_POINTS } from './ApiEndPoints'
import { emptySplitApi } from './emptySplitApi'

export const api = emptySplitApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: body => ({
        url: API_END_POINTS.login,
        method: 'POST',
        body
      })
    }),
    resetPassword: builder.mutation({
      query: body => ({
        url: API_END_POINTS.resetPassword,
        method: 'POST',
        body
      })
    }),
    forgotPassword: builder.mutation({
      query: body => ({
        url: API_END_POINTS.forgotPassword,
        method: 'POST',
        body
      })
    }),

    resend: builder.mutation({
      query: body => ({
        url: API_END_POINTS.resend,
        method: 'POST',
        body
      })
    }),
    verify: builder.mutation({
      query: body => ({
        url: API_END_POINTS.verify,
        method: 'POST',
        body
      })
    }),
    logout: builder.mutation({
      query: body => ({
        url: API_END_POINTS.logout,
        method: 'POST'
      })
    }),
    adminChangePassword: builder.mutation({
      query: body => ({
        url: API_END_POINTS.adminChangePassword,
        method: 'POST',
        body
      })
    }),
    getBankAccounts: builder.query({
      query: ({ pageUrl, searchText }) => ({
        url: pageUrl || API_END_POINTS.getBankAccounts,
        method: 'GET',
        params: {
          q: searchText
        }
      }),
      providesTags: ['BankAccounts'],
      transformResponse: response => response.data
    }),
    createBankAccount: builder.mutation({
      query: body => ({
        url: API_END_POINTS.createBankAccount,
        method: 'POST',
        body
      }),
      invalidatesTags: ['BankAccounts']
    }),
    showBankAccount: builder.query({
      query: uuid => ({
        url: `${API_END_POINTS.showBankAccount}/${uuid}`,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    updateBankAccount: builder.mutation({
      query: ({ bankAccountId, updated_data }) => ({
        url: `${API_END_POINTS.updateBankAccount}/${bankAccountId}`,
        method: 'POST',
        body: updated_data
      }),
      invalidatesTags: ['BankAccounts']
    }),
    deleteBankAccount: builder.mutation({
      query: id => ({
        url: `${API_END_POINTS.deleteBankAccount}/${id}`,
        method: 'GET'
      }),
      invalidatesTags: ['BankAccounts']
    }),
    getAirlines: builder.query({
      query: ({ pageUrl, searchText }) => ({
        url: pageUrl || API_END_POINTS.getAirlines,
        method: 'GET',
        params: {
          q: searchText
        }
      }),
      providesTags: ['Airlines'],
      transformResponse: response => response.data
    }),
    createAirline: builder.mutation({
      query: body => ({
        url: API_END_POINTS.createAirline,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Airlines']
    }),
    showAirline: builder.query({
      query: uuid => ({
        url: `${API_END_POINTS.showAirline}/${uuid}`,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    updateAirline: builder.mutation({
      query: ({ airlineId, formData }) => ({
        url: `${API_END_POINTS.updateAirline}/${airlineId}`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['Airlines']
    }),
    deleteAirline: builder.mutation({
      query: id => ({
        url: `${API_END_POINTS.deleteAirline}/${id}`,
        method: 'GET'
      }),
      invalidatesTags: ['Airlines']
    }),
    getCountryList: builder.query({
      query: () => ({
        url: API_END_POINTS.getCountryDropDown,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    getSupplierList: builder.query({
      query: () => ({
        url: API_END_POINTS.supplierDropDownList,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    getAirports: builder.query({
      query: ({ pageUrl, searchText }) => ({
        url: pageUrl || API_END_POINTS.getAirports,
        method: 'GET',
        params: {
          q: searchText
        }
      }),
      providesTags: ['Airports'],
      transformResponse: response => response.data
    }),
    createAirport: builder.mutation({
      query: body => ({
        url: API_END_POINTS.createAirport,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Airports']
    }),
    showAirport: builder.query({
      query: uuid => ({
        url: `${API_END_POINTS.showAirport}/${uuid}`,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    updateAirport: builder.mutation({
      query: ({ airportId, updated_data }) => ({
        url: `${API_END_POINTS.updateAirport}/${airportId}`,
        method: 'POST',
        body: updated_data
      }),
      invalidatesTags: ['Airports']
    }),
    deleteAirport: builder.mutation({
      query: id => ({
        url: `${API_END_POINTS.deleteAirport}/${id}`,
        method: 'GET'
      }),
      invalidatesTags: ['Airports']
    }),
    getCountries: builder.query({
      query: ({ pageUrl, searchText }) => ({
        url: pageUrl || API_END_POINTS.getCountries,
        method: 'GET',
        params: {
          q: searchText
        }
      }),
      providesTags: ['Countries'],
      transformResponse: response => response.data
    }),
    createCountry: builder.mutation({
      query: body => ({
        url: API_END_POINTS.createCountry,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Countries']
    }),
    showCountry: builder.query({
      query: uuid => ({
        url: `${API_END_POINTS.showCountry}/${uuid}`,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    updateCountry: builder.mutation({
      query: ({ countryId, updated_data }) => ({
        url: `${API_END_POINTS.updateCountry}/${countryId}`,
        method: 'POST',
        body: updated_data
      }),
      invalidatesTags: ['Countries']
    }),
    deleteCountry: builder.mutation({
      query: id => ({
        url: `${API_END_POINTS.deleteCountry}/${id}`,
        method: 'GET'
      }),
      invalidatesTags: ['Countries']
    }),
    getNews: builder.query({
      query: ({ pageUrl, searchText }) => ({
        url: pageUrl || API_END_POINTS.getNews,
        method: 'GET',
        params: {
          q: searchText
        }
      }),
      providesTags: ['News'],
      transformResponse: response => response.data
    }),
    createNews: builder.mutation({
      query: body => ({
        url: API_END_POINTS.createNews,
        method: 'POST',
        body
      }),
      invalidatesTags: ['News']
    }),
    showNews: builder.query({
      query: uuid => ({
        url: `${API_END_POINTS.showNews}/${uuid}`,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    updateNews: builder.mutation({
      query: ({ newsId, updated_data }) => ({
        url: `${API_END_POINTS.updateNews}/${newsId}`,
        method: 'POST',
        body: updated_data
      }),
      invalidatesTags: ['News']
    }),
    deleteNews: builder.mutation({
      query: id => ({
        url: `${API_END_POINTS.deleteNews}/${id}`,
        method: 'GET'
      }),
      invalidatesTags: ['News']
    }),
    getSuppliers: builder.query({
      query: ({ pageUrl, searchText }) => ({
        url: pageUrl || API_END_POINTS.getSuppliers,
        method: 'GET',
        params: {
          q: searchText
        }
      }),
      providesTags: ['Suppliers'],
      transformResponse: response => response.data
    }),
    createSupplier: builder.mutation({
      query: body => ({
        url: API_END_POINTS.createSupplier,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Suppliers']
    }),
    showSupplier: builder.query({
      query: uuid => ({
        url: `${API_END_POINTS.showSupplier}/${uuid}`,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    updateSupplier: builder.mutation({
      query: ({ supplierId, updated_data }) => ({
        url: `${API_END_POINTS.updateSupplier}/${supplierId}`,
        method: 'POST',
        body: updated_data
      }),
      invalidatesTags: ['Suppliers']
    }),
    deleteSupplier: builder.mutation({
      query: id => ({
        url: `${API_END_POINTS.deleteSupplier}/${id}`,
        method: 'GET'
      }),
      invalidatesTags: ['Suppliers']
    }),
    showConnector: builder.query({
      query: type => ({
        url: `${API_END_POINTS.showConnector}/${type}`,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    updateConnector: builder.mutation({
      query: updated_data => ({
        url: `${API_END_POINTS.updateConnector}`,
        method: 'POST',
        body: updated_data
      }),
      invalidatesTags: ['Suppliers']
    }),
    airlineDropDown: builder.query({
      query: () => ({
        url: API_END_POINTS.airlineDropDown,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    connectorDropDown: builder.query({
      query: () => ({
        url: API_END_POINTS.connectorDropDown,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    getAirlineMargins: builder.query({
      query: ({ pageUrl, searchText }) => ({
        url: pageUrl || API_END_POINTS.getAirlineMargins,
        method: 'GET',
        params: {
          q: searchText
        }
      }),
      providesTags: ['AirlineMargins'],
      transformResponse: response => response.data
    }),
    createAirlineMargin: builder.mutation({
      query: body => ({
        url: API_END_POINTS.createAirlinMargin,
        method: 'POST',
        body
      }),
      invalidatesTags: ['AirlineMargins']
    }),
    showAirlineMargin: builder.query({
      query: uuid => ({
        url: `${API_END_POINTS.showAirlinMargin}/${uuid}`,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    updateAirlineMargin: builder.mutation({
      query: ({ airlineMarginId, updated_data }) => ({
        url: `${API_END_POINTS.updateAirlinMargin}/${airlineMarginId}`,
        method: 'POST',
        body: updated_data
      }),
      invalidatesTags: ['AirlineMargins']
    }),
    deleteAirlineMargin: builder.mutation({
      query: id => ({
        url: `${API_END_POINTS.deleteAirlinMargin}/${id}`,
        method: 'GET'
      }),
      invalidatesTags: ['AirlineMargins']
    }),
    verifySetPasswordLink: builder.mutation({
      query: body => ({
        url: API_END_POINTS.verifySetPasswordLink,
        method: 'POST',
        body
      })
    }),
    getBranches: builder.query({
      query: ({ pageUrl, searchText }) => ({
        url: pageUrl || API_END_POINTS.getBranches,
        method: 'GET',
        params: {
          q: searchText
        }
      }),
      providesTags: ['Branches'],
      transformResponse: response => response.data
    }),
    createBranch: builder.mutation({
      query: body => ({
        url: API_END_POINTS.createBranch,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Branches']
    }),
    deleteBranch: builder.mutation({
      query: id => ({
        url: `${API_END_POINTS.deleteBranch}/${id}`,
        method: 'GET'
      }),
      invalidatesTags: ['Branches']
    }),
    updateBranch: builder.mutation({
      query: ({ branchId, updated_data }) => ({
        url: `${API_END_POINTS.updateBranch}/${branchId}`,
        method: 'POST',
        body: updated_data
      }),
      invalidatesTags: ['Branches']
    }),
    branchDropDown: builder.query({
      query: () => ({
        url: API_END_POINTS.branchDropDown,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    dropDownByType: builder.query({
      query: ({ roleType }) => ({
        url: API_END_POINTS.dropDownByType,
        method: 'POST',
        body: {
          type: roleType
        }
      })
    }),
    statusUpdate: builder.mutation({
      query: ({ uuid, body }) => ({
        url: API_END_POINTS.statusUpdate + `/${uuid}`,
        method: 'POST',
        body
      })
    }),
    getAgencies: builder.query({
      query: ({ pageUrl, searchText }) => ({
        url: pageUrl || API_END_POINTS.getAgencies,
        method: 'GET',
        params: {
          q: searchText
        }
      }),
      providesTags: ['Agencies'],
      transformResponse: response => response.data
    }),
    createAgency: builder.mutation({
      query: body => ({
        url: API_END_POINTS.createAgency,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Agencies']
    }),
    deleteAgency: builder.mutation({
      query: id => ({
        url: `${API_END_POINTS.deleteAgency}/${id}`,
        method: 'GET'
      }),
      invalidatesTags: ['Agencies']
    }),
    updateAgency: builder.mutation({
      query: ({ agencyId, updated_data }) => ({
        url: `${API_END_POINTS.updateAgency}/${agencyId}`,
        method: 'POST',
        body: updated_data
      }),
      invalidatesTags: ['Agencies']
    }),
    agencystatusUpdate: builder.mutation({
      query: ({ uuid, body }) => ({
        url: API_END_POINTS.agencystatusUpdate + `/${uuid}`,
        method: 'POST',
        body
      })
    }),

    getEmployees: builder.query({
      query: ({ pageUrl, searchText }) => ({
        url: pageUrl || API_END_POINTS.getEmployees,
        method: 'GET',
        params: {
          q: searchText
        }
      }),
      providesTags: ['Agencies'],
      transformResponse: response => response.data
    }),
    createEmployee: builder.mutation({
      query: body => ({
        url: API_END_POINTS.createEmployee,
        method: 'POST',
        body
      }),
      invalidatesTags: ['Agencies']
    }),
    deleteEmployee: builder.mutation({
      query: id => ({
        url: `${API_END_POINTS.deleteEmployee}/${id}`,
        method: 'GET'
      }),
      invalidatesTags: ['Agencies']
    }),
    updateEmployee: builder.mutation({
      query: ({ employeeId, updated_data }) => ({
        url: `${API_END_POINTS.updateEmployee}/${employeeId}`,
        method: 'POST',
        body: updated_data
      }),
      invalidatesTags: ['Agencies']
    }),
    employeeStatusUpdate: builder.mutation({
      query: ({ uuid, body }) => ({
        url: API_END_POINTS.employeeStatusUpdate + `/${uuid}`,
        method: 'POST',
        body
      })
    }),
    locationsLookup: builder.query({
      query: params => ({
        url: API_END_POINTS.locations,
        method: 'GET',
        params
      })
    }),
    permissionUpdate: builder.mutation({
      query: ({ userUUid, selectedPermissionUUIDs }) => ({
        url: `${API_END_POINTS.permissionUpdate}/${userUUid}`,
        method: 'POST',
        body: selectedPermissionUUIDs
      })
    }),
    permissionListByType: builder.mutation({
      query: ({ uuid, type }) => ({
        url: `${API_END_POINTS.permissionList}/${uuid}`,
        params: { type: type },
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),

    flightSearch: builder.mutation({
      query: body => ({
        url: `${API_END_POINTS.flightSearch}`,
        method: 'POST',
        body
      })
    }),
    initiating: builder.mutation({
      query: body => ({
        url: `${API_END_POINTS.initiating}`,
        method: 'POST',
        body
      })
    }),

    bookingAvailabilityConfirmation: builder.query({
      query: bookingId => ({
        url: `${API_END_POINTS.bookingAvailabilityConfirmation}?confirmation_id=${bookingId}`,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),
    bookingConfirm: builder.mutation({
      query: body => ({
        url: `${API_END_POINTS.bookingConfirm}`,
        method: 'POST',
        body
      })
    }),
    bookingById: builder.query({
      query: bookingId => ({
        url: `${API_END_POINTS.bookingById}/${bookingId}`,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),

    bookingCancel: builder.mutation({
      query: ({ bookingPnr }) => ({
        url: `${API_END_POINTS.bookingCancel}`,
        method: 'POST',
        body: {
          reservation_id: bookingPnr
        }
      })
    }),

    issueTicket: builder.mutation({
      query: ({ bookingId, otpCode }) => ({
        url: `${API_END_POINTS.issueTicket}`,
        method: 'POST',
        body: {
          reservation_id: bookingId,
          otp: otpCode
        }
      })
    }),

    voidTicket: builder.mutation({
      query: body => ({
        url: `${API_END_POINTS.voidTicket}`,
        method: 'POST',
        body
      })
    }),
    searchBooking: builder.mutation({
      query: body => ({
        url: API_END_POINTS.searchBooking,
        method: 'POST',
        body
      }),
      transformResponse: response => response.data
    }),
    bookingEmail: builder.mutation({
      query: body => ({
        url: API_END_POINTS.bookingEmail,
        method: 'POST',
        body
      })
    }),

    ticketOtpEmail: builder.mutation({
      query: () => ({
        url: API_END_POINTS.ticketOtpEmail,
        method: 'GET'
      })
    }),
    dashboardStats: builder.query({
      query: params => ({
        url: API_END_POINTS.dashboardStats,
        method: 'GET',
        params
      })
    }),
    dashboardSaleStatics: builder.query({
      query: params => ({
        url: API_END_POINTS.dashboardSaleStatics,
        method: 'GET',
        params
      })
    }),
    downloadBooking: builder.mutation({
      query: body => ({
        url: API_END_POINTS.downloadBooking,
        method: 'POST',
        body
      }),
      transformResponse: response => response.data
    }),

    bookingList: builder.query({
      query: ({ pageUrl, searchText, ...filters }) => ({
        url: pageUrl || API_END_POINTS.bookingList,
        method: 'GET',
        params: {
          q: searchText,
          ...filters
        }
      }),
      providesTags: ['Agencies'],
      transformResponse: response => response.data
    }),
    finanicalProfile: builder.query({
      query: () => ({
        url: API_END_POINTS.finanicalProfile,
        method: 'GET'
      }),
      transformResponse: response => response.data
    }),

    branchMargins: builder.query({
      query: (params) => ({
        url: API_END_POINTS.branchMargins,
        method: "GET",
        params
      }),
      transformResponse: (response) => response.data,
    }),

    assignToBranchByAirline: builder.mutation({
      query: (body) => ({
        url: API_END_POINTS.assignToBranchByAirline,
        method: "POST",
        body
      }),
    }),

    agenciesMargins: builder.query({
      query: (orgUUid) => ({
        url: `${API_END_POINTS.agenciesMargins}/${orgUUid}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),

    agencyMarginAssign: builder.mutation({
      query: ({ orgUUid, data  }) => ({
        url: `${API_END_POINTS.agencyMarginAssign}/${orgUUid}`,
        method: "POST",
        body: data,
      }),
    }),

    
    branchMargin: builder.query({
      query: (params) => ({
        url: API_END_POINTS.branchMargin,
        method: "GET",
        params
      }),
      transformResponse: (response) => response.data,
    }),

    assignMarginBranch: builder.mutation({
      query: (body) => ({
        url: API_END_POINTS.assignMarginBranch,
        method: "POST",
        body
      }),
    }),

    // Settings //
    temporaryLimit: builder.mutation({
      query: body => ({
        url: API_END_POINTS.temporaryLimit,
        method: 'POST',
        body
      })
    }),

    myRefundRequest: builder.query({
      query: () => ({
        url: `${API_END_POINTS.myRefundRequest}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),

    generalSetting: builder.mutation({
      query: body => ({
        url: API_END_POINTS.generalSetting,
        method: 'POST',
        body
      })
    })
  }),
  overrideExisting: false
})

export const {
  useLoginMutation,
  useResendMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
  useVerifyMutation,
  useLogoutMutation,
  useAdminChangePasswordMutation,
  useGetBankAccountsQuery,
  useShowBankAccountQuery,
  useGetCountryListQuery,
  useGetSupplierListQuery,
  useCreateBankAccountMutation,
  useDeleteBankAccountMutation,
  useUpdateBankAccountMutation,
  useGetAirlinesQuery,
  useShowAirlineQuery,
  useCreateAirlineMutation,
  useDeleteAirlineMutation,
  useUpdateAirlineMutation,
  useGetAirportsQuery,
  useShowAirportQuery,
  useCreateAirportMutation,
  useDeleteAirportMutation,
  useUpdateAirportMutation,
  useGetCountriesQuery,
  useShowCountryQuery,
  useCreateCountryMutation,
  useDeleteCountryMutation,
  useUpdateCountryMutation,
  useGetNewsQuery,
  useShowNewsQuery,
  useCreateNewsMutation,
  useDeleteNewsMutation,
  useUpdateNewsMutation,
  useGetSuppliersQuery,
  useShowSupplierQuery,
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useUpdateSupplierMutation,
  useShowConnectorQuery,
  useUpdateConnectorMutation,
  useAirlineDropDownQuery,
  useConnectorDropDownQuery,

  /////////////////////////
  useGetAirlineMarginsQuery,
  useShowAirlineMarginQuery,
  useCreateAirlineMarginMutation,
  useDeleteAirlineMarginMutation,
  useUpdateAirlineMarginMutation,

  useGetBranchesQuery,
  useCreateBranchMutation,
  useDeleteBranchMutation,
  useUpdateBranchMutation,
  useVerifySetPasswordLinkMutation,
  useStatusUpdateMutation,
  useBranchDropDownQuery,
  useDropDownByTypeQuery,
  useBranchMarginQuery,
  useAssignMarginBranchMutation,
  //////////////////////
  useGetAgenciesQuery,
  useCreateAgencyMutation,
  useDeleteAgencyMutation,
  useUpdateAgencyMutation,
  useAgencystatusUpdateMutation,
  useAssignToBranchByAirlineMutation,
  useBranchMarginsQuery,
  useAgenciesMarginsQuery,
  useAgencyMarginAssignMutation,
  // ///////////////////////
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useEmployeeStatusUpdateMutation,
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useLocationsLookupQuery,
  useLazyLocationsLookupQuery,

  /** Permission Management */
  usePermissionListByTypeMutation,
  usePermissionUpdateMutation,

  ////// flight ////////
  useFlightSearchMutation,
  useInitiatingMutation,
  useBookingAvailabilityConfirmationQuery,
  useBookingConfirmMutation,
  useBookingByIdQuery,
  useBookingCancelMutation,
  useIssueTicketMutation,
  useVoidTicketMutation,
  useSearchBookingMutation,
  useBookingEmailMutation,
  useTicketOtpEmailMutation,
  useBookingListQuery,
  useDownloadBookingMutation,
  useLazyFinanicalProfileQuery,

  ///settings
  useTemporaryLimitMutation,
  useGeneralSettingMutation,

  //dashboard
  useLazyDashboardSaleStaticsQuery,
  useDashboardSaleStaticsQuery,
  useLazyDashboardStatsQuery,

  useMyRefundRequestQuery
} = api

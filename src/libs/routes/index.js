const routes = {
  home: '/dashboard',
  auth: {
    login: '/',
    register: '/auth/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/auth/reset-password'
  },
  dashboards: {
    ecommerce: '/dashboard'
  },
  apps: {
    flight: {
      search: '/flights',
      bookings: '/bookings',
      refunds: '/refund-requests',
      booking_detail: bookingId => `/booking/${bookingId}`
    },
    importPnr: {
      imp_pnr: '/import-pnr'
    },
    organizations: {
      branches: '/organizations/branches',
      branch_employees: '/organizations/branch/employees',
      agencies: '/organizations/agencies',
      agency_employees: '/organizations/agency/employees',
      agency_subagent: '/organizations/agency/sub-agents',
      headoffice_employees: '/organizations/employees'
    },
    reports: {
      ledger_history: '/reports/transaction-history',
      sales_report: '/reports/sales-report',
      unused_tickets: '/reports/unused-tickets'
    },
    settings: {
      airlines: '/settings/airlines',
      airline_create: '/settings/airlines/create',
      airline_edit: id => `/settings/airlines/${id}`,
      bank_accounts: '/settings/bank-accounts',
      bank_account_create: '/settings/bank-accounts/create',
      bank_account_edit: id => `/settings/bank-accounts/${id}`,
      connectors: '/settings/connectors',
      airports: '/settings/airports',
      airport_create: '/settings/airports/create',
      airport_edit: id => `/settings/airports/${id}`,
      countries: '/settings/countries',
      country_create: '/settings/countries/create',
      country_edit: id => `/settings/countries/${id}`,
      news: '/settings/news',
      news_create: '/settings/news/create',
      news_edit: id => `/settings/news/${id}`,
      suppliers: '/settings/suppliers',
      supplier_create: '/settings/suppliers/create',
      supplier_edit: id => `/settings/suppliers/${id}`,

      airline_margins: '/settings/airline-margins',
      airline_margin_create: '/settings/airline-margins/create',
      airline_margin_edit: id => `/settings/airline-margins/${id}`
    },
    accounts: {
      chart_accounts: '/accounts/chart-accounts',
      agency_deposites: '/accounts/agency-deposites',
      journal_entries: '/accounts/journal-entries',
      account_statements: '/accounts/account-statements',
      trial_balance: '/accounts/trial-balance',
      general_legder: '/accounts/general-legder',
      branch_deposites: '/accounts/branch-deposites'
    },
    notification: '/notifications'
  }
}

export { routes }

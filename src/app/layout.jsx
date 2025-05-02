import NextTopLoader from 'nextjs-toploader'

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Fly Globle - Your Travel Partner For Growth',
  description: 'Fly Globle - Your Travel Partner For Growth'
}

const RootLayout = async props => {
  const { children } = props

  // Vars

  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (
    <html id='__next' lang='' dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col bg-[#f4f5fa]'>
        <NextTopLoader height={3} showSpinner={false} color={'#3e5eff'} />
        <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
        {children}
      </body>
    </html>
  )
}

export default RootLayout

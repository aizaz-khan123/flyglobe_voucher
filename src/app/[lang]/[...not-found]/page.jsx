// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import NotFound from '@views/NotFound'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode, getServerMode } from '@core/utils/serverHelpers'

const NotFoundPage = async props => {
  const params = await props.params

  // Vars
  const direction = i18n.langDirection[params.lang]
  const systemMode = await getSystemMode()
  const mode = await getServerMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <NotFound mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage

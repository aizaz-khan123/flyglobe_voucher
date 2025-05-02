'use client'

// React Imports
import { useEffect } from 'react'

// Component Imports
import PricingSection from '@views/front-pages/pricing/PricingSection'

import { useSettings } from '@core/hooks/useSettings'

import FreeTrial from './FreeTrial'
import Plans from './Plans'
import Faqs from './Faqs'

const PricingWrapper = ({ data }) => {
  // Hooks
  const { updatePageSettings } = useSettings()

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <PricingSection data={data} />
      <FreeTrial />
      <Plans />
      <Faqs />
    </>
  )
}

export default PricingWrapper

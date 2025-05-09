'use client'

// React Imports
import { useEffect } from 'react'

// Component Imports
import { useSettings } from '@core/hooks/useSettings'

import HeroSection from './HeroSection'
import UsefulFeature from './UsefulFeature'
import CustomerReviews from './CustomerReviews'
import OurTeam from './OurTeam'
import Pricing from './Pricing'
import ProductStat from './ProductStat'
import Faqs from './Faqs'
import GetStarted from './GetStarted'
import ContactUs from './ContactUs'

const LandingPageWrapper = ({ mode }) => {
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
      <HeroSection mode={mode} />
      <UsefulFeature />
      <CustomerReviews />
      <OurTeam />
      <Pricing />
      <ProductStat />
      <Faqs />
      <GetStarted />
      <ContactUs />
    </>
  )
}

export default LandingPageWrapper

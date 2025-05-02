'use client'

// React Imports
import { useState, useEffect } from 'react'

// Component Imports
import { useSettings } from '@core/hooks/useSettings'

import HelpCenterHeader from './HelpCenterHeader'
import Articles from './Articles'
import KnowledgeBase from './KnowledgeBase'
import KeepLearning from './KeepLearning'
import NeedHelp from './NeedHelp'

const HelpCenterWrapper = () => {
  // States
  const [searchValue, setSearchValue] = useState('')

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
      <HelpCenterHeader searchValue={searchValue} setSearchValue={setSearchValue} />
      <Articles />
      <KnowledgeBase />
      <KeepLearning />
      <NeedHelp />
    </>
  )
}

export default HelpCenterWrapper

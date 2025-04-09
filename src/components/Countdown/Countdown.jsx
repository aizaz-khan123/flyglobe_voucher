import React from 'react'

const Countdown = ({ value, dataTheme, className, ...props }) => {
  const displayedValue = Math.min(99, Math.max(0, value))
  const countdownStyle = { '--value': displayedValue }

  return (
    <span role='timer' {...props} data-theme={dataTheme} className={`countdown ${className}`}>
      <span style={countdownStyle} />
    </span>
  )
}

export default Countdown

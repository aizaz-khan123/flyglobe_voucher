const StatusWidget = ({ status }) => {
  if (status == 'issued') {
    return (
      <div className='inline rounded-badge border border-success/50 bg-success/5 px-3 py-1 text-xs font-medium text-success'>
        Issued
      </div>
    )
  } else if (status == 'confirmed') {
    return (
      <div className='inline rounded-badge border border-success/50 bg-success/5 px-3 py-1 text-xs font-medium text-success'>
        Confirmed
      </div>
    )
  } else if (status == 'cancelled') {
    return (
      <div className='inline rounded-badge border border-error/50 bg-error/5 px-3 py-1 text-xs font-medium text-error'>
        Cancelled
      </div>
    )
  } else if (status == 'expired') {
    return (
      <div className='inline rounded-badge border border-error/50 bg-error/5 px-3 py-1 text-xs font-medium text-error'>
        Failed
      </div>
    )
  } else if (status == 'voided') {
    return (
      <div className='inline rounded-badge border border-info/50 bg-info/5 px-3 py-1 text-xs font-medium text-info'>
        Voided
      </div>
    )
  } else if (status == 'refunded') {
    return (
      <div className='inline rounded-badge border border-info/50 bg-info/5 px-3 py-1 text-xs font-medium text-info'>
        Refunded
      </div>
    )
  }
}

export default StatusWidget

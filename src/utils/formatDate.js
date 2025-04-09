export const formattedDate = dateString => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1 // Months are 0-based in JS
  const day = date.getDate()
  const year = date.getFullYear()

  return `${month}-${day}-${year}`
}

export const formatDate = dateTime => {
  const date = new Date(dateTime)

  return date.toLocaleDateString('en-US', {
    weekday: 'short', // Mon
    month: 'short', // Jan
    day: '2-digit', // 27
    year: 'numeric' // 2025
  })
}

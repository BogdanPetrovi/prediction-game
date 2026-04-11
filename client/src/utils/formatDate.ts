export const formatDateTime = (date: number | undefined): string => {
  const formatedDate = date && new Intl.DateTimeFormat('sr-RS', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                  }).format(date);
  return formatedDate || ''
}

export const formatDateOnly = (date: number | undefined): string => {
  const formatedDate = date && new Intl.DateTimeFormat('sr-RS', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  }).format(date);
  return formatedDate || ''
}
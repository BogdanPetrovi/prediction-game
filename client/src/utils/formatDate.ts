export const formatDateTime = (date: number | undefined): string => {
  const formatedDate = date && new Intl.DateTimeFormat('sr-RS', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                    timeZone: 'Europe/Belgrade'
                                  }).format(date);
  return formatedDate || ''
}

export const formatDateOnly = (date: number | undefined): string => {
  const formatedDate = date && new Intl.DateTimeFormat('sr-RS', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    timeZone: 'Europe/Belgrade'
                                  }).format(date);
  return formatedDate || ''
}

export const formatDateTimeWithLetter = (date: number | undefined): string => {
  const formatedDate = date && new Intl.DateTimeFormat('sr-Latn-RS', {
                                      day: '2-digit',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: false,
                                      timeZone: 'Europe/Belgrade'                           
                                    }).format(date);
  return formatedDate || ''
}

export const formatDateWithoutYear = (date: number | undefined): string => {
  const formatedDate = date && new Intl.DateTimeFormat('sr-Latn-RS', {
                                      day: '2-digit',
                                      month: 'short',
                                      timeZone: 'Europe/Belgrade'                           
                                    }).format(date);
  return formatedDate || ''
}
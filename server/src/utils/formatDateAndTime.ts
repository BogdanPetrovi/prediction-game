const formatDateAndTime = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat('sr-RS', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: false,
                                timeZone: 'Europe/Belgrade'
                              }).format(date);
}

export default formatDateAndTime
export const acceptedPrivacy = (value) => value === 'accepted' // verifica che il valore in input non contenga caratteri blank

export const notFutureDate = (value) => {
  // value, data nel formato 2019-06-28
  if (value === null || value === '' || value === undefined) return true
  const dateObject = new Date(value.toString()).getTime()
  if (isNaN(dateObject)) return true
  const today = new Date().getTime()
  if ((dateObject - today) > 0) return false
  return true
}

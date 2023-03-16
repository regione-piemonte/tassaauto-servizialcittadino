export default {
  serverValidationFailed (serverError, field) {
    if (serverError[field] != null && serverError[field] !== '') return true
    return false
  },

  serverValidationErrors (serverDetailError) {
    const objErr = { }
    for (const key in serverDetailError) {
      if (serverDetailError[key].field === '') {
        objErr[serverDetailError[key].field + 'fieldMessage'] = serverDetailError[key].error
      } else {
        objErr[serverDetailError[key].field] = serverDetailError[key].error
      }
    }
    return objErr
  },

  serverValidationErrorsArray (serverDetailError) {
    const arrErr = []
    for (const key in serverDetailError) {
      const objErr = {}
      if (serverDetailError[key].field === '') {
        objErr[serverDetailError[key].field + 'fieldMessage'] = serverDetailError[key].error
      } else {
        objErr[serverDetailError[key].field] = serverDetailError[key].error
      }
      arrErr.push(objErr)
    }
    return arrErr
  }
}

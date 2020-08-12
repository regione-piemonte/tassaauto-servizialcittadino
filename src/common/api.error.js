export default {
  serverValidationFailed (serverError, field) {
    if (serverError[field] != null && serverError[field] !== '') return true
    return false
  },

  serverValidationErrors (serverDetailError) {
    const objErr = { }
    for (const key in serverDetailError) {
      objErr[serverDetailError[key].field] = serverDetailError[key].error
    }
    console.log(objErr)
    return objErr
  }
}

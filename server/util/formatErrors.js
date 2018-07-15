// Regresa un array con los errores formateadis
// Ex [{ path: 'password', message: 'Debe tener 8 caracteres miniumo'}]
export default (error) => {
  const { errors } = error
  let acc = []

  Object.keys(errors).forEach(key => {
    acc.push({ path: key, message: errors[key].message })
  })

  return acc
}

import { COURSE, ME } from '../queries'

// Retorna los datos del curso si existe,
// valida si el usuario esta conectado
// Caso contrario lo redirige para que
// vuelva a iniciar session
export default async (ctx) => {
  let params = { lesson: null, course: null }
  let course = null
  let user = {}
  try {
    params = ctx.req.params

    // Si existe curso se precarga
    if (params.course) {
      const res = await ctx.apolloClient.query({
        query: COURSE,
        variables: { slug: params.course }
      })
      course = res.data.course
    }
  } catch (error) {}

  try {
    const res = await ctx.apolloClient.query({
      query: ME
    })

    user = res.data.userSelf || {}

    // Si no llega user, se redirige a Home como
    // expirada para que vuelva a hacer Login
    if (!res.data.userSelf) {
      ctx.res.redirect('/?expired=true')
    }
  } catch (error) {
    ctx.res.redirect('/?expired=true2')
  }
  return {
    params,
    course,
    user
  }
}

import { COURSE, ME } from '../queries'

// Retorna los datos del curso si existe,
// valida si el usuario esta conectado
// Caso contrario lo redirige para que
// vuelva a iniciar session
export default async (ctx) => {
  // const { lessonSlug, courseSlug } = ctx.req.params
  let course = null
  // let lesson = null
  let user = {}
  try {
    if (ctx.req.params.courseSlug) {
      const res = await ctx.apolloClient.query({
        query: COURSE,
        variables: { slug: ctx.req.params.courseSlug }
      })
      course = res.data.course
    }
  } catch (error) {}

  try {
    const res = await ctx.apolloClient.query({ query: ME })

    user = res.data.userSelf || {}

    // Si no llega user, se redirige a Home como
    // expirada para que vuelva a hacer Login
    if (!res.data.userSelf) {
      ctx.res.redirect('/?expired=true')
    }
  } catch (error) {
    ctx.res.redirect('/?expired=true2')
  }

  if (ctx.req) {
    return {
      params: {
        courseSlug: ctx.req.params.courseSlug || null,
        lessonSlug: ctx.req.params.lessonSlug || null
      },
      course,
      user
    }
  }

  return {
    params: {
      courseSlug: null,
      lessonSlug: null
    },
    course,
    user
  }
}

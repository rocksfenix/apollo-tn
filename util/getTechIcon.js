export default (tech) => {
  const techs = {
    angular: {
      logo: '/static/angular.svg'
    },
    react: {
      logo: '/static/react.svg'
    },
    vue: {
      logo: '/static/vue.svg'
    },
    node: {
      logo: '/static/node.png'
    },
    rxjs: {
      logo: '/static/rxjs.png'
    },
    webpack: {
      logo: '/static/webpack.svg'
    },
    javascript: {
      logo: '/static/javascript.svg'
    },
    TecNinja: {
      logo: '/static/Tools.svg'
    },
    html: {
      logo: '/static/html.svg'
    }
  }

  try {
    return techs[tech].logo
  } catch (error) {
    return '/static/quotes-warning.svg'
  }
}

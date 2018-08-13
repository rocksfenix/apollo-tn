// Guardamos en memoria el listado de agentes disponibles
// usuario role admin
let agents = []

const add = (agent) => {
  if (agents.filter(a => a === agent).length) return
  agents.push(agent)
  console.log(`Agent ADDED: ${agent}`)
}

const remove = (agent) => {
  agents = agents.filter(a => a !== agent)
  console.log(`Agent REMOVED: ${agent}`)
}

const list = () => agents

export default {
  add,
  remove,
  list
}

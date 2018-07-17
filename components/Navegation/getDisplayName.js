export default (name) => {
  const n = name.split(' ')[0]

  if (n.length > 16) {
    return n.substr(0, 12) + ' ...'
  }

  return n
}

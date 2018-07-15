export default  `
type Conf {
  showLessons: Boolean!
  position: String!
}

type Query {
  visibilityFilter: String
  config: Conf
}
`;
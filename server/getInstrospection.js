import request from 'request-promise'

export default async (req, res) => {
  const response = await request(`http://192.168.1.96:8080/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      variables: {},
      operationName: '',
      query: `
        {
          __schema {
            types {
              kind
              name
              possibleTypes {
                name
              }
            }
          }
        }
      `
    })
  })

  console.log(response)

  res.json(JSON.stringify(response))

  // res.send(`<h1>LISTO</h1>`)
}

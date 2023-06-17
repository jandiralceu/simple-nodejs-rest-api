import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return 'Hello World!'
})

app.listen({ port: 3333 })
  .then(() => {
    console.log('Server is running...')
  })
  .catch((reason) => {
    console.log('Error on running the application...')
  })

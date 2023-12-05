import { createServer } from 'node:http'
import { routes } from './routes'
import { json } from './middlewares/json'

const app = createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find(
    (route) => route.method === method && url?.match(route.path),
  )
  if (route) {
    return route.handle(req, res)
  }

  return res.writeHead(404).end()
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})

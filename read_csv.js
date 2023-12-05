import fs from 'fs'
import { parse } from 'csv-parse'
const filePath = 'output.csv'

async function read() {
  let count = 0

  fs.createReadStream(filePath)
    .pipe(parse())
    .on('data', async ([title, description]) => {
      try {
        if (count) {
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
          }
          fetch('http://localhost:3000/tasks', options)
        }
      } catch (error) {
        console.error(`Error making POST request for ${error.message}`)
      }
      count++
      await new Promise((resolve) => setTimeout(resolve, 100))
    })
}
read()

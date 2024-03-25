import express from 'express'
import { CronJob } from 'cron'
import child from 'child_process'
import cors from 'cors'

import indexRouter from './router/index'
import { loadWords } from './action/game'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/', indexRouter)

app.listen(3000, () => {
  console.log('Loading words into memory')
  loadWords().then(() => {
    console.log('Server started on port 3000')

    // once every 30 minutes
    const job = new CronJob(
      '0 */30 * * * *',
      function () {
        console.log('Loading words into memory')
        child.exec('py ./words/index.py', (err) => {
          if (err !== null) {
            console.error(err)
          }
          loadWords().catch((err) => {
            console.error(err)
          })
        })
      }, // onTick
      null, // onComplete
      false, // start
      'America/Chicago' // timeZone
    )
    job.start()
  }).catch((err) => {
    console.error(err)
  })
})

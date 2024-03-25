import { type Request, type Response } from 'express'
import fs from 'fs'
import path from 'path'

// word and the distance from the correct word
let games: Record<string, Record<string, number>> = {}

// should load all the words from the directory ../words/days
export async function loadWords (): Promise<void> {
  games = {}
  const directory = path.join(__dirname, '../words/days')
  const files = fs.readdirSync(directory)
  for (const file of files) {
    const date = file.split('.')[0]
    const fileContents = fs.readFileSync(path.join(directory, file), 'utf8')
    const lines = fileContents.split('\n')
    console.log(lines.length)
    let count = 0
    for (const line of lines) {
      count += 1
      const [word, distance] = line.split(':')
      console.log(count, word, distance)
      if (word !== '' && distance !== '') {
        games[date] = { ...games[date], [word]: parseInt(distance, 10) }
      }
    }
  }
}

export async function getPlayableDates (req: Request, res: Response): Promise<void> {
  const dates = Object.keys(games)
  res.json(dates)
}

export async function getLatestDate (req: Request, res: Response): Promise<void> {
  const dates = Object.keys(games)
  const latestDate = dates[dates.length - 1]
  res.json(latestDate)
}

export async function getIndexOfDate (req: Request, res: Response): Promise<void> {
  const { date } = req.params
  const dates = Object.keys(games)
  const index = dates.indexOf(date)
  res.json(index)
}

// maybe add something to add new words to the list if someone guesses a real word
export async function guessWord (req: Request, res: Response): Promise<void> {
  const { word, date } = req.params

  const game = games[date]
  if (game === undefined) {
    res.status(404).json({ error: 'No game found for that date' })
  }

  const wordWithoutLastLetter = word.slice(0, -1)
  const wordWithLastLetter = word + 's'
  const wordWithLastLetterPlural = word + 'es'
  const wordWithLastLetterPlural2 = word + 'ies'
  const wordWithLastLetterPlural3 = word + 'ves'
  const wordWithLastLetterPlural4 = word + 'zes'
  const wordWithLastLetterPlural5 = word + 'xes'
  const wordWithLastLetterPlural6 = word + 'ches'
  const wordWithLastLetterPlural7 = word + 'shes'

  const possibleWords = [
    word,
    wordWithoutLastLetter,
    wordWithLastLetter,
    wordWithLastLetterPlural,
    wordWithLastLetterPlural2,
    wordWithLastLetterPlural3,
    wordWithLastLetterPlural4,
    wordWithLastLetterPlural5,
    wordWithLastLetterPlural6,
    wordWithLastLetterPlural7
  ]

  let distance = 0
  for (const possibleWord of possibleWords) {
    if (game[possibleWord] !== undefined) {
      distance = game[possibleWord]
      break
    }
  }

  res.json({ distance })
}

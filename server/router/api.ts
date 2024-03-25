import { Router } from 'express'
import { getIndexOfDate, getLatestDate, getPlayableDates, guessWord } from '../action/game'

const router = Router()

router.get('/guess/:date/:word', guessWord)
router.get('/dates', getPlayableDates)
router.get('/latest', getLatestDate)
router.get('/getIndexOfDate/:date', getIndexOfDate)

export default router

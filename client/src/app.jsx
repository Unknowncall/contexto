import { useEffect, useState } from 'preact/hooks'
import { getIndexOfDate, getLatestDate, getPlayableDates, guessWord } from './queries'
import { getGameData, hasPlayedDate, hasWonDate, saveGame } from './save'
import getShareableText from './share'

export function App() {
  const [date, setDate] = useState(null)
  const [indexOfDate, setIndexOfDate] = useState(0)
  const [guesses, setGuesses] = useState({})
  const [errorMessages, setErrorMessages] = useState("")
  const [showingHowToPlay, setShowingHowToPlay] = useState(true)

  const [won, setWon] = useState(false)

  const [previousDaysMenuOpen, setPreviousDaysMenuOpen] = useState(false)
  const [previousDays, setPreviousDays] = useState([])

  useEffect(() => {
    getLatestDate().then((date) => {
      getIndexOfDate(date).then((index) => {
        setIndexOfDate(index)
        getPlayableDates().then((dates) => {
          setPreviousDays(dates)
        });
      });
      setDate(date)
    })
  }, [])

  useEffect(() => {
    saveGame(date, guesses)
  }, [guesses])

  useEffect(() => {
    const gameData = getGameData(date)
    if (gameData !== null) {
      setGuesses(gameData)
      if (gameData[Object.keys(gameData)[0]] === 0) {
        setWon(true)
      }
    }
  }, [date])

  async function checkGuess(guess) {
    setShowingHowToPlay(false)
    return new Promise((resolve, reject) => {
      // make sure it's one word
      if (guess.split(" ").length > 1) {
        setErrorMessages("Please only enter one word")
        resolve(false)
        return
      }

      // make sure it's not a duplicate
      if (guesses[guess]) {
        setErrorMessages(`<span class="font-bold">${guess}</span> has already been guessed`)
        resolve(false)
        return
      }

      guessWord(guess, date).then((distance) => {
        const newGuesses = { ...guesses, [guess]: distance }
        const sortedGuesses = Object.keys(newGuesses).sort((a, b) => newGuesses[a] - newGuesses[b])
        const sortedMap = {}
        sortedGuesses.forEach((guess) => {
          sortedMap[guess] = newGuesses[guess]
        })
        setGuesses(sortedMap)
        if (distance === 0) {
          setWon(true)
        }

        setErrorMessages("")
        resolve(true)
      }).catch((err) => {
        setErrorMessages(err.response.data.error)
        resolve(false)
      })
    });
  }

  return (
    <div class="w-full h-screen bg-slate-900 p-10 m-0 flex justify-center">

      {won && <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-gray-700 rounded-lg p-10 justify-center flex flex-col">
          <p class="text-4xl font-bold text-white">You Won!</p>

          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={() => {
            setWon(false)
            setPreviousDaysMenuOpen(true)
          }}>Previous Days</button>

          {/* share button */}
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 mb-2" onClick={() => {
            const shareableText = getShareableText(date)
            navigator.clipboard.writeText(shareableText)
          }}>Share Results</button>

        </div>
      </div>}

      {previousDaysMenuOpen && <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-gray-700 rounded-lg p-10 justify-center flex flex-col">
          <p class="text-4xl font-bold text-white">Previous Days</p>
          {previousDays.map((day) => {
            return <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 mb-2" onClick={() => {
              setPreviousDaysMenuOpen(false)
              setDate(day)
            }}>{day} {hasWonDate(day) ? "Won" : hasPlayedDate(day) ? "In Progress" : ""}</button>
          })}
        </div>
      </div>}

      <div class="w-[500px] rounded-lg">

        <div class="flex flex-row justify-around ">
          <p class="text-white text-4xl font-bold">Contexto</p>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setGame(date)}>Options</button>
        </div>

        <div class="flex flex-col py-4 h-full">
          <p class="text-white font-bold">Game: #{indexOfDate} Guesses: {Object.keys(guesses).length}</p>
          <form class="flex flex-row justify-center gap-x-10 w-full h-16 py-2" onSubmit={async (e) => {
            e.preventDefault()
            const shouldRemove = await checkGuess(e.target.guess.value)
            if (shouldRemove) {
              e.target.guess.value = ""
            }
          }}>
            <input type="text" name="guess" placeholder="type a word" className='p-2 bg-slate-700 rounded-lg h-full w-full border-white border-2 text-white' />
          </form>

          {errorMessages && <p class="text-red-500">{errorMessages}</p>}

          {Object.keys(guesses).map((guess) => {
            return <Guess guess={guess} distance={guesses[guess]} />
          })}

          {showingHowToPlay &&
            <div class="flex flex-col justify-center h-fit bg-slate-700 p-5 rounded-md gap-y-4">
              <p class="text-white text-2xl">How to Play</p>
              <p class="text-white text-md">Find the secret word. You have unlimited guesses.</p>
              <p class="text-white text-md">The words were sorted by an artificial intelligence algorithm according to how similar they were to the secret word.</p>
              <p class="text-white text-md">After submitting a word, you will see its position. The secret word is number 1.</p>
              <p class="text-white text-md">The algorithm analyzed thousands of texts. It uses the context in which words are used to calculate the similarity between them.</p>
            </div>
          }

        </div>
      </div>

    </div>
  )
}

function Guess({ guess, distance }) {

  function getGuessColor() {
    if (distance >= 1000) {
      return "bg-red-500"
    } else if (distance >= 100) {
      return "bg-yellow-500"
    } else if (distance >= 1) {
      return "bg-green-500"
    } else {
      return "bg-blue-500"
    }
  }

  return (
    <div class={`flex flex-row justify-between p-2 text-white font-bold border-2 m-1 rounded-md bg-gradient-to-r ${getGuessColor()} bg-yell`}>
      <p>{guess}</p>
      <p>{distance}</p>
    </div>
  )
}

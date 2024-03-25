export function saveGame(date: string, guesses: { [key: string]: number }) {
    if (date === null) {
        return
    }
    
    let gameData = window.localStorage.getItem("game-data")
    if (gameData === null) { // gotta make a new one
        window.localStorage.setItem("game-data", JSON.stringify({}))
        gameData = window.localStorage.getItem("game-data") // it should exist now
    }

    gameData = gameData as string
    const gameDataObj = JSON.parse(gameData)
    gameDataObj[date] = guesses
    window.localStorage.setItem("game-data", JSON.stringify(gameDataObj))
}

export function createNewGame(date: string) {
    if (date === null) {
        return
    }

    let gameData = window.localStorage.getItem("game-data")
    if (gameData === null) { // gotta make a new one
        window.localStorage.setItem("game-data", JSON.stringify({}))
        gameData = window.localStorage.getItem("game-data") // it should exist now
    }

    gameData = gameData as string
    const gameDataObj = JSON.parse(gameData)
    gameDataObj[date] = {}
    window.localStorage.setItem("game-data", JSON.stringify(gameDataObj))
}

export function getGameData(date: string) {
    if (date === null) {
        return null
    }

    const gameData = window.localStorage.getItem("game-data")
    if (gameData === null) {
        return null
    }

    const gameDataObj = JSON.parse(gameData)
    const todaysGameData = gameDataObj[date]
    if (todaysGameData === null || todaysGameData === undefined) {
        createNewGame(date)
        return getGameData(date)
    }

    return todaysGameData
}

export function hasPlayedDate(date: string) {
    if (date === null) {
        return false
    }

    const gameData = window.localStorage.getItem("game-data")
    if (gameData === null) {
        return false
    }

    const gameDataObj = JSON.parse(gameData)
    return gameDataObj[date] !== undefined
}

export function hasWonDate(date: string) {
    if (date === null) {
        return false
    }

    const gameData = window.localStorage.getItem("game-data")
    if (gameData === null) {
        return false
    }

    const gameDataObj = JSON.parse(gameData)
    const todaysGameData = gameDataObj[date]
    if (todaysGameData === undefined) {
        return false
    }

    // win means the first guess has a distance of 0
    const firstGuess = Object.keys(todaysGameData)[0]
    return todaysGameData[firstGuess] === 0
}
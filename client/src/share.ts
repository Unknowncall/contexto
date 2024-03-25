import { getGameData } from "./save";

export default function getShareableText(date) {
    const gameData = getGameData(date)
    if (gameData === null) {
        return null
    }

    // Return a multi line text that looks like this
    /**
     * I beat contexto on mm/dd/yyyy in x guesses!
     * 
     * good guesses: 
     * mid guesses:
     * bad guesses:
     * 
     */

    // a good guess is one where the distance is < 101
    // a mid guess is one where the distance is < 1001
    // a bad guess is one where the distance is > 1001

    let goodGuesses = 0
    let midGuesses = 0
    let badGuesses = 0

    for (const key in gameData) {
        const distance = gameData[key]
        if (distance < 101) {
            goodGuesses++
        } else if (distance < 1001) {
            midGuesses++
        } else {
            badGuesses++
        }
    }

    let str = `I beat contexto on ${date} in ${Object.keys(gameData).length} guesses!\n\n`

    // now for the guesses we need to put emoji boxes and the number of boxes per category is a summary of the guesses. examples below:
    // game that took 50 guesses
    // good guesses: �����
    // mid guesses: ���
    // bad guesses: ���
    // in the game above they had 50% good guesses, 30% mid guesses, and 20% bad guesses

    // game that took 100 guesses
    // good guesses: �
    // mid guesses: �����
    // bad guesses: ����
    // in the game above they had 10% good guesses, 50% mid guesses, and 40% bad guesses

    const goodGuessesPercent = Math.round((goodGuesses / Object.keys(gameData).length) * 100)
    const midGuessesPercent = Math.round((midGuesses / Object.keys(gameData).length) * 100)
    const badGuessesPercent = Math.round((badGuesses / Object.keys(gameData).length) * 100)

    str += `${"🟩".repeat(goodGuessesPercent / 10)}\n`
    str += `${"🟨".repeat(midGuessesPercent / 10)}\n`
    str += `${"🟥".repeat(badGuessesPercent / 10)}\n`

    return str
}
export function cleanInput(value: string) {
    return value.replace(".", "").replace(",", "").replace(":", "")
}

export function convertToMilliseconds(value: string) {
    if (value.length <= 5) return Number(value) * 1000

    let seconds = Number(value.includes(':') ? value.split(':')[0] : 0) * 60
    let milliSeconds = Math.round((Number(value.includes(':') ? value.split(':')[1] : value) + seconds) * 1000)

    return milliSeconds
}

export function convertToSeconds(value: string) {    
    return Math.trunc(convertToMilliseconds(value) / 1000)
}

export function formatTimeString(value: number) {
    let cleanValue = `${value}`

    let newValue = cleanValue.length < 4 ? ("0000" + cleanValue).slice(-4) : cleanValue
    if (cleanValue.length > 4) {
        newValue = newValue.slice(0, -4) + ':' + newValue.slice(-4)
    }
    newValue = newValue.slice(0, -2) + '.' + newValue.slice(-2)

    return newValue
}

export function getEncodedMbldNumber(attempted: number, solved: number, seconds: number): number | "invalid" {
    if (attempted < 2) return "invalid"
    if (solved > attempted) return "invalid"

    let points = 99 - (solved - (attempted - solved))
    let time = `0000${seconds}`.slice(-4)
    let unsolved = `00${attempted - solved}`.slice(-2)
    return Number(`${points}${time}${unsolved}`)
}
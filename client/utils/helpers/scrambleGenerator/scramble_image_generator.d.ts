import { UserSettingsMinified } from "../../types/userSettings"

export function sig(scramble: string, eventName: string, settings: UserSettingsMinified): {
    showNormalImage: () => void
    showLargeImage: () => void
}
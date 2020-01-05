import { Dispatch } from 'redux'

import { PromptAction, PromptState, ButtonColor } from '../types/promptTypes'

export function closePrompt(): PromptAction {
    return { type: "CLOSE_PROMPT" }
}

export function hidePrompt(): PromptAction {
    return { type: "HIDE_PROMPT" }
}

export function showPrompt(): PromptAction {
    return { type: "SHOW_PROMPT" }
}

export function showInfoPrompt(title: string): PromptAction {
    return { type: "SHOW_INFO_PROMPT", title }
}

export function showListViewPrompt(title: string, items: string[]): PromptAction {
    return { type: "SHOW_LISTVIEW_PROMPT", title, items }
}

export function showConfirmationPrompt(title: string, confirmAction: () => void, buttonColor: ButtonColor = "blue"): PromptAction {
    return { type: "SHOW_CONFIRMATION_PROMPT", title, confirmAction, buttonColor }
}

export function showCommentInputPrompt(title: string, comment: string, confirmAction: (comment: string) => void): PromptAction {
    return { type: "SHOW_COMMENT_INPUT_PROMPT", title, comment, confirmAction }
}

export function showFmcInputPrompt(title: string, solution: string, confirmAction: (solution: string) => void): PromptAction {
    return { type: "SHOW_FMC_INPUT_PROMPT", title, solution, confirmAction }
}

export function updateCommentInput(comment: string): PromptAction {
    return { type: "UPDATE_COMMENT_INPUT", comment }
}

export function updateFmcInput(solution: string): PromptAction {
    return { type: "UPDATE_FMC_INPUT", solution }
}
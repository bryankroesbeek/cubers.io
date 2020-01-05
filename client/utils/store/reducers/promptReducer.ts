import { Reducer, Action } from 'redux'

import { PromptState, PromptAction } from '../types/promptTypes'

const initialState: PromptState = {
    type: "none",
    hideType: "none"
}

export const promptReducer: Reducer<PromptState, PromptAction> = (state = initialState, action): PromptState => {
    switch (action.type) {
        case "CLOSE_PROMPT":
            return { ...state, type: "none", hideType: "none" }

        case "HIDE_PROMPT":
            return { ...state, hideType: "hidden" }

        case "SHOW_PROMPT":
            return { ...state, hideType: "none" }

        case "SHOW_INFO_PROMPT":
            return { ...state, type: "info", title: action.title, hideType: "fade-in" }

        case "SHOW_LISTVIEW_PROMPT":
            return { ...state, type: "listview", title: action.title, items: action.items, hideType: "fade-in" }

        case "SHOW_CONFIRMATION_PROMPT":
            return { ...state, type: "confirmation", title: action.title, confirmAction: action.confirmAction, hideType: "fade-in", buttonColor: action.buttonColor }

        case "SHOW_COMMENT_INPUT_PROMPT":
            return { ...state, type: "comment", title: action.title, comment: action.comment, confirmAction: action.confirmAction, hideType: "fade-in" }

        case "SHOW_FMC_INPUT_PROMPT":
            return { ...state, type: "fmc", title: action.title, solution: action.solution, confirmAction: action.confirmAction, hideType: "fade-in" }

        case "UPDATE_COMMENT_INPUT":
            if (state.type !== "comment") break
            return { ...state, comment: action.comment }

        case "UPDATE_FMC_INPUT":
            if (state.type !== "fmc") break
            return { ...state, solution: action.solution }
    }

    return state
}
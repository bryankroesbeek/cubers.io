import { Action, Dispatch } from "redux"

export type PromptState = { hideType: "hidden" | "fade-in" | "none" } & (
    PromptNone |
    PromptInfoState |
    PromptConfirmationState |
    PromptCommentInputState |
    PromptFmcInputState |
    PromptListViewPrompt
)

type PromptNone = {
    type: "none"
}

type PromptInfoState = {
    type: "info"
    title: string
    // closeAction?: (dispatch: Dispatch) => void
}

type PromptConfirmationState = {
    type: "confirmation"
    title: string
    buttonColor: ButtonColor
    confirmAction: () => void
    // cancelAction?: (dispatch: Dispatch) => void
}

type PromptCommentInputState = {
    type: "comment"
    title: string
    comment: string
    confirmAction: (comment: string) => void
    // cancelAction?: (dispatch: Dispatch) => void
}

type PromptFmcInputState = {
    type: "fmc"
    title: string
    solution: string
    confirmAction: (solution: string) => void
    // cancelAction?: (dispatch: Dispatch) => void
}

type PromptListViewPrompt = {
    type: "listview"
    title: string
    items: string[]
    // closeAction?: (dispatch: Dispatch) => void
}

export type ButtonColor = "blue" | "green" | "red"

export type PromptAction = Action<"NONE"> |
    Action<"CLOSE_PROMPT"> |
    Action<"HIDE_PROMPT"> |
    Action<"SHOW_PROMPT"> |
    Action<"SHOW_INFO_PROMPT"> & { title: string } |
    Action<"SHOW_LISTVIEW_PROMPT"> & { title: string, items: string[] } |
    Action<"SHOW_CONFIRMATION_PROMPT"> & { title: string, confirmAction: () => void, buttonColor: ButtonColor } |
    Action<"SHOW_COMMENT_INPUT_PROMPT"> & { title: string, comment: string, confirmAction: (comment: string) => void } |
    Action<"SHOW_FMC_INPUT_PROMPT"> & { title: string, solution: string, confirmAction: (solution: string) => void } |
    Action<"UPDATE_COMMENT_INPUT"> & { comment: string } |
    Action<"UPDATE_FMC_INPUT"> & { solution: string }
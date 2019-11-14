import * as React from 'react'

import * as Api from '../../utils/api'
import * as Types from '../../utils/types'
import * as Helpers from '../../utils/helpers'
import { ManualEntry } from '../Helper/ManualEntry';
import { PreviousSolve } from '../../utils/types';
import * as fmcHelper from '../../utils/helpers/fmcHelper/fmcHelper'
import { PromptComponent } from '../Prompt/Prompt';
import { showFmcInputPrompt, showInfoPrompt, showListViewPrompt } from '../../utils/store/actions/promptActions';

type TimerProps = {
    settings: Types.UserSettingsMinified
    previousSolve: Types.PreviousSolve | "none"
    currentScramble: { id: number, scramble: string } | "none"
    eventName: string
    comment: string
    postTime: (time: number, penalty: Penalty, callback: () => void) => void
    postFmc: (moves: number, solution: string, callback: () => void) => void
    postPenalty: (id: number, penalty: Penalty) => void
    deleteTime: (id: number, callback: () => void) => void
    updateComment: (text: string) => void
}

type TimerState = {
    timer: TimerInfo
    comment: string
    fmcSolution: string
}

type TimeState = "idle" | "starting-inspection" | "inspecting" | "starting" | "ready" | "timing" | "finished"
type Penalty = "none" | "+2" | "DNF"
type TimerInfo = {
    state: TimeState
    start: number | "none"
    end: number | "none"
    delta: number | "none"
    startKey: string
    penalty: Penalty
    inspectionTime: number
    inspectionStart: number | "none"
    inspectionPenalty: Penalty
}

let initialTimerInfo: TimerInfo = {
    state: "idle",
    start: "none",
    end: "none",
    delta: "none",
    startKey: "",
    penalty: "none",
    inspectionTime: 15,
    inspectionStart: "none",
    inspectionPenalty: "none"
}

export class Timer extends React.Component<TimerProps, TimerState>{
    constructor(props: TimerProps) {
        super(props)

        this.state = {
            timer: initialTimerInfo,
            comment: props.comment,
            fmcSolution: ""
        }
    }

    componentDidMount() {
        if (this.props.settings.manual_time_entry_by_default) return
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
    }

    componentWillUnmount() {
        if (this.props.settings.manual_time_entry_by_default) return
        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('keyup', this.onKeyUp)
    }

    onKeyDown = (event: KeyboardEvent) => {
        if (this.props.currentScramble === "none") return
        if (this.state.timer.state === "timing") {
            if (this.state.timer.start === "none") throw "impossible"

            let time = Date.now()
            let delta = time - this.state.timer.start
            this.setState({ timer: { ...this.state.timer, state: "finished", end: time, delta: delta } }, () => {
                this.props.postTime(delta / 10, this.state.timer.inspectionPenalty, () => {
                    this.setState({ timer: { ...initialTimerInfo, state: this.state.timer.state } })
                })
            })
        }

        if (event.key !== " ") return

        if (this.state.timer.state === "idle") {
            let isBlind = this.props.eventName.toLowerCase().includes("bld")
            let inspection = this.props.settings.use_inspection_time

            if (inspection && !isBlind) {
                this.setState({ timer: { ...this.state.timer, state: "starting-inspection" } })
            } else {
                this.prepareStart()
            }
        }

        if (this.state.timer.state === "inspecting") {
            this.prepareStart()
        }
    }

    prepareStart() {
        let startKey = Math.random().toString()
        this.setState({ timer: { ...this.state.timer, state: "starting", startKey: startKey } }, () => {
            setTimeout(() => {
                if (startKey !== this.state.timer.startKey) return

                if (this.state.timer.state === "starting") {
                    this.setState({ timer: { ...this.state.timer, state: "ready" } })
                }
            }, 400)
        })
    }

    onKeyUp = () => {
        if (this.state.timer.state === "finished") {
            this.setState({ timer: { ...this.state.timer, state: "idle" } })
        }

        if (this.props.currentScramble === "none") return

        if (this.state.timer.state === "starting-inspection") {
            this.setState({ timer: { ...this.state.timer, state: "inspecting", inspectionStart: Date.now() } }, () => {
                let interval = setInterval(() => {
                    let inspectionStart = this.state.timer.inspectionStart as number
                    let inspectionDuration = parseInt(`${(Date.now() - inspectionStart) / 1000}`)

                    if (this.state.timer.state === "inspecting" || this.state.timer.state === "starting" || this.state.timer.state === "ready") {
                        this.setState({ timer: { ...this.state.timer, inspectionTime: 15 - inspectionDuration } }, () => {
                            if (this.state.timer.inspectionTime <= 0)
                                this.setState({ timer: { ...this.state.timer, inspectionPenalty: "+2" } })
                            if (this.state.timer.inspectionTime <= -2)
                                this.setState({ timer: { ...this.state.timer, state: "idle", inspectionPenalty: "DNF" } }, () => {
                                    this.props.postTime(-10, "DNF", () => {
                                        this.setState({ timer: initialTimerInfo })
                                    })
                                })
                        })
                    } else {
                        clearInterval(interval)
                    }
                }, 16)
            })
        }

        if (this.state.timer.state === "starting") {
            let previousState: "inspecting" | "idle" = this.props.settings.use_inspection_time ? "inspecting" : "idle"
            this.setState({ timer: { ...this.state.timer, state: previousState } })
        }

        if (this.state.timer.state === "ready") {
            let interval = setInterval(() => {
                if (this.state.timer.state === "timing") {
                    if (this.state.timer.start !== "none")
                        this.setState({ timer: { ...this.state.timer, delta: Date.now() - this.state.timer.start } })
                } else {
                    clearInterval(interval)
                }
            }, 16)
            let time = Date.now()
            this.setState({ timer: { ...this.state.timer, state: "timing", start: time, delta: 0 } })
        }
    }

    getTime() {
        if (this.state.timer.state === "inspecting") {
            if (this.props.settings.hide_inspection_time) return "Inspect"
            if (this.state.timer.inspectionTime <= -2) return "DNF"
            if (this.state.timer.inspectionTime <= 0) return "+2"
            return this.state.timer.inspectionTime
        }
        if (this.state.timer.state === "starting" || this.state.timer.state === "ready") return "0.00"
        if (this.state.timer.state === "timing") {
            if (this.props.settings.hide_running_timer) return "Solve"
            return Helpers.toReadableTime(this.state.timer.delta as number)
        }
        if (this.state.timer.delta !== "none") return Helpers.toReadableTime(this.state.timer.delta)
        if (this.props.previousSolve !== "none") return this.props.previousSolve.time
        return "0.00"
    }

    getTimerState(state: TimeState) {
        if (state === "ready" || state === "timing")
            return state
        return ""
    }

    getInspectionState() {
        if (this.state.timer.inspectionTime <= -2) return "dnf"
        if (this.state.timer.state === "timing") return ""
        if (this.state.timer.inspectionTime <= 0) return "penalty"
        return ""
    }

    updateTime(penalty: Penalty) {
        let previousSolve = this.props.previousSolve as Types.PreviousSolve
        this.props.postPenalty(previousSolve.id, penalty)
    }

    getPenaltyState(): Penalty {
        if (this.props.previousSolve === "none") return
        if (this.props.previousSolve.is_dnf) return "DNF"
        if (this.props.previousSolve.is_plus_2) return "+2"
    }

    renderTime() {
        let timeEntryDisabled = this.props.currentScramble === "none"
        let mblind = this.props.eventName.toLowerCase().indexOf("bld") !== -1
        let fmc = this.props.eventName.toLowerCase().indexOf("fmc") !== -1

        if (mblind)
            return <ManualEntry
                type="mbld"
                disabled={timeEntryDisabled}
                submit={(value, callback) => this.props.postTime(value, "none", callback)}
            />

        if (fmc) {
            let cleanInput = fmcHelper.sanitizeSolutionAndGetRawMoves(this.state.fmcSolution)
            let moveCount = fmcHelper.getOBTMMoveCount(cleanInput)
            return <ManualEntry
                type="fmc"
                disabled={timeEntryDisabled}
                submit={(moveCount, callback) => this.props.postFmc(moveCount, this.state.fmcSolution, () => {
                    this.setState({ fmcSolution: "" }, callback)
                })}
                moveCount={moveCount ? moveCount : "none"}
            />
        }

        if (this.props.settings.manual_time_entry_by_default)
            return <ManualEntry
                type="normal"
                disabled={timeEntryDisabled}
                submit={(value, callback) => this.props.postTime(value / 10, "none", callback)}
            />

        return <span className={`timer-time ${this.getTimerState(this.state.timer.state)} ${this.getInspectionState()}`}>
            {this.getTime()}
        </span>
    }

    renderFmcButtons(id: number, disabled: boolean, buttonStyle: "disabled" | "enabled") {
        let timeEntryDisabled = this.props.currentScramble === "none"
        return <div className="timer-buttons">
            <button className={`timer-modifier-button ${buttonStyle}`} disabled={disabled} onClick={e => {
                this.props.deleteTime(id, () => {
                    this.setState({ fmcSolution: "" })
                })
            }}>
                <i className="fas fa-undo"></i>
            </button>
            <button className={`timer-modifier-button ${buttonStyle}`} disabled={disabled || timeEntryDisabled} onClick={e => {
                if (this.props.currentScramble === "none") return
                let { currentScramble } = this.props
                PromptComponent.modifyPrompt(showFmcInputPrompt(
                    `Enter your solution`,
                    this.state.fmcSolution,
                    (newSolution) => {
                        let cleanSolution = fmcHelper.sanitizeSolutionAndGetRawMoves(newSolution)
                        if (!fmcHelper.doesSolutionSolveScramble(cleanSolution.join(" "), currentScramble.scramble)) {
                            return PromptComponent.swapPrompt(showListViewPrompt(
                                `Your solution doesn't appear to solve the provided scramble!
                                Please double-check your solution for correctness and typos.
                                
                                Here is how your solution was interpreted:`,
                                [cleanSolution.join(" ")]
                            ))
                        }

                        this.setState({ fmcSolution: newSolution })
                    }
                ))
            }}>Solution</button>
        </div>
    }

    renderMbldButtons(id: number, disabled: boolean, buttonStyle: "disabled" | "enabled") {
        return <div className="timer-buttons">
            <button className={`timer-modifier-button ${buttonStyle}`} disabled={disabled} onClick={e => {
                this.props.deleteTime(id, () => { })
            }}>
                <i className="fas fa-undo"></i>
            </button>
            <button className={`timer-modifier-button ${buttonStyle}`} disabled={disabled} onClick={e => {
                this.props.updateComment(this.props.comment)
            }}>
                <i className="far fa-comment"></i>
            </button>
        </div>
    }

    renderButtons() {
        let { id } = this.props.previousSolve as PreviousSolve

        let disabled = this.props.previousSolve === "none" || this.state.timer.state !== "idle"
        let penaltyDisabled = this.props.previousSolve === "none" || this.state.timer.state !== "idle" || this.props.previousSolve.is_inspection_dnf
        let buttonStyle: "disabled" | "enabled" = disabled ? "disabled" : "enabled"
        let penaltyButtonStyle = penaltyDisabled ? "disabled" : "enabled"

        let mblind = this.props.eventName.toLowerCase().indexOf("bld") !== -1
        let fmc = this.props.eventName.toLowerCase().indexOf("fmc") !== -1

        if (mblind) return this.renderMbldButtons(id, disabled, buttonStyle)
        if (fmc) return this.renderFmcButtons(id, disabled, buttonStyle)

        return <div className="timer-buttons">
            <button className={`timer-modifier-button ${buttonStyle}`} disabled={disabled} onClick={e => {
                this.props.deleteTime(id, () => { })
            }}>
                <i className="fas fa-undo"></i>
            </button>
            <button className={`timer-modifier-button ${penaltyButtonStyle} ${this.getPenaltyState() === "+2" ? "active" : ""}`} disabled={penaltyDisabled} onClick={e => {
                this.updateTime("+2")
                e.currentTarget.blur()
            }}>
                <span>+2</span>
            </button>
            <button className={`timer-modifier-button ${penaltyButtonStyle} ${this.getPenaltyState() === "DNF" ? "active" : ""}`} disabled={penaltyDisabled} onClick={e => {
                this.updateTime("DNF")
                e.currentTarget.blur()
            }}>
                <span>DNF</span>
            </button>
            <button className={`timer-modifier-button ${buttonStyle}`} disabled={disabled} onClick={e => {
                this.props.updateComment(this.props.comment)
            }}>
                <i className="far fa-comment"></i>
            </button>
        </div>
    }

    render() {
        return <div className="timer-wrapper">
            {this.renderTime()}
            {this.renderButtons()}
        </div>
    }
}
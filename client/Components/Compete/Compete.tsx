import * as React from 'react'
import { DispatchProp, MapStateToProps, connect } from 'react-redux'
import { match } from 'react-router'

import * as Api from '../../utils/api'
import * as Types from '../../utils/types'
import { CompeteAction, CompeteState } from '../../utils/store/types/competeTypes'
import { fetchEvent, submitSolve, submitPenalty, deleteSolveAction, submitFmcResult } from '../../utils/store/actions/competeActions'
import { Store } from '../../utils/store/types/generalTypes'
import { minifyRawSettings } from '../../utils/helpers/settingsHelper'
import { UserSettings } from '../../utils/types'

import { Timer } from './Timer'
import { FitText } from '../Helper/FitText'
import { ScrambleViewer } from '../Helper/ScrambleViewer'
import { PromptAction } from '../../utils/store/types/promptTypes'
import { showCommentInputPrompt, showConfirmationPrompt, showFmcInputPrompt } from '../../utils/store/actions/promptActions'

type RemoteProps = {
    eventType: number
    settings: Types.UserSettingsMinified
}

type CompeteProps = CompeteState

type Props = CompeteProps & RemoteProps & DispatchProp<CompeteAction | PromptAction>

export class CompeteComponent extends React.Component<Props>{
    scrambleRef: React.RefObject<HTMLDivElement>

    constructor(props: Props) {
        super(props)

        this.scrambleRef = React.createRef()
    }

    componentDidMount() {
        Api.getEventInfo(this.props.eventType)
            .then(event => this.props.dispatch(fetchEvent(event)))
    }

    postTime(time: number, penalty: "none" | "+2" | "DNF", callback: () => void) {
        let event = this.props.event as Types.Event
        submitSolve(this.props.dispatch, event, time, penalty, callback)
    }

    postFmc(moveCount: number, solution: string, callback: () => void) {
        let event = this.props.event as Types.Event
        submitFmcResult(this.props.dispatch, event, moveCount, solution, callback)
    }

    postPenalty(id: number, penalty: "none" | "+2" | "DNF") {
        let event = this.props.event as Types.Event
        submitPenalty(this.props.dispatch, event, id, penalty)
    }

    deleteTime(id: number, callback: () => void) {
        let event = this.props.event as Types.Event
        this.props.dispatch(showConfirmationPrompt(
            `Are you sure you want to delete your last solve? (${event.previousSolve.time})`,
            () => deleteSolveAction(this.props.dispatch, event, id, callback)
        ))
    }

    updateComment(text: string) {
        let event = this.props.event as Types.Event
        this.props.dispatch(showCommentInputPrompt(
            `Comment for ${event.event.name}`,
            text,
            (comment) => {
                Api.submitComment(event.event.id, comment)
                    .then(newEvent => this.props.dispatch(fetchEvent(newEvent)))
            }
        ))
    }

    renderSidebar(event: Types.Event) {
        return <div className="sidebar">
            <div className="sidebar-title">Solves</div>
            <div className="sidebar-times">
                {event.event.solves.map((solve, count) =>
                    <div key={`solve_${count}`} className="time">
                        {solve.friendlyTime}
                    </div>
                )}
            </div>
            <ScrambleViewer
                event={event}
                settings={this.props.settings}
            />
        </div>
    }

    renderTimer(event: Types.Event) {
        let previousSolve = event.previousSolve

        return <div className="timer-container">
            <FitText text={event.currentScramble.text} />
            <Timer
                settings={this.props.settings}
                previousSolve={!previousSolve ? "none" : previousSolve}
                currentScramble={event.currentScramble.id === -1 ?
                    "none" :
                    {
                        id: event.currentScramble.id,
                        scramble: event.currentScramble.text
                    }
                }
                eventName={event.event.name}
                comment={event.event.comment}
                postTime={(time, penalty, callback) => this.postTime(time, penalty, callback)}
                postFmc={(moveCount, solution, callback) => this.postFmc(moveCount, solution, callback)}
                postPenalty={(id, penalty) => this.postPenalty(id, penalty)}
                deleteTime={(id, callback) => this.deleteTime(id, callback)}
                updateComment={(text: string) => this.updateComment(text)}
            />
        </div>
    }

    render() {
        if (this.props.event === "loading") return null

        return <div className="compete-container">
            {this.renderSidebar(this.props.event)}
            {this.renderTimer(this.props.event)}
        </div>
    }
}

let mapStateToProps:
    MapStateToProps<CompeteProps & RemoteProps, RemoteProps & { match: match<{ eventType: string }> }, Store> =
    (store, ownProps) => {
        return {
            ...store.compete,
            settings: minifyRawSettings(store.baseInfo.settings as UserSettings),
            eventType: Number(ownProps.match.params.eventType)
        }
    }

export let Compete = connect(mapStateToProps)(CompeteComponent)
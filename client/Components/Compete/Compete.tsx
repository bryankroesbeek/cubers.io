import * as React from 'react'
import { DispatchProp, MapStateToProps, connect } from 'react-redux'
import { match } from 'react-router'

import * as Api from '../../utils/api'
import * as Types from '../../utils/types'
import { CompeteAction, CompeteState } from '../../utils/store/types/competeTypes'
import { fetchEvent, submitSolve, submitPenalty, deleteSolveAction } from '../../utils/store/actions/competeActions'
import { Store } from '../../utils/store/types/generalTypes'
import { minifyRawSettings } from '../../utils/helpers/settingsHelper'
import { UserSettings } from '../../utils/types'

import { Timer } from './Timer'
import { FitText } from '../Helper/FitText'
import { ScrambleViewer } from '../Helper/ScrambleViewer'
import { PromptAction } from '../../utils/store/types/promptTypes'
import { showCommentInputPrompt, showConfirmationPrompt } from '../../utils/store/actions/promptActions'

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
        submitSolve(this.props.dispatch, event, time, penalty)
        callback()
        // Api.postSolve({
        //     comp_event_id: event.event.id,
        //     elapsed_centiseconds: parseInt(`${time / 10}`),
        //     is_inspection_dnf: penalty === "DNF",
        //     is_dnf: penalty === "DNF",
        //     is_plus_two: penalty === "+2",
        //     scramble_id: event.currentScramble.id
        // }).then(newEvent => this.setState({ event: newEvent }, () => callback()))
    }

    postPenalty(id: number, penalty: "none" | "+2" | "DNF") {
        let event = this.props.event as Types.Event
        submitPenalty(this.props.dispatch, event, id, penalty)
        // if (penalty === "+2") {
        //     Api.putPlusTwo(id, event.event.id)
        //         .then(newEvent => this.setState({ event: newEvent }))
        //     return
        // }
        // if (penalty === "DNF") {
        //     Api.putDnf(id, event.event.id)
        //         .then(newEvent => this.setState({ event: newEvent }))
        //     return
        // }
    }

    deleteTime(id: number) {
        let event = this.props.event as Types.Event
        this.props.dispatch(showConfirmationPrompt(
            `Are you sure you want to delete your last solve? (${event.previousSolve.time})`,
            () => deleteSolveAction(this.props.dispatch, event, id)
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
                currentScrambleId={event.currentScramble.id === -1 ?
                    "none" :
                    { id: event.currentScramble.id }
                }
                eventName={event.event.name}
                comment={event.event.comment}
                postTime={(time, penalty, callback) => this.postTime(time, penalty, callback)}
                postPenalty={(id, penalty) => this.postPenalty(id, penalty)}
                deleteTime={(id: number) => this.deleteTime(id)}
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
import * as React from 'react'

import * as Api from '../../utils/api'
import * as Types from '../../utils/types'
import { Timer } from './Timer';
import { FitText } from '../Helper/FitText';
import { ScrambleViewer } from '../Helper/ScrambleViewer'

type CompeteProps = {
    eventType: number
    settings: Types.UserSettingsMinified
}

type CompeteState = {
    event: Types.Event | "loading"
}

export class Compete extends React.Component<CompeteProps, CompeteState>{
    scrambleRef: React.RefObject<HTMLDivElement>

    constructor(props: CompeteProps) {
        super(props)

        this.state = {
            event: "loading"
        }

        this.scrambleRef = React.createRef()
    }

    componentDidMount() {
        Api.getEventInfo(this.props.eventType)
            .then(event => this.setState({ event: event }))
    }

    postTime(time: number, penalty: "none" | "+2" | "DNF", callback: () => void) {
        let event = this.state.event as Types.Event
        Api.postSolve({
            comp_event_id: event.event.id,
            elapsed_centiseconds: parseInt(`${time / 10}`),
            is_inspection_dnf: penalty === "DNF",
            is_dnf: penalty === "DNF",
            is_plus_two: penalty === "+2",
            scramble_id: event.currentScramble.id
        }).then(newEvent => this.setState({ event: newEvent }, () => callback()))
    }

    postPenalty(id: number, penalty: "none" | "+2" | "DNF") {
        let event = this.state.event as Types.Event
        if (penalty === "+2") {
            Api.putPlusTwo(id, event.event.id)
                .then(newEvent => this.setState({ event: newEvent }))
            return
        }
        if (penalty === "DNF") {
            Api.putDnf(id, event.event.id)
                .then(newEvent => this.setState({ event: newEvent }))
            return
        }
    }

    deleteTime(id: number) {
        let event = this.state.event as Types.Event
        Api.deleteSolve(id, event.event.id)
            .then(newEvent => this.setState({ event: newEvent }))
    }

    updateComment(text: string) {
        let event = this.state.event as Types.Event
        Api.submitComment(event.event.id, text)
            .then(newEvent => this.setState({ event: newEvent }))
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
        if (this.state.event === "loading") return null

        return <div className="compete-container">
            {this.renderSidebar(this.state.event)}
            {this.renderTimer(this.state.event)}
        </div>
    }
}
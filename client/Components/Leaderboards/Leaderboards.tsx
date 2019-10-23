import * as React from 'react'

import * as Api from '../../utils/api'
import { User, Leaderboard, LeaderboardEvent } from '../../utils/types'
import { LeaderboardTable } from './LeaderboardTable'

type LeaderboardsProps = {
    competitionId: number
    user: User
}

type LeaderboardsState = {
    events: LeaderboardEvent[] | "loading"
    leaderboards: Leaderboard | "loading"
    currentActiveEvent: LeaderboardEvent | "none"
}

export class Leaderboards extends React.Component<LeaderboardsProps, LeaderboardsState>{

    constructor(props: LeaderboardsProps) {
        super(props)

        this.state = {
            events: "loading",
            leaderboards: "loading",
            currentActiveEvent: "none"
        }
    }

    async componentDidMount() {
        let events = await Api.getLeaderboardItems(this.props.competitionId)

        let event = events.filter(e => e.slug === "3x3")[0]

        let leaderboardsRequest = Api.getLeaderboardEvent(event.compEventId)

        this.setState({ events: events }, async () => {
            this.setState({ leaderboards: await leaderboardsRequest, currentActiveEvent: event })
        })
    }

    async loadEvent(event: LeaderboardEvent) {
        let leaderboardEvent = await Api.getLeaderboardEvent(event.compEventId)
        this.setState({ leaderboards: leaderboardEvent, currentActiveEvent: event })
    }

    renderEvents() {
        let events = this.state.events
        let currentEvent = this.state.currentActiveEvent as LeaderboardEvent

        if (events === "loading") return null

        return <div className="tab-events-header">
            {events.map(e => {
                let active = e.slug === currentEvent.slug ? "active" : ""

                return <button className={`tab-events-header-item ${active}`} onClick={() => this.loadEvent(e)}>
                    <img className="tab-events-header-item-image" src={`/static/images/cube-${e.slug}.png`} />
                </button>
            })}
        </div>
    }

    render() {
        if (this.state.leaderboards === "loading") return null
        if (this.state.currentActiveEvent === "none") return null

        return <div className="leaderboards">
            {this.renderEvents()}
            <LeaderboardTable
                currentEvent={this.state.currentActiveEvent}
                leaderboard={this.state.leaderboards}
            />
        </div>
    }
}
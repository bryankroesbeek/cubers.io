import * as React from 'react'

import * as Api from '../../api/api'
import * as Types from '../../api/types'
import * as Helpers from '../../api/helpers'
import { Link } from 'react-router-dom'
import { User, Leaderboard, LeaderboardEvent } from '../../api/types'

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

        return <div className="leaderboards-events">
            {events.map(e => {
                let active = e.slug === currentEvent.slug ? "active" : ""

                return <button className={`leaderboards-events-item ${active}`} onClick={() => this.loadEvent(e)}>
                    <img className="leaderboards-events-item-image" src={`/static/images/cube-${e.slug}.png`} />
                </button>
            })}
        </div>
    }

    renderLeaderboardTable() {
        let leaderboard = this.state.leaderboards
        if (leaderboard === "loading") return null

        let results = leaderboard.results
        let currentEvent = this.state.currentActiveEvent as LeaderboardEvent

        return <div className="leaderboards-event">
            <div className="leaderboards-event-header">
                <Link to={`/event/${currentEvent.name}`}>{currentEvent.name}</Link>
                <button className="leaderboards-event-header-scrambles-button" onClick={() => {/* TODO: implement prompt */}}>
                    <i className="fas fa-dice-five scrambles" />
                </button>
            </div>

            <div className="leaderboards-event-table">
                <table className="table-results table table-sm table-striped table-cubersio">
                    <thead className="thead-dark">
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Average</th>
                            <th>Best</th>
                            <th colSpan={5}>Solves</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(r => <tr>
                            <td>{r.visibleRank}</td>
                            <td>{r.solve.user.name}</td>
                            <td>{Helpers.toReadableTime(r.solve.average * 10)}</td>
                            <td>{Helpers.toReadableTime(r.solve.best_single * 10)}</td>
                            {r.solve.times.map(t => <td>{t}</td>)}
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>

    }

    render() {
        return <div className="leaderboards">
            {this.renderEvents()}
            {this.renderLeaderboardTable()}
        </div>
    }
}
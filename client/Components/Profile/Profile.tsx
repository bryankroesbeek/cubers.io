import * as React from 'react'
import { Link } from 'react-router-dom'

import * as Api from '../../api/api'
import * as Helpers from '../../api/helpers'
import { ProfileHistory, ProfileRankings, ProfileRecords, User, ProfileHistoryEvent, ProfileHistoryResult } from '../../api/types'
import { CompetitionEvent } from '../../api/types'
import { string } from 'prop-types'

type ProfileProps = {
    username: string
    currentUser: User
}

type ProfileState = {
    rankings: ProfileRankings | "loading"
    records: ProfileRecords | "loading"
    history: ProfileHistory | "loading"

    selectedEvent: {
        event: string,
        results: ProfileHistoryResult[]
    } | "none"
}

export class Profile extends React.Component<ProfileProps, ProfileState>{
    constructor(props: ProfileProps) {
        super(props)

        this.state = {
            history: "loading",
            rankings: "loading",
            records: "loading",
            selectedEvent: "none"
        }
    }

    async componentDidMount() {
        let rankingsRequest = Api.getUserRankings(this.props.username)
        let recordsRequest = Api.getUserRecords(this.props.username)
        let historyRequest = Api.getUserHistory(this.props.username)

        let history = await historyRequest
        let initialEvent = history.find(h => h.event === "3x3")
        if (!initialEvent) initialEvent = history[0]

        this.setState({
            rankings: await rankingsRequest,
            records: await recordsRequest,
            history: history,
            selectedEvent: initialEvent
        })
    }

    renderRankings() {
        let rankings = this.state.rankings
        if (rankings === "loading") return null

        return <div>
            <table className="table-results table table-sm table-striped table-cubersio">
                <thead className="thead-dark">
                    <tr>
                        <th rowSpan={2}>Competitions</th>
                        <th rowSpan={2}>Completed Solves</th>
                        <th colSpan={3}>Sum of Ranks (Single, Average)</th>
                        <th colSpan={3}>Kinchranks</th>
                    </tr>
                    <tr>
                        <th>Combined</th>
                        <th>WCA Events</th>
                        <th>Non-WCA Events</th>
                        <th>Combined</th>
                        <th>WCA Events</th>
                        <th>Non-WCA Events</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{rankings.competitions}</td>
                        <td>{rankings.solves}</td>
                        <td>{rankings.sumOfRanks.all.single}, {rankings.sumOfRanks.all.average}</td>
                        <td>{rankings.sumOfRanks.wca.single}, {rankings.sumOfRanks.wca.average}</td>
                        <td>{rankings.sumOfRanks.non_wca.single}, {rankings.sumOfRanks.non_wca.average}</td>
                        <td>{rankings.kinchRanks.all}</td>
                        <td>{rankings.kinchRanks.wca}</td>
                        <td>{rankings.kinchRanks.non_wca}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    }

    renderRecords() {
        let records = this.state.records
        if (records === "loading") return null

        return <div>
            <table className="table-results table table-sm table-striped table-cubersio">
                <thead className="thead-dark">
                    <tr>
                        <th>{/* Event image */}</th>
                        <th>Event</th>
                        <th>Site rank</th>
                        <th>Single</th>
                        <th>Average</th>
                        <th>Site rank</th>
                        <th>Site Kinchrank</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(r => <tr>
                        <td><Link to={`/event/${r.puzzle}`}><img className="profile-record-puzzle" src={`/static/images/cube-${r.puzzleSlug}.png`}/></Link></td>
                        <td><Link to={`/event/${r.puzzle}`}>{r.puzzle}</Link></td>
                        <td>{r.singleRank}</td>
                        <td>{Helpers.toReadableTime(r.single * 10)}</td>
                        <td>{Helpers.toReadableTime(r.average * 10)}</td>
                        <td>{r.averageRank}</td>
                        <td>{r.kinchRank}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    }

    renderHistory() {
        let history = this.state.history
        if (history === "loading") return null

        return <div>
            <div className="tab-events-header">
                {history.map(h =>
                    <button className={`tab-events-header-item ${h.event === this.state.selectedEvent}`} onClick={() => { }}>
                        <img className="tab-events-header-item-image" src={`/static/images/cube-${h.eventSlug}.png`} />
                    </button>
                )}

            </div>
            {this.renderHistoryTable()}
        </div>
    }

    renderHistoryTable() {
        let selectedEvent = this.state.selectedEvent
        if (selectedEvent === "none") return null

        return <div className="leaderboards-event">
            <table className="table-results table table-sm table-striped table-cubersio">
                <thead className="thead-dark">
                    <tr>
                        <th>{/* Comment */}</th>
                        <th>Competition</th>
                        <th>Single</th>
                        <th>Average</th>
                        <th colSpan={5}>Solves</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedEvent.results.map(r => <tr>
                        <td><i className="far fa-comment spacer"></i></td>
                        <td><Link to={`/leaderboards/${r.comp.id}`}>{r.comp.title}</Link></td>
                        <td>{Helpers.toReadableTime(r.solves.single * 10)}</td>
                        <td>{Helpers.toReadableTime(r.solves.average * 10)}</td>
                        {r.solves.times.map(t => <td>{t}</td>)}
                    </tr>)}
                </tbody>
            </table>
        </div>
    }

    render() {
        return <div>
            <h3>{this.props.username}</h3>
            {this.renderRankings()}
            {this.renderRecords()}
            {this.renderHistory()}
        </div>
    }
}
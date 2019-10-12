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

    selectedEvent: ProfileHistoryEvent | "none"
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
        let initialEvent = this.getInitialEvent(history)

        this.setState({
            rankings: await rankingsRequest,
            records: await recordsRequest,
            history: history,
            selectedEvent: initialEvent
        })
    }

    getInitialEvent(history: ProfileHistoryEvent[]): ProfileHistoryEvent | "none" {
        if (history.length === 0) return "none"
        let initialEvent = history.find(h => h.event === "8x8")
        if (!initialEvent) initialEvent = history[0]

        return initialEvent
    }

    renderRankings() {
        let rankings = this.state.rankings
        if (rankings === "loading") return null

        return <div>
            <table className="table-results table table-sm table-striped table-cubersio">
                <thead className="thead-dark">
                    <tr className="medium-row">
                        <th rowSpan={2}>Competitions</th>
                        <th rowSpan={2}>Completed Solves</th>
                        <th colSpan={3}>Sum of Ranks (Single, Average)</th>
                        <th colSpan={3}>Kinchranks</th>
                    </tr>
                    <tr className="medium-row">
                        <th>Combined</th>
                        <th>WCA Events</th>
                        <th>Non-WCA Events</th>
                        <th>Combined</th>
                        <th>WCA Events</th>
                        <th>Non-WCA Events</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="medium-row">
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
                    <tr className="medium-row">
                        <th>Event</th>
                        <th>Site rank</th>
                        <th>Single</th>
                        <th>Average</th>
                        <th>Site rank</th>
                        <th>Site Kinchrank</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(r => <tr className="medium-row">
                        <td>
                            <Link className="profile-record-puzzle-link" to={`/event/${r.puzzle}`}>
                                <img className="profile-record-puzzle-image puzzle-image" src={`/static/images/cube-${r.puzzleSlug}.png`} />
                                {r.puzzle}
                            </Link>
                        </td>
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

        let selectedEvent = this.state.selectedEvent as ProfileHistoryEvent

        return <div>
            <div className="tab-events-header">
                {history.map(h => this.renderEventButton(h, selectedEvent))}
            </div>
            {this.renderHistoryTable()}
        </div>
    }

    renderEventButton(h: ProfileHistoryEvent, selectedEvent: ProfileHistoryEvent) {
        let buttonClassName = `tab-events-header-item ${h.eventSlug === selectedEvent.eventSlug ? "active" : ""}`

        let onClick = () => {
            this.setState({ selectedEvent: h })
        }

        return <button className={buttonClassName} onClick={onClick}>
            <img className="tab-events-header-item-image" src={`/static/images/cube-${h.eventSlug}.png`} />
        </button>
    }

    renderHistoryTable() {
        let selectedEvent = this.state.selectedEvent
        if (selectedEvent === "none") return null

        return <div>
            <table className="table-results table table-sm table-striped table-cubersio">
                <thead className="thead-dark">
                    <tr className="medium-row">
                        <th>{/* Comment */}</th>
                        <th>Competition</th>
                        <th>Single</th>
                        <th>Average</th>
                        <th colSpan={5}>Solves</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedEvent.results.map(r => this.renderHistoryTableRow(r))}
                </tbody>
            </table>
        </div>
    }

    renderHistoryTableRow(r: ProfileHistoryResult) {
        let commentIconStyle = !r.solves.comment ? "empty-comment" : ""
        let comment = null

        if (r.solves.comment) comment = <div className="comment-tooltip">
            <span>{r.solves.comment}</span>
        </div>

        return <tr className="medium-row">
            <td className={`table-comment ${commentIconStyle}`}>
                <i className="far fa-comment comment-icon">{comment}</i>
            </td>
            <td>
                <Link to={`/leaderboards/${r.comp.id}`}>{r.comp.title}</Link>
            </td>
            <td>{Helpers.toReadableTime(r.solves.single * 10)}</td>
            <td>{Helpers.toReadableTime(r.solves.average * 10)}</td>
            {r.solves.times.map(t => <td>{t}</td>)}
        </tr>
    }

    renderComparisonLink() {
        if (this.props.username === this.props.currentUser.name) return null

        return <Link to={`/versus/${this.props.currentUser.name}/${this.props.username}`}>
            Compare to my records
        </Link>
    }

    render() {
        return <div className="profile">
            <h1 className="profile-username">{this.props.username}</h1>
            {this.renderRankings()}
            <div className="profile-section-title">
                <h3>Personal Records</h3>
                {this.renderComparisonLink()}
            </div>
            {this.renderRecords()}
            <div className="profile-section-title">
                <h3>Competition History</h3>
            </div>
            {this.renderHistory()}
        </div>
    }
}
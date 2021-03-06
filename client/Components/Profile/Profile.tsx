import * as React from 'react'
import { Link, match } from 'react-router-dom'
import { DispatchProp, MapStateToProps, connect } from 'react-redux'

import * as Helpers from '../../utils/helpers'
import { ProfileHistory, ProfileRankings, ProfileRecords, User, ProfileHistoryEvent, ProfileHistoryResult, ProfileUser } from '../../utils/types'
import { ProfileAction, ProfileState } from '../../utils/store/types/profileTypes'
import { fetchUserRankings, fetchUserRecords, fetchUserHistory, setActiveHistoryItem, fetchUserInformation } from '../../utils/store/actions/profileActions'
import { Store } from '../../utils/store/types/generalTypes'
import { Comment } from '../Helper/Comment'
import { setVerifiedStatus, setBlacklistStatus } from '../../utils/api'

type RemoteProps = {
    username: string
    currentUser: User
}

type ProfileProps = ProfileState & RemoteProps & DispatchProp<ProfileAction>

class ProfileComponent extends React.Component<ProfileProps>{
    async componentDidMount() {
        fetchUserInformation(this.props.dispatch, this.props.username)
        this.props.dispatch(fetchUserRankings(this.props.dispatch, this.props.username))
        this.props.dispatch(fetchUserRecords(this.props.dispatch, this.props.username))
        this.props.dispatch(fetchUserHistory(this.props.dispatch, this.props.username))
    }

    renderModBanner() {
        if (this.props.user === "loading") return null
        let user = this.props.user

        if (!(this.props.currentUser.admin || this.props.currentUser.admin)) return null

        const verify = () => setVerifiedStatus(this.props.username, "verify")
            .then(() => this.props.dispatch({ type: "FETCH_PROFILE_INFORMATION", user: { ...user, verified: true } }))

        const unverify = () => setVerifiedStatus(this.props.username, "unverify")
            .then(() => this.props.dispatch({ type: "FETCH_PROFILE_INFORMATION", user: { ...user, verified: false } }))

        const blacklist = () => setBlacklistStatus(this.props.username, "blacklist")
            .then(() => this.props.dispatch({ type: "FETCH_PROFILE_INFORMATION", user: { ...user, alwaysBlacklist: true } }))

        const unblacklist = () => setBlacklistStatus(this.props.username, "unblacklist")
            .then(() => this.props.dispatch({ type: "FETCH_PROFILE_INFORMATION", user: { ...user, alwaysBlacklist: false } }))

        let verifiedButton = user.verified ?
            <button className="profile-mod-button gray" onClick={unverify}>Un-verify User</button> :
            <button className="profile-mod-button green" onClick={verify}>Verify User</button>

        let blacklistButton = user.alwaysBlacklist ?
            <button className="profile-mod-button gray" onClick={unblacklist}>Remove Permanent Blacklist</button> :
            <button className="profile-mod-button red" onClick={blacklist}>Apply Permanent Blacklist</button>

        return <div className="profile-mod-row">
            <div className="mod-row-banner">
                {verifiedButton}
                {blacklistButton}
            </div>
        </div>
    }

    renderTitle() {
        if (this.props.user === "loading") return null
        let user = this.props.user

        let allowView = this.props.currentUser.admin || this.props.currentUser.mod

        return <h1 className="profile-username">
            {this.props.username}
            {allowView ? <span className="profile-username-mod-icons">
                <i className={`fas fa-user-check ${user.verified ? "verified" : "unverified"} ml-3`}></i>
                <i className={`fas fa-ban ${user.alwaysBlacklist ? "blacklisted" : "unblacklisted"} mx-3`}></i>
            </span> : null}
        </h1>
    }

    renderRankings() {
        let rankings = this.props.rankings
        if (rankings === "loading") return null

        return <div>
            <table className="cubersio-table text-center">
                <thead>
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
        let records = this.props.records
        if (records === "loading") return null

        return <div>
            <table className="cubersio-table">
                <thead>
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
        let history = this.props.history
        if (history === "loading") return null

        let selectedEvent = this.props.selectedEvent as ProfileHistoryEvent

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
            this.props.dispatch(setActiveHistoryItem(h))
        }

        return <button className={buttonClassName} onClick={onClick}>
            <img className="tab-events-header-item-image" src={`/static/images/cube-${h.eventSlug}.png`} />
        </button>
    }

    renderHistoryTable() {
        let selectedEvent = this.props.selectedEvent
        if (selectedEvent === "none") return null

        return <div>
            <table className="cubersio-table">
                <thead>
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
        let singleCellStyling = r.solves.wasPbSingle ? "personal-best" : null
        let averageCellStyling = r.solves.wasPbAverage ? "personal-best" : null

        return <tr className="medium-row">
            <td><Comment comment={r.solves.comment} /></td>
            <td>
                <Link to={`/leaderboards/${r.comp.id}`}>{r.comp.title}</Link>
            </td>
            <td className={singleCellStyling}>{Helpers.toReadableTime(r.solves.single * 10)}</td>
            <td className={averageCellStyling}>{Helpers.toReadableTime(r.solves.average * 10)}</td>
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
            {this.renderModBanner()}
            {this.renderTitle()}
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

let mapStateToProps:
    MapStateToProps<ProfileState & RemoteProps, { match: match<{ username: string }> } & RemoteProps, Store> =
    (store, ownProps) => {
        return {
            ...store.profile,
            username: ownProps.match.params.username,
            currentUser: store.baseInfo.user as User
        }
    }

export const Profile = connect(mapStateToProps)(ProfileComponent)
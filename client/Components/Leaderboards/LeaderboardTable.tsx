import * as React from 'react'
import { Link } from 'react-router-dom'

import * as Helpers from '../../utils/helpers'
import { Leaderboard, LeaderboardItem, LeaderboardEvent, User } from '../../utils/types'
import { PromptComponent } from '../Prompt/Prompt'
import { showConfirmationPrompt } from '../../utils/store/actions/promptActions'

type LeaderboardTableProps = {
    user: User
    leaderboard: Leaderboard
    currentEvent: LeaderboardEvent
    showScrambles: () => void
    toggleBlacklist?: (row: LeaderboardItem, type: "blacklist" | "unblacklist") => void
}

export class LeaderboardTable extends React.Component<LeaderboardTableProps> {
    renderTableHeader() {
        return <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Average</th>
            <th>Best</th>
            <th colSpan={Number(this.props.currentEvent.format.slice(2))}>Solves</th>
            {this.props.user.admin ? <th></th> : null}
        </tr>
    }

    renderTableRow(r: LeaderboardItem) {
        // We know for a fact that blacklisted results are only shown to people with higher privileges
        let className = r.solve.blacklisted ? "blacklisted-result" : null
        return <tr className={className}>
            <td>{r.visibleRank}</td>
            <td><Link to={`/u/${r.solve.user.name}`}>/u/{r.solve.user.name}</Link></td>
            <td>{Helpers.toReadableTime(r.solve.average * 10)}</td>
            <td>{Helpers.toReadableTime(r.solve.best_single * 10)}</td>
            {r.solve.times.map(t => <td>{t}</td>)}
            {this.props.user.admin ? <td>
                <button
                    className={r.solve.blacklisted ? "btn btn-success btn-xs btn-unblacklist" : "btn btn-danger btn-xs btn-blacklist"}
                    onClick={() => {
                        if (r.solve.blacklisted) PromptComponent.modifyPrompt(showConfirmationPrompt(
                            `Unblacklist this ${this.props.currentEvent.name} result for ${r.solve.user.name}`,
                            () => { this.props.toggleBlacklist(r, "unblacklist") }
                        ))
                        else PromptComponent.modifyPrompt(showConfirmationPrompt(
                            `Blacklist this ${this.props.currentEvent.name} result for ${r.solve.user.name}`,
                            () => { this.props.toggleBlacklist(r, "blacklist") }
                        )) 
                    }}
                /* button */>
                    {r.solve.blacklisted ? "unblacklist" : "blacklist"}
                </button>
            </td> : null}
        </tr>
    }

    render() {
        return <div className="leaderboards-event">
            <div className="leaderboards-event-header">
                <Link to={`/event/${this.props.currentEvent.name}`}>{this.props.currentEvent.name}</Link>
                <button className="leaderboards-event-header-scrambles-button" onClick={() => this.props.showScrambles()}>
                    <i className="fas fa-dice-five scrambles" />
                </button>
            </div>

            <div className="leaderboards-event-table">
                <table className="table-results table table-sm table-striped table-cubersio">
                    <thead className="thead-dark">
                        {this.renderTableHeader()}
                    </thead>
                    <tbody>
                        {this.props.leaderboard.results.map(r => this.renderTableRow(r))}
                    </tbody>
                </table>
            </div>
        </div>
    }
}
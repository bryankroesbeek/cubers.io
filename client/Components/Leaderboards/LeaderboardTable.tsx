import * as React from 'react'
import { Link } from 'react-router-dom'

import * as Helpers from '../../utils/helpers'
import { Leaderboard, LeaderboardItem, LeaderboardEvent } from '../../utils/types'

type LeaderboardTableProps = {
    leaderboard: Leaderboard
    currentEvent: LeaderboardEvent
}

export class LeaderboardTable extends React.Component<LeaderboardTableProps> {
    renderTableHeader() {
        return <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Average</th>
            <th>Best</th>
            <th colSpan={5}>Solves</th>
            {/* TODO: add mod buttons */}
        </tr>
    }

    renderTableRow(r: LeaderboardItem) {
        return <tr>
            <td>{r.visibleRank}</td>
            <td><Link to={`/u/${r.solve.user.name}`}>/u/{r.solve.user.name}</Link></td>
            <td>{Helpers.toReadableTime(r.solve.average * 10)}</td>
            <td>{Helpers.toReadableTime(r.solve.best_single * 10)}</td>
            {r.solve.times.map(t => <td>{t}</td>)}
            {/* TODO: add mod button */}
        </tr>
    }

    render() {
        return <div className="leaderboards-event">
            <div className="leaderboards-event-header">
                <Link to={`/event/${this.props.currentEvent.name}`}>{this.props.currentEvent.name}</Link>
                <button className="leaderboards-event-header-scrambles-button" onClick={() => {/* TODO: implement prompt */ }}>
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
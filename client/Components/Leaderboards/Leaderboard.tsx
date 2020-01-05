import * as React from 'react'
import { match } from 'react-router'
import { DispatchProp, connect, MapStateToProps } from 'react-redux'

import { User, LeaderboardEvent } from '../../utils/types'
import { LeaderboardTable } from './LeaderboardTable'
import { LeaderboardState, LeaderboardAction, LeaderboardTableRowOverall } from '../../utils/store/types/leaderboardTypes'
import { fetchLeaderboardById, setCurrentActiveEvent, updateBlacklist, fetchLeaderboardOverall } from '../../utils/store/actions/leaderboardActions'
import { Store } from '../../utils/store/types/generalTypes'
import { showListViewPrompt } from '../../utils/store/actions/promptActions'
import { PromptAction } from '../../utils/store/types/promptTypes'
import { Header } from '../Header/Header'
import { Link } from 'react-router-dom'

type RemoteProps = {
    competitionId: number
    user: User
}

type LeaderboardsProps = DispatchProp<LeaderboardAction | PromptAction> & LeaderboardState & RemoteProps

export class LeaderboardComponent extends React.Component<LeaderboardsProps>{
    componentDidMount() {
        this.props.dispatch(fetchLeaderboardById(this.props.dispatch, this.props.competitionId))
    }

    componentDidUpdate() {
        if (this.props.data === "loading") return
        Header.setTitle(this.props.data.compTitle)
        if (this.props.data.compId === this.props.competitionId) return
        this.props.dispatch(fetchLeaderboardById(this.props.dispatch, this.props.competitionId))
    }

    renderEvents() {
        let data = this.props.data
        let currentEvent = this.props.currentActiveEvent as LeaderboardEvent

        if (data === "loading") return null

        return <div className="tab-events-header">
            {data.events.map(e => {
                let active = e.slug === currentEvent.slug ? "active" : ""

                return <button
                    className={`tab-events-header-item ${active}`}
                    onClick={() => this.props.dispatch(setCurrentActiveEvent(this.props.dispatch, e))}
                /* button */>
                    <img className="tab-events-header-item-image" src={`/static/images/cube-${e.slug}.png`} />
                </button>
            })}
            <button
                className={`tab-events-header-item ${this.props.overall !== "none" ? "active" : ""}`}
                onClick={() => fetchLeaderboardOverall(this.props.dispatch, this.props.competitionId)}
            /* button */>
                <i className={`fas fa-globe-europe tab-events-header-item-image`} />
            </button>
        </div>
    }

    renderOverallTable(rows: LeaderboardTableRowOverall[]) {
        return <div className="leaderboards-event">
            <div className="leaderboards-event-header">

            </div>

            <div className="leaderboards-event-table">
                <table className="table-results table table-sm table-striped table-cubersio">
                    <thead className="thead-dark">
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => <tr>
                            <td>{i + 1}</td>
                            <td><Link to={`/u/${r.user.name}`}>/u/{r.user.name}</Link></td>
                            <td>{r.points}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    }

    render() {
        if (this.props.leaderboard === "loading") return null
        if (this.props.currentActiveEvent !== "none") {
            let currentActiveEvent = this.props.currentActiveEvent
            let leaderboard = this.props.leaderboard

            var leaderboardTable = <LeaderboardTable
                user={this.props.user}
                currentEvent={currentActiveEvent}
                leaderboard={this.props.leaderboard}
                showScrambles={() => {
                    this.props.dispatch(showListViewPrompt(
                        `Scrambles for ${currentActiveEvent.name}`,
                        leaderboard.scrambles
                    ))
                }}
                toggleBlacklist={(row, type) => {
                    this.props.dispatch(updateBlacklist(this.props.dispatch, row, type))
                }}
            />
        }
        if (this.props.overall !== "none") var leaderboardTable = this.renderOverallTable(this.props.overall)

        return <div className="leaderboards">
            {this.renderEvents()}
            {leaderboardTable}
        </div>
    }
}

export let mapStateToProps:
    MapStateToProps<LeaderboardState & RemoteProps, RemoteProps & { match: match<{ compId: string }> }, Store> =
    (store, ownProps) => {
        return {
            ...store.leaderboard,
            user: store.baseInfo.user as User,
            competitionId: Number(ownProps.match.params.compId),
        }
    }

export let Leaderboard = connect(mapStateToProps)(LeaderboardComponent)
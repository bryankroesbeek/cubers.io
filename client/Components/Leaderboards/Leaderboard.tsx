import * as React from 'react'
import { match } from 'react-router'
import { DispatchProp, connect, MapStateToProps } from 'react-redux'

import { User, LeaderboardEvent } from '../../utils/types'
import { LeaderboardTable } from './LeaderboardTable'
import { LeaderboardState, LeaderboardAction } from '../../utils/store/types/leaderboardTypes'
import { fetchLeaderboardById, setCurrentActiveEvent } from '../../utils/store/actions/leaderboardActions'
import { Store } from '../../utils/store/types/generalTypes'

type RemoteProps = {
    competitionId: number
    user: User
}

type LeaderboardsProps = DispatchProp<LeaderboardAction> & LeaderboardState & RemoteProps

export class LeaderboardComponent extends React.Component<LeaderboardsProps>{
    componentDidMount() {
        this.props.dispatch(fetchLeaderboardById(this.props.dispatch, this.props.competitionId))
    }

    renderEvents() {
        let events = this.props.events
        let currentEvent = this.props.currentActiveEvent as LeaderboardEvent

        if (events === "loading") return null

        return <div className="tab-events-header">
            {events.map(e => {
                let active = e.slug === currentEvent.slug ? "active" : ""

                return <button
                    className={`tab-events-header-item ${active}`}
                    onClick={() => this.props.dispatch(setCurrentActiveEvent(this.props.dispatch, e))}
                /* button */>
                    <img className="tab-events-header-item-image" src={`/static/images/cube-${e.slug}.png`} />
                </button>
            })}
        </div>
    }

    render() {
        if (this.props.leaderboard === "loading") return null
        if (this.props.currentActiveEvent === "none") return null

        return <div className="leaderboards">
            {this.renderEvents()}
            <LeaderboardTable
                currentEvent={this.props.currentActiveEvent}
                leaderboard={this.props.leaderboard}
            />
        </div>
    }
}

export let mapStateToProps:
    MapStateToProps<LeaderboardState & RemoteProps, RemoteProps & { match: match<{ compId: string }> }, Store> =
    (store, ownProps) => {
        return {
            ...store.leaderboard,
            user: ownProps.user,
            competitionId: Number(ownProps.match.params.compId),
        }
    }

export let Leaderboard = connect(mapStateToProps)(LeaderboardComponent)
import * as React from 'react'
import { match } from 'react-router'
import { DispatchProp, connect, MapStateToProps } from 'react-redux'

import { User, LeaderboardEvent } from '../../utils/types'
import { LeaderboardTable } from './LeaderboardTable'
import { LeaderboardState, LeaderboardAction } from '../../utils/store/types/leaderboardTypes'
import { fetchLeaderboardById, setCurrentActiveEvent } from '../../utils/store/actions/leaderboardActions'
import { Store } from '../../utils/store/types/generalTypes'
import { showListViewPrompt } from '../../utils/store/actions/promptActions'
import { PromptAction } from '../../utils/store/types/promptTypes'
import { Header } from '../Header/Header'

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
        </div>
    }

    render() {
        if (this.props.leaderboard === "loading") return null
        if (this.props.currentActiveEvent === "none") return null
        let { leaderboard, currentActiveEvent, dispatch } = this.props

        return <div className="leaderboards">
            {this.renderEvents()}
            <LeaderboardTable
                currentEvent={currentActiveEvent}
                leaderboard={leaderboard}
                showScrambles={() => {
                    dispatch(showListViewPrompt(
                        `Scrambles for ${currentActiveEvent.name}`,
                        leaderboard.scrambles
                    ))
                }}
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
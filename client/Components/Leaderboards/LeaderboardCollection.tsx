import * as React from 'react'

import { Link } from 'react-router-dom'
import { DispatchProp, connect } from 'react-redux'
import { LeaderboardCollectionAction, LeaderboardsCollectionState } from '../../utils/store/types/leaderboardTypes'
import { fetchLeaderboardCollection } from '../../utils/store/actions/leaderboardActions'
import { Store } from '../../utils/store/types/generalTypes'
import { Header } from '../Header/Header'

type RemoteProps = {}

type LeaderboardsCollectionProps = DispatchProp<LeaderboardCollectionAction> & LeaderboardsCollectionState & RemoteProps

export class LeaderboardsCollectionComponent extends React.Component<LeaderboardsCollectionProps>{
    componentDidMount() {
        Header.setTitle("Leaderboards")
        this.props.dispatch(fetchLeaderboardCollection(this.props.dispatch))
    }

    render() {
        let collection = this.props.collection
        if (collection === "loading") return null

        return <div className="leaderboards-collection">
            <table className="table-results table table-sm table-striped table-cubersio leaderboards-collection-table">
                <thead className="thead-dark">
                    <tr>
                        <th>Competition</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><Link to={`/leaderboards/${collection.currentComp.id}`}>{collection.currentComp.title}</Link></td>
                        <td colSpan={2}>In progress!!</td>
                    </tr>
                    {collection.pastComps.map(c => <tr>
                        <td><Link to={`/leaderboards/${c.id}`}>{c.title}</Link></td>
                        <td>{new Date(c.startDate).toDateString()}</td>
                        <td>{new Date(c.endDate).toDateString()}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    }
}

let mapStateToProps = (store: Store): LeaderboardsCollectionState & RemoteProps => {
    return {
        ...store.leaderboardCollection,
    }
}

export let LeaderboardsCollection = connect(mapStateToProps)(LeaderboardsCollectionComponent)
import * as React from 'react'

import * as Api from '../../api/api'
import * as Types from '../../api/types'
import * as Helpers from '../../api/helpers'
import { Link } from 'react-router-dom'
import { User, Leaderboard, LeaderboardEvent } from '../../api/types'

type LeaderboardsCollectionProps = {
    user: User
}

type LeaderboardsCollectionState = {
    collection: Types.LeaderboardsCollection | "loading"
}

export class LeaderboardsCollection extends React.Component<LeaderboardsCollectionProps, LeaderboardsCollectionState>{

    constructor(props: LeaderboardsCollectionProps) {
        super(props)

        this.state = {
            collection: "loading"
        }
    }

    async componentDidMount() {
        let collection = await Api.getLeaderboardCompetitions()

        this.setState({ collection: collection })
    }

    render() {
        let collection = this.state.collection
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
                        <td><Link to={`/leaderboards/${collection.currentComp.id}`} ></Link>{collection.currentComp.title}</td>
                        <td colSpan={2}>In progress!!</td>
                    </tr>
                    {collection.pastComps.map(c => <tr>
                        <td><Link to={`/leaderboards/${c.id}`} ></Link>{c.title}</td>
                        <td>{new Date(c.startDate).toDateString()}</td>
                        <td>{new Date(c.endDate).toDateString()}</td>
                    </tr> )}
                </tbody>
            </table>
        </div>
    }
}
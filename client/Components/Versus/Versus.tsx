import * as React from 'react'
import { Link } from 'react-router-dom'

import * as Api from '../../api/api'
import * as Constants from '../../api/constants'
import * as Helpers from '../../api/helpers'
import { ProfileRankings, ProfileRecords, ProfileRecord, EventConstant } from '../../api/types'

type VersusProps = {
    username1: string
    username2: string
}

type VersusState = {
    user1Rankings: ProfileRankings | "loading"
    user2Rankings: ProfileRankings | "loading"

    user1Records: ProfileRecords | "loading"
    user2Records: ProfileRecords | "loading"
}

export class Versus extends React.Component<VersusProps, VersusState>{
    constructor(props: VersusProps) {
        super(props)

        this.state = {
            user1Rankings: "loading",
            user1Records: "loading",
            user2Rankings: "loading",
            user2Records: "loading"
        }
    }

    async componentDidMount() {
        let user1RankingsRequest = Api.getUserRankings(this.props.username1)
        let user1RecordsRequest = Api.getUserRecords(this.props.username1)
        let user2RankingsRequest = Api.getUserRankings(this.props.username2)
        let user2RecordsRequest = Api.getUserRecords(this.props.username2)

        this.setState({
            user1Rankings: await user1RankingsRequest,
            user1Records: await user1RecordsRequest,
            user2Rankings: await user2RankingsRequest,
            user2Records: await user2RecordsRequest
        })
    }

    renderRecords() {
        if (this.state.user1Records === "loading") return null
        if (this.state.user2Records === "loading") return null

        let user1Records = this.state.user1Records
        let user2Records = this.state.user2Records

        return <div>
            <h4>Event Records</h4>
            <table className="table-results table table-sm table-striped table-cubersio">
                <thead className="thead-dark">
                    <tr className="medium-row">
                        <th></th>
                        <th colSpan={2}>Single</th>
                        <th colSpan={2}>Average</th>
                    </tr>
                    <tr className="medium-row">
                        <th>Event</th>
                        <th>{this.props.username1}</th>
                        <th>{this.props.username2}</th>
                        <th>{this.props.username1}</th>
                        <th>{this.props.username2}</th>
                    </tr>
                </thead>
                <tbody>
                    {Constants.events.map(p => this.renderRecordsRow(p, user1Records, user2Records))}
                </tbody>
            </table>
        </div>
    }

    renderRecordsRow(event: EventConstant, user1: ProfileRecord[], user2: ProfileRecord[]) {
        let result1 = user1.find(u => u.puzzleSlug === event.slug)
        let result2 = user2.find(u => u.puzzleSlug === event.slug)

        if (!result1 && !result2) return null

        let r1Single = result1 ? result1.single : null
        let r2Single = result2 ? result2.single : null
        let r1Average = result1 ? result1.average : null
        let r2Average = result2 ? result2.average : null

        return <tr className="medium-row">
            <td>
                <Link to={`/event/${event.name}`} className="profile-record-puzzle-link">
                    <img className="profile-record-puzzle-image puzzle-image" src={`/static/images/cube-${event.slug}.png`} />
                    {event.name}
                </Link>
            </td>

            <td className={(r1Single < r2Single && r1Single) || !r2Single ? "vs_winner" : null}>{result1 ? Helpers.toReadableTime(result1.single * 10) : null}</td>
            <td className={(r2Single < r1Single && r2Single) || !r1Single ? "vs_winner" : null}>{result2 ? Helpers.toReadableTime(result2.single * 10) : null}</td>

            <td className={(r1Average < r2Average && r1Average) || !r2Average ? "vs_winner" : null}>{result1 ? Helpers.toReadableTime(result1.average * 10) : null}</td>
            <td className={(r2Average < r1Average && r2Average) || !r1Average ? "vs_winner" : null}>{result2 ? Helpers.toReadableTime(result2.average * 10) : null}</td>
        </tr>
    }

    renderRankings() {
        if (this.state.user1Records === "loading") return null
        if (this.state.user2Records === "loading") return null

        return <div>{/* TODO: Rankings of user1 vs user2 */}</div>
    }

    render() {
        return <div>
            {this.renderRecords()}
            {this.renderRankings()}
        </div>
    }
}

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
        if (this.state.user1Rankings === "loading") return null
        if (this.state.user2Rankings === "loading") return null

        let rankings1 = this.state.user1Rankings
        let rankings2 = this.state.user2Rankings

        let statisticsTable = this.renderStatisticsTable(rankings1, rankings2)

        let medalsTable = this.renderMedalsTable(rankings1, rankings2)

        let singleSumOfRanksTable = this.renderRankingsComparisonTable(
            <tr className="medium-row">
                <td>{rankings1.sumOfRanks.all.single}</td>
                <td>{rankings1.sumOfRanks.wca.single}</td>
                <td>{rankings1.sumOfRanks.non_wca.single}</td>
                <td>{rankings2.sumOfRanks.all.single}</td>
                <td>{rankings2.sumOfRanks.wca.single}</td>
                <td>{rankings2.sumOfRanks.non_wca.single}</td>
            </tr>
        )

        let averageSumOfRanksTable = this.renderRankingsComparisonTable(
            <tr className="medium-row">
                <td>{rankings1.sumOfRanks.all.average}</td>
                <td>{rankings1.sumOfRanks.wca.average}</td>
                <td>{rankings1.sumOfRanks.non_wca.average}</td>
                <td>{rankings2.sumOfRanks.all.average}</td>
                <td>{rankings2.sumOfRanks.wca.average}</td>
                <td>{rankings2.sumOfRanks.non_wca.average}</td>
            </tr>
        )

        let kinchranksTable = this.renderRankingsComparisonTable(
            <tr className="medium-row">
                <td>{rankings1.kinchRanks.all}</td>
                <td>{rankings1.kinchRanks.wca}</td>
                <td>{rankings1.kinchRanks.non_wca}</td>
                <td>{rankings2.kinchRanks.all}</td>
                <td>{rankings2.kinchRanks.wca}</td>
                <td>{rankings2.kinchRanks.non_wca}</td>
            </tr>
        )


        return <div>
            <h4>Solve Statistics</h4>
            {statisticsTable}

            <h4>Medals Collection</h4>
            {medalsTable}

            <h4>Kinchranks</h4>
            {kinchranksTable}

            <h4>Sum Of Rank (Single)</h4>
            {singleSumOfRanksTable}

            <h4>Sum Of Rank (Average)</h4>
            {averageSumOfRanksTable}
        </div>
    }

    renderStatisticsTable(userRankings1: ProfileRankings, userRankings2: ProfileRankings) {
        let user1CompCount = userRankings1.competitions
        let user2CompCount = userRankings2.competitions
        let user1SolvesCount = userRankings1.solves
        let user2SolvesCount = userRankings2.solves

        return this.renderComparisonTable([
            <tr className="medium-row">
                <th colSpan={2}>Competitions</th>
                <th colSpan={2}>Total Solves</th>
            </tr>,
            <tr className="medium-row">
                <th>{this.props.username1}</th>
                <th>{this.props.username2}</th>
                <th>{this.props.username1}</th>
                <th>{this.props.username2}</th>
            </tr>
        ], [
            <tr className="medium-row">
                <td>{user1CompCount}</td>
                <td>{user2CompCount}</td>
                <td>{user1SolvesCount}</td>
                <td>{user2SolvesCount}</td>
            </tr>
        ])
    }

    renderMedalsTable(userRankings1: ProfileRankings, userRankings2: ProfileRankings) {
        let user1Medals = userRankings1.medals
        let user2Medals = userRankings2.medals

        return this.renderComparisonTable(
            [
                <tr className="medium-row">
                    <th colSpan={3}>{this.props.username1}</th>
                    <th colSpan={3}>{this.props.username2}</th>
                </tr>,
                <tr className="medium-row">
                    <th><i className="fas fa-medal bronze" /></th>
                    <th><i className="fas fa-medal silver" /></th>
                    <th><i className="fas fa-medal gold" /></th>
                    <th><i className="fas fa-medal bronze" /></th>
                    <th><i className="fas fa-medal silver" /></th>
                    <th><i className="fas fa-medal gold" /></th>
                </tr>
            ],
            [
                <tr className="medium-row">
                    <td>{user1Medals.bronze}</td>
                    <td>{user1Medals.silver}</td>
                    <td>{user1Medals.gold}</td>
                    <td>{user2Medals.bronze}</td>
                    <td>{user2Medals.silver}</td>
                    <td>{user2Medals.gold}</td>
                </tr>
            ]
        )
    }

    renderRankingsComparisonTable(rankingRow: JSX.Element) {
        return this.renderComparisonTable([
            <tr className="medium-row">
                <th colSpan={3}>{this.props.username1}</th>
                <th colSpan={3}>{this.props.username2}</th>
            </tr>,
            <tr className="medium-row">
                <th>Combined</th>
                <th>WCA</th>
                <th>Non WCA</th>
                <th>Combined</th>
                <th>WCA</th>
                <th>Non WCA</th>
            </tr>
        ], [
            rankingRow
        ])
    }

    renderComparisonTable(headerRows: JSX.Element[], valuesRows: JSX.Element[]) {
        return <table className="table-results table table-sm table-striped table-cubersio">
            <thead className="thead-dark">
                {headerRows}
            </thead>
            <tbody>
                {valuesRows}
            </tbody>
        </table>
    }

    render() {
        return <div>
            {this.renderRecords()}
            {this.renderRankings()}
        </div>
    }
}

import * as React from 'react'

import * as Api from '../../utils/api'
import * as Types from '../../utils/types'
import { Link } from 'react-router-dom';

type SumOfRanksProps = {
    type: string
    user: Types.User
}

type SumOfRanksState = {
    eventRecords: Types.SumOfRanks | "loading"
    type: "single" | "average"
}

export class SumOfRanks extends React.Component<SumOfRanksProps, SumOfRanksState>{
    MySolve: React.RefObject<HTMLTableRowElement>

    constructor(props: SumOfRanksProps) {
        super(props)

        this.state = {
            eventRecords: "loading",
            type: "single"
        }

        this.MySolve = React.createRef()
    }

    componentDidMount() {
        Api.getSumOfRanks(this.props.type)
            .then(ranks => this.setState({ eventRecords: ranks }))
    }

    scrollToUser() {
        let current = this.MySolve.current
        if (current) current.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    renderRanks(solves: Types.Rank[]) {
        return solves.map((solve, count) => {
            let verifiedIcon = null
            if (this.props.user.admin || this.props.user.mod) {
                let verified = solve.user.verified ? "verified" : "unverified"
                verifiedIcon = <i className={`fas fa-user-check ${verified} mr-1`} />
            }

            let ref = solve.user.id === this.props.user.id ? this.MySolve : null

            return <tr key={`user-${solve.user.id}-${this.state.type}`} ref={ref} className={this.props.user.id === solve.user.id ? "my-solve" : null}>
                <td>{count + 1}</td>
                <td>{verifiedIcon}<Link to={`/u/${solve.user.name}`}>/u/{solve.user.name}</Link></td>
                <td>{solve.rank_count}</td>
            </tr>
        })
    }

    render() {
        if (this.state.eventRecords === "loading") return null

        let solves = this.state.type === "single" ? this.state.eventRecords.singles : this.state.eventRecords.averages

        return <div className="records-page">
            <div className="records-wrapper">
                <div className="records-header">
                    <h3 className="records-header-title">{this.state.eventRecords.title}</h3>
                    <div className="records-navbar">
                        <button
                            className={`records-navbar-button ${this.state.type === "single" ? "active" : ""}`}
                            onClick={() => this.setState({ type: "single" })}>By Single</button>
                        <button
                            className={`records-navbar-button ${this.state.type === "average" ? "active" : ""}`}
                            onClick={() => this.setState({ type: "average" })}>By Average</button>
                    </div>
                </div>
                <div className="records-table">
                    <table className="table-results table table-sm table-striped table-cubersio">
                        <thead className="thead-dark">
                            <tr>
                                <th>Rank</th>
                                <th>
                                    User
                                    <button className="records-table-locate-user" onClick={() => { this.scrollToUser() }}>
                                        <i className="fas fa-arrow-down" id="scrollSingle" />
                                    </button>
                                </th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRanks(solves)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}
import * as React from 'react'

import * as Api from '../../api/api'
import * as Types from '../../api/types'
import { Link } from 'react-router-dom';

type RecordsProps = {
    event: string
    user: Types.User
}

type RecordsState = {
    eventRecords: Types.EventRecords | "loading"
    type: "single" | "average"
}

export class Records extends React.Component<RecordsProps, RecordsState>{
    MySolve: React.Ref<HTMLTableRowElement>

    constructor(props: RecordsProps) {
        super(props)

        this.state = {
            eventRecords: "loading",
            type: "single"
        }

        this.MySolve = React.createRef()
    }

    componentDidMount() {
        Api.getRecords(this.props.event, "single")
            .then(records => this.setState({ eventRecords: records }))
    }

    renderSolves(solves: Types.PersonalRecord[]) {
        return solves.map(solve => {
            let verifiedIcon = null
            if (this.props.user.admin) {
                let verified = solve.user_is_verified ? "verified" : "unverified"
                verifiedIcon = <i className={`fas fa-user-check ${verified} mr-1`} />
            }

            return <tr ref={this.MySolve} className={this.props.user.id === solve.user_id ? "my-solve" : null}>
                <td>{solve.rank}</td>
                <td>{verifiedIcon}<Link to={`/u/${solve.username}`}>/u/{solve.username}</Link></td>
                <td>{Number(solve.personal_best) / 100}</td>
                <td><Link to={`${solve.comp_id}`}>{solve.comp_title}</Link></td>
            </tr>
        })
    }

    render() {
        if (this.state.eventRecords === "loading") return null

        let solves = this.state.type === "single" ? this.state.eventRecords.singles : this.state.eventRecords.averages

        return <div className="records-page">
            <div className="records-wrapper">
                <div className="records-header">
                    <img className="records-event-image" src={`/static/images/cube-${this.state.eventRecords.event_id}.png`} />
                    <div className="records-navbar">
                        <button
                            className={`records-navbar-button ${this.state.type === "single" ? "active" : ""}`}
                            onClick={() => this.setState({ type: "single" })}>Single</button>
                        <button
                            className={`records-navbar-button ${this.state.type === "average" ? "active" : ""}`}
                            onClick={() => this.setState({ type: "average" })}>Average</button>

                        <a className="records-navbar-button export" href={`/event/${this.props.event}/export/`}>Export to CSV</a>
                    </div>
                </div>
                <div className="records-table">
                    <table className="table-results table table-sm table-striped table-cubersio">
                        <thead className="thead-dark">
                            <tr>
                                <th>Rank</th>
                                <th>
                                    User
                                    <button className="records-table-locate-user">
                                        <i className="fas fa-arrow-down" id="scrollSingle" />
                                    </button>
                                </th>
                                <th>Time</th>
                                <th>Competition</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderSolves(solves)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}
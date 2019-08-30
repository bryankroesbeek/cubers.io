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
    constructor(props: RecordsProps) {
        super(props)

        this.state = {
            eventRecords: "loading",
            type: "single"
        }
    }

    componentDidMount() {
        Api.getRecords(this.props.event, "single")
            .then(records => this.setState({ eventRecords: records }))
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
                                <th>User</th>
                                <th>Time</th>
                                <th>Competition</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solves.map(solve => <tr className={`${this.props.user.id === solve.user_id ? "hey-its-me" : ""}`}>
                                <td>{solve.rank}</td>
                                <td><Link to={`/u/${solve.username}`}>/u/{solve.username}</Link></td>
                                <td>{Number(solve.personal_best) / 100}</td>
                                <td><Link to={`${solve.comp_id}`}>{solve.comp_title}</Link></td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }
}
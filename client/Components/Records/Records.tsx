import * as React from 'react'
import { match } from 'react-router'
import { connect, DispatchProp } from 'react-redux'

import { Store } from '../../utils/store/types/generalTypes'
import * as Types from '../../utils/types'
import * as Helpers from '../../utils/helpers'

import { RecordsState, RecordsAction } from '../../utils/store/types/recordsTypes'
import { fetchCompetitionEvents, setAverage, setSingle } from '../../utils/store/actions/recordsActions'

import { Link } from 'react-router-dom'
import { User } from '../../utils/types'
import { Header } from '../Header/Header'
import { events } from '../../utils/constants'

type RemoteProps = {
    event: string
    user: Types.User
    key: string
}

type RecordsProps = DispatchProp<RecordsAction> & RecordsState & RemoteProps

class RecordsComponent extends React.Component<RecordsProps, {}>{
    MySolve: React.RefObject<HTMLTableRowElement>

    constructor(props: RecordsProps) {
        super(props)

        this.MySolve = React.createRef()
    }

    componentDidMount() {
        let event = events.filter(e => e.slug === this.props.event)[0]
        let title = event ? `${event.name} Records` : ""
        Header.setTitle(title)
        this.props.dispatch(fetchCompetitionEvents(this.props.dispatch, this.props.event, "single"))
    }

    scrollToUser() {
        let current = this.MySolve.current
        if (current) current.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    renderSolves(solves: Types.PersonalRecord[]) {
        return solves.map(solve => {
            let verifiedIcon = null
            if (this.props.user.admin || this.props.user.mod) {
                let verified = solve.user_is_verified ? "verified" : "unverified"
                verifiedIcon = <i className={`fas fa-user-check ${verified} mr-1`} />
            }

            let ref = solve.user_id === this.props.user.id ? this.MySolve : null

            return <tr key={`user-${solve.user_id}-${this.props.type}`} ref={ref} className={this.props.user.id === solve.user_id ? "my-solve" : null}>
                <td>{solve.rank}</td>
                <td>{verifiedIcon}<Link to={`/u/${solve.username}`}>/u/{solve.username}</Link></td>
                <td>{Helpers.toReadableTime(Number(solve.personal_best) * 10)}</td>
                <td><Link to={`${solve.comp_id}`}>{solve.comp_title}</Link></td>
            </tr>
        })
    }

    render() {
        if (this.props.eventRecords === "loading") return null

        let solves = this.props.type === "single" ? this.props.eventRecords.singles : this.props.eventRecords.averages

        return <div className="records-page">
            <div className="records-wrapper">
                <div className="records-header">
                    <img
                        className="records-event-image puzzle-image"
                        src={`/static/images/cube-${this.props.event.toLowerCase().split(" ").join("-")}.png`}
                    />
                    <div className="records-navbar">
                        <button
                            className={`records-navbar-button ${this.props.type === "single" ? "active" : ""}`}
                            onClick={() => this.props.dispatch(setSingle())}>Single</button>
                        <button
                            className={`records-navbar-button ${this.props.type === "average" ? "active" : ""}`}
                            onClick={() => this.props.dispatch(setAverage())}>Average</button>

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
                                    <button className="records-table-locate-user" onClick={() => {
                                        this.scrollToUser()
                                    }}>
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

let mapStateToProps = (state: Store, ownProps: RemoteProps & { match: match<{ eventType: string }> }): RecordsState & RemoteProps => {
    return {
        ...state.records,
        event: ownProps.match.params.eventType,
        user: state.baseInfo.user as User,
        key: `records-${ownProps.match.params.eventType}`,
    }
}

export const Records = connect(mapStateToProps)(RecordsComponent)
import * as React from 'react'

import * as Api from '../../utils/api'
import * as Types from '../../utils/types'
import { Link, match } from 'react-router-dom';
import { DispatchProp, connect } from 'react-redux';
import { SumOfRanksAction, SumOfRanksState } from '../../utils/store/types/sumOfRanksTypes';
import { fetchSumOfRanks, setAverage, setSingle } from '../../utils/store/actions/sunOfRanksActions';
import { Store } from '../../utils/store/types/generalTypes';
import { User } from '../../utils/types';

type RemoteProps = {
    type: string
    user: Types.User
    key: string
}
type SumOfRanksProps = DispatchProp<SumOfRanksAction> & SumOfRanksState & RemoteProps

class SumOfRanksComponent extends React.Component<SumOfRanksProps, {}>{
    MySolve: React.RefObject<HTMLTableRowElement>

    constructor(props: SumOfRanksProps) {
        super(props)

        this.MySolve = React.createRef()
    }

    componentDidMount() {
        this.props.dispatch(fetchSumOfRanks(this.props.dispatch, this.props.type))
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

            return <tr key={`user-${solve.user.id}-${this.props.type}`} ref={ref} className={this.props.user.id === solve.user.id ? "my-solve" : null}>
                <td>{count + 1}</td>
                <td>{verifiedIcon}<Link to={`/u/${solve.user.name}`}>/u/{solve.user.name}</Link></td>
                <td>{solve.rank_count}</td>
            </tr>
        })
    }

    render() {
        if (this.props.eventRecords === "loading") return null

        let solves = this.props.type === "single" ? this.props.eventRecords.singles : this.props.eventRecords.averages

        return <div className="records-page">
            <div className="records-wrapper">
                <div className="records-header">
                    <h3 className="records-header-title">{this.props.eventRecords.title}</h3>
                    <div className="records-navbar">
                        <button
                            className={`records-navbar-button ${this.props.type === "single" ? "active" : ""}`}
                            onClick={() => this.props.dispatch(setSingle())}>By Single</button>
                        <button
                            className={`records-navbar-button ${this.props.type === "average" ? "active" : ""}`}
                            onClick={() => this.props.dispatch(setAverage())}>By Average</button>
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

let mapStateToProps = (state: Store, ownProps: RemoteProps & { match: match<{ eventType: string }> }): SumOfRanksState & RemoteProps => {
    return {
        ...state.sumOfRanks,
        type: ownProps.match.params.eventType,
        user: state.routerInfo.user as User,
        key: `records-${ownProps.match.params.eventType}`,
    }
}

export const SumOfRanks = connect(mapStateToProps)(SumOfRanksComponent)
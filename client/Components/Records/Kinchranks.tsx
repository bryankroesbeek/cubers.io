import * as React from 'react'

import * as Api from '../../utils/api'
import * as Types from '../../utils/types'
import { Link, match } from 'react-router-dom';
import { DispatchProp, connect } from 'react-redux';
import { KinchranksAction, KinchranksState } from '../../utils/store/types/kinchranksTypes';
import { fetchKinchranks } from '../../utils/store/actions/kinchranksActions';
import { Store } from '../../utils/store/types/generalTypes';
import { User } from '../../utils/types';
import { Header } from '../Header/Header';

type RemoteProps = {
    type: string
    user: Types.User
    key: string
}
type KinchranksProps = DispatchProp<KinchranksAction> & KinchranksState & RemoteProps

class KinchranksComponent extends React.Component<KinchranksProps, {}>{
    MySolve: React.RefObject<HTMLTableRowElement>

    constructor(props: KinchranksProps) {
        super(props)

        this.MySolve = React.createRef()
    }

    componentDidMount() {
        Header.setTitle("Kinchranks")
        this.props.dispatch(fetchKinchranks(this.props.dispatch, this.props.type))
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

        let solves = this.props.eventRecords.values

        return <div className="records-page">
            <div className="records-wrapper">
                <div className="records-header">
                    <h3 className="records-header-title">{this.props.eventRecords.title}</h3>
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

let mapStateToProps = (state: Store, ownProps: RemoteProps & { match: match<{ eventType: string }> }): KinchranksState & RemoteProps => {
    return {
        ...state.kinchranks,
        type: ownProps.match.params.eventType,
        user: state.baseInfo.user as User,
        key: `records-${ownProps.match.params.eventType}`,
    }
}

export const Kinchranks = connect(mapStateToProps)(KinchranksComponent)
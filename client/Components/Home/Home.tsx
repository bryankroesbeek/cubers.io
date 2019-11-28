import * as React from 'react'
import { connect, DispatchProp, MapStateToProps } from 'react-redux'

import { CompetitionEvent } from '../../utils/types'
import { HomeState, HomeAction } from '../../utils/store/types/homeTypes'
import { Store } from '../../utils/store/types/generalTypes'
import { fetchCompetitionEvents } from '../../utils/store/actions/homeActions'
import { Link } from 'react-router-dom';
import { Header } from '../Header/Header'

type HomeProps = HomeState & DispatchProp<HomeAction>

class HomeComponent extends React.Component<HomeProps, {}> {
    constructor(props: HomeProps) {
        super(props)
    }

    componentDidMount() {
        this.props.dispatch(fetchCompetitionEvents(this.props.dispatch))
        Header.setTitle(Header.currentCompetition)
    }

    render() {
        if (this.props.events === "loading") return null

        return <div className="container">
            <div className="ultra-hidden"></div>
            <div className="row event-cards">
                {this.props.events.map(e => this.renderCard(e))}
            </div>
        </div>
    }

    renderOverlay(status: "not_started" | "incomplete" | "complete") {
        if (status === "not_started") return null
        let cssClass = status === "complete" ? "fas fa-check" : "far fa-clock"

        return <div className={`overlay ${status}-overlay`}>
            <span className="icon">
                <i className={cssClass}></i>
            </span>
        </div>
    }

    renderCard(event: CompetitionEvent) {
        return <Link to={event.competeLocation} key={`comp_event_${event.compId}`} className={`event-card drop-shadow ${event.status === "not_started" ? "" : event.status}`}>
            <div className="event-image-container">
                <img className="event-image" src={`./static/images/cube-${event.name.toLowerCase().split(" ").join("-")}.png`} />
                {this.renderOverlay(event.status)}
            </div>

            <div className="event-name">
                <hr />
                <div className="row">
                    <div className="col-12"><span className="event-title" />{event.name}</div>
                </div>
            </div>

            <span className="event-summary">{event.summary}</span>

            {event.bonusEvent ? <div className="bonus-event-indicator">
                <i className="fas fa-gift"></i>
            </div> : null}
        </Link>
    }
}

let mapStateToProps = (state: Store) => {
    return state.home
}

export let Home = connect(mapStateToProps)(HomeComponent)
import * as React from 'react'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router'
import { Header } from './Components/Header/Header'
import { BrowserRouter } from 'react-router-dom'
import { Home } from './Components/Home/Home'
import { Compete } from './Components/Compete/Compete'
import { UserSettings } from './Components/UserSettings/UserSettings'
import { SumOfRanks } from './Components/Records/SumOfRanks'

import * as Api from './utils/api'
import * as Types from './utils/types'
import * as Helpers from './utils/helpers/settingsHelper'
import { Records } from './Components/Records/Records'
import { Leaderboards } from './Components/Leaderboards/Leaderboards'
import { LeaderboardsCollection } from './Components/Leaderboards/LeaderboardCollection'
import { Profile } from './Components/Profile/Profile'
import { Versus } from './Components/Versus/Versus'
import { VersusSelect } from './Components/Versus/VersusSelect'

import { connect, DispatchProp } from 'react-redux'
import { RouterState, RouterAction } from './utils/store/types/routerTypes'
import { getRouterInfo } from './utils/store/actions/routerActions'
import { Store } from './utils/store/types/generalTypes'

type RouterProps = DispatchProp<RouterAction> & RouterState

class MainRouterComponent extends React.Component<RouterProps, {}> {
    constructor(props: RouterProps) {
        super(props)
    }

    async componentDidMount() {
        this.props.dispatch(getRouterInfo(this.props.dispatch))
    }

    render() {
        if (this.props.settings === "loading") return null
        if (this.props.user === "loading") return null
        let settings = this.props.settings
        let user = this.props.user

        return <BrowserRouter>
            <Header user={user} />

            <Switch>
                <Route exact path="/" component={Home} />

                <Route path="/compete/:eventType" component={({ match }: any) => {
                    return <Compete eventType={Number(match.params.eventType)} settings={Helpers.minifyRawSettings(settings)} />
                }} />

                <Route>
                    <div className="white-container">
                        <Route path="/event/:eventType" component={Records} />

                        <Route path="/sum-of-ranks/:eventType" component={SumOfRanks} />

                        <Route exact path="/leaderboards" component={LeaderboardsCollection} />

                        <Route path="/leaderboards/:compId" component={({ match }: any) =>
                            <Leaderboards key={`leaderboards-${match.params.compId}`} competitionId={match.params.compId} user={user} />
                        } />

                        <Route exact path="/(u|user)/:username" component={({ match }: any) =>
                            <Profile key={`profile-${match.params.username}`} username={match.params.username} currentUser={user} />
                        } />

                        <Route exact path="/versus" component={() =>
                            <VersusSelect />
                        } />

                        <Route path="/(vs|versus)/:user1/:user2" component={({ match }: any) =>
                            <Versus
                                username1={match.params.user1}
                                username2={match.params.user2}
                            />
                        } />

                        <Route path="/settings" component={() =>
                            <UserSettings
                                settings={settings}
                                updateSettings={settings => this.setState({ settings: settings })}
                            />
                        } />
                    </div>
                </Route>
            </Switch>
        </BrowserRouter>
    }
}

let mapStateToProps = (store: Store): RouterState => {
    return store.routerInfo
}

export let MainRouter = connect(mapStateToProps)(MainRouterComponent)
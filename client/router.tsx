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
import { Leaderboard } from './Components/Leaderboards/Leaderboard'
import { LeaderboardsCollection } from './Components/Leaderboards/LeaderboardCollection'
import { Profile } from './Components/Profile/Profile'
import { Versus } from './Components/Versus/Versus'
import { VersusSelect } from './Components/Versus/VersusSelect'
import { Prompt } from './Components/Prompt/Prompt'

import { connect, DispatchProp } from 'react-redux'
import { BaseState, BaseAction } from './utils/store/types/baseTypes'
import { getBaseInfo } from './utils/store/actions/baseActions'
import { Store } from './utils/store/types/generalTypes'
import { SettingsAction } from './utils/store/types/settingsTypes'

type RouterProps = DispatchProp<BaseAction | SettingsAction> & BaseState

class MainRouterComponent extends React.Component<RouterProps, {}> {
    constructor(props: RouterProps) {
        super(props)
    }

    async componentDidMount() {
        this.props.dispatch(getBaseInfo(this.props.dispatch))
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

                <Route path="/compete/:eventType" component={Compete} />

                <Route>
                    <div className="white-container">
                        <Route path="/event/:eventType" component={Records} />

                        <Route path="/sum-of-ranks/:eventType" component={SumOfRanks} />

                        <Route exact path="/leaderboards" component={LeaderboardsCollection} />

                        <Route path="/leaderboards/:compId" component={Leaderboard} />

                        <Route exact path="/(u|user)/:username" component={Profile} />

                        <Route exact path="/versus" component={VersusSelect} />

                        <Route path="/(vs|versus)/:user1/:user2" component={Versus} />

                        <Route path="/settings" component={UserSettings} />
                    </div>
                </Route>
            </Switch>
            <Route component={Prompt} />
        </BrowserRouter>
    }
}

let mapStateToProps = (store: Store): BaseState => {
    return store.baseInfo
}

export let MainRouter = connect(mapStateToProps)(MainRouterComponent)
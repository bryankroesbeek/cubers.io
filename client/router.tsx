import * as React from 'react'
import { Route, Switch } from 'react-router'
import { Header } from './Components/Header/Header'
import { BrowserRouter } from 'react-router-dom'
import { Home } from './Components/Home/Home'
import { Compete } from './Components/Compete/Compete'
import { UserSettings } from './Components/UserSettings/UserSettings'
import { SumOfRanks } from './Components/Records/SumOfRanks'

import * as Api from './api/api'
import * as Types from './api/types'
import * as Helpers from './api/helpers/settingsHelper'
import { Records } from './Components/Records/Records'
import { Leaderboards } from './Components/Leaderboards/Leaderboards'
import { LeaderboardsCollection } from './Components/Leaderboards/LeaderboardCollection'
import { Profile } from './Components/Profile/Profile'
import { Versus } from './Components/Versus/Versus'
import { VersusSelect } from './Components/Versus/VersusSelect'

type RouterState = {
    user: Types.User | "loading"
    settings: Types.UserSettings | "loading"
}

type RouterProps = {}

export class MainRouter extends React.Component<RouterProps, RouterState> {
    constructor(props: RouterProps) {
        super(props)

        this.state = {
            settings: "loading",
            user: "loading"
        }
    }

    async componentDidMount() {
        let userSettings = await Api.getUserSettings()

        let userInfo = await Api.getUserInfo()

        this.setState({ settings: userSettings, user: userInfo })
    }

    render() {
        if (this.state.settings === "loading") return null
        if (this.state.user === "loading") return null
        let settings = this.state.settings
        let user = this.state.user

        return <BrowserRouter>
            <Header user={user} />

            <Switch>
                <Route exact path="/" component={() => <Home />} />

                <Route path="/compete/:eventType" component={({ match }: any) => {
                    return <Compete eventType={Number(match.params.eventType)} settings={Helpers.minifyRawSettings(settings)} />
                }} />

                <Route>
                    <div className="white-container">
                        <Route path="/event/:eventType" component={({ match }: any) =>
                            <Records key={`records-${match.params.eventType}`} event={match.params.eventType} user={user} />
                        } />

                        <Route path="/sum-of-ranks/:eventType" component={({ match }: any) =>
                            <SumOfRanks key={`records-${match.params.eventType}`} type={match.params.eventType} user={user} />
                        } />

                        <Route exact path="/leaderboards" component={() =>
                            <LeaderboardsCollection user={user} />
                        } />

                        <Route path="/leaderboards/:compId" component={({ match }: any) =>
                            <Leaderboards key={`leaderboards-${match.params.compId}`} competitionId={match.params.compId} user={user} />
                        } />

                        <Route exact path="/(u|user)/:username" component={({ match }: any) =>
                            <Profile key={`profile-${match.params.username}`} username={match.params.username} currentUser={user} />
                        } />

                        <Route exact path="/versus" component={() =>
                            <VersusSelect />
                        } />

                        <Route path="/versus/:user1/:user2" component={({ match }: any) =>
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
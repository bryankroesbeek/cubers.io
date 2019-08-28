import * as React from 'react'
import { Route, Switch } from 'react-router'
import { Header } from './Components/Header/Header';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './Components/Home/Home';
import { Compete } from './Components/Compete/Compete';
import { UserSettings } from './Components/UserSettings/UserSettings'

import * as Api from './api/api'
import * as Types from './api/types'
import * as Helpers from './api/helpers/settingsHelper'
import { Records } from './Components/Records/Records'

type RouterState = {
    settings: Types.UserSettings | "loading"
}

type RouterProps = {}

export class MainRouter extends React.Component<RouterProps, RouterState> {
    constructor(props: RouterProps) {
        super(props)

        this.state = {
            settings: "loading"
        }
    }

    componentDidMount() {
        Api.getUserSettings()
            .then(settings => this.setState({ settings: settings }))
    }

    render() {
        if (this.state.settings === "loading") return null
        let settings = this.state.settings

        return <BrowserRouter>
            <Header />

            <Switch>
                <Route exact path="/" component={() => <Home />} />

                <Route path="/compete/:eventType" component={({ match }: any) => {
                    return <Compete eventType={Number(match.params.eventType)} settings={Helpers.minifyRawSettings(settings)} />
                }} />
                <Route path="/event/:eventType" component={({ match }: any) => <Records key={`records-${match.params.eventType}`} event={match.params.eventType} />} />
                <Route path="/settings" component={() =>
                    <UserSettings
                        settings={settings}
                        updateSettings={settings => this.setState({ settings: settings })}
                    />}
                />
            </Switch>
        </BrowserRouter>
    }
}
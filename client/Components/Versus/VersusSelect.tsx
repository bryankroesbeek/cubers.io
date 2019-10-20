import * as React from 'react'
import { SearchableInput } from './SearchableInput'
import { Link } from 'react-router-dom';

type VersusSelectProps = {}

type VersusSelectState = {
    user1: { username: string } | "none"
    user2: { username: string } | "none"
}

export class VersusSelect extends React.Component<VersusSelectProps, VersusSelectState>{
    constructor(props: VersusSelectProps) {
        super(props)

        this.state = {
            user1: "none",
            user2: "none",
        }
    }

    getUrl() {
        if (this.state.user1 === "none") return null
        if (this.state.user2 === "none") return null

        return `/versus/${this.state.user1.username}/${this.state.user2.username}`
    }

    render() {
        return <div className="versus-search-page">
            <h2 className="versus-search-title">Competitor Showdown</h2>
            <div className="versus-search-inputs">
                <SearchableInput
                    key="input-1"
                    onNameChosen={username => this.setState({ user1: username })}
                />
                <span>vs</span>
                <SearchableInput
                    key="input-2"
                    onNameChosen={username => this.setState({ user2: username })}
                />
            </div>
            <Link className="versus-search-confirm" to={this.getUrl()}>
                <span>Go!</span>
            </Link>
        </div>
    }
}

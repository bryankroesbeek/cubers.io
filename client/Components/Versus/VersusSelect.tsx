import * as React from 'react'
import { SearchableInput } from './SearchableInput'

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
            user2: "none"
        }
    }

    handleClick() {
        if (this.state.user1 === "none") return
        if (this.state.user2 === "none") return


    }

    render() {
        return <div className="versus-search-page">
            <h2 className="versus-search-title">Competitor Showdown</h2>
            <div className="versus-search-inputs">
                <SearchableInput
                    onNameChosen={username => { console.log(username)}}
                />
                <span>vs</span>
                <SearchableInput
                    onNameChosen={username => { }}
                />
            </div>
            <button className="versus-search-confirm" onClick={() => { }}>Go!</button>
        </div>
    }
}

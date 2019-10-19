import * as React from 'react'

import * as Api from '../../api/api'

type Props = {
    onNameChosen: (username: string) => void
}

type State = {
    currentUsername: string
    requestUsername: string
    requestState: "pending" | "idle"
    matchingUsernames: string[]
    showSuggestions: boolean
}

export class SearchableInput extends React.Component<Props, State> {
    intervalId: number

    constructor(props: Props) {
        super(props)

        this.state = {
            currentUsername: "",
            requestState: "idle",
            requestUsername: "",
            matchingUsernames: [],
            showSuggestions: false
        }
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            if (this.state.currentUsername === this.state.requestUsername) return
            if (this.state.requestState === "pending") return
            this.setState({ requestUsername: this.state.currentUsername, requestState: "pending" }, async () => {
                let usernames = await Api.getUsernames(this.state.requestUsername)
                this.setState({ matchingUsernames: usernames, requestState: "idle" })
            })
        }, 200)
    }

    componentWillUnmount() {
        clearInterval(this.intervalId)
    }

    renderSuggestions() {
        if (!this.state.showSuggestions) return null

        return this.state.matchingUsernames.map(u =>
            <button onClick={() => this.props.onNameChosen(u)} className="input-suggestions-item">
                {this.emphasizeSection(u, this.state.requestUsername)}
            </button>
        )
    }

    emphasizeSection(username: string, section: string) {
        let sections = username.split(new RegExp(`(${section})`, "gi"))

        return <span>
            {sections.map(s => {
                if (s.toLowerCase() === section.toLowerCase()) return <b>{s}</b>
                return s
            })}
        </span>
    }

    render() {
        return <div className="searchable-input-component">
            <input
                className="searchable-input-field"
                type="text"
                onFocus={() => { this.setState({ showSuggestions: true }) }}
                onBlur={() => { this.setState({ showSuggestions: false }) }}
                onChange={i => this.setState({ currentUsername: i.target.value })}
            />
            <div className="input-suggestions">
                {this.renderSuggestions()}
            </div>
        </div>
    }
}
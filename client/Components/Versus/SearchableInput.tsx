import * as React from 'react'

import * as Api from '../../api/api'

type Props = {
    onNameChosen: (user: { username: string } | "none") => void
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
    componentRef: React.RefObject<HTMLDivElement>

    constructor(props: Props) {
        super(props)

        this.componentRef = React.createRef()

        this.state = {
            currentUsername: "",
            requestState: "idle",
            requestUsername: "",
            matchingUsernames: [],
            showSuggestions: false
        }
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClick)

        this.intervalId = setInterval(() => {
            if (this.state.currentUsername === this.state.requestUsername) return
            if (this.state.requestState === "pending") return
            this.setState({ requestUsername: this.state.currentUsername, requestState: "pending" }, async () => {
                let usernames = await Api.getUsernames(this.state.requestUsername)

                if (usernames.length === 1 && usernames[0].toLowerCase() === this.state.requestUsername.toLowerCase()) this.chooseUser(usernames[0])

                this.setState({ matchingUsernames: usernames, requestState: "idle" })
            })
        }, 200)
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClick)
        clearInterval(this.intervalId)
    }

    handleClick = (e: MouseEvent) => {
        if (!this.componentRef.current) return
        if (!this.componentRef.current.contains(e.target as Element))
            this.setState({ showSuggestions: false })
    }

    chooseUser(username: string) {
        this.setState({
            currentUsername: username,
            requestUsername: username,
            matchingUsernames: [username],
            showSuggestions: false
        }, () => this.props.onNameChosen({ username }))
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

    renderSuggestions() {
        if (!this.state.showSuggestions) return null

        return <ul className="searchable-input-suggestions">
            {this.state.matchingUsernames.map(u =>
                <li className="searchable-input-suggestions-item">
                    <button onClick={() => this.chooseUser(u)} className="searchable-input-suggestions-button">
                        {this.emphasizeSection(u, this.state.requestUsername)}
                    </button>
                </li>
            )}
        </ul>
    }

    render() {
        return <div ref={this.componentRef} className="searchable-input-component">
            <input
                className="searchable-input-field"
                type="text"
                onFocus={() => { this.setState({ showSuggestions: true }) }}
                onChange={i => this.setState({ currentUsername: i.target.value })}
                value={this.state.currentUsername}
            />
            {this.renderSuggestions()}

        </div>
    }
}
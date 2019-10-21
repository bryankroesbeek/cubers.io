import * as React from 'react'

import * as Api from '../../utils/api'

type Props = {
    onNameChosen: (user: { username: string }) => void
    key: string
}

type State = {
    currentUsername: string
    requestUsername: string
    requestState: "pending" | "idle"
    matchingUsernames: string[]
    showSuggestions: boolean
    activeSuggestionId: number | "none"
}

export class SearchableInput extends React.Component<Props, State> {
    intervalId: number
    componentRef: React.RefObject<HTMLDivElement>
    inputRef: React.RefObject<HTMLInputElement>

    constructor(props: Props) {
        super(props)

        this.componentRef = React.createRef()
        this.inputRef = React.createRef()

        this.state = {
            currentUsername: "",
            requestState: "idle",
            requestUsername: "",
            matchingUsernames: [],
            showSuggestions: false,
            activeSuggestionId: "none"
        }
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClick)
        window.addEventListener('keydown', this.handleKeyDown)

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
        window.removeEventListener('keydown', this.handleKeyDown)
        clearInterval(this.intervalId)
    }

    handleClick = (e: MouseEvent) => {
        if (!this.componentRef.current) return
        if (!this.componentRef.current.contains(e.target as Element))
            this.setState({ showSuggestions: false, activeSuggestionId: "none" })
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") return this.setState({ activeSuggestionId: "none", showSuggestions: false })
        if (e.key === "ArrowDown") {
            let inputIsActive = this.inputRef.current === document.activeElement
            if (inputIsActive && this.state.activeSuggestionId === "none") return this.selectSuggestion(0)
            if (this.state.activeSuggestionId === "none") return
            if (this.state.activeSuggestionId === this.state.matchingUsernames.length - 1) return
            this.selectSuggestion(this.state.activeSuggestionId + 1)
        }
        if (e.key === "ArrowUp") {
            let inputIsActive = this.inputRef.current === document.activeElement
            if (inputIsActive && this.state.activeSuggestionId === "none") return
            if (this.state.activeSuggestionId === "none") return
            if (this.state.activeSuggestionId === 0) return
            this.selectSuggestion(this.state.activeSuggestionId - 1)
        }
    }

    selectSuggestion(id: number) {
        let username = this.state.matchingUsernames[id]

        this.setState({
            activeSuggestionId: id,
            currentUsername: username,
            requestUsername: username,
        }, () => this.props.onNameChosen({ username }))
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
            {this.state.matchingUsernames.map((u, i) =>
                <li
                    key={`suggestion-${i}-${this.props.key}`}
                    tabIndex={0}
                    onMouseEnter={() => this.selectSuggestion(i)}
                    className={`searchable-input-suggestions-item`}
                /* li */>
                    <button
                        onClick={() => this.chooseUser(u)}
                        className={`searchable-input-suggestions-button ${i === this.state.activeSuggestionId ? "active" : ""}`}
                    /* button */>
                        {this.emphasizeSection(u, this.state.requestUsername)}
                    </button>
                </li>
            )}
        </ul>
    }

    render() {
        return <div ref={this.componentRef} key={this.props.key} className="searchable-input-component">
            <input
                ref={this.inputRef}
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
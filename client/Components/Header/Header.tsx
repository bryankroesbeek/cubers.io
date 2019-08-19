import * as React from 'react'
import { Link } from 'react-router-dom'
import * as Api from '../../api/api'
import * as Types from '../../api/types'

type HeaderProps = {

}

type HeaderState = {
    title: string
    recordsItems: Types.Record | "loading"
    leaderboardItems: Types.Leaderboard | "loading",
    current_user: Types.CurrentUser
    currentDropdown: "none" | "records" | "leaderboards" | "profile" | "wca" | "non-wca" | "sum"
}


export class Header extends React.Component<HeaderProps, HeaderState> {
    currentActiveItem: React.RefObject<HTMLUListElement>

    constructor(props: HeaderProps) {
        super(props)

        this.state = {
            title: "cubers.io",
            recordsItems: "loading",
            leaderboardItems: "loading",
            current_user: "none",
            currentDropdown: "none"
        }

        this.currentActiveItem = React.createRef()
    }

    componentDidMount() {
        Api.getHeaderInfo()
            .then(info => this.setState({
                title: info.title,
                recordsItems: info.recordsItems,
                leaderboardItems: info.leaderboardItems,
                current_user: info.current_user
            }))

        window.addEventListener('click', this.handleClick)
    }

    componentWillUnmount() {
        window.removeEventListener("click", this.handleClick)
    }

    handleClick = (e: MouseEvent) => {
        if (!this.currentActiveItem.current) return
        if (!this.currentActiveItem.current.contains(e.target as Element)) {
            this.setState({ currentDropdown: "none" })
        }
    }

    hideNavigation = () => {
        this.setState({ currentDropdown: "none" })
    }

    renderRecordItem(item: Types.HeaderItem, loading: boolean) {
        return item.urls.map((item, id) =>
            <Link
                key={id}
                className="dropdown-item slim-nav-item"
                to={item.url}
                onClick={() => this.setState({ currentDropdown: "none" })}
            >{item.name}</Link>
        )
    }

    renderRecords() {
        if (this.state.recordsItems === "loading") return null
        let currentDropdown = this.state.currentDropdown
        let show = currentDropdown === "records" || currentDropdown === "wca"
            || currentDropdown === "non-wca" || currentDropdown === "sum" ? "show" : ""

        return <>
            <button className="nav-link dropdown-toggle py-0" onClick={() => {
                this.setState({ currentDropdown: "records" })
            }}>Records</button>
            <div className={`dropdown-menu dropdown-menu-right ${show}`}>
                <div className="dropdown dropright dropdown-submenu">
                    <button className="dropdown-item dropdown-toggle" onClick={() => {
                        this.setState({ currentDropdown: "wca" })
                    }}>
                        {this.state.recordsItems.wca.title}
                    </button>
                    <div className={`dropdown-menu ${currentDropdown === "wca" ? "show" : ""}`}>
                        {this.renderRecordItem(this.state.recordsItems.wca, false)}
                    </div>
                </div>

                <div className="dropdown dropright dropdown-submenu">
                    <button className="dropdown-item dropdown-toggle" onClick={() => {
                        this.setState({ currentDropdown: "non-wca" })
                    }}>
                        {this.state.recordsItems.nonWca.title}
                    </button>
                    <div className={`dropdown-menu ${currentDropdown === "non-wca" ? "show" : ""}`}>
                        {this.renderRecordItem(this.state.recordsItems.nonWca, false)}
                    </div>
                </div>
                <div className="dropdown-divider" />

                <div className="dropdown dropright dropdown-submenu">
                    <button className="dropdown-item dropdown-toggle" onClick={() => {
                        this.setState({ currentDropdown: "sum" })
                    }}>
                        {this.state.recordsItems.sum.title}
                    </button>
                    <div className={`dropdown-menu ${currentDropdown === "sum" ? "show" : ""}`}>
                        {this.renderRecordItem(this.state.recordsItems.sum, false)}
                    </div>
                </div>
            </div>
        </>
    }

    renderLeaderboards() {
        let leaderboard = this.state.leaderboardItems
        if (leaderboard === "loading") return null

        let show = this.state.currentDropdown === "leaderboards" ? "show" : ""

        return <>
            <button className="nav-link dropdown-toggle py-0" onClick={() => {
                this.setState({ currentDropdown: "leaderboards" })
            }}>Leaderboards</button>
            <div className={`dropdown-menu dropdown-menu-right ${show}`}>
                <Link className="dropdown-item" to={leaderboard.current.url} onClick={this.hideNavigation}>{leaderboard.current.name}</Link>
                <Link className="dropdown-item" to={leaderboard.previous.url} onClick={this.hideNavigation}>{leaderboard.previous.name}</Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to={leaderboard.all.url} onClick={this.hideNavigation}>{leaderboard.all.name}</Link>
            </div>
        </>
    }

    renderUser() {
        if (this.state.current_user === "none")
            return <Link className="nav-link py-0" to="/login">Login with Reddit</Link>

        let show = this.state.currentDropdown === "profile" ? "show" : ""

        return <>
            <button className="nav-link dropdown-toggle py-0" onClick={() => {
                this.setState({ currentDropdown: "profile" })
            }}>
                {this.state.current_user.name}
            </button>
            <div className={`dropdown-menu dropdown-menu-right ${show}`}>
                <Link className="dropdown-item" to={this.state.current_user.profile_url} onClick={this.hideNavigation}>Profile</Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to="/logout" onClick={this.hideNavigation}>Logout</Link>
            </div>
        </>
    }

    renderSettings() {
        if (this.state.current_user === "none") return null
        return <Link className="nav-link py-0" to={this.state.current_user.settings_url}>
            <i className="fas fa-cog"></i>
        </Link>
    }

    render() {
        return <div>
            <div className="navbar navbar-expand-md navbar-dark cubers-navbar"></div>
            <div className="navbar navbar-expand-md fixed-top navbar-dark cubers-navbar">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand py-0">{this.state.title}</Link>

                    <button className="navbar-toggler py-0">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse py-0">
                        <ul className="navbar-nav ml-auto py-0" ref={this.currentActiveItem}>
                            <li className="nav-item dropdown">{this.renderRecords()}</li>
                            <li className="nav-item dropdown">{this.renderLeaderboards()}</li>
                            <li className="nav-item dropdown">{this.renderUser()}</li>
                            <li className="nav-item nav-settings">{this.renderSettings()}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    }
}
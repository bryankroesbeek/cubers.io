import * as React from 'react'
import { Link } from 'react-router-dom'
import * as Api from '../../utils/api'
import * as Types from '../../utils/types'

type HeaderProps = {
    user: Types.User
}

type DropdownTypes = "none" | "records" | "leaderboards" | "profile" | "wca" | "non-wca" | "sum" | "kinchranks" | "export"

type HeaderState = {
    title: string
    recordsItems: Types.Record | "loading"
    leaderboardItems: Types.LeaderboardHeaderItem | "loading",
    userItems: Types.UserItems
    currentDropdown: DropdownTypes
}


export class Header extends React.Component<HeaderProps, HeaderState> {
    currentActiveItem: React.RefObject<HTMLUListElement>

    static currentCompetition: string
    static instance: Header
    static setTitle(newTitle: string) {
        this.instance.setState({ title: newTitle })
    }

    constructor(props: HeaderProps) {
        super(props)

        this.state = {
            title: "",
            recordsItems: "loading",
            leaderboardItems: "loading",
            userItems: "none",
            currentDropdown: "none"
        }

        this.currentActiveItem = React.createRef()
        Header.instance = this
    }

    async componentDidMount() {
        window.addEventListener('click', this.handleClick)

        let info = await Api.getHeaderInfo()

        this.setState({
            ...this.state,
            title: this.state.title || info.title,
            recordsItems: info.recordsItems,
            leaderboardItems: info.leaderboardItems,
            userItems: info.userItems
        })

        Header.currentCompetition = info.title
    }

    componentWillUnmount() {
        window.removeEventListener("click", this.handleClick)
    }

    handleClick = (e: MouseEvent) => {
        if (!this.currentActiveItem.current) return
        if (!this.currentActiveItem.current.contains(e.target as Element)) {
            this.setDropdown("none")
        }
    }

    hideNavigation = () => {
        this.setDropdown("none")
    }

    setDropdown = (type: DropdownTypes) => {
        let d = this.state.currentDropdown
        if (d === "wca" && type === "wca" || d === "non-wca" && type === "non-wca" || d === "sum" && type === "sum")
            return this.setState({ currentDropdown: "records" })

        if (d === type) return this.setState({ currentDropdown: "none" })

        this.setState({ currentDropdown: type })
    }

    renderRecordItem(item: Types.HeaderItem, loading: boolean) {
        return item.urls.map((item, id) =>
            <Link
                key={id}
                className="dropdown-item slim-nav-item"
                to={item.url}
                onClick={() => this.setDropdown("none")}
            >{item.name}</Link>
        )
    }

    renderRecords() {
        if (this.state.recordsItems === "loading") return null
        let currentDropdown = this.state.currentDropdown
        let show = currentDropdown === "records" || currentDropdown === "wca"
            || currentDropdown === "non-wca" || currentDropdown === "sum"
            || currentDropdown === "kinchranks" ? "show" : ""

        return <>
            <button className="nav-link dropdown-toggle py-0" onClick={() => {
                this.setDropdown("records")
            }}>Records</button>
            <div className={`dropdown-menu dropdown-menu-right ${show}`}>
                <div className="dropdown dropright dropdown-submenu">
                    <button className="dropdown-item dropdown-toggle" onClick={() => {
                        this.setDropdown("wca")
                    }}>
                        {this.state.recordsItems.wca.title}
                    </button>
                    <div className={`dropdown-menu ${currentDropdown === "wca" ? "show" : ""}`}>
                        {this.renderRecordItem(this.state.recordsItems.wca, false)}
                    </div>
                </div>

                <div className="dropdown dropright dropdown-submenu">
                    <button className="dropdown-item dropdown-toggle" onClick={() => {
                        this.setDropdown("non-wca")
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
                        this.setDropdown("sum")
                    }}>
                        {this.state.recordsItems.sum.title}
                    </button>
                    <div className={`dropdown-menu ${currentDropdown === "sum" ? "show" : ""}`}>
                        {this.renderRecordItem(this.state.recordsItems.sum, false)}
                    </div>
                </div>

                <div className="dropdown dropright dropdown-submenu">
                    <button className="dropdown-item dropdown-toggle" onClick={() => {
                        this.setDropdown("kinchranks")
                    }}>
                        {this.state.recordsItems.kinchranks.title}
                    </button>
                    <div className={`dropdown-menu ${currentDropdown === "kinchranks" ? "show" : ""}`}>
                        {this.renderRecordItem(this.state.recordsItems.kinchranks, false)}
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
                this.setDropdown("leaderboards")
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
        if (this.state.userItems === "none")
            return <Link className="nav-link py-0" to="/login">Login with Reddit</Link>

        let show = this.state.currentDropdown === "profile" || this.state.currentDropdown === "export" ? "show" : ""

        return <>
            <button className="nav-link dropdown-toggle py-0" onClick={() => {
                this.setDropdown("profile")
            }}>
                {this.props.user.name}
            </button>
            <div className={`dropdown-menu dropdown-menu-right ${show}`}>
                <Link className="dropdown-item" to={this.state.userItems.profile_url} onClick={this.hideNavigation}>Profile</Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to={this.state.userItems.versus_url} onClick={this.hideNavigation}>Competitor Showdown</Link>
                <div className="dropdown-divider"></div>
                <div className="dropdown dropleft dropdown-submenu">
                    <button className="dropdown-item dropdown-toggle" onClick={() => {
                        this.setDropdown("export")
                    }}>
                        {" Solves Export"}
                    </button>
                    <div className={`dropdown-menu ${this.state.currentDropdown === "export" ? "show" : ""}`}>
                        <a
                            className="dropdown-item slim-nav-item"
                            href={"/api/export?type=twisty_timer"}
                            onClick={() => this.setDropdown("none")}
                        >{"Twisty Timer"}</a>
                        <div className="dropdown-divider"></div>

                        <button className="dropdown-item" disabled>
                            {"More coming soon!"}
                        </button>
                    </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to="/logout" onClick={this.hideNavigation}>Logout</Link>
            </div>
        </>
    }

    renderSettings() {
        if (this.state.userItems === "none") return null
        return <Link className="nav-link py-0" to={this.state.userItems.settings_url} onClick={() => this.setDropdown("none")}>
            <i className="fas fa-cog"></i>
        </Link>
    }

    renderTitle() {
        if (!this.state.title) return "cubers.io"
        return `cubers.io - ${this.state.title}`
    }

    render() {
        return <div>
            <div className="navbar navbar-expand-md navbar-dark cubers-navbar"></div>
            <div className="navbar navbar-expand-md fixed-top navbar-dark cubers-navbar">
                <div className="container-fluid">
                    <Link to="/" className="navbar-brand py-0">{this.renderTitle()}</Link>

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
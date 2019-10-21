import * as React from 'react'
import { SketchPicker } from 'react-color'
import { cloneDeep } from 'lodash'

import * as Api from '../../utils/api'
import * as Types from '../../utils/types'
import * as Helpers from '../../utils/helpers/settingsHelper'
import { SettingsToggle } from './SettingsToggle';

type UserSettingsProps = {
    settings: Types.UserSettings
    updateSettings: (settings: Types.UserSettings) => void
}

type UserSettingsState = {
    settings: Types.CleanUserSettings
    expandedOption: string
}

export class UserSettings extends React.Component<UserSettingsProps, UserSettingsState>{
    colorPickerRef: React.RefObject<HTMLSpanElement>

    constructor(props: UserSettingsProps) {
        super(props)

        this.state = {
            settings: Helpers.cleanSettings(props.settings),
            expandedOption: null
        }

        this.colorPickerRef = React.createRef()
    }

    handleClick = (e: MouseEvent) => {
        if (!this.colorPickerRef.current) return
        if (!this.colorPickerRef.current.contains(e.target as Element))
            this.setState({ expandedOption: null })
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClick)
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClick)
    }

    submitSettings() {
        let settings = Helpers.minifySettings(this.state.settings)
        Api.updateSettings(settings)
            .then(s => this.props.updateSettings(s))
    }

    renderGeneralSettings() {
        let generalSettings = this.state.settings.generalSettings

        return <div className="settings-block">
            <label className="block-title">General Settings</label>
            {Object.keys(this.state.settings.generalSettings).map(s => {
                let setting = this.state.settings.generalSettings[s]
                return <div className="settings-block-field">
                    <span className="field-title">{setting.title}</span>
                    <span className="guide"></span>
                    <SettingsToggle toggled={setting.value} setSwitch={(value) => {
                        let newState = cloneDeep(this.state)
                        newState.settings.generalSettings[s].value = value
                        this.setState(newState)
                    }} />
                </div>
            })}
        </div>
    }

    renderRedditSettings() {
        let settings = this.state.settings.redditSettings
        return <div className="settings-block">
            <label className="block-title">Reddit Settings</label>
            <div className="settings-block-field">
                <span className="field-title">{settings.reddit_comp_notify.title}</span>
                <span className="guide"></span>
                <SettingsToggle toggled={settings.reddit_comp_notify.value} setSwitch={(value) => {
                    let newState = cloneDeep(this.state)
                    newState.settings.redditSettings.reddit_comp_notify.value = value
                    this.setState(newState)
                }} />
            </div>
            <div className="settings-block-field">
                <span className="field-title">{settings.reddit_results_notify.title}</span>
                <span className="guide"></span>
                <SettingsToggle toggled={settings.reddit_results_notify.value} setSwitch={(value) => {
                    let newState = cloneDeep(this.state)
                    newState.settings.redditSettings.reddit_results_notify.value = value
                    this.setState(newState)
                }} />
            </div>
        </div>
    }

    renderCubeColors(
        puzzleType: "Cube" | "Pyraminx" | "Megaminx",
        puzzleSettings: { key: string, value: string, title: string }[],
        useCustomColors: boolean
    ) {
        return <div className="settings-block">
            <span className="block-title">{puzzleType} Color Preferences</span>
            <span className="settings-block-field">
                <label className="field-title">Use Custom {puzzleType} Colors</label>
                <span className="guide"></span>
                <SettingsToggle toggled={useCustomColors} setSwitch={(value) => {
                    let newState = cloneDeep(this.state)
                    if (puzzleType === "Megaminx") newState.settings.megaminxSettings.use_custom_megaminx_colors = value
                    if (puzzleType === "Pyraminx") newState.settings.pyraminxSettings.use_custom_pyraminx_colors = value
                    if (puzzleType === "Cube") newState.settings.cubeSettings.use_custom_cube_colors = value
                    this.setState(newState)
                }} />
            </span>
            {puzzleSettings.map((setting, count) =>
                <div key={setting.key} className="settings-block-field">
                    <span className="field-title">{setting.title}</span>
                    <span className="guide"></span>
                    {this.state.expandedOption === setting.key ?
                        <span className="color-setting-picker-align">
                            <span ref={this.colorPickerRef} className="color-setting-picker">
                                <SketchPicker disableAlpha={true} color={setting.value} onChangeComplete={e => {
                                    let newState = cloneDeep(this.state)
                                    let colors = cloneDeep(puzzleSettings)
                                    colors[count].value = e.hex

                                    if (puzzleType === "Megaminx") newState.settings.megaminxSettings.values = colors
                                    if (puzzleType === "Pyraminx") newState.settings.pyraminxSettings.values = colors
                                    if (puzzleType === "Cube") newState.settings.cubeSettings.values = colors

                                    this.setState(newState)
                                }} />
                            </span>
                        </span> : null
                    }
                    <button className="color-picker-toggle" disabled={!useCustomColors} onClick={e => {
                        e.preventDefault()
                        if (this.state.expandedOption === setting.key) return this.setState({ expandedOption: null })
                        this.setState({ expandedOption: setting.key })
                    }}>
                        <div className="color-preview-block" style={{ background: setting.value }}></div>
                    </button>
                </div>
            )}
        </div>
    }

    render() {
        return <div className="settings-wrapper">
            <form className="settings-form" onSubmit={e => {
                e.preventDefault()
                this.submitSettings()
            }}>
                {this.renderGeneralSettings()}
                <hr />
                {this.renderRedditSettings()}
                <hr />
                {this.renderCubeColors(
                    "Cube",
                    this.state.settings.cubeSettings.values,
                    this.state.settings.cubeSettings.use_custom_cube_colors
                )}
                <hr />
                {this.renderCubeColors(
                    "Pyraminx",
                    this.state.settings.pyraminxSettings.values,
                    this.state.settings.pyraminxSettings.use_custom_pyraminx_colors
                )}
                <hr />
                {this.renderCubeColors(
                    "Megaminx",
                    this.state.settings.megaminxSettings.values,
                    this.state.settings.megaminxSettings.use_custom_megaminx_colors
                )}
                <button className="settings-submit-button" type="submit">Save Changes</button>
            </form>
        </div>
    }
}
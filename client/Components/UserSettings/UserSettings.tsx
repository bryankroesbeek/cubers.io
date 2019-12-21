import * as React from 'react'
import { SketchPicker } from 'react-color'
import { cloneDeep } from 'lodash'

import * as Types from '../../utils/types'
import * as Helpers from '../../utils/helpers/settingsHelper'
import { SettingsToggle } from './SettingsToggle'
import { UserSettingsState, SettingsAction } from '../../utils/store/types/settingsTypes'
import { DispatchProp, MapStateToProps, connect } from 'react-redux'
import { updateSettingsState, updateExpandedPicker } from '../../utils/store/actions/settingsActions'
import { CleanUserSettings, GeneralSetting } from '../../utils/types'
import { Store } from '../../utils/store/types/generalTypes'
import { BaseAction } from '../../utils/store/types/baseTypes'
import { submitNewSettings } from '../../utils/store/actions/baseActions'
import { Header } from '../Header/Header'

type UserSettingsProps = UserSettingsState & DispatchProp<SettingsAction | BaseAction>

class UserSettingsComponent extends React.Component<UserSettingsProps>{
    colorPickerRef: React.RefObject<HTMLSpanElement>

    constructor(props: UserSettingsProps) {
        super(props)

        this.colorPickerRef = React.createRef()
    }

    handleClick = (e: MouseEvent) => {
        if (!this.colorPickerRef.current) return
        if (!this.colorPickerRef.current.contains(e.target as Element))
            this.props.dispatch(updateExpandedPicker(null))
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClick)
        Header.setTitle("Preferences")
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClick)
        this.props.dispatch(updateSettingsState(null))
    }

    submitSettings(settings: CleanUserSettings) {
        this.props.dispatch(submitNewSettings(this.props.dispatch, settings))
    }

    renderGeneralSettings() {
        let generalSettings = this.props.settings.generalSettings

        let manualEntry = generalSettings.manual_time_entry_by_default.value
        let useInspection = manualEntry && generalSettings.use_inspection_time.value

        return <div className="settings-block">
            <label className="block-title">General Settings</label>

            {this.renderSetting(generalSettings.manual_time_entry_by_default, false, "manual_time_entry_by_default")}
            {this.renderSetting(generalSettings.use_inspection_time, manualEntry, "use_inspection_time")}
            {this.renderSetting(generalSettings.hide_inspection_time, useInspection, "hide_inspection_time")}
            {this.renderSetting(generalSettings.hide_running_timer, manualEntry, "hide_running_timer")}

            {this.renderSetting(generalSettings.hide_scramble_preview, false, "hide_scramble_preview")}
            {this.renderSetting(generalSettings.enable_moving_shapes_bg, false, "enable_moving_shapes_bg")}
        </div>
    }

    renderSetting(setting: GeneralSetting, disabled: boolean, settingKey: string) {
        return <div className="settings-block-field">
            <span className="field-title">{setting.title}</span>
            <span className="guide"></span>
            <SettingsToggle toggled={setting.value} disabled={disabled} setSwitch={(value) => {
                let settings = cloneDeep(this.props.settings)
                settings.generalSettings[settingKey].value = value
                this.props.dispatch(updateSettingsState(settings))
            }} />
        </div>
    }

    renderRedditSettings() {
        let settings = this.props.settings.redditSettings
        return <div className="settings-block">
            <label className="block-title">Reddit Settings</label>
            <div className="settings-block-field">
                <span className="field-title">{settings.reddit_comp_notify.title}</span>
                <span className="guide"></span>
                <SettingsToggle toggled={settings.reddit_comp_notify.value} disabled={false} setSwitch={(value) => {
                    let settings = cloneDeep(this.props.settings)
                    settings.redditSettings.reddit_comp_notify.value = value
                    this.props.dispatch(updateSettingsState(settings))
                }} />
            </div>
            <div className="settings-block-field">
                <span className="field-title">{settings.reddit_results_notify.title}</span>
                <span className="guide"></span>
                <SettingsToggle toggled={settings.reddit_results_notify.value} disabled={false} setSwitch={(value) => {
                    let settings = cloneDeep(this.props.settings)
                    settings.redditSettings.reddit_results_notify.value = value
                    this.props.dispatch(updateSettingsState(settings))
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
                <SettingsToggle toggled={useCustomColors} disabled={false} setSwitch={(value) => {
                    let settings = cloneDeep(this.props.settings)
                    if (puzzleType === "Megaminx") settings.megaminxSettings.use_custom_megaminx_colors = value
                    if (puzzleType === "Pyraminx") settings.pyraminxSettings.use_custom_pyraminx_colors = value
                    if (puzzleType === "Cube") settings.cubeSettings.use_custom_cube_colors = value
                    this.props.dispatch(updateSettingsState(settings))
                }} />
            </span>
            {puzzleSettings.map((setting, count) =>
                <div key={setting.key} className="settings-block-field">
                    <span className="field-title">{setting.title}</span>
                    <span className="guide"></span>
                    {this.props.expandedOption === setting.key ?
                        <span className="color-setting-picker-align">
                            <span ref={this.colorPickerRef} className="color-setting-picker">
                                <SketchPicker disableAlpha color={setting.value} onChangeComplete={e => {
                                    let settings = cloneDeep(this.props.settings)
                                    let colors = cloneDeep(puzzleSettings)
                                    colors[count].value = e.hex

                                    if (puzzleType === "Megaminx") settings.megaminxSettings.values = colors
                                    if (puzzleType === "Pyraminx") settings.pyraminxSettings.values = colors
                                    if (puzzleType === "Cube") settings.cubeSettings.values = colors

                                    this.props.dispatch(updateSettingsState(settings))
                                }} />
                            </span>
                        </span> : null
                    }
                    <button className="color-picker-toggle" disabled={!useCustomColors} onClick={e => {
                        e.preventDefault()
                        if (this.props.expandedOption === setting.key) return this.props.dispatch(updateExpandedPicker(null))
                        this.props.dispatch(updateExpandedPicker(setting.key))
                    }}>
                        <div className="color-preview-block" style={{ background: setting.value }} />
                    </button>
                </div>
            )}
        </div>
    }

    render() {
        return <div className="settings-wrapper">
            <form className="settings-form" onSubmit={e => {
                e.preventDefault()
                this.submitSettings(this.props.settings)
            }}>
                {this.renderGeneralSettings()}
                <hr />
                {this.renderRedditSettings()}
                <hr />
                {this.renderCubeColors(
                    "Cube",
                    this.props.settings.cubeSettings.values,
                    this.props.settings.cubeSettings.use_custom_cube_colors
                )}
                <hr />
                {this.renderCubeColors(
                    "Pyraminx",
                    this.props.settings.pyraminxSettings.values,
                    this.props.settings.pyraminxSettings.use_custom_pyraminx_colors
                )}
                <hr />
                {this.renderCubeColors(
                    "Megaminx",
                    this.props.settings.megaminxSettings.values,
                    this.props.settings.megaminxSettings.use_custom_megaminx_colors
                )}
                <button className="settings-submit-button" type="submit">Save Changes</button>
            </form>
        </div>
    }
}

let mapStateToProps: MapStateToProps<UserSettingsState, {}, Store> = (store, _) => {
    return {
        ...store.settings,
        settings: store.settings.settings || Helpers.cleanSettings(store.baseInfo.settings as Types.UserSettings)
    }
}

export let UserSettings = connect(mapStateToProps)(UserSettingsComponent)
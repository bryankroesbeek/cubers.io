import * as React from 'react'

// import * as Types from '../../api/types'
// import * as Helpers from '../../api/helpers/settingsHelper'

type SettingsToggleProps = {
    toggled: boolean
    disabled: boolean
    setSwitch: (value: boolean) => void
}

type SettingsToggleState = {}

export class SettingsToggle extends React.Component<SettingsToggleProps, SettingsToggleState>{
    constructor(props: SettingsToggleProps) {
        super(props)

        this.state = {}
    }

    switchOff = (e: React.MouseEvent) => {
        e.preventDefault()
        if (this.props.disabled) return
        this.props.setSwitch(false)
    }

    switchOn = (e: React.MouseEvent) => {
        e.preventDefault()
        if (this.props.disabled) return
        this.props.setSwitch(true)
    }

    render() {
        return <div className="settings-option-wrapper">
            <button className={`settings-option true ${this.props.toggled ? "toggled" : ""}`} onClick={this.switchOn}>Yes</button>
            <button className={`settings-option false ${this.props.toggled ? "" : "toggled"}`} onClick={this.switchOff}>No</button>
        </div>
    }
}
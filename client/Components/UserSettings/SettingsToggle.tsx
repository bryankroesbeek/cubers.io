import * as React from 'react'

// import * as Types from '../../api/types'
// import * as Helpers from '../../api/helpers/settingsHelper'

type SettingsToggleProps = {
    toggled: boolean
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
        this.props.setSwitch(false)
    }

    switchOn = (e: React.MouseEvent) => {
        e.preventDefault()
        this.props.setSwitch(true)
    }

    render() {
        return <div className="settings-option">
            <button className={`settings-option-yes ${this.props.toggled ? "toggled" : ""}`} onClick={this.switchOn}>Yes</button>
            <button className={`settings-option-no  ${this.props.toggled ? "" : "toggled"}`} onClick={this.switchOff}>No</button>
        </div>
    }
}
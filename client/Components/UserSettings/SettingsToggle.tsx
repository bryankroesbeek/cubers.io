import * as React from 'react'

type SettingsToggleProps = {
    toggled: boolean
    disabled: boolean
    setSwitch: (value: boolean) => void
}

export class SettingsToggle extends React.Component<SettingsToggleProps>{
    toggleSwitch = (e: React.MouseEvent) => {
        e.preventDefault()
        if (this.props.disabled) return;
        this.props.setSwitch(!this.props.toggled)
    }

    render() {
        let toggled = this.props.toggled ? "toggled" : ""
        let disabled = this.props.disabled ? "disabled" : ""

        return <button className={`button-toggle ${disabled}`} onClick={this.toggleSwitch}>
            <div className={`button-toggle-container ${toggled}`}>
                <div className={`button-toggle-switch-wrapper ${toggled}`}>
                    <div className={`button-toggle-switch ${toggled}`}></div>
                </div>
            </div>
        </button>
    }
}
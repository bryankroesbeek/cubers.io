import * as React from 'react'

import * as Helper from '../../api/helpers/manualEntryHelper'

type BlindInfo = {
    cubesSolved: number
    cubesAttempted: number
}

type ManualEntryProps = {
    disabled: boolean
    multiblind?: boolean
    submit: (value: number, blindInfo?: BlindInfo) => void
}
type ManualEntryState = {
    value: string
    blindSolved: number
    blindAttempted: number
}

export class ManualEntry extends React.Component<ManualEntryProps, ManualEntryState>{
    constructor(props: ManualEntryProps) {
        super(props)

        this.state = {
            value: "",
            blindAttempted: 0,
            blindSolved: 0
        }
    }

    processChange(value: string) {
        let numberValue = Number(Helper.cleanInput(value))
        if (Number.isNaN(numberValue)) return
        if (numberValue === 0) return this.setState({ value: "" })

        let newValue = Helper.formatTimeString(numberValue)
        this.setState({ value: newValue })
    }

    submitTime(e: React.FormEvent) {
        e.preventDefault()
        if (this.state.value === "") return

        this.props.submit(Helper.convertToMilliseconds(this.state.value))
        this.setState({ value: "" })
    }

    renderBlindInputs() {
        if (!this.props.multiblind) return

        return <div className="timer-input-blind">
            <input
                className="timer-manual-input"
                type="number"
                value={this.state.blindSolved}
                onChange={e => this.setState({ blindSolved: e.target.valueAsNumber })}
                placeholder="#"
                disabled={this.props.disabled}
            />
            succesful, out of
            <input
                className="timer-manual-input"
                type="number"
                value={this.state.blindAttempted}
                onChange={e => this.setState({ blindAttempted: e.target.valueAsNumber })}
                placeholder="#"
                disabled={this.props.disabled}
            />
        </div>
    }

    render() {
        return <div className="timer-manual-entry">
            <form className="timer-manual-form" onSubmit={e => this.submitTime(e)}>
                {this.renderBlindInputs()}
                <div className="timer-input-normal">
                    <input
                        className="timer-manual-input"
                        type="text"
                        value={this.state.value}
                        onChange={e => this.processChange(e.target.value)}
                        placeholder="00:00.00"
                        disabled={this.props.disabled}
                    />
                    <button className="timer-manual-submit" type="submit" disabled={this.props.disabled}>
                        <i className="fas fa-arrow-right" />
                    </button>
                </div>
            </form>
        </div>
    }
}
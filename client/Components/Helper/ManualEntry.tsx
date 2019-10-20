import * as React from 'react'

import * as Helper from '../../api/helpers/manualEntryHelper'

type ManualEntryProps = {
    disabled: boolean
    submit: (value: number) => void
}
type ManualEntryState = {
    value: string
}

export class ManualEntry extends React.Component<ManualEntryProps, ManualEntryState>{
    constructor(props: ManualEntryProps) {
        super(props)

        this.state = {
            value: ""
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

    render() {
        return <div className="timer-manual-entry">
            <form className="timer-manual-form" onSubmit={e => this.submitTime(e)}>
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
            </form>
        </div>
    }
}
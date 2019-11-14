import * as React from 'react'

import * as Helper from '../../utils/helpers/manualEntryHelper'

type BlindInfo = {
    cubesSolved: number
    cubesAttempted: number
}

type ManualEntryProps = {
    disabled: boolean
    submit: (value: number, callback: () => void) => void
} & (
        { type: "normal" } |
        { type: "mbld" } |
        {
            type: "fmc"
            moveCount: number | "none"
        }
    )

type ManualEntryState = {
    type: "normal" | "mbld" | "fmc"
    value: string
    blindSolved: number
    blindAttempted: number
}

export class ManualEntry extends React.Component<ManualEntryProps, ManualEntryState>{
    constructor(props: ManualEntryProps) {
        super(props)

        this.state = {
            type: this.props.type,
            value: "",
            blindAttempted: 0,
            blindSolved: 0
        }
    }

    processChange(value: string) {
        if (this.props.type === "fmc") return

        let numberValue = Number(Helper.cleanInput(value))
        if (Number.isNaN(numberValue)) return
        if (numberValue === 0) return this.setState({ value: "" })

        let newValue = Helper.formatTimeString(numberValue)
        this.setState({ value: newValue })
    }

    submitTime(e: React.FormEvent) {
        e.preventDefault()

        if (this.props.type === "fmc") {
            if (this.props.moveCount === "none") return
            return this.props.submit(this.props.moveCount, () => {
                this.setState({ value: "" })
            })
        }

        if (this.state.value === "") return

        if (this.props.type === "mbld") {
            let value = Helper.getEncodedMbldNumber(
                this.state.blindAttempted,
                this.state.blindSolved,
                Helper.convertToSeconds(this.state.value)
            )
            if (value === "invalid") return
            return this.props.submit(value, () => {
                this.setState({ value: "" })
            })
        }

        this.props.submit(Helper.convertToMilliseconds(this.state.value), () => {
            this.setState({ value: "" })
        })
    }

    renderBlindInputs() {
        if (this.props.type !== "mbld") return

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
        let value = this.props.type === "fmc" ?
            `${this.props.moveCount === "none" ? "Enter solution" : this.props.moveCount}` :
            this.state.value

        return <div className="timer-manual-entry">
            <form className="timer-manual-form" onSubmit={e => this.submitTime(e)}>
                {this.renderBlindInputs()}
                <div className="timer-input-normal">
                    <input
                        className="timer-manual-input"
                        type="text"
                        value={value}
                        onChange={e => this.processChange(e.target.value)}
                        placeholder={this.props.type === "fmc" ? "" : "00:00.00"}
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
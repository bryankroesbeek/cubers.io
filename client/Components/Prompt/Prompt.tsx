import * as React from 'react'
import { PromptState, PromptAction } from '../../utils/store/types/promptTypes'
import { DispatchProp, MapStateToProps, connect } from 'react-redux'
import { closePrompt, hidePrompt, updateCommentInput, updateFmcInput, showPrompt } from '../../utils/store/actions/promptActions'
import { Store } from '../../utils/store/types/generalTypes'

type RemoteProps = {}

type PromptProps = PromptState

type PromptBody = {
    body: JSX.Element | JSX.Element[]
    buttons: JSX.Element | JSX.Element[]
}

export class PromptComponent extends React.Component<PromptProps & DispatchProp<PromptAction>> {
    componentDidUpdate() {
        let { hideType, dispatch } = this.props
        if (hideType === "hidden") return setTimeout(() => {
            dispatch(closePrompt())
        }, 750)
        if (hideType === "fade-in") return setTimeout(() => {
            dispatch(showPrompt())
        }, 32)
    }

    closeCurrentPrompt = () => {
        this.props.dispatch(hidePrompt())
    }

    getInformationBody(): PromptBody {
        return {
            body: null,
            buttons: <div className="prompt-buttons">
                <button className="prompt-button" onClick={this.closeCurrentPrompt}>OK</button>
            </div>
        }
    }

    getListViewBody(items: string[]): PromptBody {
        return {
            body: items.map(item => <pre className="scramble-item">{item}</pre>),
            buttons: <div className="prompt-buttons">
                <button className="prompt-button" onClick={this.closeCurrentPrompt}>OK</button>
            </div>
        }
    }

    getConfirmationBody(confirmAction: () => void): PromptBody {
        return {
            body: null,
            buttons: <div className="prompt-buttons">
                <button className="prompt-button cancel" onClick={this.closeCurrentPrompt}>Cancel</button>
                <button className="prompt-button" onClick={() => {
                    confirmAction()
                    this.closeCurrentPrompt()
                }}>Yes</button>
            </div>
        }
    }

    getInputBody(text: string, updateAction: (input: string) => PromptAction): JSX.Element {
        return <textarea className="prompt-textbox-input" onChange={e => {
            this.props.dispatch(updateAction(e.target.value))
        }} value={text}></textarea>
    }

    getBody() {
        let { dispatch } = this.props
        if (this.props.type === "none") return
        if (this.props.type === "info") {
            return this.getInformationBody()
        }

        if (this.props.type === "listview") {
            return this.getListViewBody(this.props.items)
        }

        if (this.props.type === "confirmation") {
            let { confirmAction } = this.props
            return this.getConfirmationBody(confirmAction)
        }

        if (this.props.type === "comment") {
            var confirmText = "Update comment"
            var text = this.props.comment
            var body = this.getInputBody(text, value => updateCommentInput(value))
        }
        else if (this.props.type === "fmc") {
            var confirmText = "Confirm solution"
            var text = this.props.solution
            var body = this.getInputBody(text, value => updateFmcInput(value))
        }

        let { confirmAction } = this.props

        let buttons = <div className="prompt-buttons">
            <button className="prompt-button cancel" onClick={this.closeCurrentPrompt}>Cancel</button>
            <button className="prompt-button" onClick={() => {
                confirmAction(text)
                this.closeCurrentPrompt()
            }}>{confirmText}</button>
        </div>

        return { body, buttons }
    }

    render() {
        if (this.props.type === "none") return null
        let visibility = this.props.hideType !== "none" ? "hide" : ""

        let { buttons, body } = this.getBody()

        return <div className={`prompt-background ${visibility}`}>
            <div className="timer-prompt">
                <div className="prompt-message-bar">
                    <span className="prompt-message">{this.props.title}</span>
                    <button className="prompt-blank" onClick={this.closeCurrentPrompt}>×</button>
                </div>
                <div className="prompt-body">{body}</div>
                {buttons}
            </div>
        </div>
    }
}

const mapStateToProps: MapStateToProps<PromptState, RemoteProps, Store> = (store, ownProps) => {
    return store.prompt
}

export const Prompt = connect(mapStateToProps)(PromptComponent)
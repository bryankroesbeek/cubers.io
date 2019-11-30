import * as React from 'react'

type Props = {
    comment: string
}

export class Comment extends React.Component<Props> {
    renderCommentTooltip() {
        if (!this.props.comment) return null

        return <div className="comment-tooltip">
            <span>{this.props.comment}</span>
        </div>
    }

    getCommentStyle = () => !this.props.comment ? "empty-comment" : ""

    render() {
        return <div className={`table-comment ${this.getCommentStyle()}`}>
            <i className="far fa-comment comment-icon">{this.renderCommentTooltip()}</i>
        </div>
    }
}
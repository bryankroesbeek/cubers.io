import * as React from 'react'

import * as Api from '../../api/api'
import * as Types from '../../api/types'

type RecordsProps = {
    event: string
}

type RecordsState = {
    items: Types.PersonalRecord[] | "loading"
}

export class Records extends React.Component<RecordsProps, RecordsState>{
    constructor(props: RecordsProps) {
        super(props)

        this.state = {
            items: "loading"
        }
    }

    componentDidMount() {
        Api.getRecords(this.props.event, "single")
            .then(records => this.setState({ items: records }))
    }

    render() {
        if (this.state.items === "loading") return null

        return <div>{this.state.items.map(item => <div>
            {item.username}
        </div>)}</div>
    }
}
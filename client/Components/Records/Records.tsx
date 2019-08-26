import * as React from 'react'

type RecordsProps = {
    event: string
}

type RecordsState = {
    items: {
        compId: number
        rank: number | ""
        username: string
        single: string
        average: string
        competition: {
            name: string
            url: string
        }
    }[] | "loading"
}

export class Records extends React.Component<RecordsProps, RecordsState>{
    constructor(props: RecordsProps) {
        super(props)

        this.state = {
            items: "loading"
        }
    }
    
    componentDidMount() {
        
    }

    render() {
        if (this.state.items === "loading") return null
        
        return <div>{this.props.event}</div>
    }
}
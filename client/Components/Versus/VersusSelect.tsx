import * as React from 'react'
import { SearchableInput } from './SearchableInput'

type VersusSelectProps = {}

type VersusSelectState = {}

export class VersusSelect extends React.Component<VersusSelectProps, VersusSelectState>{
    constructor(props: VersusSelectProps) {
        super(props)
    }

    render() {
        return <div className="versus-search-page">
            <SearchableInput
                onNameChosen={(username) => {/* store chosen username */}}
            />
        </div>
    }
}

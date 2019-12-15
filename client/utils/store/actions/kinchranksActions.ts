import { Dispatch } from 'redux'

import { KinchranksAction } from '../types/kinchranksTypes'
import { getKinchranks } from '../../api'

export let fetchKinchranks = (dispatch: Dispatch<KinchranksAction>, type: string): KinchranksAction => {
    getKinchranks(type)
        .then(result => dispatch({ type: "FETCH_KINCHRANKS", ranks: result }))

    return { type: "NONE" }
}
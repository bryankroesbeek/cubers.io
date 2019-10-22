import { HomeState } from './homeTypes'
import { RecordsState } from './recordsTypes'
import { RouterState } from './routerTypes'

export type Store = {
    home: HomeState
    records: RecordsState
    routerInfo: RouterState
}
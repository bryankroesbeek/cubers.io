import { HomeState } from './homeTypes'
import { RouterState } from './routerTypes'

export type Store = {
    home: HomeState
    routerInfo: RouterState
}
import { fetchResources } from './base'
import { User, HeaderInfo } from '../types'

export function getUserInfo(): Promise<User> {
    return fetchResources('/api/user-info')
}

export function getHeaderInfo(): Promise<HeaderInfo> {
    return fetchResources("/api/header-info")
}
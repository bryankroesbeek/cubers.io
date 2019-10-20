let getHeaders = (): Headers => {
    let token = document.getElementsByName('Anti-Forgery-Token')[0].getAttribute('value')
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('X_CSRF_TOKEN', token)

    return headers
}

export function fetchResources<T>(url: string): Promise<T> {
    return fetch(url)
        .then(res => res.json())
        .then(json => json as T)
}

function sendResources<T>(url: string, data: any, method: "POST" | "PUT" | "DELETE") {
    let request: RequestInit = {
        method: method,
        headers: getHeaders(),
    }

    if (!!data) request.body = JSON.stringify(data)

    return fetch(url, request)
        .then(res => res.json())
        .then(json => json as T)
}

export function postResources<T>(url: string, data: any): Promise<T> {
    return sendResources<T>(url, data, "POST")
}

export function putResources<T>(url: string, data: any): Promise<T> {
    return sendResources<T>(url, data, "PUT")
}

export function deleteResources<T>(url: string, data: any): Promise<T> {
    return sendResources<T>(url, data, "DELETE")
}
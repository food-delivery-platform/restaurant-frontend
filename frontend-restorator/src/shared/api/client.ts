import axios from 'axios'

const API_URL = 'http://localhost:3001'

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export async function apiGet<T>(path: string): Promise<T> {
    const res = await client.get<T>(path)
    return res.data
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
    const res = await client.post<T>(path, body)
    return res.data
}

export async function apiPatch<T>(path: string, body: any): Promise<T> {
    const res = await client.patch<T>(path, body)
    return res.data
}
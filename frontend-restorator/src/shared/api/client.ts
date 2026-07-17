import axios from 'axios'
import { API_URL } from '../config'

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

export async function apiPost<T, B = unknown>(path: string, body: B): Promise<T> {
    const res = await client.post<T>(path, body)
    return res.data
}

export async function apiPatch<T, B = unknown>(path: string, body: B): Promise<T> {
    const res = await client.patch<T>(path, body)
    return res.data
}
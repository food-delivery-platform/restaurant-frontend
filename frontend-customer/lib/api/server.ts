import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const serverClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function serverApiGet<T>(path: string): Promise<T> {
  const res = await serverClient.get<T>(path)
  return res.data
}

export async function serverApiPost<T>(path: string, body: any): Promise<T> {
  const res = await serverClient.post<T>(path, body)
  return res.data
}

export async function serverApiPatch<T>(path: string, body: any): Promise<T> {
  const res = await serverClient.patch<T>(path, body)
  return res.data
}

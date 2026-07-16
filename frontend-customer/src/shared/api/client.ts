'use client'

import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const clientAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function apiGet<T>(path: string): Promise<T> {
  const res = await clientAxios.get<T>(path)
  return res.data
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await clientAxios.post<T>(path, body)
  return res.data
}

export async function apiPatch<T>(path: string, body: any): Promise<T> {
  const res = await clientAxios.patch<T>(path, body)
  return res.data
}

'use client'

import { useEffect, useState } from 'react'

export interface UseLocalStorageOptions<T = unknown> {
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
  initializeWithValue?: boolean
}

const defaultSerializer = JSON.stringify
const defaultDeserializer = JSON.parse

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {},
): [T, (value: T | ((val: T) => T)) => void] {
  const {
    serializer = defaultSerializer,
    deserializer = defaultDeserializer,
    initializeWithValue = true,
  } = options

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!initializeWithValue) {
      return initialValue
    }

    try {
      const item = typeof window !== 'undefined' ? window.localStorage?.getItem(key) : null
      if (item) {
        return deserializer(item)
      }
      return initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serializer(valueToStore))
      }
      setStoredValue(valueToStore)
    } catch (error) {
      console.warn(error)
    }
  }

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const item = window.localStorage?.getItem(key)
        if (item) {
          setStoredValue(deserializer(item))
        }
      } catch (error) {
        console.warn(error)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, deserializer])

  return [storedValue, setValue]
}

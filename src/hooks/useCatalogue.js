import { useCallback, useMemo } from 'react'
import { useAsyncResource } from './useAsyncResource'
import * as catalogue from '../services/catalogue'

export function useProducts(filters = {}) {
  const key = JSON.stringify(filters)
  const options = useMemo(() => JSON.parse(key), [key])
  const loader = useCallback(() => catalogue.listProducts(options), [options])
  return useAsyncResource(loader, key)
}

export function useCategories() {
  const loader = useCallback(() => catalogue.listCategories(), [])
  return useAsyncResource(loader, 'categories')
}

export function useProduct(slug) {
  const loader = useCallback(() => catalogue.getProductBySlug(slug), [slug])
  return useAsyncResource(loader, slug)
}

export function useCollection(loader, limit) {
  const run = useCallback(() => loader(limit), [loader, limit])
  return useAsyncResource(run, limit)
}

export function useCategoryCounts() {
  const loader = useCallback(() => catalogue.getCategoryCounts(), [])
  return useAsyncResource(loader, 'counts')
}

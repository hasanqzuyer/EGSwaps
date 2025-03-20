import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const userUseEGSmartRouterAtom = atomWithStorageWithErrorCatch<boolean>('pcs:useEGSmartRouter', true)

export function useEGSmartRouterByDefault() {
  return useAtom(userUseEGSmartRouterAtom)
}

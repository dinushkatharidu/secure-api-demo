import { afterEach, describe, expect, it } from 'vitest'
import{
    setToken,
    getToken,
    clearToken,
    isLoggedIn,
    setActiveRole,
    getActiveRole,
    hasRole
} from '../auth'

afterEach(()=>{
    localStorage.clear()
})

describe('auth store helpers',() =>{
    it('stores and reads token', ()=>{
        expect(getToken()).toBeNull()
        expect(isLoggedIn()).toBe(false)

        setToken('abc123')

        expect(getToken()).toBe('abc123')
        expect(isLoggedIn()).toBe(true)

        clearToken()

        expect(getToken()).toBeNull()
        expect(isLoggedIn()).toBe(false)
    })

    it('handles roles and hasRole()', ()=> {
        expect(getActiveRole()).toBe('USER')
        expect(hasRole('USER')).toBe(true)
        expect(hasRole('ADMIN')).toBe(false)

        setActiveRole('ADMIN')

        expect(getActiveRole()).toBe('ADMIN')
        expect(hasRole('ADMIN')).toBe(true)
        expect(hasRole(['USER', 'ADMIN'])).toBe(true)
        expect(hasRole(['USER'])).toBe(false)
    })
})
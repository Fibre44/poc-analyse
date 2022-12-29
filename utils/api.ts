/**
 * Représente une erreur envoyé par l'API
 */
export class ApiErrors {
    constructor(errors: string) {
        errors = errors
    }
}
/**
 * 
 * @param {string} endpoint 
 * @param {object} options 
 */
export async function apiFetch(endpoint: string, options: object) {
    const response = await fetch(endpoint, {
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        ...options
    })
    if (response.status === 204) {
        return null
    }
    const responseData = await response.json()
    if (response.ok) {
        return responseData
    } else {
        if (responseData.error) {
            throw new ApiErrors(responseData.error)
        }

    }
}
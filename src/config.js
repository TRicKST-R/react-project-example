const env = process.env.REACT_APP_ENVAR

export const API_ADDRESS_IMAGES = 
let authEnv = ''
let client_id = ''
let api_address = ''

if (env === 'uat2.') {
	authEnv = 'uat2'
	client_id = 
	api_address = 
} else if (env === 'svt1.') {
	authEnv = 'svt1'
	client_id = 
	api_address = 
} else {
	client_id = 
	api_address = 
	// api_address = 
}

// const redirect_path = (authEnv === 'svt1') ? '' : 'auth'
const redirect_path = ''
export const AUTH_ADDRESS = 

export const API_ADDRESS =

export const PUBLIC_API_ADDRESS = 

export const PUBLIC_API_KEY =
	env === 

export const docsKind = [
	{ description: 'Signature Image', name: 'SIGNATURE_IMAGE' },
	{ description: "Driver's License", name: 'DRIVERS_LICENSE' },
	{ description: 'Passport', name: 'PASSPORT' },
	{ description: 'Social Security Card', name: 'SSN_CARD' },
	{ description: 'Other Government-Issued ID', name: 'OTHER_GOVERNMENT_ID' },
	{ description: '407/3210 Affiliaton Letter', name: 'AFFLIATED_DOCUMENT' },
	{ description: 'Document', name: 'DOCUMENT' }
]

export const featureKind = [
	{ description: 'Share Code', name: 'SHARE_CODE' },
	{ description: 'GIFT SEARCH', name: 'GIFT_SEARCH' }
]

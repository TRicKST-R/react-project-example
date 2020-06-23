import { publicClient, client, s3FileUpload, clientUpload } from '../root/client'

const getChunk = async (query, variables) => {
	return new Promise((resolve, reject) => {
		client
			.query({
				query,
				variables
			})
			.then(({ loading, error, data }) => {
				if (error) {
					console.log(error)
					return reject()
				}
				resolve(data)
			})
	})
}

export const getPublicChunk = async (query, variables) => {
	return new Promise((resolve, reject) => {
		publicClient
			.query({
				query,
				variables
			})
			.then(({ loading, error, data }) => {
				if (error) {
					console.log(error)
					return reject()
				}
				resolve(data)
			})
	})
}

export const mutation = async (mutation, variables) => {
	return new Promise((resolve, reject) => {
		client
			.mutate({
				mutation,
				variables
			})
			.then(({ loading, error, data }) => {
				if (error) {
					console.log(error)
					return reject()
				}
				resolve(data)
			})
			.catch(err => resolve(err))
	})
}

export const mutationUpload = async (mutation, variables) => {
	return new Promise((resolve, reject) => {
		clientUpload
			.mutate({
				mutation,
				variables
			})
			.then(({ loading, error, data }) => {
				if (error) {
					console.log(error)
					return reject()
				}
				resolve(data)
			})
			.catch(err => resolve(err))
	})
}

export const s3Upload = s3FileUpload

export default getChunk

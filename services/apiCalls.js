import axios from 'axios';
import { print } from 'graphql';
import gql from 'graphql-tag';

import { getAccessToken } from './auth.js';

const accessToken = await getAccessToken();

const contentManagementUrl =
	'https://api.amplience.net/v2/content/content-repositories/6724d0603736886cda0324f2/content-items';

const assetManagementGraphQLUrl = 'https://api.amplience.net/graphql';

export const createBlogAPI = async (blogData) => {
	try {
		const response = await axios.post(contentManagementUrl, blogData, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});

		// console.log('Content Item Created:', response.data);
	} catch (error) {
		console.error(
			'Error Creating Content Item:',
			error.response?.data || error.message
		);
	}
};

export const createImageAPI = async (query) => {
	const QUERY = gql(query);
	const gqlRequest = await axios.post(
        assetManagementGraphQLUrl,
		{
			query: print(QUERY),
		},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);
	// console.log(gqlRequest.data.data);
	return gqlRequest.data.data.createAsset.id;
};

export const publishImageAssetAPI = async (query) => {
    // console.log('QUERY', query);
    const QUERY = gql(query);

	const gqlRequest = await axios.post(
		assetManagementGraphQLUrl,
		{
			query: print(QUERY),
		},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);
	// console.log("gqlRequest.data.data", gqlRequest.data.data.publishAsset.publishJobId);
	return gqlRequest.data
}

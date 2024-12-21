import axios from 'axios';
import { print } from 'graphql';
import gql from 'graphql-tag';
import { getAccessToken } from './auth.js';
import { writeLog } from '../utils/helpers.js';
import { DC_REPO_ID } from '../data/constants.js';

const accessToken = await getAccessToken();

const contentManagementUrl = `https://api.amplience.net/v2/content/content-repositories/${DC_REPO_ID}/content-items`;
const patchContentManagementUrl = `https://api.amplience.net/v2/content/content-items/`;

const assetManagementGraphQLUrl = 'https://api.amplience.net/graphql';

export const createBlogAPI = async (blogData) => {
	const blogMetaData = JSON.stringify(
		blogData?.body?._meta || 'No blog data',
		null,
		2
	);
	try {
		const response = await axios.post(contentManagementUrl, blogData, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		writeLog(`createBlogAPI: created \n${blogMetaData}`);
		return response.data
	} catch (error) {
		const errorData = JSON.stringify(
			error.response?.data || error.message,
			null,
			2
		);
		writeLog(
			`createBlogAPI: An error occurred:\nError: ${errorData}\nBlogData: ${blogMetaData}`
		);

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

	if (
		gqlRequest.data &&
		gqlRequest.data.data &&
		gqlRequest.data.data.createAsset &&
		gqlRequest.data.data.createAsset.id
	) {
		writeLog(`Image created:\nquery: ${query}`);
		return gqlRequest.data.data.createAsset.id;
	} else {
		writeLog(`createImageAPI: An error occurred:\nquery: ${query}`);
	}
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
	return gqlRequest.data;
};

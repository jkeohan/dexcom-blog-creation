// createRequire used to import meat.url
import { createRequire } from 'module';
import { getAccessToken } from './services/auth.js';
import { createBlogAPI, createImageAPI, publishImageAssetAPI } from './services/apiCalls.js';
import { formatBlogData } from './utils/formatBlogData.js';
import {
	buildCreateImageAssetQuery,
	buildPublishImageAssetQuery,
} from './services/queries.js';
import { extractBlogData, extractImageData } from './utils/data_extractors.js';
import { decodeGraphQLId } from './utils/helpers.js'

const require = createRequire(import.meta.url);
//  619 objects in the array, and 220 of them do not have an associated image
// import blogData from './all_blog_posts.json' assert { type: 'json' } didn't work hence the need for require
const blogData = require('./data/all_blog_posts.json');
const accessToken = await getAccessToken();

// replace repo id with a parameter to be passed via node params
const url =
	'https://api.amplience.net/v2/content/content-repositories/6724d0603736886cda0324f2/content-items';

const singleBlogData = blogData[4];

const createImage = async (image) => {
	const { src, alt, name, filename, mimeType } = extractImageData(
		image
	);
	const assetQuery = buildCreateImageAssetQuery(name, src, filename);
	const id = await createImageAPI(assetQuery);
	const buildPublishQuery = buildPublishImageAssetQuery(id);
	await publishImageAssetAPI(buildPublishQuery);
	return {
		id: decodeGraphQLId(id),
		name,
		mimeType,
	};
};

const createBlog = async (blog) => {
	const imageData = await createImage(blog.image);

	let blogDataJSON = extractBlogData(blog);
	blogDataJSON = { 
		...blogDataJSON,
		image: {...imageData}
	}
	// console.log('blogDataJSON', blogDataJSON);
	const blogData = formatBlogData(blogDataJSON);
	const response = await createBlogAPI(blogData);
};

createBlog(singleBlogData);
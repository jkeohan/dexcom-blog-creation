// createRequire used to import meat.url
import { createRequire } from 'module';
import {
	createBlogAPI,
	createImageAPI,
	publishImageAssetAPI,
} from './services/apiCalls.js';
import {
	buildCreateImageAssetQuery,
	buildPublishImageAssetQuery,
	buildCreateBlogQuery,
} from './services/queries.js';
import { extractBlogData, extractImageData } from './utils/dataExtractors.js';
import { decodeGraphQLId } from './utils/helpers.js';
import { IMAGE_DATA } from './data/constants.js';

const delay = 1000;
const require = createRequire(import.meta.url);
const blogData = require('./data/all_blog_posts.json');

// First 3 with images
// const blogDataArr = blogData.slice(0,3)

// Last 3 with no images
const blogDataArr = blogData.slice(blogData.length - 5, blogData.length - 2)

const createImage = async (image) => {
	if(image === undefined) return IMAGE_DATA
	console.log("*** createImage ***", image)
	const { src, alt, name, filename, mimeType } = extractImageData(image);
	console.log('*** image ***', { src, alt, name, filename, mimeType });
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
	const imageData = await createImage(blog.image)

	let blogDataJSON = extractBlogData(blog);
	blogDataJSON = {
		...blogDataJSON,
		image: { ...imageData },
	};
	// console.log('blogDataJSON', blogDataJSON);
	const blogDataObj = buildCreateBlogQuery(blogDataJSON);
	const response = await createBlogAPI(blogDataObj);
};

// createBlog(blogDataArr);

const runQueue = async () => {
	if (blogDataArr.length) {
		const blog = blogDataArr.pop();
		const response = await createBlog(blog);

		setTimeout(() => {
			runQueue();
		}, delay);
	}
};

runQueue();

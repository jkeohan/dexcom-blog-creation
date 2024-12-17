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
const blogDataArr = require('./data/all_blog_posts.json');

const createImage = async (image) => {
	if (image === undefined || (image.src && image.src.includes('.webp'))) {
		return IMAGE_DATA;
	}
	const { src, alt, name, filename, mimeType } = extractImageData(image);

	const assetQuery = buildCreateImageAssetQuery(src, name, filename);
	const id = await createImageAPI(assetQuery);
	const buildPublishQuery = buildPublishImageAssetQuery(id);
	await publishImageAssetAPI(buildPublishQuery);
	return {
		id: decodeGraphQLId(id),
		name,
		mimeType,
		alt,
	};
};

const createBlog = async (blog) => {
	const imageData = await createImage(blog.image);

	let blogDataJSON = extractBlogData(blog);
	blogDataJSON = {
		...blogDataJSON,
		image: { ...imageData },
	};
	const blogDataObj = buildCreateBlogQuery(blogDataJSON);
	const response = await createBlogAPI(blogDataObj);
};

const runQueue = async () => {
	if (blogDataArr.length) {
		const blog = blogDataArr.pop();
		const response = await createBlog(blog);

		setTimeout(() => {
			runQueue();
		}, delay);
	} else {
		console.timeEnd('Create Blogs');
	}
};

console.time('Create Blogs');
runQueue();

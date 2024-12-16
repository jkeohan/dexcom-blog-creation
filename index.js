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

// First blog
const blogDataArr = blogData.slice(0,1)

// First 3 with images
// const blogDataArr = blogData.slice(0,3)

// Last blog with no image 
// const blogDataArr = blogData[blogData.length - 2]

// Last 3 with no images
// const blogDataArr = blogData.slice(blogData.length - 5, blogData.length - 2)

const createImage = async (image) => {
	if(image === undefined) return IMAGE_DATA
	// console.log("*** image ***", image)
	const { src, alt, name, filename, mimeType } = extractImageData(image);
	// console.log('*** image data extracted ***', { src, alt, name, filename, mimeType });
	const assetQuery = buildCreateImageAssetQuery(src, name, filename);
	const id = await createImageAPI(assetQuery);
	const buildPublishQuery = buildPublishImageAssetQuery(id);
	await publishImageAssetAPI(buildPublishQuery);
	return {
		id: decodeGraphQLId(id),
		name,
		mimeType,
		alt
	};
};

const createBlog = async (blog) => {
	const imageData = await createImage(blog.image)

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
	}
};

runQueue();

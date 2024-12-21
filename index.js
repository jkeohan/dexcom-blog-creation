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
import { formatToFourDigits } from './utils/helpers.js';
import { extractBlogData, extractImageData } from './utils/dataExtractors.js';
import { decodeGraphQLId } from './utils/helpers.js';
import { IMAGE_DATA } from './data/joe_constants.js';

const delay = 750;
const require = createRequire(import.meta.url);
const blogData = require('./data/all_blog_posts.json');

const blogDataArr = blogData.slice(2,4);
const blogDataArrLength = blogDataArr.length;

const createImage = async (image) => {
	if (image === undefined) {
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

const createBlog = async (blog, indexPos) => {
	const imageData = await createImage(blog.image);
	// console.log("createBlog - indexPos: " + indexPos)
	let blogDataJSON = extractBlogData(blog);
	blogDataJSON = {
		...blogDataJSON,
		image: { ...imageData },
		indexPos,
	};

	const blogDataObj = buildCreateBlogQuery(blogDataJSON);
	// console.log('blogDataObj', blogDataObj);
	// console.dir(blogDataObj, {
	// 	maxArrayLength: null,
	// });
	await createBlogAPI(blogDataObj);
};

const runQueue = async () => {
	if (blogDataArr.length) {
		const indexPos = formatToFourDigits(
			Math.abs(blogDataArr.length - blogDataArrLength)
		);

		const blog = blogDataArr.pop();
		await createBlog(blog, indexPos);

		setTimeout(() => {
			runQueue();
		}, delay);
	} else {
		console.timeEnd('Create Blogs');
	}
};

console.time('Create Blogs');
runQueue();

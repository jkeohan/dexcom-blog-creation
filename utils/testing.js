import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { getAccessToken } from '../services/auth.js';
const blogData = require('../data/all_blog_posts.json');
console.log("*** blogData.length ****", blogData.length);

////////////////////////////////////////////////////////////////
// This sill generate a new image filename by combining the image alt value and its image extension, which is extracted from the url
export const generateAltFilename = (src, alt) => {
	// Extract the image file type from the src URL
	const fileTypeMatch = src.match(/\.([a-zA-Z0-9]+)\?v=/);
	const fileType = fileTypeMatch ? fileTypeMatch[1] : '';

	// Replace spaces with dashes, collapse multiple dashes, and trim leading/trailing dashes
	const sanitizedAltText = alt
		.trim()
		.replace(/\s+/g, '-') // Replace spaces with dashes
		.replace(/-+/g, '-') // Replace multiple consecutive dashes with a single dash
		.replace(/^-|-$/g, ''); // Trim leading and trailing dashes

	// Append the image file type
	return `${sanitizedAltText}.${fileType}`;
};

console.log(
	generateAltFilename(
		'https://cdn.shopify.com/s/files/1/1488/7742/articles/blog-feature_people-ops-women-leadership_1440x765_May22.jpg?v=1652372995',
		'Ozempic Side Effects - GLP-1 Side Effects - Wegovy Side Effects - Weight Loss Drugs - One Drop'
	)
);
// output: Ozempic-Side-Effects-GLP-1-Side-Effects-Wegovy-Side-Effects-Weight-Loss-Drugs-One-Drop.jpg
////////////////////////////////////////////////////////////////

// Not being used
export const encodeGraphQLId = (type, id) => {
	const encodedString = Buffer.from(`${type}:${id}`, 'utf-8').toString(
		'base64'
	);
	return encodedString;
};

////////////////////////////////////////////////////////////////////////

// This will replace existing Unicode characters with their corresponding HTML opening/closing tags
function replaceUnicodeWithTags(input) {
	return input.text
		.replace(/\\u003C/g, '<') // Replace \u003C with <
		.replace(/\\u003E/g, '>'); // Replace \u003E with >
}
////////////////////////////////////////////////////////////////

const data = {
	text: '\u003Cp\u003EGet education and support from your personal diabetes coach anytime, anywhere! All One Drop coaches are Certified Diabetes Educators, available to help you reach all your health goals.\u003C/p\u003E\n\u003Cp\u003E \u003C/p\u003E\n\u003Cp\u003E\u003Cimg src="//cdn.shopify.com/s/files/1/1310/0437/files/ADA_badge_74399271-08f0-4a26-b8b2-003bb03c604d.png?v=1549398495" alt="American Diabetes Association Logo"\u003E\u003C/p\u003E\n\u003Cp\u003E\u003Cbr\u003E\u003Cstrong\u003EHow do I sign up for One Drop Coaching?\u003C/strong\u003E\u003Cbr\u003E\u003Cbr\u003EOne Drop Coaching is included in any \u003Ca href="https://onedrop.today/products/test-strips" target="_blank" title="Test Strip Subscription" rel="noopener noreferrer"\u003Etest strip subscription\u003C/a\u003E or \u003Ca href="https://onedrop.today/products/diabetes-package" target="_blank" title="Diabetes Packages" rel="noopener noreferrer"\u003Ediabetes package\u003C/a\u003E.\u003Cbr\u003E\u003Cbr\u003EOnly interested in coaching? \u003Ca href="https://onedrop.today/collections/coaching-programs" title="Coaching Stand-Alone Programs " target="_blank" rel="noopener noreferrer"\u003EClick here\u003C/a\u003E to explore our stand-alone programs.\u003C/p\u003E',
};

const result = replaceUnicodeWithTags(data);
// console.log('results', result);
////////////////////////////////////////////////////////////////////////
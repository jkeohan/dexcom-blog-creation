import {
	sanitizeInput,
	generateAltFilename,
	extractSrcImageDetails,
} from './helpers.js';
export const extractBlogData = ({ title: name, body_html: body, handle, image }) => {
	const data = {
		name,
		label: name,
		body
	};
	// console.log('data', data);
	return data;
};

export const extractImageData = ({ src, alt }) => {
	const {name, filename, mimeType} = extractSrcImageDetails(src);
	const data = {
		src,
		alt,
		name,
		filename,
		mimeType
        // alt: sanitizeInput(alt),
        // fileName: extractSrcImageFileNameWithImageType((src)),
		// name: sanitizeInput(alt),
		// fileName: extractSrcImageFilename((src)),
	};
	return data;
};

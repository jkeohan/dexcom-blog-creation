import { READING_TIME } from '../data/constants.js';

export const extractReadingTime = (text) => {
	const regex = /Read time: (\d+) minutes/; // Regular expression with a capturing group
	const match = regex.exec(text); // Executes the regex on the text and returns the match
	if (match) {
		const readTime = parseInt(match[1], 10); // Store the captured value (the number)
		return readTime;
	}
	return READING_TIME; // Return 0 if no match is found
};

export const extractBlogData = ({ title: name, body_html: body }) => {
	const data = {
		name,
		label: name,
		body,
		readingTime: extractReadingTime(body),
	};
	return data;
};
export const extractSrcImageDetails = (url) => {
	const match = url.match(/\/articles\/([^?]+)/); // Extract the filename including extension
	if (match) {
		const filenameWithType = match[1]; // Full filename with extension
		const filenameWithoutType = filenameWithType.replace(/\.[^.]+$/, ''); // Remove extension
		const extensionMatch = filenameWithType.match(/\.[^.]+$/); // Extract the extension
		const mimeType = extensionMatch
			? `image/${extensionMatch[0].slice(1)}`
			: 'image/unknown'; // Format mimeType

		return {
			name: filenameWithoutType, // Filename without the extension
			filename: filenameWithType, // Full filename with extension
			mimeType, // MIME type based on the extension
		};
	}
	// Fallback object when no match
	return {
		name: 'default',
		filename: 'default.png',
		mimeType: 'image/unknown',
	};
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

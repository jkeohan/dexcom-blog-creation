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
		let filenameWithType = match[1]; // Full filename with extension

		// Remove specific patterns
		filenameWithType = filenameWithType
			.replace(/^[\d-]+_?/, '') // Remove numbers or patterns at the beginning of the filename
			.replace(/_\d+x\d+/g, '') // Remove resolution patterns like _1440x765
			.replace(/(\b|\D)1440x(\b|\D)/g, '') // Explicitly remove 1440x when standalone
			.replace(/x\d+/g, '') // Remove residual patterns like x765
			.replace(/_[a-f0-9\-]{36}/g, '') // Remove UUIDs like "8e1825f-aa7e-496a-9674-ec9e90e0e742"
			.replace(/_\d{14}-\d{4}/g, '') // Remove timestamps like "20231002135029-1023"
			.replace(/__+/g, '_') // Replace multiple underscores with a single underscore
			.replace(/_$/, ''); // Remove trailing underscore if present

		// Prepend "Stelo_imported_blog_" to the filename
		filenameWithType = `Stelo_imported_blog_${filenameWithType}`.replace(
			/__+/g,
			'_'
		); // Ensure no double underscores after prepend

		const filenameWithoutType = filenameWithType
			.replace(/\.[^.]+$/, '') // Remove extension
			.replace(/\./g, ''); // Remove any dots in the filenameWithoutType
			
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
	const { name, filename, mimeType } = extractSrcImageDetails(src);
	const data = {
		src,
		alt: alt || name,
		name,
		filename,
		mimeType,
	};
	return data;
};

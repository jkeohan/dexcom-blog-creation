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

// Example usage
// console.log(
// 	extractSrcImageDetails(
// 		'https://cdn.shopify.com/s/files/1/1488/7742/articles/blog-feature_people-ops-women-leadership_1440x765_May22.jpg?v=1652372995'
// 	)
// );

export const sanitizeInput = (input) => {
	return (
		input
			.replace(/\s*-\s*/g, '-') // Remove spaces around dashes
			// .replace(/-+(\s*-+)*-+/g, '-') // Replace multiple consecutive dashes with a single dash
			.replace(/-jpg$/, '.png') // Replace trailing dash before 'jpg' with a dot
			.replace(/\s+/g, '-')
	); // Replace any remaining spaces with a single dash
	// .replace(/^-|-$/g, ''); // Trim leading and trailing dashes if present
};

// Example usage
// const sanitizedFilename = sanitizeInput(
// 	'Ozempic Side Effects - GLP-1 Side Effects - Wegovy Side Effects - Weight Loss Drugs - One Drop.jpg'
// );
// console.log(sanitizedFilename);

export const generateAltFilename = (srcUrl, altText) => {
	// Extract the image file type from the src URL
	const fileTypeMatch = srcUrl.match(/\.([a-zA-Z0-9]+)\?v=/);
	const fileType = fileTypeMatch ? fileTypeMatch[1] : '';

	// Replace spaces with dashes, collapse multiple dashes, and trim leading/trailing dashes
	const sanitizedAltText = altText
		.trim()
		.replace(/\s+/g, '-') // Replace spaces with dashes
		.replace(/-+/g, '-') // Replace multiple consecutive dashes with a single dash
		.replace(/^-|-$/g, ''); // Trim leading and trailing dashes

	// Append the image file type
	return `${sanitizedAltText}.${fileType}`;
};

// console.log(
// 	generateAltFilename(
// 		'https://cdn.shopify.com/s/files/1/1488/7742/articles/blog-feature_people-ops-women-leadership_1440x765_May22.jpg?v=1652372995'
// 	)
// );

export const decodeGraphQLId = (encodedId) => {
	const decodedString = Buffer.from(encodedId, 'base64').toString('utf-8');
	return decodedString.split(':')[1];
};

console.log("decodeGraphQLId",
	decodeGraphQLId('QXNzZXQ6ZmFkYzAwMDMtMjliNi00N2UxLWE2ODEtMWM3ZGJmNmE0MDI4')
);

export const encodeGraphQLId = (type, id) => {
	const encodedString = Buffer.from(`${type}:${id}`, 'utf-8').toString(
		'base64'
	);
	return encodedString;
};

// Example usage
// const type = 'Asset';
// const id = '8d58a689-01d4-492c-a546-014cdb261834';
// const encodedId = encodeGraphQLId(type, id);
// console.log("encodeGraphQLId", encodedId);


// export const extractSrcImageFileNameWithImageType = (url) => {
// 	const match = url.match(/\/articles\/([^?]+)/);
// 	return match ? match[1] : 'default.png'; // Fallback to 'default.png' if not found
// };

// console.log(
// 	extractSrcImageFileNameWithImageType(
// 		'https://cdn.shopify.com/s/files/1/1488/7742/articles/blog-feature_people-ops-women-leadership_1440x765_May22.jpg?v=1652372995'
// 	)
// );

// const extractSrcImageFilenameWithoutImageType = (url) => {
// 	const match = url.match(/\/articles\/([^?]+)/); // Extract the filename including extension
// 	if (match) {
// 		const filename = match[1];
// 		// Remove the file extension by splitting at the last dot
// 		return filename.replace(/\.[^.]+$/, ''); // Removes the last dot and everything after it
// 	}
// 	return 'default'; // Fallback to 'default' if not found
// };

// console.log(
// 	extractSrcImageFilenameWithoutImageType(
// 		'https://cdn.shopify.com/s/files/1/1488/7742/articles/blog-feature_people-ops-women-leadership_1440x765_May22.jpg?v=1652372995'
// 	)
// );

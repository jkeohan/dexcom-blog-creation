// Removes spaces before/after dashes from the image's alt value
export const sanitizeAltText = (input) => {
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
// console.log(sanitizeAltText(
// 	'Ozempic Side Effects - GLP-1 Side Effects - Wegovy Side Effects - Weight Loss Drugs - One Drop.jpg'
// ));
// Output: Ozempic-Side-Effects-GLP-1-Side-Effects-Wegovy-Side-Effects-Weight-Loss-Drugs-One-Drop.jpg


// Decodes base64 GraphQL ID to utf-8 DAM id 
// Used in index > createImage
export const decodeGraphQLId = (encodedId) => {
	const decodedString = Buffer.from(encodedId, 'base64').toString('utf-8');
	return decodedString.split(':')[1];
};

// console.log("decodeGraphQLId",
// 	decodeGraphQLId('QXNzZXRSZXBvc2l0b3J5OjZiMjU0ZDMxLTE1MjEtNDlkYS04MDNmLTA3N2U4NTRmNDQ4MA==')
// );
// Output: da314341-0eec-4a33-824e-0f518fdebf36

////////////////////////////////////////////////////////////////////////////

// Extracts the image file name and extension from url
// Used in dataExtractors
export const extractSrcImageFileNameWithImageType = (url) => {
	const match = url.match(/\/articles\/([^?]+)/);
	return match ? match[1] : 'default.png'; // Fallback to 'default.png' if not found
};

// console.log(
// 	extractSrcImageFileNameWithImageType(
// 		'https://cdn.shopify.com/s/files/1/1488/7742/articles/blog-feature_people-ops-women-leadership_1440x765_May22.jpg?v=1652372995'
// 	)
// );
// Output: blog-feature_people-ops-women-leadership_1440x765_May22.jpg

////////////////////////////////////////////////////////////////////////////
// Extracts the image file name without image extension from url
// Not being used 
const extractSrcImageFilenameWithoutImageType = (url) => {
	const match = url.match(/\/articles\/([^?]+)/); // Extract the filename including extension
	if (match) {
		const filename = match[1];
		// Remove the file extension by splitting at the last dot
		return filename.replace(/\.[^.]+$/, ''); // Removes the last dot and everything after it
	}
	return 'default'; // Fallback to 'default' if not found
};

// console.log(
// 	extractSrcImageFilenameWithoutImageType(
// 		'https://cdn.shopify.com/s/files/1/1488/7742/articles/blog-feature_people-ops-women-leadership_1440x765_May22.jpg?v=1652372995'
// 	)
// );
// Output: blog-feature_people-ops-women-leadership_1440x765_May22

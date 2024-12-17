// UPDATE CLIENT_ID AND CLIENT_SECRET
export const CLIENT_ID = '';
export const CLIENT_SECRET = '';

// USED FOR CREATING BLOG CONTENT ITEM
// Replace with your Content Hub name (Settings > Properties)
export const ENDPOINT = 'jkeohandemo';
// Replace with your Content Repo Folder ID.  Used with the Content Management REST API
export const CONTENT_MANAGEMENT_REPO_ID = '6724d0603736886cda0324f2';

// USED FOR CREATING IMAGE ASSETS
// Replace with your DAM AssetRepository and AssetFolder IDs.  Used when creating image assets
export const ASSET_REPOSITORY_ID =
	'QXNzZXRSZXBvc2l0b3J5OjA5NzQ1NDk4LWMxYTAtNGUyZS1iZDlkLTQ4MzA1ZmM1ZDZhYQ==';
export const ASSET_FOLDER_ID =
	'QXNzZXRGb2xkZXI6NTJiOTYzODUtOGY0OS00OGJiLWFiOGYtZjRjYzYzOGRiMjI3';
export const BLOG_LANDING_PAGE = {
	id: '3c09a146-a14a-4988-bbc3-a2413df467d5',
	contentType: 'https://dexcom.com/content/blog-landing',
	_meta: {
		schema:
			'http://bigcontent.io/cms/schema/v1/core#/definitions/content-reference',
	},
};
export const CATEGORY = {
	id: 'e418d6e1-f72b-45ab-a2f7-31891413370e',
	contentType: 'https://dexcom.com/hierarchy/blog-category',
	_meta: {
		schema: 'http://bigcontent.io/cms/schema/v1/core#/definitions/content-link',
	},
};
export const IMAGE_DATA = {
	id: 'da314341-0eec-4a33-824e-0f518fdebf36',
	name: 'global-g7-sensor-couple-running',
	mimeType: 'image/jpeg',
	alt: 'Global G7 Sensor Couple Running',
};
export const READING_TIME = 0;
export const SEARCH_INDEX =
	'Frontierprod.production-blog_sort-publishdate-desc';

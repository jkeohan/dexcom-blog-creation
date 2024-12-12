import { BLOG_LANDING_PAGE, SEARCH_INDEX, CATEGORY} from "../data/constants.js"

export const buildCreateImageAssetQuery = (name, src, fileName) => {
	console.log('**** buildCreateAssetQuery ****', name, fileName, src);
	let ql = `mutation {	
				createAsset(
					input: {
						name: "${name}"
						type: IMAGE
						filename: "${fileName}"
						src: "${src}"
						assetRepositoryId: "QXNzZXRSZXBvc2l0b3J5OjA5NzQ1NDk4LWMxYTAtNGUyZS1iZDlkLTQ4MzA1ZmM1ZDZhYQ=="

					}
				) {
           			 id
        		  }
			}`;
	return ql;
};

export const buildPublishImageAssetQuery = (assetId) => {
	let ql = `mutation {	
    			publishAsset(
       				 input: {
            			id:  "${assetId}"
        			}
				) {
         			publishJobId
      				}
		}`;
	return ql;
}

export const buildCreateBlogQuery = ({ name, label, body, image, readingTime }) => {
	return {
		body: {
			_meta: {
				name,
				schema: 'https://dexcom.com/content/blog-article',
			},
			blogSearchable: true,
			cardDisplay: 'image',
			blogLanding: BLOG_LANDING_PAGE ,
			category: CATEGORY,
			image: {
				diImage: {
					crop: [0, 0, 0, 0],
					rot: 0,
					hue: 0,
					sat: 0,
					bri: 0,
					fliph: false,
					flipv: false,
					poi: {
						x: -1,
						y: -1,
					},
					aspectLock: 'clear',
					image: {
						_meta: {
							schema:
								'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link',
						},
						id: image.id,
						name: image.name,
						endpoint: 'jkeohandemo',
						defaultHost: 'cdn.media.amplience.net',
						mimeType: image.mimeType,
					},
				},
				guide: 'Image Transformation Tool',
				isStatic: false,
			},
			schemaOrgType: 'Article',
			searchIndex: SEARCH_INDEX,
			searchType: 'Blog',
			searchable: false,
			readingTime,
			sections: [
				{
					textBlock: {
						slate: {
							heading: [
								{
									type: 'h2',
									children: [
										{
											text: 'Test Article Heading 2',
											textStyle: 'h2',
										},
									],
								},
							],
							body: [
								{
									type: 'paragraph',
									children: [
										{
											text: body,
											textStyle: 'b1',
										},
									],
								},
							],
						},
					},
				},
			],
		},
		label,
		folderId: null,
		locale: 'en-US',
	};
};

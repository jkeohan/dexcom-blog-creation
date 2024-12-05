export const formatBlogData = ({ name, label, body, image }) => {
	console.log('formatBlogData', name, label, body, image);
	return {
		body: {
			_meta: {
				name,
				schema: 'https://dexcom.com/content/blog-article',
			},
			blogSearchable: true,
			cardDisplay: 'image',
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
			searchIndex: 'dexcom.production-blog_sort-publishdate-desc',
			searchType: 'Blog',
			searchable: false,
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

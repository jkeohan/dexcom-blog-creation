# ONE DROP BLOG ARTICLE MIGRATION

Creating 616 blog entries took about 18:57.746

This app will do the following:

1. Look through the all_blog_posts.json file
2. Using the GraphQL Asset Management API it creates image assets and place in Assets > Blogs > Stelo_imported.
3. Using the GraphQL Asset Management API it publishes the associated image asset or use the default provided
4. Using the Content Management REST API it creates the blog with all required fields, including the above image and place in Content folder of destination hub
5. Log file captures all image/blog creation and errors

## Requirements

1. Update auth.js with the appropriate CLIENT_ID and CLIENT_SECRET keys.
2. Update IMAGE_DATA in constants.js with the appropriate image to reference from the your DAM.
3. In constants.js update the following constants:
   - ENDPOINT (DAM ID)
   - CONTENT_MANAGEMENT_REPO_ID 
   - ASSET_REPOSITORY_ID
   - ASSET_FOLDER_ID
   - CATEGORY ID
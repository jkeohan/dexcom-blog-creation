# ONE DROP BLOG ARTICLE MIGRATION

Creating 616 blog entries took about 18:57.746

This app will do the following:

1. Look through the all_blog_posts.json file
2. Using the GraphQL Asset Management API it creates image assets and place in Assets > Blogs > Stelo_imported.
3. Using the GraphQL Asset Management API it publishes the associated image asset or use the default provided
4. Using the Content Management REST API it creates the blog with all required fields, including the above image and place in Content folder of destination hub
5. Log file captures all image/blog creation and errors

## Instructions

1. Download or clone this repo
2. Install dependencies 
3. Update Constants
4. Run index.js

## Requirements

1. Update auth.js with the appropriate CLIENT_ID and CLIENT_SECRET keys.
2. Update IMAGE_DATA in constants.js with the appropriate image to reference from the your DAM.
3. In constants.js update the following constants:
   - CLIENT_ID and CLIENT_SECRET
   - CONTENT_MANAGEMENT_REPO_ID (Content Hub: Content Repo Folder ID)
   - ENDPOINT (DAM ID)
   - ASSET_REPOSITORY_ID (DAM: Specific Asset Repo ID)
   - ASSET_FOLDER_ID (DAM: Specific Child Folder ID)

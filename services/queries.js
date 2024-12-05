export const buildCreateImageAssetQuery = (name, src, fileName) => {
	console.log('buildCreateAssetQuery', name, src);
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

export const buildAssetQuery = (assetId) => {
	console.log('buildAssetQuery', assetId);
	let ql = `query getAssetQuery {	
				assets(
					 id: ["${assetId}"]
				) }  
					edges {
						node {
							id
							assetId
							label
							createdDate
							mimeType
	    	 			}
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

const AWS=require('aws-sdk');
const BUCKET_NAME=process.env.BUCKET_NAME;
const IAM_USER_KEY=process.env.AWS_ACCESS_KEY_ID;
const IAM_USER_SECRET=process.env.AWS_SECRET_ACCESS_KEY;

const s3Bucket=new AWS.S3({
    accessKeyId:IAM_USER_KEY,
    secretAccessKey:IAM_USER_SECRET,
});

const uploadToS3=async function (data,filename){
    try{
        const params={
            Bucket:BUCKET_NAME,
            Key:filename,
            Body:data,
            ACL:'public-read',
        }
        return new Promise((resolve,reject)=>{
            s3Bucket.upload(params,async(err,response)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(response.Location);
                }
            });
        });
    }
    catch(error){
        throw error;
    }
    
}

module.exports={uploadToS3,};
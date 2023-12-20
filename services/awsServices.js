// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
// const bucketName = process.env.BUCKET_NAME;
// const s3Client = new S3Client({
  
//   credentials: {
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey,
//   },
//   region: "ap-south-1",
// });


// exports.uploadToS3 = async (image, filename) => {
//     try {
//         const uploadParams = {
//             Bucket: bucketName,
//             Key: filename,
//             Body: image,
//             ACL: "public-read",
//             ContentType: "image/jpeg",
//           };
//           const data = await s3Client.send(new PutObjectCommand(uploadParams));
//           const publicUrl = `https://${uploadParams.Bucket}.s3.ap-south-1.amazonaws.com/${uploadParams.Key}`;
//           return publicUrl;
          
//     } catch (error) {
//         console.error('Error uploading file to S3:', error);
//         throw error;
//     }
// }

const AWS=require('aws-sdk');

const uploadToS3=async function (data,filename){
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.AWS_ACCESS_KEY_ID;
    const IAM_USER_SECRET=process.env.AWS_SECRET_ACCESS_KEY;

    const s3Bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
    });

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
    })
}

module.exports={uploadToS3,}
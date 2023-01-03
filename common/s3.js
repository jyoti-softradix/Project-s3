const AWS = require("aws-sdk");
const fs = require('fs');
// const multer= require('multer')
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};
const s3 = new AWS.S3(awsConfig);

const uploadFileToAWS = async (params) => new Promise((resolve, reject) => {
  s3.upload(params, (err, response) => {
    if (err) {
      // console.log(err);
      reject(err);
    } else {
      resolve(response);
    }
  });
}); 

async function uploadFiles(req, res) {
  const { files, body } = req;
  const type = body.type;
  try {
    const uploadedFiles = [];
    for (const ele of files) {
      const data = fs.readFileSync(ele.path);
      fs.unlinkSync(ele.path);
      const params = {
        Bucket: type && typeof (type) === 'string' ? `${process.env.AWS_BUCKET}/${type}` : type && type.length > 0 ? `${process.env.AWS_BUCKET}/${type[0]}` : process.env.AWS_BUCKET,
        Key: `${Date.now()}-assets.${(ele.originalname).split(".").pop()}`,
        Body: data,
        contentType: ele.mimetype,
        ACL: "public-read",
      };
      // console.log("params :", params)
      // eslint-disable-next-line no-await-in-loop
      const result = await uploadFileToAWS(params);
      ele.location = result.Location;
      ele.key = result.Key;
    }
    if (files) {
      if (files.length > 0) {
        files.forEach((file) => {
          const upload = {
            path: file.location,
            type: file.mimetype,
            name: file.originalname,
            file_key: file.key,
          };
          uploadedFiles.push(upload);
        });
      }
    }
    res.status(200).send({success: true, msg: "Image uploaded successfully", data: uploadedFiles});
    } catch (e) {
      console.log(e.message)
      res.status(500).send({ message: e.message });
    }
}

module.exports = { uploadFiles }

// let upload = multer({
//   // storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: function (req, file, done) {
//     if (
//       file.mimetype === "image/jpeg" ||
//       file.mimetype === "image/png" ||
//       file.mimetype === "image/jpg" ||
//       file.mimetype === "image/gif"
//     ) {
//       done(null, true);
//     } else {
//       //prevent the upload
//       let newError = new Error("File type is incorrect");
//       newError.name = "MulterError";
//       done(newError, false);
//     }
//   },
// });
// const uploadFileToAWS = (fileData) => {
//   return new Promise((resolve, reject) => {
//     const params = {
//       Bucket: process.env.AWS_BUCKET,
//       Key: `${Date.now().toString()}.jpg`,
//       Body: fileData,
//     };
//     s3.upload(params, (err, data) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       console.log(data);
//       return resolve(data);
//     });
//   });
// };

// module.exports = { upload, uploadFileToAWS };



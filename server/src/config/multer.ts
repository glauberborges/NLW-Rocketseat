import multer from 'multer';
import path from "path";
import crypto from "crypto";

export default {
    storage : multer.diskStorage({
        destination :   path.resolve(__dirname, '..', '..', 'uploads' ),

        filename: function (request, file, callback) {
            const hash =  crypto.randomBytes(6).toString('hex')

            callback(null, hash + '-' +file.originalname )
        }
    })

};



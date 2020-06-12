import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

/*This function takes each file received and change
its name for some hash code plus the original name*/
export default {
	storage: multer.diskStorage({
		destination: path.resolve(__dirname, '..', '..', 'uploads'),
		filename(req, file, callback){
			const hash = crypto.randomBytes(6).toString('hex');

			const fileName = `${hash}-${file.originalname}`;

			callback(null, fileName);
		}
	})
}
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

const dest = path.resolve(__dirname, '..', '..', 'tmp', 'uploads')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"))
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err);
      const fileName = `${hash.toString('hex')}-${file.originalname}`;
      cb(null, fileName)
    })
  },
})
const limits = {
  fileSize: 2 * 1024 * 1024
}
const fileFilter = (req, file, cb) => {
  const allowedMines = [
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/gif'
  ];

  if(allowedMines.includes(file.mimetype)){
    cb(null, true)
  }else{
    cb(new Error("Invalid file type."))
  }

}

export default {
  dest,
  storage,
  limits,
  fileFilter,
}

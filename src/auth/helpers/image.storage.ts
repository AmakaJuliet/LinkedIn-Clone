import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

const fs = require('fs');
import FileType from 'file-type';
import FromFile from 'file-type';
import * as nodeFetch from "node-fetch"

import path = require('path');
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators'

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png' ,'jpg' ,'jpeg'];
const validMimeTypes: validMimeType[] = [
    'image/png',
    'image/jpg',
    'image/jpeg',
];

export const saveImageToStorage = {
    storage: diskStorage({
      destination: './images',
      filename: (req, file, cb) => {
        const fileExtension: string = path.extname(file.originalname);
        const fileName: string = uuidv4() + fileExtension; 
        cb(null, fileName)
      }
    }),
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes: validMimeType[] = validMimeTypes;
      allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
    }
}

export const isFileExtensionSafe = (fullFilePath: string): Observable<boolean> => {
  return from(FileType.fromFile(fullFilePath)).pipe(
    switchMap((fileExtensionAndMimeType: { ext: validFileExtension; mime: validMimeType;}) => {
      if(!fileExtensionAndMimeType) return of(false)
    })
  )
}
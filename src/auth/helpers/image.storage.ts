import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
<<<<<<< HEAD

import fs from 'fs';
import FileType from 'file-type';
import { fileTypeFromFile } from 'file-type';
import * as nodeFetch from "node-fetch"

import path = require('path');
=======
import FileType, { FileExtension, MimeType } from 'file-type';
>>>>>>> e79a3506cb7518efa0985b565018ec1a108f1e1a
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import path from 'path';
import fs from 'fs';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] | FileExtension[] = [
  'png',
  'jpg',
  'jpeg',
];
const validMimeTypes: validMimeType[] | MimeType[] = [
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
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

// export const isFileExtensionSafe_old = (
//   fullFilePath: string,
// ): Observable<boolean> => {
//   return from(FileType.fileTypeFromFile(fullFilePath)).pipe(
//     switchMap(
//       (fileExtensionAndMimeType: {
//         ext: validFileExtension;
//         mime: validMimeType;
//       }) => {
//         if (!fileExtensionAndMimeType) return of(false);

//         const isFileTypeLegit = validFileExtensions.includes(
//           fileExtensionAndMimeType.ext,
//         );
//         const isMimeTypeLegit = validMimeTypes.includes(
//           fileExtensionAndMimeType.mime,
//         );
//         const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
//         return of(isFileLegit);
//       },
//     ),
//   );
// };

export const isFileExtensionSafe = (
  fullFilePath: string,
): Observable<boolean> => {
  return from(FileType.fileTypeFromFile(fullFilePath)).pipe(
    switchMap((fileExtensionAndMimeType) => {
      if (!fileExtensionAndMimeType) return of(false);

      const isFileTypeLegit = validFileExtensions.includes(
        fileExtensionAndMimeType.ext as validFileExtension,
      );
      const isMimeTypeLegit = validMimeTypes.includes(
        fileExtensionAndMimeType.mime as validMimeType,
      );
      const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
      return of(isFileLegit);
    }),
  );
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (err) {
    console.error(err);
  }
};

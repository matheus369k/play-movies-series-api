/** biome-ignore-all lint/performance/useTopLevelRegex: necessary */
import path from 'node:path'
import multer from 'fastify-multer'
import { BadRequestError } from './error'
import { existsSync, renameSync } from 'node:fs'

export class UploadMiddleware {
  private readonly filesExtensionRegex = /(jpg|jpeg|png|webp)$/i
  private readonly maxSizeOfImage = 5_240_880
  private readonly rootUpload = 'public/uploads/'

  uploads = multer({
    storage: multer.diskStorage({
      destination: this.rootUpload,
      filename: (req, file, cb) => {
        const fileName = req.user.id + path.extname(file.originalname)
        const baseDirRootPath = path
          .dirname(__dirname)
          .replace('src', this.rootUpload)
        const filePath = baseDirRootPath.concat(fileName)
        const backupFilePath = baseDirRootPath.concat(`backup-${fileName}`)

        if (!existsSync(filePath)) {
          cb(null, fileName)
          return
        }

        renameSync(filePath, backupFilePath)
        cb(null, `${fileName}`)

        setTimeout(() => {
          if (!existsSync(fileName)) {
            renameSync(backupFilePath, filePath)
          }
        }, 2000)
      },
    }),
    limits: {
      fileSize: this.maxSizeOfImage,
    },
    fileFilter: (_, file, cb) => {
      const isNotTypeValidationFile = !this.filesExtensionRegex.test(
        file.mimetype.split('/')[1]
      )

      if (isNotTypeValidationFile) {
        cb(new BadRequestError('type of image not supported'), false)
      }

      cb(null, true)
    },
  })
}

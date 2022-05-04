import { Controller, HttpCode, HttpStatus, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Auth } from 'src/auth/decorators'
import { FileService } from './file.service'

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth('admin')
  @UseInterceptors(FileInterceptor('image'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    return this.fileService.saveFiles([file], folder)
  }
}

import { Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@ApiTags('Storage')
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/storage')
@UseInterceptors(GeneralInterceptor)
export class StorageController {

    constructor(
        private readonly storageService: StorageService,
        private readonly logger: ApplicationLoggerService
    ) { }

    @ApiOperation({ summary: 'Upload a file' })
    @ApiResponse({ status: HttpStatus.OK, description: 'The file has been successfully uploaded.'})
    @ApiBody({
        description: 'Request Body',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                fileName: {
                    type: 'string',
                    nullable: true,
                }
            },
        }
    })
    @HttpCode(HttpStatus.OK)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('fileName') fileName: string,
    ) {
        this.logger.log('Uploading file...');
        try {
            const prefix = process.env.AZURE_STORAGE_FOLDER ? `${process.env.AZURE_STORAGE_FOLDER}/` : '';
            const ext = file.originalname.split('.').at(-1);
            const originalname = `${prefix}${new Date().getTime()}_${fileName ? fileName + ext : file.originalname}`;
            const url = await this.storageService.uploadBuffer({
                buffer: file.buffer,
                blobName: originalname,
                contentType: file.mimetype
            });
            return {
                url
            };
        } catch (error) {
            this.logger.error(error.message);
        }
    }
}

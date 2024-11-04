import { Injectable } from '@nestjs/common';
import { BlobSASPermissions, BlobServiceClient, ContainerClient, SASProtocol, StorageSharedKeyCredential, generateBlobSASQueryParameters } from "@azure/storage-blob";
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { DefaultAzureCredential } from '@azure/identity';
import axios from 'axios';

@Injectable()
export class StorageService {

    client: BlobServiceClient;
    credential: any;
    containerName: string = process.env.AZURE_STORAGE_CONTAINER;
    container: ContainerClient;

    constructor(
        private readonly logger: ApplicationLoggerService,
    ) {
        const account = process.env.AZURE_STORAGE_ACCOUNT;
        this.credential = new DefaultAzureCredential();
        // this.credential = new StorageSharedKeyCredential(account, accountKey);
        this.client = new BlobServiceClient(
            `https://${account}.blob.core.windows.net`,
            this.credential
        );
        // console.log(this.client);
        this.logger.log('@@@@StorageService initialized');
        this.container = this.client.getContainerClient(this.containerName);
    }

    async uploadBuffer({
        buffer,
        blobName,
        contentType,
    }: {
        buffer: Buffer;
        blobName: string;
        contentType: string
    }) {
        try {
            this.logger.log('Uploading file...');
            const token = await this.testManagedIdentity();
            await this.listBlobsWithToken(token);
            await this.listBlobs();
            const startDate = new Date();
            const blockBlobClient = this.container.getBlockBlobClient(blobName);
            const options = { blobHTTPHeaders: { blobContentType: contentType } };
            // await blockBlobClient.uploadStream(stream, contentLength, 5, options);
            await blockBlobClient.uploadData(buffer, options);
            this.logger.debug(`Blob uploaded in ${new Date().getTime() - startDate.getTime()}ms`);
            const sasQueryParameters = this.getSasQueryParameters(blobName);
            const blobUrlWithSas = `${blockBlobClient.url}?${sasQueryParameters}`;
            return { blobUrl: blobUrlWithSas, contentType };
        } catch (error) {
            this.logger.error("=====error in uploadbuffer=======")
            throw error;
        }
    }

    async listBlobsWithToken(token: string) {
        const accountName = 'lightsoft';
        const containerName = this.containerName;
        this.logger.debug({ accountName, containerName });
        const url = `https://${accountName}.blob.core.windows.net/${containerName}?comp=list`;
    
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-ms-version': '2020-04-08' // Asegúrate de usar una versión válida
                }
            });
            this.logger.debug('list with token success');
            console.log('Blobs:', response.data);
        } catch (error) {
            this.logger.error(`Error al listar blobs: ${error.message}`);
        }
    }
    

    async testManagedIdentity() {
        try {
            const token = await this.credential.getToken('https://storage.azure.com/.default');
            this.logger.debug(`Token adquirido: ${token.token}`);
            return token.token;
        } catch (error) {
            console.error('Error al obtener el token:', error);
        }
    }

    private async listBlobs() {
        // Listar blobs en el contenedor
        try {
            for await (const blob of this.container.listBlobsFlat()) {
                this.logger.debug(`- ${blob.name}`);
            }
        } catch (error) {
            this.logger.error("Error in listBlobs");
            this.logger.error(error.message);
        }
    }

    private getSasQueryParameters(blobName: string): string {
        try {
            const permissions = BlobSASPermissions.parse("r");
            const startsOn = new Date();
            const expiresOn = new Date(startsOn.getTime() + 100 * 365 * 24 * 60 * 60 * 1000);
            const sasQueryParameters = generateBlobSASQueryParameters({
                containerName: this.containerName,
                blobName,
                permissions,
                startsOn,
                expiresOn,
                protocol: SASProtocol.HttpsAndHttp
            }, this.credential).toString();

            return sasQueryParameters;
        } catch (error) {
            this.logger.error("Error in getSasQueryParameters");
            this.logger.error(error.message);
            throw error;
        }
    }

}

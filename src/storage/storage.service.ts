import { Injectable } from '@nestjs/common';
import { BlobSASPermissions, BlobServiceClient, ContainerClient, SASProtocol, StorageSharedKeyCredential, generateBlobSASQueryParameters } from "@azure/storage-blob";
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { DefaultAzureCredential } from '@azure/identity';

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
            console.log("=====error=======")
            throw error;
        }
    }

    private getSasQueryParameters(blobName: string): string {
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
    }

}

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApplicationLoggerService } from '../services/application-logger.service';
import { EnterprisesRepository, SubsidiariesRepository } from 'src/domain/repositories';

@Injectable()
export class GeneralInterceptor implements NestInterceptor {

    constructor(
        // private readonly logger: ApplicationLoggerService,
        private readonly enterprisesRepository: EnterprisesRepository,
        private readonly subsidiariesRepository: SubsidiariesRepository,
    ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { enterpriseId, subsidiaryId } = request.params;
    const requestBody = request.body;
    // this.logger.debug(`Request body: ${JSON.stringify(requestBody)}`);
    console.debug(`Request body: ${JSON.stringify(requestBody)}`);

    // Almacenar los IDs en el objeto request
    request.enterpriseId = enterpriseId;
    request.subsidiaryId = subsidiaryId;

    Promise.all([
        //TODO: Cachear los resultados
        enterpriseId ? this.enterprisesRepository.findById(enterpriseId) : Promise.resolve(true),
        subsidiaryId ? this.subsidiariesRepository.findById(subsidiaryId): Promise.resolve(true),
    ]).then(([enterprise, subsidiary]) => {
        if(!enterprise){
            throw new NotFoundException('Enterprise not found');
        }
        if(!subsidiary){
            throw new NotFoundException('Subsidiary not found');
        }
    });

    return next.handle();
  }
}
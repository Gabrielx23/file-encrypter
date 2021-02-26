import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvKeyEnum } from '../enum/env-key.enum';

@Injectable()
export class SamplePdfClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async getSamplePDF(): Promise<any> {
    const uri = await this.configService.get(EnvKeyEnum.ExamplePDFEndpoint);

    const call = this.httpService.get(uri);

    return await call
      .toPromise()
      .then((response) => response.data)
      .catch(() => {
        throw new NotFoundException('Could not obtain sample pdf.');
      });
  }
}

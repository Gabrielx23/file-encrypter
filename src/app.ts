import { HttpModule, Module } from '@nestjs/common';
import { controllers } from './controllers';
import { services } from './services';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { SamplePdfClient } from './clients/sample-pdf.client';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule],
  controllers: [...controllers],
  providers: [...services, AuthGuard, SamplePdfClient],
})
export class App {}

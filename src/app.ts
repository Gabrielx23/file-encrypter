import { Module } from '@nestjs/common';
import { controllers } from './controllers';
import { services } from './services';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [...controllers],
  providers: [...services, AuthGuard],
})
export class App {}

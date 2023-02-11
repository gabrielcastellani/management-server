import { Module } from '@nestjs/common'
import { PrismaModule } from './app/prisma/prisma.module';
import { UsersModule } from './app/users/users.module';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule],
})
export class AppModule {}

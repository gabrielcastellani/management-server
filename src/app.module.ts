import { Module } from '@nestjs/common'
import { PrismaModule } from './app/prisma/prisma.module';
import { UsersModule } from './app/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
})
export class AppModule {}

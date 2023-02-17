import { Module } from '@nestjs/common';
import { ProductOrdersService } from './product-orders.service';
import { ProductOrdersController } from './product-orders.controller';
import { ProductsModule } from '../products/products.module';
import { PrismaModule } from '../prisma/prisma.module';
import { GoalsModule } from '../goals/goals.module';

@Module({
  imports: [ProductsModule, PrismaModule, GoalsModule],
  providers: [ProductOrdersService],
  controllers: [ProductOrdersController],
  exports: [ProductOrdersService],
})
export class ProductOrdersModule {}

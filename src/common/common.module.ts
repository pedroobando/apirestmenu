import { Module } from '@nestjs/common';
import { BCryptAdapter } from './adapter';

@Module({
  providers: [BCryptAdapter],
  exports: [BCryptAdapter],
})
export class CommonModule {}

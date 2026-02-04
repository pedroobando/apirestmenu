import * as bcrypt from 'bcrypt';

import { Injectable, Logger } from '@nestjs/common';
import { CryptoAdapter } from '../interfaces';

// import { HttpAdapter } from '../interfaces';

// implements HttpAdapter

@Injectable()
export class BCryptAdapter implements CryptoAdapter {
  private saltNumber = 10;
  private readonly logger = new Logger(BCryptAdapter.name);

  // NOTE: hay que definirlo en el common.module.ts
  hash(password: string): string {
    try {
      const data = bcrypt.hashSync(password, this.saltNumber);
      return data;
    } catch (error) {
      this.logger.error(error);
      throw new Error(`This is a error - Check logs`);
    }
  }

  compare(password: string, hash: string): boolean {
    try {
      return bcrypt.compareSync(password, hash);
    } catch (error) {
      this.logger.error(error);
      throw new Error(`This is a error - Check logs`);
    }
  }
}

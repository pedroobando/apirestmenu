import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IUser, JwtPayload } from '../interfaces';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import * as schema from '../schema/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly userSchema = schema.users;
  constructor(
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly configService: ConfigService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      secretOrKey: configService.get('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload): Promise<IUser> {
    const { id } = payload;

    const user = await this.database
      .select({
        id: this.userSchema.id,
        name: this.userSchema.name,
        email: this.userSchema.email,
        password: this.userSchema.password,
        role: this.userSchema.role,
      })
      .from(this.userSchema)
      .where(eq(this.userSchema.id, id));

    if (!user[0]) throw new UnauthorizedException('Token not valid');

    // if (!user.active) throw new UnauthorizedException('The user is inactive, contact the administrator');

    return user[0] as IUser;
  }
}

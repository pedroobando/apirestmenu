export class AuthResponseDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: string;
  readonly active: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly token: string;
}

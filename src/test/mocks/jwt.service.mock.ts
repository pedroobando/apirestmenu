import type { JwtService } from '@nestjs/jwt';

export const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
};

export const createJwtServiceMock = (): jest.Mocked<JwtService> => {
  return {
    sign: mockJwtService.sign.mockReturnValue('mocked-jwt-token'),
    verify: mockJwtService.verify.mockReturnValue({
      id: 'user-uuid',
      email: 'test@test.com',
    }),
    decode: mockJwtService.decode.mockReturnValue({
      id: 'user-uuid',
      email: 'test@test.com',
    }),
  } as unknown as jest.Mocked<JwtService>;
};

export const mockRepository = {
  select: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  from: jest.fn(),
  where: jest.fn(),
  values: jest.fn(),
  returning: jest.fn(),
  set: jest.fn(),
  offset: jest.fn(),
  limit: jest.fn(),
  orderBy: jest.fn(),
};

import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export const createDatabaseMock = (): jest.Mocked<NodePgDatabase<any>> => {
  return {
    select: mockRepository.select.mockReturnThis(),
    insert: mockRepository.insert.mockReturnThis(),
    update: mockRepository.update.mockReturnThis(),
    delete: mockRepository.delete.mockReturnThis(),
    from: mockRepository.from.mockReturnThis(),
    where: mockRepository.where.mockReturnThis(),
    values: mockRepository.values.mockReturnThis(),
    returning: mockRepository.returning.mockReturnThis(),
    set: mockRepository.set.mockReturnThis(),
    offset: mockRepository.offset.mockReturnThis(),
    limit: mockRepository.limit.mockReturnThis(),
    orderBy: mockRepository.orderBy.mockReturnThis(),
  } as unknown as jest.Mocked<NodePgDatabase<any>>;
};

export const resetMocks = () => {
  jest.clearAllMocks();
};

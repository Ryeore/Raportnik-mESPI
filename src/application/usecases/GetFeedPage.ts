import type { IReportRepository, FeedPage } from '../../domain/repositories/IReportRepository';

export async function getFeedPage(
  repository: IReportRepository,
  date: string,
  page: number,
): Promise<FeedPage> {
  return repository.getFeedPage(date, page);
}

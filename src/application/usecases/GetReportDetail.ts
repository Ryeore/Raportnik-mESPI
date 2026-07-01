import type { IReportRepository, ReportDetail } from '../../domain/repositories/IReportRepository';

export async function getReportDetail(
  repository: IReportRepository,
  id: string,
): Promise<ReportDetail> {
  return repository.getReportDetail(id);
}

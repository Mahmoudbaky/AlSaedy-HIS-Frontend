import { useQuery } from '@tanstack/react-query';
import { statisticsService, type StatisticsFilters, type HolyCapitalHospitalsStatistics } from 'src/services/statistics.service';

// Get Holy Capital Hospitals Statistics
export const useHolyCapitalHospitalsStatistics = (filters: StatisticsFilters | null) => {
  return useQuery<HolyCapitalHospitalsStatistics>({
    queryKey: ['statistics', 'holy-capital-hospitals', filters],
    queryFn: () => statisticsService.getHolyCapitalHospitalsStatistics(filters!),
    enabled: !!filters && !!filters.fromDate && !!filters.toDate,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

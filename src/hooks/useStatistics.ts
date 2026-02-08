import { useQuery } from '@tanstack/react-query';
import {
  statisticsService,
  type StatisticsFilters,
  type HolyCapitalHospitalsStatistics,
  type DoctorsStatistics,
} from 'src/services/statistics.service';

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

export const useDoctorsStatistics = (filters: StatisticsFilters | null) => {
  return useQuery<DoctorsStatistics>({
    queryKey: ['statistics', 'doctors', filters],
    queryFn: () => statisticsService.getDoctorsStatistics(filters!),
    enabled: !!filters && !!filters.fromDate && !!filters.toDate,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useDentalDoctorsStatistics = (filters: StatisticsFilters | null) => {
  return useQuery<DoctorsStatistics>({
    queryKey: ['statistics', 'dental-doctors', filters],
    queryFn: () => statisticsService.getDentalDoctorsStatistics(filters!),
    enabled: !!filters && !!filters.fromDate && !!filters.toDate,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

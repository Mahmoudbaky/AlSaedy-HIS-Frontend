import apiClient from 'src/lib/apiClient';
import { API_ENDPOINTS } from 'src/config/api';
import { authService } from './auth.service';
import axios from 'axios';

// Types
export interface StatisticsFilters {
  fromDate: string | Date;
  toDate: string | Date;
}

export interface ClinicCounts {
  saudiMaleInternalCount: number;
  saudiFemaleInternalCount: number;
  nonSaudiMaleInternalCount: number;
  nonSaudiFemaleInternalCount: number;
}

export interface DentalCounts {
  saudiMaleDentalCount: number;
  saudiFemaleDentalCount: number;
  nonSaudiMaleDentalCount: number;
  nonSaudiFemaleDentalCount: number;
}

export interface PediatricsCounts {
  saudiMalePediatricsCount: number;
  saudiFemalePediatricsCount: number;
  nonSaudiMalePediatricsCount: number;
  nonSaudiFemalePediatricsCount: number;
}

export interface ObgyCounts {
  saudiMaleObgyCount: number;
  saudiFemaleObgyCount: number;
  nonSaudiMaleObgyCount: number;
  nonSaudiFemaleObgyCount: number;
}

export interface OrthopedicCounts {
  saudiMaleOrthopedicCount: number;
  saudiFemaleOrthopedicCount: number;
  nonSaudiMaleOrthopedicCount: number;
  nonSaudiFemaleOrthopedicCount: number;
}

export interface ChestCounts {
  saudiMaleChestCount: number;
  saudiFemaleChestCount: number;
  nonSaudiMaleChestCount: number;
  nonSaudiFemaleChestCount: number;
}

export interface OphthalmologyCounts {
  saudiMaleOphthalmologyCount: number;
  saudiFemaleOphthalmologyCount: number;
  nonSaudiMaleOphthalmologyCount: number;
  nonSaudiFemaleOphthalmologyCount: number;
}

export interface UrologyCounts {
  saudiMaleUrologyCount: number;
  saudiFemaleUrologyCount: number;
  nonSaudiMaleUrologyCount: number;
  nonSaudiFemaleUrologyCount: number;
}

export interface EntCounts {
  saudiMaleEntCount: number;
  saudiFemaleEntCount: number;
  nonSaudiMaleEntCount: number;
  nonSaudiFemaleEntCount: number;
}

export interface SurgeryCounts {
  saudiMaleSurgeryCount: number;
  saudiFemaleSurgeryCount: number;
  nonSaudiMaleSurgeryCount: number;
  nonSaudiFemaleSurgeryCount: number;
}

export interface DermatologyVenCounts {
  saudiMaleDermatologyVenCount: number;
  saudiFemaleDermatologyVenCount: number;
  nonSaudiMaleDermatologyVenCount: number;
  nonSaudiFemaleDermatologyVenCount: number;
}

export interface EmergencyCounts {
  saudiMaleEmergencyCount: number;
  saudiFemaleEmergencyCount: number;
  nonSaudiMaleEmergencyCount: number;
  nonSaudiFemaleEmergencyCount: number;
}

export interface Emergency2Counts {
  saudiMaleEmergency2Count: number;
  saudiFemaleEmergency2Count: number;
  nonSaudiMaleEmergency2Count: number;
  nonSaudiFemaleEmergency2Count: number;
}

export interface RadiologyDeptCounts {
  saudiMaleRadiologyDeptCount: number;
  saudiFemaleRadiologyDeptCount: number;
  nonSaudiMaleRadiologyDeptCount: number;
  nonSaudiFemaleRadiologyDeptCount: number;
}

export interface LaboratoryDeptCounts {
  saudiMaleLaboratoryDeptCount: number;
  saudiFemaleLaboratoryDeptCount: number;
  nonSaudiMaleLaboratoryDeptCount: number;
  nonSaudiFemaleLaboratoryDeptCount: number;
}

export interface PhysiotherapyDietCounts {
  saudiMalePhysiotherapyDietCount: number;
  saudiFemalePhysiotherapyDietCount: number;
  nonSaudiMalePhysiotherapyDietCount: number;
  nonSaudiFemalePhysiotherapyDietCount: number;
}

export interface CardiologyClinicCounts {
  saudiMaleCardiologyClinicCount: number;
  saudiFemaleCardiologyClinicCount: number;
  nonSaudiMaleCardiologyClinicCount: number;
  nonSaudiFemaleCardiologyClinicCount: number;
}

export interface OpticalsCounts {
  saudiMaleOpticalsCount: number;
  saudiFemaleOpticalsCount: number;
  nonSaudiMaleOpticalsCount: number;
  nonSaudiFemaleOpticalsCount: number;
}

export interface NeurologyCounts {
  saudiMaleNeurologyCount: number;
  saudiFemaleNeurologyCount: number;
  nonSaudiMaleNeurologyCount: number;
  nonSaudiFemaleNeurologyCount: number;
}

export interface PhysiotherapyCounts {
  saudiMalePhysiotherapyCount: number;
  saudiFemalePhysiotherapyCount: number;
  nonSaudiMalePhysiotherapyCount: number;
  nonSaudiFemalePhysiotherapyCount: number;
}

export interface PsychiatryCounts {
  saudiMalePsychiatryCount: number;
  saudiFemalePsychiatryCount: number;
  nonSaudiMalePsychiatryCount: number;
  nonSaudiFemalePsychiatryCount: number;
}

export interface HolyCapitalHospitalsStatistics {
  internalCount: ClinicCounts;
  dentalCount: DentalCounts;
  pediatricsCount: PediatricsCounts;
  obgyCount: ObgyCounts;
  orthopedicCount: OrthopedicCounts;
  chestCount: ChestCounts;
  ophthalmologyCount: OphthalmologyCounts;
  urologyCount: UrologyCounts;
  entCount: EntCounts;
  surgeryCount: SurgeryCounts;
  dermatologyVenCount: DermatologyVenCounts;
  emergencyCount: EmergencyCounts;
  emergency2Count: Emergency2Counts;
  radiologyDeptCount: RadiologyDeptCounts;
  laboratoryDeptCount: LaboratoryDeptCounts;
  physiotherapyDietCount: PhysiotherapyDietCounts;
  cardiologyClinicCount: CardiologyClinicCounts;
  opticalsCount: OpticalsCounts;
  neurologyCount: NeurologyCounts;
  physiotherapyCount: PhysiotherapyCounts;
  psychiatryCount: PsychiatryCounts;
}

export interface DoctorServiceCategoryCount {
  service_category: string;
  count: number;
}

export interface DoctorStatisticsItem {
  doctor_Aname: string;
  doctor_Ename: string;
  service_category_counts: DoctorServiceCategoryCount[];
}

export type DoctorsStatistics = DoctorStatisticsItem[];

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  requestId?: string;
}

// Statistics Service
class StatisticsService {
  // Format date to ISO string for API
  private formatDate(date: string | Date): string {
    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }
    return date.toISOString();
  }

  // Get Holy Capital Hospitals Statistics
  async getHolyCapitalHospitalsStatistics(
    filters: StatisticsFilters
  ): Promise<HolyCapitalHospitalsStatistics> {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      throw new Error('No access token available');
    }

    try {
      // Use apiClient (with interceptors) for authenticated requests
      const response = await apiClient.get<ApiResponse<HolyCapitalHospitalsStatistics>>(
        API_ENDPOINTS.STATISTICS.HOLY_CAPITAL_HOSPITALS,
        {
          params: {
            fromDate: this.formatDate(filters.fromDate),
            toDate: this.formatDate(filters.toDate),
          },
        }
      );

      const result = response.data;

      if (result.success && result.data) {
        return result.data;
      }

      throw new Error(result.message || 'Failed to fetch statistics');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const result = error.response.data as ApiResponse<HolyCapitalHospitalsStatistics>;
        throw new Error(result.message || 'Failed to fetch statistics');
      }
      throw error instanceof Error ? error : new Error('Failed to fetch statistics');
    }
  }

  // Get Doctors Statistics
  async getDoctorsStatistics(filters: StatisticsFilters): Promise<DoctorsStatistics> {
    if (!authService.isAuthenticated()) {
      throw new Error('No access token available');
    }

    try {
      const response = await apiClient.get<ApiResponse<DoctorsStatistics>>(
        API_ENDPOINTS.STATISTICS.DOCTORS,
        {
          params: {
            fromDate: this.formatDate(filters.fromDate),
            toDate: this.formatDate(filters.toDate),
          },
        },
      );

      const result = response.data;

      if (result.success && result.data) {
        return result.data;
      }

      throw new Error(result.message || 'Failed to fetch doctor statistics');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const result = error.response.data as ApiResponse<DoctorsStatistics>;
        throw new Error(result.message || 'Failed to fetch doctor statistics');
      }
      throw error instanceof Error ? error : new Error('Failed to fetch doctor statistics');
    }
  }

  // Get Dental Doctors Statistics
  async getDentalDoctorsStatistics(filters: StatisticsFilters): Promise<DoctorsStatistics> {
    if (!authService.isAuthenticated()) {
      throw new Error('No access token available');
    }

    try {
      const response = await apiClient.get<ApiResponse<DoctorsStatistics>>(
        API_ENDPOINTS.STATISTICS.DENTAL_DOCTORS,
        {
          params: {
            fromDate: this.formatDate(filters.fromDate),
            toDate: this.formatDate(filters.toDate),
          },
        },
      );

      const result = response.data;

      if (result.success && result.data) {
        return result.data;
      }

      throw new Error(result.message || 'Failed to fetch dental doctor statistics');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const result = error.response.data as ApiResponse<DoctorsStatistics>;
        throw new Error(result.message || 'Failed to fetch dental doctor statistics');
      }
      throw error instanceof Error ? error : new Error('Failed to fetch dental doctor statistics');
    }
  }
}

export const statisticsService = new StatisticsService();

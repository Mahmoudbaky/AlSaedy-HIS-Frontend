import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from 'src/components/ui/field';
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover';
import { Calendar } from 'src/components/ui/calendar';
import { ClinicStatsCard } from 'src/components/statistics/ClinicStatsCard';
import { useHolyCapitalHospitalsStatistics } from 'src/hooks/useStatistics';
import {
  statisticsFiltersSchema,
  type StatisticsFiltersFormData,
} from 'src/validations/statistics.schema';
import { type StatisticsFilters } from 'src/services/statistics.service';
import { Loader2, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from 'src/lib/utils';

// Clinic names mapping
const CLINIC_NAME_KEYS: Record<string, string> = {
  internalCount: 'statistics.clinics.internalMedicine',
  dentalCount: 'statistics.clinics.dental',
  pediatricsCount: 'statistics.clinics.pediatrics',
  obgyCount: 'statistics.clinics.obstetricsGynecology',
  orthopedicCount: 'statistics.clinics.orthopedic',
  chestCount: 'statistics.clinics.chest',
  ophthalmologyCount: 'statistics.clinics.ophthalmology',
  urologyCount: 'statistics.clinics.urology',
  entCount: 'statistics.clinics.ent',
  surgeryCount: 'statistics.clinics.surgery',
  dermatologyVenCount: 'statistics.clinics.dermatologyVenereology',
  emergencyCount: 'statistics.clinics.emergency',
  emergency2Count: 'statistics.clinics.emergency2',
  radiologyDeptCount: 'statistics.clinics.radiologyDepartment',
  laboratoryDeptCount: 'statistics.clinics.laboratoryDepartment',
  physiotherapyDietCount: 'statistics.clinics.physiotherapyDiet',
  cardiologyClinicCount: 'statistics.clinics.cardiologyClinic',
  opticalsCount: 'statistics.clinics.opticals',
  neurologyCount: 'statistics.clinics.neurology',
  physiotherapyCount: 'statistics.clinics.physiotherapy',
  psychiatryCount: 'statistics.clinics.psychiatry',
  operationsCount: 'statistics.clinics.operations',
  birthCasesCount: 'statistics.clinics.birthCases',
};

// Default to last month
const getDefaultFromDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().split('T')[0];
};

const getDefaultToDate = () => {
  return new Date().toISOString().split('T')[0];
};

const HolyCapitalHospitals = () => {
  const { t } = useTranslation();
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [filters, setFilters] = useState<StatisticsFilters | null>(() => ({
    fromDate: getDefaultFromDate(),
    toDate: getDefaultToDate(),
  }));

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<StatisticsFiltersFormData>({
    resolver: zodResolver(statisticsFiltersSchema),
    defaultValues: {
      fromDate: getDefaultFromDate(),
      toDate: getDefaultToDate(),
    },
  });

  const { data: statistics, isLoading, error } = useHolyCapitalHospitalsStatistics(filters);

  // Update form values when filters change
  useEffect(() => {
    if (filters) {
      setValue(
        'fromDate',
        typeof filters.fromDate === 'string'
          ? filters.fromDate
          : filters.fromDate.toISOString().split('T')[0],
      );
      setValue(
        'toDate',
        typeof filters.toDate === 'string'
          ? filters.toDate
          : filters.toDate.toISOString().split('T')[0],
      );
    }
  }, [filters, setValue]);

  const onSubmit = (data: StatisticsFiltersFormData) => {
    setFilters({
      fromDate: data.fromDate,
      toDate: data.toDate,
    });
  };

  // Extract counts from clinic data
  const getClinicCounts = (clinicKey: string, clinicData: any) => {
    if (!clinicData || typeof clinicData !== 'object') {
      return { saudiMale: 0, saudiFemale: 0, nonSaudiMale: 0, nonSaudiFemale: 0 };
    }

    // Get the base name from the key (e.g., "internalCount" -> "internal")
    const baseName = clinicKey.replace('Count', '');
    // Capitalize first letter to match property names (e.g., "internal" -> "Internal")
    const capitalizedBaseName = baseName.charAt(0).toUpperCase() + baseName.slice(1);

    // Construct property names that match the API response format
    const saudiMaleKey = `saudiMale${capitalizedBaseName}Count`;
    const saudiFemaleKey = `saudiFemale${capitalizedBaseName}Count`;
    const nonSaudiMaleKey = `nonSaudiMale${capitalizedBaseName}Count`;
    const nonSaudiFemaleKey = `nonSaudiFemale${capitalizedBaseName}Count`;

    // Access properties directly, with fallback to 0
    // Use nullish coalescing (??) to preserve 0 values
    return {
      saudiMale: clinicData[saudiMaleKey] ?? 0,
      saudiFemale: clinicData[saudiFemaleKey] ?? 0,
      nonSaudiMale: clinicData[nonSaudiMaleKey] ?? 0,
      nonSaudiFemale: clinicData[nonSaudiFemaleKey] ?? 0,
    };
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!statistics) return null;

    let totalPatients = 0;
    let totalSaudi = 0;
    let totalNonSaudi = 0;
    let totalMale = 0;
    let totalFemale = 0;

    Object.entries(statistics).forEach(([key, clinicData]) => {
      const counts = getClinicCounts(key, clinicData);
      totalPatients +=
        counts.saudiMale + counts.saudiFemale + counts.nonSaudiMale + counts.nonSaudiFemale;
      totalSaudi += counts.saudiMale + counts.saudiFemale;
      totalNonSaudi += counts.nonSaudiMale + counts.nonSaudiFemale;
      totalMale += counts.saudiMale + counts.nonSaudiMale;
      totalFemale += counts.saudiFemale + counts.nonSaudiFemale;
    });

    return {
      totalPatients,
      totalSaudi,
      totalNonSaudi,
      totalMale,
      totalFemale,
    };
  };

  const totals = calculateTotals();

  const BCrumb = [
    { to: '/', title: t('common.home') },
    { to: '/statistics/holy-capital-hospital', title: t('common.statistics') },
    { title: t('statistics.pageTitle') },
  ];

  return (
    <>
      <BreadcrumbComp title={t('statistics.pageTitle')} items={BCrumb} />

      <div className="space-y-6">
        {/* Date Filter Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {t('statistics.dateRangeFilter')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <Field data-invalid={!!errors.fromDate}>
                    <FieldLabel htmlFor="fromDate">{t('statistics.fromDate')}</FieldLabel>
                    <Controller
                      name="fromDate"
                      control={control}
                      render={({ field }) => (
                        <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal border border-input shadow-sm',
                                !field.value && 'text-muted-foreground',
                              )}
                              type="button"
                            >
                              <CalendarIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                              {field.value
                                ? format(new Date(field.value), 'MMM dd, yyyy')
                                : t('statistics.fromDate')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                                setFromDateOpen(false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.fromDate && (
                      <FieldError errors={[{ message: errors.fromDate.message }]} />
                    )}
                  </Field>

                  <Field data-invalid={!!errors.toDate}>
                    <FieldLabel htmlFor="toDate">{t('statistics.toDate')}</FieldLabel>
                    <Controller
                      name="toDate"
                      control={control}
                      render={({ field }) => (
                        <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal border border-input shadow-sm',
                                !field.value && 'text-muted-foreground',
                              )}
                              type="button"
                            >
                              <CalendarIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                              {field.value
                                ? format(new Date(field.value), 'MMM dd, yyyy')
                                : t('statistics.toDate')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                                setToDateOpen(false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.toDate && <FieldError errors={[{ message: errors.toDate.message }]} />}
                  </Field>

                  <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.loading')}
                      </>
                    ) : (
                      t('statistics.fetchStatistics')
                    )}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('common.error')}</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : t('statistics.errorDescription')}
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        {statistics && totals && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('statistics.totalPatients')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totals.totalPatients.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('statistics.saudiPatients')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totals.totalSaudi.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('statistics.nonSaudiPatients')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totals.totalNonSaudi.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('statistics.malePatients')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totals.totalMale.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('statistics.femalePatients')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totals.totalFemale.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {isLoading && filters && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">{t('statistics.loadingStats')}</span>
          </div>
        )}

        {/* Statistics Grid */}
        {statistics && !isLoading && (
          <div>
            <h2 className="text-xl font-semibold mb-4">{t('statistics.clinicStatistics')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(statistics).map(([key, clinicData]) => {
                const counts = getClinicCounts(key, clinicData);
                const clinicName = CLINIC_NAME_KEYS[key]
                  ? t(CLINIC_NAME_KEYS[key])
                  : key;

                return (
                  <ClinicStatsCard
                    key={key}
                    clinicName={clinicName}
                    saudiMale={counts.saudiMale}
                    saudiFemale={counts.saudiFemale}
                    nonSaudiMale={counts.nonSaudiMale}
                    nonSaudiFemale={counts.nonSaudiFemale}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!filters && !isLoading && !error && (
          <Alert variant="info">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t('statistics.noDataTitle')}</AlertTitle>
            <AlertDescription>
              {t('statistics.noDataDescription')}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
};

export default HolyCapitalHospitals;

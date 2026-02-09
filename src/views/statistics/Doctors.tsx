import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert';
import { Button } from 'src/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from 'src/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover';
import { Calendar } from 'src/components/ui/calendar';
import { Input } from 'src/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from 'src/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from 'src/components/ui/select';
import { useDentalDoctorsStatistics, useDoctorsStatistics } from 'src/hooks/useStatistics';
import type { DoctorStatisticsItem } from 'src/services/statistics.service';
import { statisticsFiltersSchema, type StatisticsFiltersFormData } from 'src/validations/statistics.schema';
import type { StatisticsFilters } from 'src/services/statistics.service';
import { AlertCircle, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from 'src/lib/utils';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const getDefaultFromDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
};

const getDefaultToDate = () => {
    return new Date().toISOString().split('T')[0];
};

const filterDoctors = (data: DoctorStatisticsItem[], searchTerm: string) => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((doctor) => {
        const arName = doctor.doctor_Aname?.toLowerCase() ?? '';
        const enName = doctor.doctor_Ename?.toLowerCase() ?? '';
        return arName.includes(term) || enName.includes(term);
    });
};

const Doctors = () => {
    const { t } = useTranslation();
    const [fromDateOpen, setFromDateOpen] = useState(false);
    const [toDateOpen, setToDateOpen] = useState(false);
    const [filters, setFilters] = useState<StatisticsFilters | null>(() => ({
        fromDate: getDefaultFromDate(),
        toDate: getDefaultToDate(),
    }));
    const [doctorSearch, setDoctorSearch] = useState('');
    const [dentalSearch, setDentalSearch] = useState('');
    const [doctorPage, setDoctorPage] = useState(1);
    const [dentalPage, setDentalPage] = useState(1);
    const [doctorPageSize, setDoctorPageSize] = useState(10);
    const [dentalPageSize, setDentalPageSize] = useState(10);

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

    const {
        data: doctorsData = [],
        isLoading: doctorsLoading,
        error: doctorsError,
    } = useDoctorsStatistics(filters);

    const {
        data: dentalDoctorsData = [],
        isLoading: dentalLoading,
        error: dentalError,
    } = useDentalDoctorsStatistics(filters);

    const filteredDoctors = useMemo(
        () => filterDoctors(doctorsData, doctorSearch),
        [doctorsData, doctorSearch],
    );
    const filteredDentalDoctors = useMemo(
        () => filterDoctors(dentalDoctorsData, dentalSearch),
        [dentalDoctorsData, dentalSearch],
    );

    const doctorTotalPages = Math.max(1, Math.ceil(filteredDoctors.length / doctorPageSize));
    const dentalTotalPages = Math.max(1, Math.ceil(filteredDentalDoctors.length / dentalPageSize));

    useEffect(() => {
        setDoctorPage(1);
    }, [doctorSearch, doctorPageSize]);

    useEffect(() => {
        setDentalPage(1);
    }, [dentalSearch, dentalPageSize]);

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

    useEffect(() => {
        if (doctorPage > doctorTotalPages) setDoctorPage(doctorTotalPages);
    }, [doctorPage, doctorTotalPages]);

    useEffect(() => {
        if (dentalPage > dentalTotalPages) setDentalPage(dentalTotalPages);
    }, [dentalPage, dentalTotalPages]);

    const onSubmit = (data: StatisticsFiltersFormData) => {
        setFilters({
            fromDate: data.fromDate,
            toDate: data.toDate,
        });
    };

    const BCrumb = [
        { to: '/', title: t('common.home') },
        { to: '/statistics/holy-capital-hospital', title: t('common.statistics') },
        { title: t('sidebar.doctorStatistics') },
    ];

    const renderTable = ({
        data,
        filteredData,
        isLoading,
        error,
        searchValue,
        onSearchChange,
        page,
        totalPages,
        pageSize,
        onPageChange,
        onPageSizeChange,
        emptyMessage,
    }: {
        data: DoctorStatisticsItem[];
        filteredData: DoctorStatisticsItem[];
        isLoading: boolean;
        error: unknown;
        searchValue: string;
        onSearchChange: (value: string) => void;
        page: number;
        totalPages: number;
        pageSize: number;
        onPageChange: (value: number) => void;
        onPageSizeChange: (value: number) => void;
        emptyMessage: string;
    }) => {
        const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('statistics.doctorStatisticsTable')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <Input
                            placeholder={t('statistics.doctorSearchPlaceholder')}
                            value={searchValue}
                            onChange={(event) => onSearchChange(event.target.value)}
                            className="max-w-md"
                        />
                    </div>

                    {Boolean(error) && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{t('common.error')}</AlertTitle>
                            <AlertDescription>
                                {error instanceof Error ? error.message : t('statistics.errorDescription')}
                            </AlertDescription>
                        </Alert>
                    )}

                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-2 text-muted-foreground">{t('statistics.loadingStats')}</span>
                        </div>
                    )}

                    {!isLoading && !error && data.length === 0 && (
                        <Alert variant="info">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{t('statistics.noDataTitle')}</AlertTitle>
                            <AlertDescription>{t('statistics.noDoctorsData')}</AlertDescription>
                        </Alert>
                    )}

                    {!isLoading && !error && data.length > 0 && (
                        <>
                            {filteredData.length === 0 ? (
                                <Alert variant="info">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{t('statistics.noDataTitle')}</AlertTitle>
                                    <AlertDescription>{emptyMessage}</AlertDescription>
                                </Alert>
                            ) : (
                                <div className="overflow-x-auto border rounded-md border-ld">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="min-w-[220px]">
                                                    {t('statistics.doctorArabicName')}
                                                </TableHead>
                                                <TableHead className="min-w-[220px]">
                                                    {t('statistics.doctorEnglishName')}
                                                </TableHead>
                                                <TableHead className="min-w-[280px]">
                                                    {t('statistics.serviceCategories')}
                                                </TableHead>
                                                <TableHead className="text-center min-w-[120px]">
                                                    {t('statistics.totalCount')}
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedData.map((doctor, doctorIndex) => {
                                                const serviceMap = new Map<string, number>();
                                                doctor.service_category_counts?.forEach((service) => {
                                                    const name = service.service_category?.trim() || t('statistics.unknownService');
                                                    const current = serviceMap.get(name) ?? 0;
                                                    serviceMap.set(name, current + (service.count ?? 0));
                                                });

                                                const serviceCounts = Array.from(serviceMap.entries())
                                                    .map(([service_category, count]) => ({ service_category, count }))
                                                    .sort(
                                                        (a, b) =>
                                                            b.count - a.count ||
                                                            a.service_category.localeCompare(b.service_category),
                                                    );

                                                const totalCount = serviceCounts.reduce(
                                                    (sum, item) => sum + item.count,
                                                    0,
                                                );

                                                return (
                                                    <TableRow key={`${doctor.doctor_Ename}-${doctor.doctor_Aname}-${doctorIndex}`}>
                                                        <TableCell className="whitespace-normal font-medium">
                                                            {doctor.doctor_Aname || t('statistics.unknownDoctor')}
                                                        </TableCell>
                                                        <TableCell className="whitespace-normal">
                                                            {doctor.doctor_Ename || t('statistics.unknownDoctor')}
                                                        </TableCell>
                                                        <TableCell className="whitespace-normal">
                                                            {serviceCounts.length === 0 ? (
                                                                <span className="text-muted-foreground text-sm">
                                                                    {t('statistics.noServiceCounts')}
                                                                </span>
                                                            ) : (
                                                                <ul className="list-disc list-inside space-y-1 text-sm">
                                                                    {serviceCounts.map((service, serviceIndex) => (
                                                                        <li
                                                                            key={`${doctor.doctor_Ename}-${service.service_category}-${serviceIndex}`}
                                                                            className="text-muted-foreground"
                                                                        >
                                                                            <span className="text-foreground">{service.service_category}</span>
                                                                            {' '}
                                                                            <span className="font-semibold">{service.count}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center font-semibold">
                                                            {totalCount.toLocaleString()}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {filteredData.length > 0 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            onClick={() => onPageChange(Math.max(1, page - 1))}
                                            disabled={page === 1}
                                        >
                                            {t('statistics.previous')}
                                        </Button>
                                        <Button
                                            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                                            disabled={page === totalPages}
                                        >
                                            {t('statistics.next')}
                                        </Button>
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        {t('statistics.pageOf', { current: page, total: totalPages })}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {t('statistics.rowsPerPage')}
                                        </span>
                                        <Select
                                            value={String(pageSize)}
                                            onValueChange={(value) => onPageSizeChange(Number(value))}
                                        >
                                            <SelectTrigger className="w-20!">
                                                <SelectValue placeholder={t('statistics.rowsPerPage')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PAGE_SIZE_OPTIONS.map((size) => (
                                                    <SelectItem key={size} value={String(size)}>
                                                        {size}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <>
            <BreadcrumbComp title={t('sidebar.doctorStatistics')} items={BCrumb} />

            <div className="space-y-6">
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

                                    <Button type="submit" disabled={doctorsLoading || dentalLoading} className="w-full md:w-auto">
                                        {doctorsLoading || dentalLoading ? (
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

                <Tabs defaultValue="doctors">
                    <TabsList variant="line">
                        <TabsTrigger
                            value="doctors"
                            className="data-[state=active]:text-primary data-[state=active]:after:bg-primary"
                        >
                            {t('statistics.doctorsTab')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="dental"
                            className="data-[state=active]:text-primary data-[state=active]:after:bg-primary"
                        >
                            {t('statistics.dentalDoctorsTab')}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="doctors" className="mt-4">
                        {renderTable({
                            data: doctorsData,
                            filteredData: filteredDoctors,
                            isLoading: doctorsLoading,
                            error: doctorsError,
                            searchValue: doctorSearch,
                            onSearchChange: setDoctorSearch,
                            page: doctorPage,
                            totalPages: doctorTotalPages,
                            pageSize: doctorPageSize,
                            onPageChange: setDoctorPage,
                            onPageSizeChange: setDoctorPageSize,
                            emptyMessage: t('statistics.noDoctorResults'),
                        })}
                    </TabsContent>

                    <TabsContent value="dental" className="mt-4">
                        {renderTable({
                            data: dentalDoctorsData,
                            filteredData: filteredDentalDoctors,
                            isLoading: dentalLoading,
                            error: dentalError,
                            searchValue: dentalSearch,
                            onSearchChange: setDentalSearch,
                            page: dentalPage,
                            totalPages: dentalTotalPages,
                            pageSize: dentalPageSize,
                            onPageChange: setDentalPage,
                            onPageSizeChange: setDentalPageSize,
                            emptyMessage: t('statistics.noDentalDoctorResults'),
                        })}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default Doctors;

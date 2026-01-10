import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { cn } from 'src/lib/utils';

interface ClinicStatsCardProps {
  clinicName: string;
  saudiMale: number;
  saudiFemale: number;
  nonSaudiMale: number;
  nonSaudiFemale: number;
  className?: string;
}

export const ClinicStatsCard = ({
  clinicName,
  saudiMale,
  saudiFemale,
  nonSaudiMale,
  nonSaudiFemale,
  className,
}: ClinicStatsCardProps) => {
  const total = saudiMale + saudiFemale + nonSaudiMale + nonSaudiFemale;
  const saudiTotal = saudiMale + saudiFemale;
  const nonSaudiTotal = nonSaudiMale + nonSaudiFemale;
  const maleTotal = saudiMale + nonSaudiMale;
  const femaleTotal = saudiFemale + nonSaudiFemale;

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{clinicName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Badge */}
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <span className="text-sm font-medium text-muted-foreground">Total Patients</span>
          <Badge variant="outline" className="text-base font-semibold px-3 py-1">
            {formatNumber(total)}
          </Badge>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Saudi Patients */}
          <div className="space-y-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <div className="text-xs font-medium text-green-700 dark:text-green-400">Saudi</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Male:</span>
                <span className="font-semibold">{formatNumber(saudiMale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Female:</span>
                <span className="font-semibold">{formatNumber(saudiFemale)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-green-200 dark:border-green-800">
                <span className="font-medium text-green-700 dark:text-green-400">Total:</span>
                <span className="font-bold text-green-700 dark:text-green-400">
                  {formatNumber(saudiTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Non-Saudi Patients */}
          <div className="space-y-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="text-xs font-medium text-blue-700 dark:text-blue-400">Non-Saudi</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Male:</span>
                <span className="font-semibold">{formatNumber(nonSaudiMale)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Female:</span>
                <span className="font-semibold">{formatNumber(nonSaudiFemale)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-blue-200 dark:border-blue-800">
                <span className="font-medium text-blue-700 dark:text-blue-400">Total:</span>
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  {formatNumber(nonSaudiTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gender Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-border text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Male:</span>
            <span className="font-semibold">{formatNumber(maleTotal)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Female:</span>
            <span className="font-semibold">{formatNumber(femaleTotal)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

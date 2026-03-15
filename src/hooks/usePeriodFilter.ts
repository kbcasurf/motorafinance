import { useState, useMemo } from 'react';
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type PeriodType = 'day' | 'week' | 'month';

export interface PeriodFilter {
  periodType: PeriodType;
  setPeriodType: (type: PeriodType) => void;
  startDate: string;
  endDate: string;
  label: string;
  goNext: () => void;
  goPrevious: () => void;
  goToday: () => void;
}

export function usePeriodFilter(): PeriodFilter {
  const [periodType, setPeriodType] = useState<PeriodType>('month');
  const [anchor, setAnchor] = useState(new Date());

  const { startDate, endDate, label } = useMemo(() => {
    let start: Date;
    let end: Date;
    let lbl: string;

    switch (periodType) {
      case 'day':
        start = startOfDay(anchor);
        end = endOfDay(anchor);
        lbl = format(anchor, "dd 'de' MMMM", { locale: ptBR });
        break;
      case 'week':
        start = startOfWeek(anchor, { weekStartsOn: 1 });
        end = endOfWeek(anchor, { weekStartsOn: 1 });
        lbl = `${format(start, 'dd/MM')} - ${format(end, 'dd/MM')}`;
        break;
      case 'month':
      default:
        start = startOfMonth(anchor);
        end = endOfMonth(anchor);
        lbl = format(anchor, "MMMM 'de' yyyy", { locale: ptBR });
        break;
    }

    return {
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
      label: lbl,
    };
  }, [periodType, anchor]);

  function goNext() {
    setAnchor((prev) => {
      switch (periodType) {
        case 'day': return addDays(prev, 1);
        case 'week': return addWeeks(prev, 1);
        case 'month': return addMonths(prev, 1);
      }
    });
  }

  function goPrevious() {
    setAnchor((prev) => {
      switch (periodType) {
        case 'day': return subDays(prev, 1);
        case 'week': return subWeeks(prev, 1);
        case 'month': return subMonths(prev, 1);
      }
    });
  }

  function goToday() {
    setAnchor(new Date());
  }

  return { periodType, setPeriodType, startDate, endDate, label, goNext, goPrevious, goToday };
}

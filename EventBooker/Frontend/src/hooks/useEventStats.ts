import { Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Event } from '../types';

interface Stat {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}

const useEventStats = (eventsData: Event[] | undefined, isLoading: boolean) => {
  const stats: Stat[] = [
    {
      icon: Calendar,
      label: 'Total Events',
      value: eventsData?.length || 0,
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      label: 'Total Capacity',
      value: eventsData?.reduce(
        (sum, event) =>
          sum +
          (typeof event.maxCapacity === "number" && !isNaN(event.maxCapacity)
            ? event.maxCapacity
            : 0),
        0
      ) || 0,
      color: 'bg-emerald-500',
    },
    {
      icon: DollarSign,
      label: 'Revenue Potential',
      value: `$${eventsData
        ?.reduce(
          (sum, event) =>
            sum +
            ((typeof event.price === "number" && typeof event.maxCapacity === "number")
              ? event.price * event.maxCapacity
              : 0),
          0
        )
        .toLocaleString()}`,
      color: 'bg-orange-500',
    },
    {
      icon: TrendingUp,
      label: 'Available Tickets',
      value: eventsData?.reduce((sum, event) => sum + event.availableSpots, 0) || 0,
      color: 'bg-purple-500',
    },
  ];

  return { stats, isLoading };
};

export default useEventStats; 
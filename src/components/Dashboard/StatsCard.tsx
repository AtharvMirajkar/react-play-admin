import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const bgColorClasses = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value?.toLocaleString()}
          </p>
          {trend && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <span>
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          )}
        </div>

        <div
          className={`w-12 h-12 ${bgColorClasses[color]} rounded-lg flex items-center justify-center`}
        >
          <Icon size={24} className={colorClasses[color]} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

import React from 'react';
import { Sparkline } from '../charts/Sparkline';
import { Card } from '../ui/Card';
import { ToneIcon } from '../ui/ToneIcon';
import { Icon } from '../ui/Icon';

export const StatCard = ({ stat }) => {
  const isPositive = stat.change >= 0;
  return (
    <Card className="p-5 relative overflow-hidden group hover:shadow-premium-lg hover:-translate-y-0.5">
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-slate-100/0 group-hover:bg-slate-100 transition-all duration-500"></div>

      <div className="relative flex items-start justify-between mb-4">
        <ToneIcon icon={stat.icon} tone={stat.tone} size="lg" />
        <div className={[
          'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold',
          isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
        ].join(' ')}>
          <Icon name={isPositive ? 'arrow-up' : 'arrow-down'} size={10} strokeWidth={3} />
          {Math.abs(stat.change)}%
        </div>
      </div>

      <div className="relative">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {stat.label}
        </div>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {stat.value}
        </div>
      </div>

      <div className="relative mt-4">
        <Sparkline data={stat.spark} width={220} height={40} />
      </div>
    </Card>
  );
};

export default StatCard;

import React from 'react';

const StatCard = ({ title, value, icon, trend, trendValue }) => {
  const colors = {
    teal: '#425c5a',
    gold: '#d7a217'
  };

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:scale-105 transition-transform duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#d7a217]/10 to-transparent rounded-bl-full"></div>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: colors.teal }}>{title}</p>
          <h2 className="text-3xl font-bold" style={{ color: colors.teal }}>{value}</h2>
          {trend && (
            <p className="text-xs mt-2 flex items-center gap-1" style={{ color: colors.gold }}>
              {trend} {trendValue}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.gold + '20' }}>
          <div style={{ color: colors.gold }}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
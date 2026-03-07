import React from 'react';
import { Trash2, Edit3, Database } from 'lucide-react';

// Default colors jika tidak ada props
const defaultColors = {
  tealDark: '#425c5a',
  tealMedium: '#3c5654',
  tealLight: '#e2eceb',
  tealPale: '#cadfdf',
  gold: '#d7a217'
};

const MasterDataTable = ({ 
  data, 
  columns, 
  onDelete, 
  onEdit,
  emptyMessage = "Belum ada data",
  showActions = true,
  isDarkMode = false,  // Default value
  colors = defaultColors  // Default value
}) => {
  return (
    <div 
      className="backdrop-blur-md rounded-2xl border h-[600px] flex flex-col overflow-hidden transition-all hover:shadow-xl"
      style={{ 
        backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'rgba(255, 255, 255, 0.7)',
        borderColor: isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale
      }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b flex justify-between items-center font-bold text-xs uppercase tracking-wider"
        style={{ 
          borderColor: colors.tealPale,
          backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.2)' : 'rgba(202, 223, 223, 0.3)'
        }}
      >
        <span style={{ color: colors.tealDark }}>Daftar Data</span>
        <span 
          className="px-3 py-1 rounded-full text-[9px] font-bold"
          style={{ 
            backgroundColor: `${colors.gold}20`,
            color: colors.gold
          }}
        >
          {data.length} Data
        </span>
      </div>
      
      {/* Content */}
      <div className="overflow-y-auto p-4 grid grid-cols-1 gap-2 scrollbar-hide flex-1">
        {data.length > 0 ? (
          data.map((item) => (
            <div 
              key={item.id} 
              className="p-4 rounded-xl flex justify-between items-center group transition-all hover:scale-[1.02] hover:shadow-md"
              style={{ 
                backgroundColor: isDarkMode ? 'rgba(60, 86, 84, 0.3)' : 'white',
                border: `1px solid ${isDarkMode ? 'rgba(215, 162, 23, 0.2)' : colors.tealPale}`
              }}
            >
              <div className="flex-1">
                {columns.map((col, idx) => (
                  <div 
                    key={idx} 
                    className={idx === 0 ? 'font-bold' : 'text-xs'}
                    style={{ 
                      color: idx === 0 
                        ? colors.tealDark 
                        : isDarkMode ? colors.tealLight : colors.tealMedium
                    }}
                  >
                    {col.render ? col.render(item) : item[col.field]}
                  </div>
                ))}
              </div>
              
              {showActions && (
                <div className="flex gap-2">
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(item)} 
                      className="p-2 rounded-lg transition-all hover:scale-110"
                      style={{ 
                        backgroundColor: `${colors.gold}20`,
                        color: colors.gold
                      }}
                      title="Edit"
                    >
                      <Edit3 size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => onDelete(item)} 
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ 
                      backgroundColor: `${colors.tealDark}20`,
                      color: colors.tealDark
                    }}
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Database 
              size={48} 
              className="mx-auto mb-3 opacity-30"
              style={{ color: colors.tealMedium }}
            />
            <p className="text-sm italic" style={{ color: colors.tealMedium }}>
              {emptyMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterDataTable;
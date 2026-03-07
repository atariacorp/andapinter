import React from 'react';
import { Edit3, Trash2, Printer, Eye } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatIDR } from '../../utils/formatters';

const ProposalTableRow = ({ 
  proposal, rincian, index, isFirstRow, rowSpan, selectedForBulk, onSelectBulk, 
  currentUserLevel, canEdit, onDetail, onEdit, onDelete, onPrint, isDarkMode 
}) => {
  const isSelected = selectedForBulk?.includes(proposal.id);
  const selisih = Number(rincian.paguSesudah || 0) - Number(rincian.paguSebelum || 0);
  
  return (
    <tr className={`transition-colors duration-300 hover:bg-white/40 dark:hover:bg-white/5 ${isSelected ? (isDarkMode ? 'bg-[#d7a217]/10' : 'bg-[#d7a217]/5') : ''}`}>
      
      {/* Checkbox */}
      {isFirstRow && ['Admin', 'Operator BKAD'].includes(currentUserLevel) && (
        <td rowSpan={rowSpan} className="p-4 align-top border-r border-[#cadfdf]/20 dark:border-[#cadfdf]/10 text-center">
          <div className="flex items-center justify-center h-full pt-1">
            <input 
              type="checkbox" 
              checked={isSelected || false} 
              onChange={(e) => onSelectBulk(proposal.id, e.target.checked)} 
              className="w-4 h-4 rounded cursor-pointer accent-[#d7a217] transition-transform hover:scale-110 shadow-sm" 
            />
          </div>
        </td>
      )}

      {/* Tanggal Surat */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-4 align-top border-r border-[#cadfdf]/20 dark:border-[#cadfdf]/10">
          <span className={`text-[10px] font-bold ${isDarkMode ? 'text-[#cadfdf]/80' : 'text-[#3c5654]/80'}`}>
            {proposal.tanggalSurat || '-'}
          </span>
        </td>
      )}

      {/* Nomor Surat & Tahap */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-4 align-top border-r border-[#cadfdf]/20 dark:border-[#cadfdf]/10">
          <span className="text-xs font-black text-[#d7a217]">{proposal.nomorSurat || 'N/A'}</span>
          <span className={`block mt-2 text-[9px] px-2.5 py-1 rounded-md w-max font-bold uppercase tracking-wider border shadow-sm ${isDarkMode ? 'bg-[#d7a217]/10 text-[#d7a217] border-[#d7a217]/30' : 'bg-[#d7a217]/10 text-[#d7a217] border-[#d7a217]/20'}`}>
            {proposal.tahap || 'Belum Ditentukan'}
          </span>
        </td>
      )}

      {/* SKPD */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-4 align-top border-r border-[#cadfdf]/20 dark:border-[#cadfdf]/10">
          <span className={`text-xs font-bold line-clamp-2 ${isDarkMode ? 'text-white' : 'text-[#425c5a]'}`}>
            {proposal.skpd || 'Dinas'}
          </span>
        </td>
      )}

      {/* Sub Kegiatan */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-4 align-top border-r border-[#cadfdf]/20 dark:border-[#cadfdf]/10">
          <span className={`text-xs font-medium line-clamp-2 leading-relaxed ${isDarkMode ? 'text-[#cadfdf]' : 'text-[#3c5654]'}`}>
            {proposal.subKegiatan || '-'}
          </span>
        </td>
      )}

      {/* Kode Rekening */}
      <td className="p-4 align-top">
        <code className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold shadow-inner border ${isDarkMode ? 'bg-black/20 text-[#cadfdf]/90 border-[#cadfdf]/10' : 'bg-white/50 text-[#3c5654]/90 border-[#cadfdf]/50'}`}>
          {rincian.kodeRekening || '-'}
        </code>
      </td>

      {/* Uraian SRO */}
      <td className={`p-4 align-top text-xs font-semibold line-clamp-2 ${isDarkMode ? 'text-[#e2eceb]' : 'text-[#425c5a]'}`}>
        {rincian.uraian || '-'}
      </td>

      {/* Pagu Semula */}
      <td className={`p-4 align-top text-right text-xs font-medium tabular-nums ${isDarkMode ? 'text-[#cadfdf]/90' : 'text-[#3c5654]/90'}`}>
        {formatIDR(rincian.paguSebelum)}
      </td>

      {/* Pagu Sesudah */}
      <td className="p-4 align-top text-right text-xs font-black tabular-nums text-[#d7a217]">
        {formatIDR(rincian.paguSesudah)}
      </td>

      {/* Selisih */}
      <td className="p-4 align-top text-right tabular-nums">
        <div className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-black shadow-sm border ${
          selisih > 0 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400' : 
          selisih < 0 ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400' : 
          isDarkMode ? 'bg-[#3c5654]/40 text-[#cadfdf] border-[#cadfdf]/10' : 'bg-[#cadfdf]/30 text-[#425c5a] border-[#cadfdf]/50'
        }`}>
          {selisih > 0 ? '+' : ''}{formatIDR(selisih)}
        </div>
      </td>

      {/* Status */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-4 align-top border-l border-[#cadfdf]/20 dark:border-[#cadfdf]/10 text-center">
          <StatusBadge status={proposal.status} />
        </td>
      )}

      {/* Actions */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-4 align-top border-l border-[#cadfdf]/20 dark:border-[#cadfdf]/10">
          <div className="flex flex-col items-center justify-center gap-2 w-full max-w-[100px] mx-auto">
            
            {/* Detail Button */}
            <button 
              onClick={() => onDetail(proposal)} 
              className="w-full px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#425c5a] to-[#3c5654] text-white hover:shadow-[#425c5a]/30"
            >
              <FileText size={12} /> DETAIL
            </button>
            
            {/* Action Icons Grid */}
            <div className="flex justify-center gap-1.5 w-full mt-1">
              {canEdit && (
                <button 
                  onClick={() => onEdit(proposal)} 
                  className={`p-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-sm border ${isDarkMode ? 'bg-[#d7a217]/10 text-[#d7a217] border-[#d7a217]/20 hover:bg-[#d7a217] hover:text-white' : 'bg-[#d7a217]/10 text-[#d7a217] border-[#d7a217]/30 hover:bg-[#d7a217] hover:text-white'}`}
                  title="Perbaiki Berkas"
                >
                  <Edit3 size={14}/>
                </button>
              )}
              
              {(currentUserLevel === 'Admin' || (currentUserLevel === 'SKPD' && !String(proposal.status).includes('Disetujui'))) && (
                <button 
                  onClick={() => onDelete(proposal)} 
                  className={`p-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-sm border ${isDarkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white' : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-500 hover:text-white'}`}
                  title="Hapus Usulan"
                >
                  <Trash2 size={14}/>
                </button>
              )}
              
              {proposal.status === 'Disetujui' && (
                <button 
                  onClick={() => onPrint(proposal)} 
                  className={`p-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-sm border ${isDarkMode ? 'bg-[#cadfdf]/10 text-[#cadfdf] border-[#cadfdf]/20 hover:bg-[#cadfdf] hover:text-[#425c5a]' : 'bg-[#425c5a]/5 text-[#425c5a] border-[#425c5a]/20 hover:bg-[#425c5a] hover:text-white'}`}
                  title="Cetak Berita Acara"
                >
                  <Printer size={14}/>
                </button>
              )}
            </div>
            
          </div>
        </td>
      )}
    </tr>
  );
};

export default ProposalTableRow;
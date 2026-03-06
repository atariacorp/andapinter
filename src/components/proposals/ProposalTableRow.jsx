import React from 'react';
import { Edit3, Trash2, Printer } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatIDR } from '../../utils/formatters';

const ProposalTableRow = ({ 
  proposal, 
  rincian, 
  index, 
  isFirstRow,
  rowSpan,
  selectedForBulk,
  onSelectBulk,
  currentUserLevel,
  canEdit,
  onDetail,
  onEdit,
  onDelete,
  onPrint
}) => {
  return (
    <tr className={`transition-colors ${selectedForBulk.includes(proposal.id) ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'}`}>
      
      {/* Checkbox untuk bulk action (hanya untuk baris pertama) */}
      {isFirstRow && ['Admin', 'Operator BKAD'].includes(currentUserLevel) && (
        <td rowSpan={rowSpan} className="p-3 text-center border-b border-slate-100 dark:border-slate-700/50 align-top">
          <input 
            type="checkbox"
            checked={selectedForBulk.includes(proposal.id)}
            onChange={(e) => onSelectBulk(proposal.id, e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
          />
        </td>
      )}
      
      {/* Tanggal Surat (baris pertama) */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-xs whitespace-nowrap">
          {String(proposal.tanggalSurat || '-')}
        </td>
      )}
      
      {/* Nomor Surat + Tahap (baris pertama) */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-xs font-black text-blue-600 dark:text-blue-400 whitespace-normal break-words">
          {String(proposal.nomorSurat || "N/A")}
          <span className="block mt-1.5 text-[9px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded w-max font-bold border border-blue-200 dark:border-blue-800 uppercase tracking-tighter">
            [{String(proposal.tahap || 'Belum Ditentukan')}]
          </span>
        </td>
      )}
      
      {/* SKPD (baris pertama) */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-xs font-bold whitespace-normal break-words leading-relaxed">
          {String(proposal.skpd || "Dinas")}
        </td>
      )}
      
      {/* Sub Kegiatan (baris pertama) */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-xs whitespace-normal break-words leading-relaxed">
          {String(proposal.subKegiatan || "-")}
        </td>
      )}

      {/* Rincian SRO Columns */}
      <td className="p-3 text-[10px] font-mono text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700/50">
        {String(rincian.kodeRekening || '-')}
      </td>
      <td className="p-3 text-xs font-bold border-b border-slate-100 dark:border-slate-700/50 whitespace-normal break-words leading-relaxed">
        {String(rincian.uraian || '-')}
      </td>
      <td className="p-3 text-right text-xs border-b border-slate-100 dark:border-slate-700/50">
        {formatIDR(rincian.paguSebelum)}
      </td>
      <td className="p-3 text-right text-xs font-bold text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-700/50">
        {formatIDR(rincian.paguSesudah)}
      </td>
      <td className="p-3 text-right text-xs font-black border-b border-slate-100 dark:border-slate-700/50">
        {formatIDR(Number(rincian.paguSesudah||0) - Number(rincian.paguSebelum||0))}
      </td>

      {/* Status (baris pertama) */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-center">
          <StatusBadge status={proposal.status}/>
        </td>
      )}
      
      {/* Actions (baris pertama) */}
      {isFirstRow && (
        <td rowSpan={rowSpan} className="p-3 border-b border-slate-100 dark:border-slate-700/50 align-top text-center">
          <div className="flex items-center justify-center gap-2 flex-wrap max-w-[120px] mx-auto">
            <button 
              onClick={() => onDetail(proposal)} 
              className="px-3 py-1.5 bg-slate-700 text-white text-[9px] font-black rounded-lg shadow-sm hover:bg-slate-800 transition-all w-full"
            >
              DETAIL
            </button>
            
            <div className="flex justify-center gap-1.5 w-full mt-1">
              {canEdit && (
                <button 
                  onClick={() => onEdit(proposal)} 
                  className="p-1.5 text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 rounded-lg transition-all" 
                  title="Perbaiki Berkas"
                >
                  <Edit3 size={14}/>
                </button>
              )}
              
              {(currentUserLevel === 'Admin' || (currentUserLevel === 'SKPD' && proposal.status !== 'Disetujui')) && (
                <button 
                  onClick={() => onDelete(proposal)} 
                  className="p-1.5 text-rose-600 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 rounded-lg transition-all" 
                  title="Hapus Usulan"
                >
                  <Trash2 size={14}/>
                </button>
              )}
              
              {proposal.status === 'Disetujui' && (
                <button 
                  onClick={() => onPrint(proposal)} 
                  className="p-1.5 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 rounded-lg transition-all" 
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
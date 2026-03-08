import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import DashboardView from '../dashboard/DashboardView';
import ProposalListView from '../proposals/ProposalListView';
import ProposalFormView from '../proposals/ProposalFormView';
import ProposalDetailView from '../proposals/ProposalDetailView';
import SettingsView from '../settings/SettingsView';
import StorageView from '../storage/StorageView';
import LogsView from '../logs/LogsView';
import PanduanView from '../panduan/PanduanView';
import NotificationPanel from '../common/NotificationPanel';
import NotificationBell from '../common/NotificationBell';
import { CheckCircle, AlertTriangle, X, Sun, Moon } from 'lucide-react';

const MainLayout = ({ 
  user, 
  branding, 
  isDarkMode, 
  toggleDarkMode, 
  onLogout,
  notifications,
  removeNotification,
  addNotification,
  setDeleteConfirm,
  currentUserProfile,
  masterData,
  proposals,
  storage,
  checkStorageUsage,   
  backupAllFiles,   
  restoreFromBackup,
  cleanupOrphanFiles,
  activityLogs,
  loadingLogs,
  refreshLogs,
  addActivityLog    
}) => {
  const [view, setView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [localCatatan, setLocalCatatan] = useState('');
  const [commentText, setCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  
  // Hitung unread count untuk notifikasi
  const unreadCount = notifications.filter(n => !n.read).length;

  // Definisikan palet warna
  const colors = {
    tealDark: '#425c5a',
    tealMedium: '#3c5654',
    tealLight: '#e2eceb',
    tealPale: '#cadfdf',
    gold: '#d7a217'
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex print:block print:overflow-visible font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      
      {/* Print Area */}
      {selectedProposal && (
        <div id="print-area" className="hidden print:block bg-white p-8 w-full text-slate-900 font-serif leading-relaxed">
          {/* Isi print area - bisa dipisah ke komponen sendiri nanti */}
          <div className="flex items-center gap-6 border-b-4 border-double border-slate-900 pb-4 mb-8 text-center">
            <div className="w-20 h-20 bg-slate-100 flex items-center justify-center font-bold text-3xl border uppercase">
              {branding.icon}
            </div>
            <div className="flex-grow">
              <h1 className="text-xl font-bold uppercase">{branding.subTagline}</h1>
              <h2 className="text-lg font-extrabold uppercase">{branding.tagline}</h2>
              <p className="text-[10px]">{branding.name1}{branding.name2}</p>
            </div>
          </div>
          {/* ... sisanya bisa ditambahkan nanti */}
        </div>
      )}

      {/* Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        view={view}
        setView={setView}
        branding={branding}
        currentUserProfile={currentUserProfile}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={onLogout}
        showNotificationPanel={showNotificationPanel}
        setShowNotificationPanel={setShowNotificationPanel}
        notifications={notifications}
        unreadCount={unreadCount}
      />

      {/* Notification Panel */}
      {showNotificationPanel && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotificationPanel(false)}
          removeNotification={removeNotification}
          setSelectedProposal={(proposal) => {
            setSelectedProposal(proposal);
            setView('detail');
          }}
          setView={setView}
        />
      )}

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0 print:hidden overflow-hidden transition-colors duration-300">
        
        {/* Mobile Header */}
<MobileHeader 
  setIsMobileMenuOpen={setIsMobileMenuOpen}
  branding={branding}
  isDarkMode={isDarkMode}
  toggleDarkMode={toggleDarkMode}
/>

{/* DESKTOP HEADER - UNTUK LAYAR >= 1024px */}
<div className="hidden lg:flex justify-between items-center px-8 py-4 bg-white/70 dark:bg-[#2c1e12]/70 backdrop-blur-md border-b border-[#cadfdf] dark:border-[#d7a370]/20 mb-4">
  <h1 className="text-xl font-bold text-[#425c5a] dark:text-[#e2eceb]">
    {view === 'dashboard' ? 'Dashboard' : 
     view === 'list' ? 'Daftar Berkas' :
     view === 'settings' ? 'Pengaturan' : 
     view === 'storage' ? 'Storage' :
     view === 'logs' ? 'History Log' : 'Aplikasi'}
  </h1>
  
  <div className="flex items-center gap-4">
    {/* Lonceng Notifikasi untuk Desktop */}
    <NotificationBell isDarkMode={isDarkMode} colors={colors} />
    
    {/* Dark Mode Toggle */}
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      {isDarkMode ? 
        <Sun size={20} className="text-[#d7a217]" /> : 
        <Moon size={20} className="text-[#d7a217]" />
      }
    </button>
  </div>
</div>

        <main className="flex-grow p-6 lg:p-8 overflow-y-auto scrollbar-hide text-left print:hidden bg-gradient-to-br from-[#faf7f2] to-[#f0e9db] dark:from-[#2c1e12] dark:to-[#1f1510]">
  
          {/* Dashboard View */}
          {view === 'dashboard' && (
            <DashboardView 
              filteredProposals={proposals.filteredProposals}
              tahapList={masterData.tahapList}
              tahunList={masterData.tahunList}
              selectedTahap={proposals.selectedTahap}
              setSelectedTahap={proposals.setSelectedTahap}
              selectedYear={proposals.selectedYear}
              setSelectedYear={proposals.setSelectedYear}
              setCurrentPage={setCurrentPage}
              setView={setView}
              proposals={proposals}
              branding={branding}
              isDarkMode={isDarkMode}
            />
          )}

          {/* List View */}
          {view === 'list' && (
            <ProposalListView 
              currentUserProfile={currentUserProfile}
              proposals={proposals}
              masterData={masterData}
              setSelectedProposal={setSelectedProposal}
              setLocalCatatan={setLocalCatatan}
              setView={setView}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              setDeleteConfirm={setDeleteConfirm}
              addNotification={addNotification}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              handleBulkFinalize={proposals.updateProposalStatus}
            />
          )}

          {/* Add/Edit Form View */}
          {view === 'add-proposal' && (
            <ProposalFormView 
              currentUserProfile={currentUserProfile}
              proposals={proposals}
              masterData={masterData}
              setView={setView}
              addNotification={addNotification}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              selectedProposal={selectedProposal}
              localCatatan={localCatatan}
              setLocalCatatan={setLocalCatatan}
              commentText={commentText}
              setCommentText={setCommentText}
            />
          )}

          {/* Detail View */}
          {view === 'detail' && selectedProposal && (
            <ProposalDetailView 
              currentUserProfile={currentUserProfile}
              proposals={proposals}
              masterData={masterData}
              setView={setView}
              addNotification={addNotification}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              selectedProposal={selectedProposal}
              setSelectedProposal={setSelectedProposal}
              localCatatan={localCatatan}
              setLocalCatatan={setLocalCatatan}
              commentText={commentText}
              setCommentText={setCommentText}
              handleFinalize={proposals.updateProposalStatus}
              handleAddComment={proposals.addComment}
            />
          )}

          {/* Panduan View */}
          {view === 'panduan' && (
            <PanduanView branding={branding} />
          )}

          {/* Settings View */}
          {view === 'settings' && currentUserProfile?.level === 'Admin' && (
            <SettingsView 
              currentUserProfile={currentUserProfile}
              masterData={masterData}
              addNotification={addNotification}
              setDeleteConfirm={setDeleteConfirm}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          )}

          {/* Storage View */}
          {view === 'storage' && currentUserProfile?.level === 'Admin' && (
            <StorageView 
              addNotification={addNotification}
              setDeleteConfirm={setDeleteConfirm}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              user={user}
              storage={storage}
              checkStorageUsage={checkStorageUsage}
              backupAllFiles={backupAllFiles}
              restoreFromBackup={restoreFromBackup}
              cleanupOrphanFiles={cleanupOrphanFiles}
            />
          )}

          {/* Logs View */}
          {view === 'logs' && currentUserProfile?.level === 'Admin' && (
            <LogsView 
              addNotification={addNotification}
              activityLogs={activityLogs}
              loading={loadingLogs}
              onRefresh={refreshLogs}
            />
          )}
        </main>
      </div>

      {/* ===== NOTIFIKASI FLOATING TRANSPARAN ===== */}
      <div 
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
          maxWidth: '384px',
          width: '100%',
          pointerEvents: 'none'
        }}
      >
        {notifications.map((n, index) => (
          <div
            key={n.id}
            style={{
              pointerEvents: 'auto',
              width: '100%',
              transform: 'translateX(100%)',
              opacity: 0,
              animation: `slideInFromRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              animationDelay: `${index * 100}ms`
            }}
          >
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: n.type === 'success' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
                backgroundColor: n.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'
              }}
            >
              {/* Efek Glow */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.2,
                  filter: 'blur(24px)',
                  backgroundColor: n.type === 'success' ? '#10b981' : '#f43f5e'
                }}
              />
              
              {/* Konten Notifikasi */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '20px'
              }}>
                {/* Icon Container */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    border: n.type === 'success' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(244, 63, 94, 0.5)',
                    backgroundColor: n.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)',
                    color: n.type === 'success' ? '#6ee7b7' : '#fda4af'
                  }}
                >
                  {n.type === 'success' 
                    ? <CheckCircle size={22} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }} />
                    : <AlertTriangle size={22} style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }} />
                  }
                </div>
                
                {/* Teks */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '4px',
                    color: n.type === 'success' ? '#6ee7b7' : '#fda4af'
                  }}>
                    {n.type === 'success' ? '✓ SUKSES' : '⚠️ PERINGATAN'}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.9)',
                    lineHeight: '1.5',
                    wordBreak: 'break-word'
                  }}>
                    {String(n.message || "")}
                  </p>
                </div>
                
                {/* Tombol Close */}
                <button
                  onClick={() => removeNotification(n.id)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Progress Bar */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '4px',
                  width: '100%',
                  animation: 'progressShrink 5s linear forwards',
                  backgroundColor: n.type === 'success' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(244, 63, 94, 0.5)'
                }}
                onAnimationEnd={() => removeNotification(n.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Style Animations */}
      <style>{`
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(100%);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes progressShrink {
          0% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
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
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

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
    setView={setView}           // <-- TAMBAHKAN INI
    proposals={proposals}       // <-- TAMBAHKAN INI
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

      {/* Global Notifications */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[500] flex flex-col items-center gap-2 max-w-[calc(100vw-3rem)] pointer-events-none">
        {notifications.map(n => (
          <div 
            key={n.id} 
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl border animate-in slide-in-from-top-full fade-in backdrop-blur-md ${
              n.type === 'success' 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {n.type === 'success' 
              ? <CheckCircle size={20} className="flex-shrink-0" /> 
              : <AlertTriangle size={20} className="flex-shrink-0" />
            }
            <p className="text-xs font-black truncate tracking-tighter uppercase text-white">
              {String(n.message || "")}
            </p>
            <button 
              onClick={() => removeNotification(n.id)} 
              className="ml-2 opacity-60 hover:opacity-100 text-white"
            >
              <X size={16}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainLayout;
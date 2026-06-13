import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import EntryPage from '@/pages/entry/EntryPage';
import CoupleDashboard from '@/pages/couple/CoupleDashboard';
import PreferencePage from '@/pages/couple/PreferencePage';
import RecommendationPage from '@/pages/couple/RecommendationPage';
import CompanyDashboard from '@/pages/company/CompanyDashboard';
import PlanCreatePage from '@/pages/company/PlanCreatePage';
import SupplierDashboard from '@/pages/supplier/SupplierDashboard';
import QuotesPage from '@/pages/supplier/QuotesPage';
import FinanceDashboard from '@/pages/finance/FinanceDashboard';
import ContractPage from '@/pages/shared/ContractPage';
import TasksPage from '@/pages/shared/TasksPage';
import PaymentPage from '@/pages/shared/PaymentPage';
import FilesPage from '@/pages/shared/FilesPage';
import ReviewsPage from '@/pages/shared/ReviewsPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 入口页 */}
        <Route path="/" element={<EntryPage />} />

        {/* 新人端 */}
        <Route element={<AppLayout />}>
          <Route path="/couple" element={<CoupleDashboard />} />
          <Route path="/couple/preference" element={<PreferencePage />} />
          <Route path="/couple/recommendation" element={<RecommendationPage />} />
          <Route path="/couple/payment" element={<PaymentPage />} />
          <Route path="/couple/files" element={<FilesPage />} />
          <Route path="/couple/reviews" element={<ReviewsPage />} />
        </Route>

        {/* 婚庆公司端 */}
        <Route element={<AppLayout />}>
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/company/plan/create" element={<PlanCreatePage />} />
          <Route path="/company/plan/:id" element={<PlanCreatePage />} />
        </Route>

        {/* 供应商端 */}
        <Route element={<AppLayout />}>
          <Route path="/supplier" element={<SupplierDashboard />} />
          <Route path="/supplier/quotes" element={<QuotesPage />} />
        </Route>

        {/* 财务端 */}
        <Route element={<AppLayout />}>
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/finance/orders" element={<FinanceDashboard />} />
          <Route path="/finance/vendors" element={<FinanceDashboard />} />
        </Route>

        {/* 共享页面 */}
        <Route element={<AppLayout />}>
          <Route path="/contract/:id" element={<ContractPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/files" element={<FilesPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>

        {/* 默认重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

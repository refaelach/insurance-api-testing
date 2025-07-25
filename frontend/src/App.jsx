import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PolicyDetails from './pages/PolicyDetails';
import Profile from './pages/Profile';
import Search from './pages/Search';
import AdminPanel from './pages/AdminPanel';
import CustomerProfile from './pages/CustomerProfile';
import AccountOverview from './pages/AccountOverview';
import VulnerablePolicyDetails from './pages/VulnerablePolicyDetails';
import ContactSupport from './pages/ContactSupport';
import DocumentPreview from './pages/DocumentPreview';
import AdminReports from './pages/AdminReports';
import UserPreferences from './pages/UserPreferences';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated, isAdmin } from './utils/auth';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          
          <Route 
            path="/register" 
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/policy/:id" 
            element={
              <ProtectedRoute>
                <Layout>
                  <PolicyDetails />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/search" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Search />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Natural insurance application routes with vulnerabilities */}
          <Route 
            path="/my-profile" 
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerProfile />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/billing" 
            element={
              <ProtectedRoute>
                <Layout>
                  <AccountOverview />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Vulnerable policy access - no authentication required */}
          <Route 
            path="/my-policy" 
            element={
              <Layout>
                <VulnerablePolicyDetails />
              </Layout>
            } 
          />
          

          
          {/* Contact Support - Verbose Error Disclosure */}
          <Route 
            path="/contact" 
            element={
              <Layout>
                <ContactSupport />
              </Layout>
            } 
          />
          
          {/* Document Preview - SSRF */}
          <Route 
            path="/documents" 
            element={
              <Layout>
                <DocumentPreview />
              </Layout>
            } 
          />
          
          {/* User Preferences - Mass Assignment */}
          <Route 
            path="/preferences" 
            element={
              <ProtectedRoute>
                <Layout>
                  <UserPreferences />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin-only routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                {isAdmin() ? (
                  <Layout>
                    <AdminPanel />
                  </Layout>
                ) : (
                  <Navigate to="/dashboard" replace />
                )}
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminReports />
                </Layout>
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

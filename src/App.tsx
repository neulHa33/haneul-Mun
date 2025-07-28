import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Contents from './pages/Contents';
import CreateContent from './pages/CreateContent';
import EditContent from './pages/EditContent';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar activePage="" onPageChange={() => {}} />
          <main className="flex-1 bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/contents" element={<Contents />} />
              <Route path="/contents/create" element={<CreateContent />} />
              <Route path="/contents/:id" element={<EditContent />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

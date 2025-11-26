// App.tsx (FINAL E ESTRUTURALMENTE CORRETO)

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes e Dados (Certifique-se de que todos estes imports estão corretos)
import LogoGrid from './src/components/LogoGrid.tsx';
import WhiteLabelPage from './src/components/WhiteLabelPage.tsx';
import Login from './src/pages/Login.tsx';
import Dashboard from './src/pages/Dashboard.tsx';
import GestaoCentral from './src/pages/Gestao/GestaoCentral.tsx'; 
import AlunoManager from './src/pages/Gestao/AlunoManager.tsx'; 
import InstrutorManager from './src/pages/Gestao/InstrutorManager.tsx'; 
import FaixaManager from './src/pages/Gestao/FaixaManager.tsx'; 
import { schools, ASSOCIATION_DATA } from './src/constants.ts';
import type { School } from './src/types';

// Contexto e Autenticação (IMPORT CORRETO PARA AuthProvider e useAuth)
import { AuthProvider, useAuth } from './src/contexts/AuthContext.tsx';
import { PrivateRoute } from './src/components/PrivateRoute.tsx'; 

// --- 1. Componente que carrega a Escola e o Layout ---
const SchoolPortalLayout: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  // USAR useAuth() CORRETAMENTE AQUI
  const { isLoading } = useAuth(); 
  
  const selectedSchool = schools.find(s => String(s.id) === schoolId) as
    | School
    | undefined;

  if (isLoading) return <div>Carregando...</div>;

  if (!selectedSchool) {
    return <Navigate to="/" replace />;
  }

  return <WhiteLabelPage school={selectedSchool} />;
};

// --- 2. Componente de Rotas (Principal) ---
const AppRoutes: React.FC = () => {
  const isGridPage = window.location.pathname === '/'; 

  return (
    // ELEMENTO RAIZ ÚNICO: min-h-screen (flex vertical) e overflow-x-hidden
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col overflow-x-hidden">
      
      {/* 1. HEADER CONDICIONAL */}
      {isGridPage && (
          <header className="py-6 text-center">
             <div className="flex justify-center items-center gap-4">
                 <img src={ASSOCIATION_DATA.logoUrl} alt="Logo da Associação" className="h-14 w-14 border-2 border-gray-700 rounded-md" />
                 <div>
                     <h1 className="text-4xl font-bold text-yellow-400 tracking-wider" style={{ fontFamily: 'serif' }}>
                         {ASSOCIATION_DATA.name}
                     </h1>
                     <p className="text-gray-400">Portal de Gerenciamento das Escolas</p>
                 </div>
             </div>
          </header>
      )}
        
      {/* 2. MAIN CONTENT AREA: flex-grow garante que ele ocupe todo o espaço restante */}
      <main className="flex-grow w-full flex justify-center">
            <Routes>
                <Route path="/" element={
                    <div className="container mx-auto px-4 flex-grow flex items-center justify-center">
                        <LogoGrid schools={schools} />
                    </div>
                } />
                <Route path="/:schoolId/login" element={<Login />} />
                <Route path="/portal/:schoolId" element={<PrivateRoute element={<SchoolPortalLayout />} />} >
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} /> 
                    <Route path="cadastros" element={<GestaoCentral />} >
                        <Route index element={<Navigate to="alunos" replace />} />
                        <Route path="alunos" element={<AlunoManager />} /> 
                        <Route path="instrutores" element={<InstrutorManager />} />
                        <Route path="faixas" element={<FaixaManager />} /> 
                    </Route>
                    <Route path="historico-aulas" element={<div>Histórico de Aulas (Em Breve)</div>} />
                    <Route path="programacao-aulas" element={<div>Programação de Aulas (Em Breve)</div>} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
      </main>
        
      {/* 3. FOOTER CONDICIONAL */}
      {isGridPage && (
            <footer className="w-full text-center py-4 mt-auto border-t border-gray-700">
                 <p className="text-gray-500 text-sm">
                     &copy; {new Date().getFullYear()} International Traditional Kung Fu Association. Todos os direitos reservados.
                 </p>
            </footer>
      )}
      
      {/* 4. TOAST CONTAINER */}
      <ToastContainer /> 
    </div>
  );
};

// --- 3. Componente Principal (Provider Wrapper) ---
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';

// Layout
import Layout from './components/ui/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewWorkoutPage from './pages/NewWorkoutPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import WorkoutHistoryPage from './pages/WorkoutHistoryPage';
import CoachPage from './pages/CoachPage';
import ExercisesPage from './pages/ExercisesPage';
import ProgressPage from './pages/ProgressPage';

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="workouts/new" element={<NewWorkoutPage />} />
          <Route path="workouts/history" element={<WorkoutHistoryPage />} />
          <Route path="workouts/:id" element={<WorkoutDetailPage />} />
          <Route path="coach" element={<CoachPage />} />
          <Route path="exercises" element={<ExercisesPage />} />
          <Route path="progress" element={<ProgressPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

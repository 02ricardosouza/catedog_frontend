import { AuthProvider } from '../store/auth';
import { AppRoutes } from './routes';
import '../styles/tokens.css';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}

export default App;

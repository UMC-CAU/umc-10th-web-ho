import './App.css';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GoogleOAuthCallbackPage from './pages/GoogleOAuthCallbackPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';


const router = createBrowserRouter([
  {
    path: '/',
    element:<HomePage/>,
    errorElement:<NotFoundPage/>,
    children:[
      {
        path:'movies/:category',
        element:<MoviePage/>,
      },

      {
        path:'movie/:movieId',
        element:<MovieDetailPage/>,
      },
    
    ]
    
  },
  
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/auth/google/callback',
    element: <GoogleOAuthCallbackPage />,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  }
]);




function App() {
    console.log(import.meta.env.VITE_TMDB_KEY);
    
  return (
    <RouterProvider router={router} />
  )
}

export default App;
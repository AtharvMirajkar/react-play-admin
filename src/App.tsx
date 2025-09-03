import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './components/Dashboard/Dashboard';
import UserList from './components/Users/UserList';
import UserProfile from './components/Users/UserProfile';
import PostList from './components/Posts/PostList';
import PostDetail from './components/Posts/PostDetail';
import ReportList from './components/Reports/ReportList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/:userId" element={<UserProfile />} />
            <Route path="posts" element={<PostList />} />
            <Route path="posts/:postId" element={<PostDetail />} />
            <Route path="reports" element={<ReportList />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
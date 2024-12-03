import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './components/MainPage';
import Footer from './components/Footer';
import MovieDetails from './pages/MovieDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import WatchList from './pages/WatchList';

function App() {
  return (
    <Router>
      <div className="App">
      <Header />
      <Routes>
            <Route path="/" element={<MainPage />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/watchlist" element={<WatchList />} />
      </Routes>
      <Footer />
      </div>
    </Router>
  );
}

export default App;

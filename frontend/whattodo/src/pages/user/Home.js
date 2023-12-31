import React, { useState, useEffect, useContext } from 'react';
import './Home.css';
import NavBar from '../../components/NavBar/NavBar';
import CardList from '../../components/Cards/Cards';
import Hero from '../../components/HeroSection/HeroSection';
import Footer from '../../components/Footer/Footer';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen'; 
import CategoriesList from '../../components/CategoriesList/CategoriesList';

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); 
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="home-container">
      <NavBar  /> 
      <Hero />
      <section><CardList /></section>
      <section><CategoriesList /></section>
      <Footer />
    </div>
  );
};

export default Home;


import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import { HomePageHeader } from './components/HomePageHeader';
import { Report } from './components/Report';

const App = ({ data }) => {
  return (
    <div className="App">
      <HomePageHeader />
      <Report data={data} />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App data={data} />);

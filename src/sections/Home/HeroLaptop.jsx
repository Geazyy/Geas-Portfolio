'use client';

import { Component } from 'react';
import dynamic from 'next/dynamic';
import LaptopFallback from './LaptopFallback';

const ThreeLaptop = dynamic(() => import('./ThreeLaptop'), {
  ssr: false,
  loading: () => <div className="hero-three-laptop">
    <div className="hero-three-stage hero-three-loading"><LaptopFallback closed /></div>
    <span className="hero-three-reset hero-three-reset-placeholder" aria-hidden="true">Reset view</span>
  </div>,
});

class LaptopBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <LaptopFallback /> : this.props.children; }
}

export default function HeroLaptop() {
  return <LaptopBoundary><ThreeLaptop /></LaptopBoundary>;
}

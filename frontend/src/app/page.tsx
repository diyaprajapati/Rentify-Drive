"use client"
import React, { useEffect, useState } from 'react';
import { ChevronRight, Car, Shield, CreditCard, Star, ArrowRight, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Particles from '@/components/particles';
import AnimatedGradientText from '@/components/animated-gradient-text';
import FeatureCard from '@/components/feature-card';
import Link from 'next/link';

const CarRentalLanding = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden relative">
      <Particles />

      {/* Gradient Orb */}
      <div
        className="fixed pointer-events-none opacity-30 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
      />

      {/* Header */}
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center backdrop-blur-sm border-b border-white/10">
        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Rentify Drive
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 relative group">
              Vehicles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 relative group">
              Locations
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </a></li>
            <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </a></li>
          </ul>
        </nav>
        <Link href="/signin">
          <Button variant="outline" className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10">
            Sign In
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="animate-fade-in">
            <AnimatedGradientText>
              <Zap className="w-4 h-4" />
              <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />
              <span className="inline animate-gradient bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
                The Future is Here
              </span>
              <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedGradientText>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 mt-8 animate-fade-in animation-delay-200 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent leading-tight">
            Redefine Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Journey
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-300 animate-fade-in animation-delay-400 leading-relaxed">
            Experience the evolution of car rental with AI-powered matching, instant booking, and luxury vehicles at your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-600">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-16 animate-fade-in animation-delay-800">
            <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>4.9/5 rating</span>
              </div>
              <div className="h-4 w-px bg-gray-600"></div>
              <span>10,000+ happy customers</span>
              <div className="h-4 w-px bg-gray-600"></div>
              <span>50+ cities worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="border-purple-400/50 text-purple-400 mb-4">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Why Choose Rentify Drive?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the perfect blend of technology, luxury, and convenience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Car}
              title="Premium Fleet"
              description="Access to the latest luxury and electric vehicles with cutting-edge technology."
              gradient="from-blue-500 to-cyan-400"
            />
            <FeatureCard
              icon={Shield}
              title="Complete Protection"
              description="Full comprehensive insurance and 24/7 roadside assistance included."
              gradient="from-green-500 to-emerald-400"
            />
            <FeatureCard
              icon={CreditCard}
              title="Instant Booking"
              description="Book in seconds with our AI-powered smart matching and seamless payments."
              gradient="from-purple-500 to-pink-400"
            />
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="From booking to keys in under 2 minutes with our mobile-first experience."
              gradient="from-yellow-500 to-orange-400"
            />
            <FeatureCard
              icon={Globe}
              title="Global Network"
              description="Available in 50+ cities worldwide with consistent premium service."
              gradient="from-indigo-500 to-purple-400"
            />
            <FeatureCard
              icon={Star}
              title="5-Star Service"
              description="Rated #1 in customer satisfaction with dedicated concierge support."
              gradient="from-pink-500 to-rose-400"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>
            <Card className="relative bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Ready to Transform Your Travel?
                </h2>
                <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
                  Join the revolution in car rental. Experience luxury, convenience, and innovation like never before.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25">
                  Start Your Journey Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                Rentify Drive
              </div>
              <p className="text-gray-400 mb-4">
                Redefining car rental with cutting-edge technology and unmatched service.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Car Rental</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Corporate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Long-term</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              &copy; 2024 Rentify Drive. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CarRentalLanding;
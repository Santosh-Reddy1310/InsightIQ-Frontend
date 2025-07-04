'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Brain, BarChart3, Zap, Shield, Users, TrendingUp } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-black">
      <div className="container mx-auto px-6 py-24">
        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-full text-black dark:text-white text-sm font-medium mb-6 border border-gray-200 dark:border-gray-800">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Data Science Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-6 leading-tight">
            Transform Your Data Into
            <span className="block">
              Actionable Insights
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
            Upload your datasets and let our AI analyze, visualize, and predict outcomes with enterprise-grade accuracy. No coding required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 px-8 py-3 text-lg font-semibold">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced machine learning algorithms automatically analyze your data and provide intelligent insights.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">Smart Visualization</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Beautiful, interactive charts and graphs that make complex data easy to understand and share.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-3">Predictive Models</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Build and deploy machine learning models that predict future outcomes with high accuracy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-500 mb-8">Trusted by data teams at leading companies</p>
          <div className="flex items-center justify-center space-x-8 text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">10,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
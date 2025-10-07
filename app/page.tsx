'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Trophy, FileCheck, ArrowRight, Zap, Target, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import Link from 'next/link';

const Index = () => {
  return (
    <div className="min-h-screen bg-background ">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden flex justify-center">
        <div className="absolute inset-0 z-0 bg-hero-pattern bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />

        <div className="container relative z-10 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm shadow-sm">
              <Bot className="h-4 w-4 text-primary" />
              <span>Professional RPA Certification Platform</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Master Automation
              </span>
              <br />
              <span className="text-foreground">Get Certified</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Prove your Rocketbot automation skills through hands-on challenges and earn your official certification
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/challenge">
                <Button size="lg" className="w-full sm:w-auto shadow-[var(--shadow-primary)]">
                  <Trophy className="mr-2 h-5 w-5" />
                  Start Challenge
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/certification">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <FileCheck className="mr-2 h-5 w-5" />
                  Apply for Certification
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Why Get Certified?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Boost your career with recognized RPA credentials
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-primary)] transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Practical Skills</CardTitle>
              <CardDescription>
                Test your abilities with real-world automation challenges that mirror actual RPA scenarios
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-primary)] transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Industry Recognition</CardTitle>
              <CardDescription>
                Earn credentials that are recognized by leading companies in the automation industry
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-primary)] transition-all duration-300 border-2 hover:border-primary/50">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Career Growth</CardTitle>
              <CardDescription>
                Stand out in the job market and unlock new opportunities in the rapidly growing RPA field
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 mx-auto">
        <Card className="shadow-[var(--shadow-primary)] bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
          <CardContent className="py-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Begin?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your path: test your skills with the challenge or apply for official certification
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/challenge">
                <Button size="lg" className="w-full sm:w-auto">
                  Take the Challenge
                </Button>
              </Link>
              <Link href="/certification">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Get Certified
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;

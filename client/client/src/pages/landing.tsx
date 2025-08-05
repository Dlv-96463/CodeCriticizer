import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Shield, Zap, Users, ArrowRight, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-gray-950 dark:via-gray-900 dark:to-primary/10 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 dots-bg opacity-30" />
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full animate-pulse float-animation" />
        <div className="absolute top-1/3 -left-8 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full animate-pulse delay-1000" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full animate-pulse delay-500 float-animation" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-primary/5 to-transparent rounded-full animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <header className="relative z-10 glass border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative bg-background/80 p-2 rounded-lg">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground/70 bg-clip-text text-transparent">
                CodeAnalyzer AI
              </span>
              <div className="text-xs text-muted-foreground">Next-Gen Analysis</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button className="btn-glow bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary hover:to-primary/70 shadow-lg shadow-primary/25" asChild>
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary mb-4">
                <Sparkles className="mr-2 h-4 w-4" />
                Powered by Advanced AI
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Next-Gen Code
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Analysis
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Experience intelligent code reviews with real-time security analysis, 
                performance optimization, and style improvements powered by cutting-edge AI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="btn-glow bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary hover:to-primary/70 shadow-2xl shadow-primary/30 px-10 py-7 text-lg font-semibold group relative overflow-hidden"
                asChild
              >
                <a href="/api/login" className="flex items-center relative z-10">
                  <Sparkles className="mr-3 h-5 w-5 animate-pulse" />
                  Get Started Free
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-all duration-300" />
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="glass border-primary/30 hover:bg-primary/10 hover:border-primary/50 px-10 py-7 text-lg font-medium backdrop-blur-xl transition-all duration-300 group"
              >
                <ArrowRight className="mr-2 h-5 w-5 rotate-90 group-hover:rotate-0 transition-transform duration-300" />
                View Demo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  description: "Sub-second analysis with optimized AI models and real-time feedback",
                  gradient: "from-yellow-500 to-orange-500"
                },
                {
                  icon: Shield,
                  title: "Security First",
                  description: "Advanced vulnerability detection and threat analysis built-in",
                  gradient: "from-green-500 to-emerald-500"
                },
                {
                  icon: Code,
                  title: "Universal Support",
                  description: "20+ programming languages with intelligent syntax understanding",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description: "Seamless sharing and team-wide analysis history tracking",
                  gradient: "from-purple-500 to-pink-500"
                }
              ].map((feature, index) => (
                <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                  <CardHeader className="pb-4">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
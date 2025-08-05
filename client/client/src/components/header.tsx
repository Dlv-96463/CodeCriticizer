import { Code, User, LogOut, History, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import type { User as UserType } from '@shared/schema';

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const typedUser = user as UserType;

  return (
    <header className="glass border-b border-border/40 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative p-2 rounded-lg" style={{background: 'hsl(var(--background) / 0.8)'}}>
                <Code className="h-6 w-6 text-primary" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground/70 bg-clip-text text-transparent">
                CodeAnalyzer AI
              </h1>
              <p className="text-xs text-muted-foreground">Next-Gen Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {isAuthenticated && typedUser ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-background/50 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
                
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {typedUser.firstName?.charAt(0) || typedUser.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">
                      {typedUser.firstName ? `${typedUser.firstName} ${typedUser.lastName || ''}`.trim() : 'User'}
                    </div>
                  </div>
                </div>
                
                <Button 
                  asChild 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <a href="/api/logout" className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </a>
                </Button>
              </div>
            ) : (
              <Button 
                asChild
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
              >
                <a href="/api/login" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

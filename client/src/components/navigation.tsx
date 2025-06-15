import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Home, Search, Building, User, Menu, X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import SimpleLanguageSwitcher, { useLanguage } from "@/components/simple-language-switcher";
import { useTranslation } from "@/lib/translations";

export default function Navigation() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const navItems = [
    { path: "/", label: t('home'), icon: Home, public: true },
    { path: "/browse", label: t('browse'), icon: Search, public: true },
    { path: "/messages", label: t('messages'), icon: MessageCircle, public: false },
    { path: "/dashboard", label: t('dashboard'), icon: Building, public: false },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-primary">MbendeStay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (!item.public && !isAuthenticated) return null;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "text-neutral-700 hover:text-primary font-medium transition-colors",
                    location === item.path && "text-primary"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {!isAuthenticated ? (
              <Link href="/register-landlord">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  List Your Property
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  Dashboard
                </Button>
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <SimpleLanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={`${user.firstName || 'User'} Profile`} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-neutral-600" />
                  )}
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-medium text-neutral-900">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email}
                  </span>
                  {user?.isAdmin && (
                    <span className="text-xs text-primary font-medium">Admin</span>
                  )}
                </div>
                <a 
                  href="/api/logout"
                  className="text-sm text-neutral-600 hover:text-primary transition-colors font-medium"
                >
                  Logout
                </a>
              </div>
            ) : (
              <a 
                href="/api/login"
                className="flex items-center space-x-2 text-neutral-600 hover:text-primary transition-colors bg-neutral-50 hover:bg-neutral-100 px-4 py-2 rounded-full border border-neutral-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="hidden md:inline text-sm font-medium">Sign in with Replit</span>
              </a>
            )}
            
            <button 
              className="md:hidden text-neutral-600 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => {
                if (!item.public && !isAuthenticated) return null;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "text-neutral-700 hover:text-primary font-medium transition-colors flex items-center space-x-2",
                      location === item.path && "text-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {!isAuthenticated ? (
                <Link href="/register-landlord" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="bg-primary text-white hover:bg-primary/90 w-full">
                    List Your Property
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="bg-primary text-white hover:bg-primary/90 w-full">
                    Dashboard
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

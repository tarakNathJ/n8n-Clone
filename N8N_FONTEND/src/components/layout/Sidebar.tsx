import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Workflow, 
  Settings, 
  Users, 
  BarChart3,
  FileText,
  Key,
  HelpCircle,
  ChevronLeft,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { path: '/dashboard', label: 'Overview', icon: Home },
  { path: '/workflows', label: 'Workflows', icon: Workflow },
];

const resourceItems = [
  { path: '/credentials', label: 'Credentials', icon: Key },
  // { path: '/templates', label: 'Templates', icon: FileText },
  // { path: '/users', label: 'Users', icon: Users },
];

const bottomItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/help', label: 'Help', icon: HelpCircle },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();

  const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <NavLink
        to={item.path}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          'hover:bg-n8n-header hover:text-n8n-canvas-foreground',
          isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'text-n8n-sidebar-foreground'
        )}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {!collapsed && <span>{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <div className={cn(
      'flex flex-col bg-n8n-sidebar border-r border-n8n-node-border transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-n8n-node-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">n8</span>
            </div>
            <span className="font-semibold text-n8n-sidebar-foreground">n8n Clone</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-n8n-sidebar-foreground hover:bg-n8n-header"
        >
          <ChevronLeft className={cn(
            'h-4 w-4 transition-transform',
            collapsed && 'rotate-180'
          )} />
        </Button>
      </div>

      {/* Create Workflow Button
      <div className="p-4 border-b border-n8n-node-border">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          {!collapsed && 'Create Workflow'}
        </Button>
      </div> */}

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6">
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 py-2 text-xs font-medium text-n8n-sidebar-foreground/60 uppercase tracking-wide">
              Main
            </div>
          )}
          {navigationItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 py-2 text-xs font-medium text-n8n-sidebar-foreground/60 uppercase tracking-wide">
              Resources
            </div>
          )}
          {resourceItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 space-y-1 border-t border-n8n-node-border">
        {bottomItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
        
        {/* User Profile */}
        {!collapsed && user && (
          <div className="mt-4 p-3 bg-n8n-header rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-medium text-primary-foreground">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-n8n-sidebar-foreground truncate">
                  {user.name}
                </div>
                <div className="text-xs text-n8n-sidebar-foreground/60 truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
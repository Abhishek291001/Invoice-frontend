import { LayoutDashboard, FileText, Users, LogOut, ChevronRight } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard, roles: ['superadmin', 'admin', 'viewer'] },
    { title: 'Brands', url: '/brands', icon: Users, roles: ['superadmin', 'admin'] },
  { title: 'Invoices', url: '/invoices', icon: FileText, roles: ['superadmin', 'admin', 'viewer'] },
  { title: 'Clients', url: '/clients', icon: Users, roles: ['superadmin', 'admin'] },
  { title: 'Admins', url: '/admins', icon: Users, roles: ['superadmin'] },
  { title: 'Viewers', url: '/viewers', icon: Users, roles: ['superadmin', 'admin'] },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, signOut } = useAuth();
  const currentPath = location.pathname;

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const userInitials = user?.email?.substring(0, 2).toUpperCase() || 'U';

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'superadmin':
        return 'bg-destructive text-destructive-foreground';
      case 'admin':
        return 'bg-primary text-primary-foreground';
      case 'viewer':
        return 'bg-secondary text-secondary-foreground';
      default:
        return '';
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          {open && (
            <span className="text-lg font-semibold">Invoice Pro</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
              .filter(item => item.roles.includes(userRole))
              .map((item) => {
                const isActive = currentPath === item.url || currentPath.startsWith(item.url + '/');
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {open && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                  <Badge className={`text-xs ${getRoleBadgeColor()}`}>
                    {userRole}
                  </Badge>
                </div>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

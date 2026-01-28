// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Calendar, FolderKanban, TrendingUp, Bell, Eye, ChevronRight } from 'lucide-react';

import { Header } from './components/Header';
import { TaskProgressChart } from './components/line,bar,pie charts/TaskProgressChart';
import type { WorkspaceItem, TaskDataItem, Employee } from './components/types';
import { IconHome, IconUser, IconSettings } from "@tabler/icons-react";

import { Sidebar, SidebarBody, SidebarLink } from "./components/Sidebar";
import { FunnelChartComponent } from './components/FunnelChartComponent';
import AreaChartFillByValue from './components/line,bar,pie charts/AreaChart';
import MyChoropleth from './components/Choropleth';
import MyAreaBump from './components/line,bar,pie charts/AreaBump';


const workspaces: WorkspaceItem[] = [
  {id: 'ws-1', name: 'Pertamina', color: 'bg-orange-500' },
  {id: 'ws-2', name: 'SCBD Tower', color: 'bg-red-500' },
  {id: 'ws-3', name: 'Beos Hotel', color: 'bg-orange-500' },
];

const taskData: TaskDataItem[] = [
  { day: 'Mon', value1: 75, value2: 65 },
  { day: 'Tue', value1: 85, value2: 70 },
  { day: 'Wed', value1: 70, value2: 80 },
  { day: 'Thu', value1: 90, value2: 75 },
  { day: 'Fri', value1: 95, value2: 68 },
  { day: 'Sat', value1: 78, value2: 85 },
  { day: 'Sun', value1: 88, value2: 72 },
];

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('dashboard');

  // Chart sections array (to avoid repeated code)
  const chartSections = Array(5).fill(taskData);

  return (
   <div className="flex h-screen 
  bg-gradient-to-br 
  from-[#050b2e] 
  via-[#0f172a] 
  to-[#1b0f3a] 
  text-gray-100">
      {/* Sidebar */}
      <Sidebar>
        <SidebarBody>
          <div className="flex flex-col gap-4 mt-8">
            <SidebarLink link={{ label: "Home", href: "/", icon: <IconHome /> }} />
            <SidebarLink link={{ label: "Profile", href: "/profile", icon: <IconUser /> }} />
            <SidebarLink link={{ label: "Settings", href: "/settings", icon: <IconSettings /> }} />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-auto scrollbar-hide text-gray-100">
        <div className="sticky top-0 z-20">
    <Header />
  </div>
        {/* Loop over chart sections */}
      <div className="px-5 mt-6">
  <div className="h-12 flex items-center font-medium text-gray-700">
    Time Series Chart
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
    <TaskProgressChart data={chartSections[0]} />
    <AreaChartFillByValue/>
    <MyAreaBump/>
    
  </div>
</div>
      </main>
    </div>
  );
}

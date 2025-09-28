import React, { useState, useEffect, type JSX } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, XCircle, Clock, Users, TrendingUp, Leaf, DollarSign, Eye, ThumbsUp, ThumbsDown, AlertCircle, Home, FileText, Settings, LogOut, User, Shield, Info, ShoppingCart, Star } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  location: string;
  area: string;
  estimatedCredits: number;
  status: string;
  submittedDate: string;
  communityApproval: boolean;
  verifierApproval: boolean;
  aiApproval: boolean;
  adminApproval: boolean | null;
  projectType: string;
  description: string;
  coordinator: string;
  timeline: string;
  investmentRequired: string;
  ecosystemType: string;
  issuedCredits?: number;
}

interface DashboardData {
  totalProjects: number;
  pendingCommunity: number;
  pendingTechnical: number;
  pendingAdmin: number;
  approvedProjects: number;
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  ecosystemData: Array<{
    name: string;
    credits: number;
  }>;
}

interface MarketplaceListing {
  id: number;
  projectName: string;
  location: string;
  credits: number;
  pricePerCredit: number;
  totalValue: number;
  ecosystemType: string;
  vintage: string;
  verification: string;
  seller: string;
  rating: number;
}

interface MarketplaceData {
  marketStats: {
    totalListings: number;
    totalCreditsAvailable: number;
    averagePrice: number;
    totalMarketValue: number;
  };
  availableCredits: MarketplaceListing[];
}

interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  department: string;
}

interface Credentials {
  username: string;
  password: string;
}

const BlueCarbonAdminHub: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [marketplaceData, setMarketplaceData] = useState<MarketplaceData | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [showCreditModal, setShowCreditModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [approvalDecision, setApprovalDecision] = useState<string>('');
  const [approvalNotes, setApprovalNotes] = useState<string>('');
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@bluecarbon.org',
    role: 'Senior Administrator',
    department: 'Blue Carbon MRV'
  });

  // Mock data
  const mockDashboardData: DashboardData = {
    totalProjects: 127,
    pendingCommunity: 23,
    pendingTechnical: 18,
    pendingAdmin: 12,
    approvedProjects: 74,
    statusDistribution: [
      { name: 'Approved', value: 74, color: '#22c55e' },
      { name: 'Pending Community', value: 23, color: '#f59e0b' },
      { name: 'Pending Technical', value: 18, color: '#f97316' },
      { name: 'Pending Admin', value: 12, color: '#3b82f6' }
    ],
    ecosystemData: [
      { name: 'Mangrove', credits: 1250 },
      { name: 'Seagrass', credits: 890 },
      { name: 'Salt Marsh', credits: 500 }
    ]
  };

  const mockProjects: Project[] = [
    {
      id: 1,
      name: "Mangrove Restoration - Sundarbans",
      location: "West Bengal, India",
      area: "2,500 hectares",
      estimatedCredits: 15000,
      status: "pending_admin",
      submittedDate: "2024-09-15",
      communityApproval: true,
      verifierApproval: true,
      aiApproval: true,
      adminApproval: null,
      projectType: "Mangrove Restoration",
      description: "Large scale mangrove restoration project in the Sundarbans delta region focusing on biodiversity conservation and carbon sequestration.",
      coordinator: "Dr. Rajesh Kumar",
      timeline: "24 months",
      investmentRequired: "$2.5M",
      ecosystemType: "Mangrove"
    },
    {
      id: 2,
      name: "Seagrass Conservation - Gulf of Mannar",
      location: "Tamil Nadu, India",
      area: "1,800 hectares",
      estimatedCredits: 9500,
      status: "approved",
      submittedDate: "2024-08-28",
      communityApproval: true,
      verifierApproval: true,
      aiApproval: true,
      adminApproval: true,
      projectType: "Seagrass Conservation",
      description: "Conservation and restoration of seagrass beds in the Gulf of Mannar Marine National Park with community participation.",
      coordinator: "Prof. Meera Nair",
      timeline: "18 months",
      investmentRequired: "$1.8M",
      issuedCredits: 9500,
      ecosystemType: "Seagrass"
    }
  ];

  const mockMarketplaceData: MarketplaceData = {
    marketStats: {
      totalListings: 47,
      totalCreditsAvailable: 125000,
      averagePrice: 31.5,
      totalMarketValue: 3937500
    },
    availableCredits: [
      {
        id: 1,
        projectName: "Seagrass Conservation - Gulf of Mannar",
        location: "Tamil Nadu, India",
        credits: 2500,
        pricePerCredit: 32,
        totalValue: 80000,
        ecosystemType: "Seagrass",
        vintage: "2024",
        verification: "Gold Standard",
        seller: "Blue Carbon Foundation",
        rating: 4.8
      },
      {
        id: 2,
        projectName: "Mangrove Restoration - Andaman",
        location: "Andaman & Nicobar Islands",
        credits: 1800,
        pricePerCredit: 35,
        totalValue: 63000,
        ecosystemType: "Mangrove",
        vintage: "2024",
        verification: "VCS",
        seller: "Ocean Conservation Trust",
        rating: 4.9
      }
    ]
  };

  useEffect(() => {
    if (isAuthenticated) {
      setDashboardData(mockDashboardData);
      setProjects(mockProjects);
      setMarketplaceData(mockMarketplaceData);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getStatusBadge = (status: string): JSX.Element => {
    const config = {
      approved: { color: 'bg-emerald-100 text-emerald-800', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      pending_admin: { color: 'bg-blue-100 text-blue-800', text: 'Pending Admin' },
      pending_technical: { color: 'bg-orange-100 text-orange-800', text: 'Pending Technical' },
      pending_community: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Community' }
    };
    const statusConfig = config[status as keyof typeof config] || config.pending_admin;
    return (
      <Badge className={statusConfig.color}>
        <Clock className="w-3 h-3 mr-1" />
        {statusConfig.text}
      </Badge>
    );
  };

  const approveProject = (projectId: number, decision: string): void => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, status: decision === 'approve' ? 'approved' : 'rejected' }
        : p
    ));
    
    if (decision === 'approve' && selectedProject) {
      setCreditAmount(selectedProject.estimatedCredits);
      setShowCreditModal(true);
    }
    setShowApprovalModal(false);
  };

  // Login Component
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl border-emerald-200">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Blue Carbon MRV
            </CardTitle>
            <p className="text-gray-600 mt-2">Administrative Dashboard</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-emerald-700 font-medium">Username</Label>
              <Input
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Enter username"
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-emerald-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Enter password"
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium py-3 rounded-xl shadow-lg"
              onClick={() => {
                if (credentials.username && credentials.password) {
                  setIsAuthenticated(true);
                } else {
                  alert('Please enter both username and password');
                }
              }}
            >
              Sign In to Dashboard
            </Button>
            <div className="text-center text-sm text-gray-500 bg-emerald-50 p-3 rounded-lg">
              Demo: Use any credentials to login
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard View
  const DashboardView: React.FC = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-emerald-800 mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of Blue Carbon MRV project status and metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-emerald-800">{dashboardData?.totalProjects || 0}</p>
              <p className="text-xs text-gray-500">All registered projects</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 bg-gradient-to-br from-white to-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Community</p>
              <p className="text-3xl font-bold text-yellow-700">{dashboardData?.pendingCommunity || 0}</p>
              <p className="text-xs text-gray-500">Awaiting community verification</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-white to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Technical</p>
              <p className="text-3xl font-bold text-orange-700">{dashboardData?.pendingTechnical || 0}</p>
              <p className="text-xs text-gray-500">Awaiting technical review</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Admin</p>
              <p className="text-3xl font-bold text-blue-700">{dashboardData?.pendingAdmin || 0}</p>
              <p className="text-xs text-gray-500">Awaiting admin approval</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-white to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Approved Projects</p>
              <p className="text-3xl font-bold text-green-700">{dashboardData?.approvedProjects || 0}</p>
              <p className="text-xs text-gray-500">Fully approved & minted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-white rounded-t-lg pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">Project Status Distribution</CardTitle>
            <p className="text-gray-500 font-medium">Current status breakdown of all projects</p>
          </CardHeader>
          <CardContent className="p-8 bg-white rounded-b-lg">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={dashboardData?.statusDistribution?.filter(item => item.value > 0) || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={110}
                      dataKey="value"
                      stroke="none"
                    >
                      {(dashboardData?.statusDistribution?.filter(item => item.value > 0) || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`${value} projects`, 'Count']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-col gap-3 min-w-[200px]">
                {(dashboardData?.statusDistribution?.filter(item => item.value > 0) || []).map((entry, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-gray-700 font-medium text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-white rounded-t-lg pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800">Carbon Credits by Ecosystem</CardTitle>
            <p className="text-gray-500 font-medium">Total credits minted per ecosystem</p>
          </CardHeader>
          <CardContent className="p-8 bg-white rounded-b-lg">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dashboardData?.ecosystemData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  tick={{fontSize: 12, fill: '#6b7280'}} 
                  axisLine={{stroke: '#e5e7eb'}}
                />
                <YAxis 
                  tick={{fontSize: 12, fill: '#6b7280'}} 
                  axisLine={{stroke: '#e5e7eb'}}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`${value} tons`, 'Carbon Credits']}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="credits" 
                  fill="#059669" 
                  radius={[8, 8, 0, 0]}
                  strokeWidth={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Projects View
  const ProjectsView: React.FC = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-emerald-800 mb-2">Projects Management</h2>
          <p className="text-gray-600">Monitor and manage blue carbon restoration projects</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            Export Data
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Add New Project
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="border-emerald-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-emerald-50/30">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-emerald-800">{project.name}</h3>
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                      {project.ecosystemType}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-lg">{project.location}</p>
                  <p className="text-gray-500 mt-2 leading-relaxed">{project.description}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  {getStatusBadge(project.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProject(project)}
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Project Area</p>
                  <p className="font-semibold text-emerald-800">{project.area}</p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Est. Credits</p>
                  <p className="font-semibold text-emerald-600">{project.estimatedCredits.toLocaleString()} tons</p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Project Lead</p>
                  <p className="font-semibold text-emerald-800">{project.coordinator}</p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Timeline</p>
                  <p className="font-semibold text-emerald-800">{project.timeline}</p>
                </div>
              </div>

              {/* Approval Status */}
              <div className="bg-white/70 p-6 rounded-xl border border-emerald-100">
                <h4 className="text-lg font-semibold text-emerald-800 mb-4">Approval Workflow</h4>
                <div className="flex items-center justify-between mb-4">
                  {[
                    { name: 'Community', status: project.communityApproval },
                    { name: 'Technical', status: project.verifierApproval },
                    { name: 'AI Review', status: project.aiApproval },
                    { name: 'Admin', status: project.adminApproval }
                  ].map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        step.status === true ? 'bg-emerald-100' : 
                        step.status === false ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        {step.status === null ? (
                          <Clock className="w-6 h-6 text-gray-500" />
                        ) : step.status ? (
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{step.name}</span>
                      <span className="text-xs text-gray-500">
                        {step.status === null ? 'Pending' : step.status ? 'Approved' : 'Rejected'}
                      </span>
                    </div>
                  ))}
                </div>
                
                {project.status === 'pending_admin' && (
                  <div className=" flex justify-end gap-3 ">
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setSelectedProject(project);
                        setApprovalDecision('reject');
                        setShowApprovalModal(true);
                      }}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      Reject Project
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        setSelectedProject(project);
                        setApprovalDecision('approve');
                        setShowApprovalModal(true);
                      }}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Approve Project
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Marketplace View
  const MarketplaceView: React.FC = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-emerald-800 mb-2">Carbon Credit Marketplace</h2>
        <p className="text-gray-600">Browse and trade verified blue carbon credits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-emerald-800">{marketplaceData?.marketStats?.totalListings || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Credits</p>
                <p className="text-2xl font-bold text-blue-800">{(marketplaceData?.marketStats?.totalCreditsAvailable || 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-white to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Price</p>
                <p className="text-2xl font-bold text-green-800">${marketplaceData?.marketStats?.averagePrice || 0}</p>
                  </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Market Value</p>
                <p className="text-2xl font-bold text-purple-800">${(marketplaceData?.marketStats?.totalMarketValue || 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {(marketplaceData?.availableCredits || []).map((listing) => (
          <Card key={listing.id} className="border-emerald-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-emerald-50/30">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-emerald-800">{listing.projectName}</h3>
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                      {listing.ecosystemType}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                      {listing.verification}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-lg mb-2">{listing.location}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Seller:</span>
                    <span className="font-medium text-emerald-800">{listing.seller}</span>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{listing.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-600">${listing.pricePerCredit}</div>
                  <div className="text-sm text-gray-500">per credit</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Available</p>
                  <p className="font-bold text-2xl text-emerald-800">{listing.credits.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">credits</p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Total Value</p>
                  <p className="font-bold text-2xl text-green-600">${listing.totalValue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">USD</p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Vintage</p>
                  <p className="font-bold text-2xl text-blue-800">{listing.vintage}</p>
                  <p className="text-xs text-gray-500">year</p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Standard</p>
                  <p className="font-bold text-lg text-purple-800">{listing.verification}</p>
                  <p className="text-xs text-gray-500">verified</p>
                </div>
              </div>

              <div className="bg-white/70 p-6 rounded-xl border border-emerald-100">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Documentation
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      Add to Cart
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Settings View
  const SettingsView: React.FC = () => (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-emerald-800 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <Card className=" border-emerald-200 w-full">
        <CardHeader className=" bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-emerald-800">Profile Information</CardTitle>
              <p className="text-gray-600 text-sm">Update your personal information and contact details</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName" className="text-emerald-700 font-medium">Full Name</Label>
              <Input
                id="fullName"
                value={userProfile.fullName}
                onChange={(e) => setUserProfile({...userProfile, fullName: e.target.value})}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-emerald-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div>
              <Label htmlFor="role" className="text-emerald-700 font-medium">Role</Label>
              <Input
                id="role"
                value={userProfile.role}
                onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div>
              <Label htmlFor="department" className="text-emerald-700 font-medium">Department</Label>
              <Input
                id="department"
                value={userProfile.department}
                onChange={(e) => setUserProfile({...userProfile, department: e.target.value})}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
          </div>
          <Button 
            onClick={() => alert('Profile updated successfully')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-emerald-200 w-full">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-emerald-800">Security</CardTitle>
              <p className="text-gray-600 text-sm">Manage your account security and authentication</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-emerald-800">Change Password</h4>
              <p className="text-gray-600 text-sm">Update your account password for enhanced security</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => alert('Password change functionality would open here')}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="border-emerald-200 w-full">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-emerald-800">System Information</CardTitle>
              <p className="text-gray-600 text-sm">Blue Carbon MRV system details and status</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">System Version:</span>
                <span className="font-medium text-emerald-800">v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium text-emerald-800">January 15, 2024</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">API Status:</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-emerald-800">Online</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Blockchain Network:</span>
                <span className="font-medium text-emerald-800">Ethereum Mainnet</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="border-red-200 w-full">
        <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-800">Sign Out</CardTitle>
              <p className="text-gray-600 text-sm">Sign out of your account and return to the login page</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Button 
            variant="destructive"
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-600 hover:bg-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Main App Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-emerald-200">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Blue Carbon MRV
              </h1>
              <p className="text-sm text-gray-600">Administrative Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
              <Users className="w-3 h-3 mr-2" />
              {userProfile.fullName}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAuthenticated(false)}
              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
<nav className="bg-white/60 backdrop-blur-sm border-b border-emerald-200 px-8 py-4">
  <div className="flex gap-2 justify-around">
    <Button
      variant={currentView === 'dashboard' ? 'default' : 'ghost'}
      onClick={() => setCurrentView('dashboard')}
      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
        currentView === 'dashboard' 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
          : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
      }`}
    >
      <Home className="w-4 h-4" />
      Dashboard
    </Button>
    <Button
      variant={currentView === 'projects' ? 'default' : 'ghost'}
      onClick={() => setCurrentView('projects')}
      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
        currentView === 'projects' 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
          : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
      }`}
    >
      <FileText className="w-4 h-4" />
      Projects
    </Button>
    <Button
      variant={currentView === 'marketplace' ? 'default' : 'ghost'}
      onClick={() => setCurrentView('marketplace')}
      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
        currentView === 'marketplace' 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
          : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
      }`}
    >
      <ShoppingCart className="w-4 h-4" />
      Marketplace
    </Button>
    <Button
      variant={currentView === 'settings' ? 'default' : 'ghost'}
      onClick={() => setCurrentView('settings')}
      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
        currentView === 'settings' 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
          : 'text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
      }`}
    >
      <Settings className="w-4 h-4" />
      Settings
    </Button>
  </div>
</nav>

      {/* Main Content */}
      <main className="p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-emerald-700">Loading data...</p>
            </div>
          </div>
        ) : error ? (
          <Alert className="mb-8 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              {error} - Using demo data for preview
            </AlertDescription>
          </Alert>
        ) : null}

        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'projects' && <ProjectsView />}
        {currentView === 'marketplace' && <MarketplaceView />}
        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* Approval Modal */}
      {showApprovalModal && selectedProject && (
        <Dialog open={showApprovalModal} onOpenChange={setShowApprovalModal}>
          <DialogContent className="border-emerald-200">
            <DialogHeader>
              <DialogTitle className="text-emerald-800">
                {approvalDecision === 'approve' ? 'Approve' : 'Reject'} Project
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-800">{selectedProject.name}</h4>
                <p className="text-gray-600">{selectedProject.location}</p>
                <p className="text-sm text-emerald-600 mt-2">
                  Estimated Credits: {selectedProject.estimatedCredits.toLocaleString()} tons
                </p>
              </div>
              
              <div>
                <Label htmlFor="approval-notes" className="text-emerald-700 font-medium">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="approval-notes"
                  placeholder="Add any notes or comments about this decision..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="border-emerald-200 focus:border-emerald-400 mt-2"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApprovalModal(false)}
                  className="border-emerald-200 text-emerald-700"
                >
                  Cancel
                </Button>
                <Button
                  className={approvalDecision === 'approve' 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-red-600 hover:bg-red-700'
                  }
                  onClick={() => approveProject(selectedProject.id, approvalDecision)}
                >
                  {approvalDecision === 'approve' ? 'Approve Project' : 'Reject Project'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Carbon Credits Issued Modal */}
      {showCreditModal && (
        <Dialog open={showCreditModal} onOpenChange={setShowCreditModal}>
          <DialogContent className="border-emerald-200">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl text-emerald-800">
                🎉 Carbon Credits Successfully Issued!
              </DialogTitle>
            </DialogHeader>
            
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-emerald-600">
                  {creditAmount.toLocaleString()} tons
                </h3>
                <p className="text-gray-600 text-lg">Carbon Credits Issued & Minted</p>
              </div>
              
              <div className="bg-emerald-50 p-6 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Project:</span>
                  <span className="font-semibold text-emerald-800">{selectedProject?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Credits Issued:</span>
                  <span className="font-bold text-emerald-600">{creditAmount.toLocaleString()} tons</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Market Value:</span>
                  <span className="font-semibold text-green-600">${(creditAmount * 30).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Blockchain Status:</span>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>
              </div>

              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3"
                onClick={() => {
                  setShowCreditModal(false);
                  setSelectedProject(null);
                }}
              >
                Continue to Dashboard
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Project Details Modal */}
      {selectedProject && !showApprovalModal && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-emerald-200">
            <DialogHeader>
              <DialogTitle className="text-2xl text-emerald-800">{selectedProject.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-8">
              {/* Project Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-emerald-200 bg-emerald-50/30">
                  <CardHeader>
                    <CardTitle className="text-emerald-800">Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{selectedProject.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project Area:</span>
                      <span className="font-medium">{selectedProject.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ecosystem Type:</span>
                      <span className="font-medium">{selectedProject.ecosystemType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project Lead:</span>
                      <span className="font-medium">{selectedProject.coordinator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="font-medium">{selectedProject.timeline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment:</span>
                      <span className="font-medium">{selectedProject.investmentRequired}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200 bg-emerald-50/30">
                  <CardHeader>
                    <CardTitle className="text-emerald-800">Carbon Credits Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Credits:</span>
                      <span className="text-emerald-600 font-bold">{selectedProject.estimatedCredits.toLocaleString()} tons</span>
                    </div>
                    {selectedProject.issuedCredits && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Issued Credits:</span>
                        <span className="text-emerald-600 font-bold">{selectedProject.issuedCredits.toLocaleString()} tons</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Value:</span>
                      <span className="font-medium">${(selectedProject.estimatedCredits * 30).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per Credit:</span>
                      <span className="font-medium">$30.00</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Approval Status Visualization */}
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800">Approval Workflow Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-6">
                    {[
                      { name: 'Community Verification', status: selectedProject.communityApproval, icon: Users, description: 'Local community approval' },
                      { name: 'Technical Review', status: selectedProject.verifierApproval, icon: Shield, description: 'Technical verification' },
                      { name: 'AI Assessment', status: selectedProject.aiApproval, icon: CheckCircle, description: 'AI-powered analysis' },
                      { name: 'Admin Approval', status: selectedProject.adminApproval, icon: User, description: 'Final admin decision' }
                    ].map((approval, index) => {
                      const Icon = approval.icon;
                      return (
                        <div key={index} className="text-center p-6 border rounded-xl bg-white/50">
                          <div className="flex justify-center mb-4">
                            {approval.status === null ? (
                              <Clock className="w-12 h-12 text-yellow-500" />
                            ) : approval.status ? (
                              <CheckCircle className="w-12 h-12 text-emerald-500" />
                            ) : (
                              <XCircle className="w-12 h-12 text-red-500" />
                            )}
                          </div>
                          <h4 className="font-semibold text-emerald-800 mb-2">{approval.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{approval.description}</p>
                          <Badge className={`${
                            approval.status === null ? 'bg-yellow-100 text-yellow-800' :
                            approval.status ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {approval.status === null ? 'Pending' : approval.status ? 'Approved' : 'Rejected'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800">Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{selectedProject.description}</p>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BlueCarbonAdminHub;
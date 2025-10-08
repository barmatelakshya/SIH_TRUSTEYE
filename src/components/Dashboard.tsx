import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Shield, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#044389', '#10b981', '#f59e0b', '#ef4444'];

interface DashboardProps {
  sessionData?: {
    totalScans: number;
    threatsFound: number;
    safeMessages: number;
  };
  scanHistory?: Array<{
    id: string;
    type: 'text' | 'url';
    input: string;
    result: string;
    riskLevel: string;
    timestamp: string;
  }>;
}

export function Dashboard({ sessionData, scanHistory = [] }: DashboardProps) {
  const stats = {
    totalScans: sessionData?.totalScans || 0,
    threatsBlocked: sessionData?.threatsFound || 0,
    safeMessages: sessionData?.safeMessages || 0,
    activeUsers: 1
  };

  const [chartHistory] = useState([
    { time: 'Session Start', scans: stats.totalScans, threats: stats.threatsBlocked },
  ]);

  const [threatTypes] = useState([
    { name: 'Phishing', value: Math.floor(stats.threatsBlocked * 0.5), color: '#ef4444' },
    { name: 'Scam', value: Math.floor(stats.threatsBlocked * 0.3), color: '#f59e0b' },
    { name: 'Malware', value: Math.floor(stats.threatsBlocked * 0.2), color: '#044389' },
  ]);

  const recentActivity = scanHistory.length > 0 
    ? scanHistory.slice(0, 5).map(scan => ({
        id: parseInt(scan.id),
        type: scan.riskLevel === 'high' || scan.riskLevel === 'critical' ? 'threat' : 'scan',
        message: `${scan.type.toUpperCase()} analyzed - ${scan.result}`,
        time: new Date(scan.timestamp).toLocaleTimeString(),
        status: scan.riskLevel === 'high' || scan.riskLevel === 'critical' ? 'threat' : 'safe'
      }))
    : [{ id: 1, type: 'info', message: stats.totalScans > 0 ? `${stats.totalScans} messages analyzed this session` : 'Welcome! Start analyzing messages to see activity', time: 'Session', status: 'info' }];

  // Simulate live updates
  useEffect(() => {
    // Remove auto-incrementing - use real session data only
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Scans</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="transition-all duration-500">{stats.totalScans.toLocaleString()}</div>
            <p className="text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Live updates
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Threats Blocked</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="transition-all duration-500 text-destructive">{stats.threatsBlocked}</div>
            <p className="text-muted-foreground mt-1">
              {((stats.threatsBlocked / stats.totalScans) * 100).toFixed(1)}% detection rate
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Safe Messages</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="transition-all duration-500 text-green-600">{stats.safeMessages.toLocaleString()}</div>
            <p className="text-muted-foreground mt-1">
              {((stats.safeMessages / stats.totalScans) * 100).toFixed(1)}% safe
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="transition-all duration-500 text-blue-600">{stats.activeUsers}</div>
            <p className="text-muted-foreground mt-1">Currently protected</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Scan Activity (24h)</CardTitle>
            <CardDescription>Real-time scanning patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartHistory}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="scans" stroke="#044389" fill="#044389" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Threat Distribution</CardTitle>
            <CardDescription>Types of threats detected</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={threatTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {threatTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest scans and threat detections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {activity.status === 'safe' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p>{activity.message}</p>
                    <p className="text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

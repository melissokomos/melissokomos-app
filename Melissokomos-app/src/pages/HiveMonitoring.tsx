import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  ChevronDown, 
  Calendar, 
  Download, 
  Filter 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const temperatureData = [
  { time: "00:00", temperature: 32, optimalMin: 32, optimalMax: 35 },
  { time: "04:00", temperature: 31, optimalMin: 32, optimalMax: 35 },
  { time: "08:00", temperature: 33, optimalMin: 32, optimalMax: 35 },
  { time: "12:00", temperature: 36, optimalMin: 32, optimalMax: 35 },
  { time: "16:00", temperature: 35, optimalMin: 32, optimalMax: 35 },
  { time: "20:00", temperature: 33, optimalMin: 32, optimalMax: 35 },
  { time: "24:00", temperature: 32, optimalMin: 32, optimalMax: 35 },
];

const humidityData = [
  { time: "00:00", humidity: 45 },
  { time: "04:00", humidity: 48 },
  { time: "08:00", humidity: 50 },
  { time: "12:00", humidity: 52 },
  { time: "16:00", humidity: 55 },
  { time: "20:00", humidity: 50 },
  { time: "24:00", humidity: 46 },
];

const weightData = [
  { month: "Jan", weight: 22 },
  { month: "Feb", weight: 23 },
  { month: "Mar", weight: 25 },
  { month: "Apr", weight: 27 },
  { month: "May", weight: 29 },
  { month: "Jun", weight: 31 },
  { month: "Jul", weight: 32 },
];

const activityData = [
  { time: "00:00", activity: 10 },
  { time: "04:00", activity: 5 },
  { time: "08:00", activity: 40 },
  { time: "12:00", activity: 85 },
  { time: "16:00", activity: 90 },
  { time: "20:00", activity: 60 },
  { time: "24:00", activity: 15 },
];

const hives = [
  { id: "hive1", name: "Alpine Meadow" },
  { id: "hive2", name: "Riverside Colony" },
  { id: "hive3", name: "Orchard Hive" },
];

const HiveMonitoring: React.FC = () => {
  const [selectedHive, setSelectedHive] = useState("hive1");
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hive Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Track and analyze your hive performance metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedHive} onValueChange={setSelectedHive}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select hive" />
            </SelectTrigger>
            <SelectContent>
              {hives.map((hive) => (
                <SelectItem key={hive.id} value={hive.id}>
                  {hive.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="humidity">Humidity</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="activity">Bee Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Temperature</span>
                  <span className="text-xl font-bold text-amber-500">34.5°C</span>
                </CardTitle>
                <CardDescription>24-hour temperature trend</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="time" tickMargin={10} />
                    <YAxis domain={[30, 40]} tickMargin={10} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="optimalMin"
                      stroke="#D1D5DB"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="optimalMax"
                      stroke="#D1D5DB"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Humidity Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Humidity</span>
                  <span className="text-xl font-bold text-blue-500">50%</span>
                </CardTitle>
                <CardDescription>24-hour humidity trend</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={humidityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="time" tickMargin={10} />
                    <YAxis domain={[30, 60]} tickMargin={10} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weight Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Weight</span>
                  <span className="text-xl font-bold text-green-500">32.4 kg</span>
                </CardTitle>
                <CardDescription>Monthly weight progression</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="month" tickMargin={10} />
                    <YAxis domain={[20, 35]} tickMargin={10} />
                    <Tooltip />
                    <Bar dataKey="weight" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span>Bee Activity</span>
                  <span className="text-xl font-bold text-purple-500">85%</span>
                </CardTitle>
                <CardDescription>24-hour activity level</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="time" tickMargin={10} />
                    <YAxis domain={[0, 100]} tickMargin={10} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="activity"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Automated analysis of your hive data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-500/10 p-4 rounded-lg">
                <h3 className="font-semibold text-amber-600 mb-1">Temperature Alert</h3>
                <p className="text-sm">
                  The hive temperature briefly exceeded the optimal range around noon. 
                  This coincides with the day's peak ambient temperature. Consider adding 
                  additional ventilation if this pattern continues.
                </p>
              </div>
              <div className="bg-green-500/10 p-4 rounded-lg">
                <h3 className="font-semibold text-green-600 mb-1">Positive Weight Trend</h3>
                <p className="text-sm">
                  The hive has shown consistent weight gain over the past 6 months, 
                  indicating good nectar flow and honey production. At this rate, 
                  you should be ready for harvest in approximately 3 weeks.
                </p>
              </div>
              <div className="bg-blue-500/10 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-600 mb-1">Humidity Pattern</h3>
                <p className="text-sm">
                  Humidity levels are within normal range but show a consistent daily pattern. 
                  This suggests good thermoregulation behavior from your colony.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Temperature Tab */}
        <TabsContent value="temperature">
          <Card>
            <CardHeader>
              <CardTitle>Temperature Analysis</CardTitle>
              <CardDescription>
                Detailed temperature metrics for {hives.find(h => h.id === selectedHive)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    name="Temperature (°C)"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="optimalMin"
                    name="Optimal Min (°C)"
                    stroke="#D1D5DB"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="optimalMax"
                    name="Optimal Max (°C)"
                    stroke="#D1D5DB"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Humidity Tab */}
        <TabsContent value="humidity">
          <Card>
            <CardHeader>
              <CardTitle>Humidity Analysis</CardTitle>
              <CardDescription>
                Detailed humidity metrics for {hives.find(h => h.id === selectedHive)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={humidityData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity (%)"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weight Tab */}
        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Weight Analysis</CardTitle>
              <CardDescription>
                Detailed weight metrics for {hives.find(h => h.id === selectedHive)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="weight" 
                    name="Weight (kg)" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Bee Activity Analysis</CardTitle>
              <CardDescription>
                Detailed activity metrics for {hives.find(h => h.id === selectedHive)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="activity"
                    name="Activity Level (%)"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HiveMonitoring;

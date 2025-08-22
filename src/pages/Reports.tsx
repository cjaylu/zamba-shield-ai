import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import ThreatChart from "@/components/ThreatChart";
import { FileText, Download, Calendar, BarChart3 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const Reports = () => {
  const [reportType, setReportType] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [format, setFormat] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    if (!reportType || !timePeriod || !format) {
      toast({
        title: "Missing Information",
        description: "Please select report type, time period, and format.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { reportType, timePeriod, format }
      });

      if (error) throw error;

      if (format === 'pdf') {
        toast({
          title: "Report Generated",
          description: "Your PDF report has been generated successfully.",
        });
      } else {
        // Create and download text file
        const blob = new Blob([data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `security-report-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Report Downloaded",
          description: "Your report has been downloaded successfully.",
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const monthlyData = [
    { name: "Jan", threats: 45, emails: 1200, sms: 89, blocked: 134 },
    { name: "Feb", threats: 52, emails: 1100, sms: 76, blocked: 128 },
    { name: "Mar", threats: 48, emails: 1300, sms: 92, blocked: 140 },
    { name: "Apr", threats: 61, emails: 1450, sms: 105, blocked: 166 },
    { name: "May", threats: 55, emails: 1350, sms: 98, blocked: 153 },
    { name: "Jun", threats: 67, emails: 1500, sms: 112, blocked: 179 },
  ];

  const threatTypeData = [
    { name: "Phishing", value: 145 },
    { name: "Scam SMS", value: 89 },
    { name: "Brute Force", value: 67 },
    { name: "Malware", value: 34 },
  ];

  const reports = [
    {
      id: 1,
      title: "Monthly Security Summary",
      description: "Comprehensive overview of security events for June 2024",
      date: "2024-06-30",
      type: "Monthly",
      status: "Generated"
    },
    {
      id: 2,
      title: "Threat Intelligence Report",
      description: "Analysis of emerging threats and attack patterns",
      date: "2024-06-25",
      type: "Intelligence",
      status: "Generated"
    },
    {
      id: 3,
      title: "User Training Progress",
      description: "Assessment of cybersecurity training effectiveness",
      date: "2024-06-20",
      type: "Training",
      status: "Generated"
    },
    {
      id: 4,
      title: "Incident Response Summary",
      description: "Summary of security incidents and response times",
      date: "2024-06-15",
      type: "Incident",
      status: "Pending"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Security Reports</h1>
          <p className="text-muted-foreground">Generate and view comprehensive security analytics</p>
        </div>

        {/* Report Generation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate New Report
            </CardTitle>
            <CardDescription>Create custom security reports for specific time periods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="security">Security Summary</SelectItem>
                  <SelectItem value="threats">Threat Analysis</SelectItem>
                  <SelectItem value="training">Training Progress</SelectItem>
                  <SelectItem value="compliance">Compliance Report</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="txt">Text File</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                className="w-full" 
                onClick={generateReport}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ThreatChart
            title="Monthly Security Trends"
            data={monthlyData}
            type="line"
            dataKey="threats"
            color="hsl(var(--chart-1))"
          />
          <ThreatChart
            title="Email vs SMS Threats"
            data={monthlyData}
            type="bar"
            dataKey="emails"
            color="hsl(var(--chart-2))"
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-destructive">1,247</CardTitle>
              <CardDescription>Total Threats Blocked</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-success">98.5%</CardTitle>
              <CardDescription>Detection Accuracy</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-primary">2.3s</CardTitle>
              <CardDescription>Avg Response Time</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-warning">3.2%</CardTitle>
              <CardDescription>False Positive Rate</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Reports
            </CardTitle>
            <CardDescription>Previously generated security reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{report.title}</h3>
                      <Badge variant={report.status === "Generated" ? "outline" : "secondary"}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {report.date}
                      </span>
                      <span>{report.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={report.status === "Pending"}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Reports;
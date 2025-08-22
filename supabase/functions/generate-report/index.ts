import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabaseClient.auth.getUser(token);

    if (!user.user) {
      throw new Error('Unauthorized');
    }

    const { reportType, timePeriod, format } = await req.json();

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timePeriod) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Fetch data based on report type
    let reportData;
    switch (reportType) {
      case 'security':
        reportData = await generateSecurityReport(supabaseClient, user.user.id, startDate, endDate);
        break;
      case 'threats':
        reportData = await generateThreatReport(supabaseClient, user.user.id, startDate, endDate);
        break;
      case 'training':
        reportData = await generateTrainingReport(supabaseClient, user.user.id, startDate, endDate);
        break;
      default:
        reportData = await generateSecurityReport(supabaseClient, user.user.id, startDate, endDate);
    }

    // Generate report content
    const reportContent = generateReportContent(reportData, reportType, timePeriod);
    
    // Return based on format
    if (format === 'pdf') {
      return new Response(
        JSON.stringify({ 
          content: reportContent,
          downloadUrl: '#',
          message: 'PDF generation would be implemented with a PDF library'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      return new Response(
        reportContent,
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'text/plain',
            'Content-Disposition': `attachment; filename="security-report-${Date.now()}.txt"`
          },
          status: 200,
        }
      );
    }

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate report' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function generateSecurityReport(supabaseClient: any, userId: string, startDate: Date, endDate: Date) {
  const [emails, sms, alerts] = await Promise.all([
    supabaseClient.from('emails').select('*')
      .eq('user_id', userId)
      .gte('detected_at', startDate.toISOString())
      .lte('detected_at', endDate.toISOString()),
    supabaseClient.from('sms').select('*')
      .eq('user_id', userId)
      .gte('detected_at', startDate.toISOString())
      .lte('detected_at', endDate.toISOString()),
    supabaseClient.from('alerts').select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),
  ]);

  return {
    totalThreats: (emails.data?.length || 0) + (sms.data?.length || 0),
    emailThreats: emails.data?.filter(e => e.classification === 'threat').length || 0,
    smsThreats: sms.data?.filter(s => s.classification === 'threat').length || 0,
    alerts: alerts.data?.length || 0,
    quarantined: [...(emails.data || []), ...(sms.data || [])].filter(item => item.quarantined).length,
  };
}

async function generateThreatReport(supabaseClient: any, userId: string, startDate: Date, endDate: Date) {
  return generateSecurityReport(supabaseClient, userId, startDate, endDate);
}

async function generateTrainingReport(supabaseClient: any, userId: string, startDate: Date, endDate: Date) {
  const { data: progress } = await supabaseClient
    .from('user_training_progress')
    .select('*')
    .eq('user_id', userId);

  return {
    totalModules: 5,
    completedModules: progress?.filter(p => p.status === 'completed').length || 0,
    inProgressModules: progress?.filter(p => p.status === 'in-progress').length || 0,
    totalPoints: progress?.reduce((sum, p) => sum + (p.status === 'completed' ? 50 : 0), 0) || 0,
  };
}

function generateReportContent(data: any, reportType: string, timePeriod: string): string {
  const date = new Date().toLocaleDateString();
  
  return `
ZAMBA CYBERSECURITY REPORT
Generated: ${date}
Report Type: ${reportType.toUpperCase()}
Time Period: ${timePeriod.toUpperCase()}

===================================

SUMMARY:
${JSON.stringify(data, null, 2)}

This report provides insights into your cybersecurity posture for the selected time period.
For detailed analysis and recommendations, please consult with your security team.

===================================
Generated by Zamba Cybersecurity Platform
  `;
}
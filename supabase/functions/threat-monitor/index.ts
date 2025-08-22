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

    const { email, phone, content, type } = await req.json();

    // Analyze threat level (simplified threat detection)
    const isThreat = await analyzeContent(content, type);
    
    if (isThreat) {
      // Find user by email or phone
      const { data: profiles } = await supabaseClient
        .from('profiles')
        .select('id')
        .or(`email.eq.${email},phone_number.eq.${phone}`)
        .limit(1);

      if (profiles && profiles.length > 0) {
        const userId = profiles[0].id;

        // Log the threat
        const threatData = {
          user_id: userId,
          classification: 'threat',
          quarantined: true,
          detected_at: new Date().toISOString(),
        };

        if (type === 'email') {
          await supabaseClient.from('emails').insert({
            ...threatData,
            subject: content.subject || 'Detected Threat',
            body: content.body || content,
          });
        } else if (type === 'sms') {
          await supabaseClient.from('sms').insert({
            ...threatData,
            sender: content.sender || 'Unknown',
            message: content.message || content,
          });
        }

        // Create notification
        await supabaseClient.from('notifications').insert({
          user_id: userId,
          title: 'Security Threat Detected',
          message: `A potential ${type} threat has been detected and quarantined.`,
          type: 'threat',
        });

        // Create alert
        await supabaseClient.from('alerts').insert({
          user_id: userId,
          type: 'threat_detected',
          message: `${type.toUpperCase()} threat detected from ${email || phone}`,
          resolved: false,
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        threat_detected: isThreat,
        message: isThreat ? 'Threat detected and logged' : 'Content appears safe'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in threat-monitor:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function analyzeContent(content: any, type: string): Promise<boolean> {
  // Simplified threat detection logic
  const threatKeywords = [
    'urgent action required',
    'verify your account',
    'click here immediately',
    'limited time offer',
    'congratulations you have won',
    'tax refund',
    'suspended account',
    'confirm your password',
    'mobile money transfer',
    'airtel money',
    'mtn money',
    'suspicious activity',
  ];

  const text = (typeof content === 'string' ? content : 
    content.body || content.message || JSON.stringify(content)).toLowerCase();

  return threatKeywords.some(keyword => text.includes(keyword));
}
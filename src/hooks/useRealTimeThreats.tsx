import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface Threat {
  id: string;
  type: 'email' | 'sms' | 'brute_force';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  status: 'detected' | 'blocked' | 'quarantined';
  timestamp: string;
  description: string;
  classification: string;
}

interface ThreatStats {
  total_threats: number;
  emails_scanned: number;
  sms_filtered: number;
  brute_force_attempts: number;
  threats_blocked: number;
}

export const useRealTimeThreats = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [stats, setStats] = useState<ThreatStats>({
    total_threats: 0,
    emails_scanned: 0,
    sms_filtered: 0,
    brute_force_attempts: 0,
    threats_blocked: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchThreats = async () => {
    if (!user) return;

    try {
      // Fetch emails
      const { data: emails } = await supabase
        .from('emails')
        .select('*')
        .eq('user_id', user.id)
        .order('detected_at', { ascending: false })
        .limit(20);

      // Fetch SMS
      const { data: sms } = await supabase
        .from('sms')
        .select('*')
        .eq('user_id', user.id)
        .order('detected_at', { ascending: false })
        .limit(20);

      // Fetch brute force logs
      const { data: bruteForce } = await supabase
        .from('brute_force_logs')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(20);

      // Combine and format threats
      const allThreats: Threat[] = [
        ...(emails || []).map(email => ({
          id: email.id,
          type: 'email' as const,
          severity: (email.classification === 'threat' ? 'high' : 'medium') as 'low' | 'medium' | 'high' | 'critical',
          source: 'Email System',
          target: email.subject || 'Email Content',
          status: (email.quarantined ? 'quarantined' : 'detected') as 'detected' | 'blocked' | 'quarantined',
          timestamp: email.detected_at,
          description: `Email threat: ${email.subject}`,
          classification: email.classification,
        })),
        ...(sms || []).map(sms => ({
          id: sms.id,
          type: 'sms' as const,
          severity: (sms.classification === 'threat' ? 'high' : 'medium') as 'low' | 'medium' | 'high' | 'critical',
          source: sms.sender || 'Unknown',
          target: 'SMS System',
          status: (sms.quarantined ? 'quarantined' : 'detected') as 'detected' | 'blocked' | 'quarantined',
          timestamp: sms.detected_at,
          description: `SMS threat from ${sms.sender}`,
          classification: sms.classification,
        })),
        ...(bruteForce || []).map(bf => ({
          id: bf.id,
          type: 'brute_force' as const,
          severity: (bf.flagged ? 'critical' : 'high') as 'low' | 'medium' | 'high' | 'critical',
          source: bf.ip_address,
          target: bf.username || 'System',
          status: (bf.flagged ? 'blocked' : 'detected') as 'detected' | 'blocked' | 'quarantined',
          timestamp: bf.detected_at,
          description: `Brute force attempt from ${bf.ip_address}`,
          classification: 'attack',
        })),
      ];

      // Sort by timestamp
      allThreats.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setThreats(allThreats);

      // Calculate stats
      setStats({
        total_threats: allThreats.filter(t => t.classification === 'threat' || t.classification === 'attack').length,
        emails_scanned: emails?.length || 0,
        sms_filtered: sms?.length || 0,
        brute_force_attempts: bruteForce?.length || 0,
        threats_blocked: allThreats.filter(t => t.status === 'blocked' || t.status === 'quarantined').length,
      });

    } catch (error) {
      console.error('Error fetching threats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch threat data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchThreats();

    // Set up real-time listeners
    const emailChannel = supabase
      .channel('emails-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'emails',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newEmail = payload.new as any;
          const newThreat: Threat = {
            id: newEmail.id,
            type: 'email',
            severity: (newEmail.classification === 'threat' ? 'high' : 'medium') as 'low' | 'medium' | 'high' | 'critical',
            source: 'Email System',
            target: newEmail.subject || 'Email Content',
            status: (newEmail.quarantined ? 'quarantined' : 'detected') as 'detected' | 'blocked' | 'quarantined',
            timestamp: newEmail.detected_at,
            description: `Email threat: ${newEmail.subject}`,
            classification: newEmail.classification,
          };

          setThreats(prev => [newThreat, ...prev].slice(0, 50));
          
          if (newEmail.classification === 'threat') {
            toast({
              title: 'Email Threat Detected!',
              description: `Suspicious email detected: ${newEmail.subject}`,
              variant: 'destructive',
            });
          }
        }
      )
      .subscribe();

    const smsChannel = supabase
      .channel('sms-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sms',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newSms = payload.new as any;
          const newThreat: Threat = {
            id: newSms.id,
            type: 'sms',
            severity: (newSms.classification === 'threat' ? 'high' : 'medium') as 'low' | 'medium' | 'high' | 'critical',
            source: newSms.sender || 'Unknown',
            target: 'SMS System',
            status: (newSms.quarantined ? 'quarantined' : 'detected') as 'detected' | 'blocked' | 'quarantined',
            timestamp: newSms.detected_at,
            description: `SMS threat from ${newSms.sender}`,
            classification: newSms.classification,
          };

          setThreats(prev => [newThreat, ...prev].slice(0, 50));
          
          if (newSms.classification === 'threat') {
            toast({
              title: 'SMS Threat Detected!',
              description: `Suspicious SMS from ${newSms.sender}`,
              variant: 'destructive',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(emailChannel);
      supabase.removeChannel(smsChannel);
    };
  }, [user]);

  return {
    threats,
    stats,
    isLoading,
    refetch: fetchThreats,
  };
};
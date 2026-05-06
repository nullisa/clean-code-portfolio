import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const useContactInfo = () =>
  useQuery({
    queryKey: ["contact_info"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_info").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const useTechStack = () =>
  useQuery({
    queryKey: ["tech_stack"],
    queryFn: async () => {
      const { data, error } = await supabase.from("tech_stack").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

export const useCareerTimeline = () =>
  useQuery({
    queryKey: ["career_timeline"],
    queryFn: async () => {
      const { data, error } = await supabase.from("career_timeline").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

import { useMemo } from "react";
import { createClerkSupabaseClient } from "../lib/supabase";
import { useAuth } from "@clerk/expo";

export function useSupabase() {
  const { getToken } = useAuth();

  const client = useMemo(() => createClerkSupabaseClient(() => getToken()), [getToken]);
  return client;
}
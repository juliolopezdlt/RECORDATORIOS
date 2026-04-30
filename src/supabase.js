import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pvmjrgldehiokghksnir.supabase.co";
const supabasePublishableKey = "sb_publishable_R0gbgIBcOxrnwzZkZZzVqQ_hQ7tbPHF";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

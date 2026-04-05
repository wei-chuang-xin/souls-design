import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ 
      success: false, 
      error: 'Missing env vars',
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
    
    const { data, error } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', 'zhaosongli323@gmail.com')
      .single()
    
    return NextResponse.json({ 
      success: !error, 
      data, 
      error: error?.message || null,
      errorDetails: error || null,
      supabaseUrl
    })
  } catch (e: any) {
    return NextResponse.json({ 
      success: false, 
      error: e.message,
      stack: e.stack,
      supabaseUrl
    })
  }
}

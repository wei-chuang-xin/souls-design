import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', 'zhaosongli323@gmail.com')
      .single()
    
    return NextResponse.json({ 
      success: !error, 
      data, 
      error: error?.message,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    })
  } catch (e: any) {
    return NextResponse.json({ 
      success: false, 
      error: e.message,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    })
  }
}

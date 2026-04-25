import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  revalidatePath('/menu')
  revalidatePath('/calendar')
  revalidatePath('/en/menu')
  revalidatePath('/en/calendar')

  return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() })
}

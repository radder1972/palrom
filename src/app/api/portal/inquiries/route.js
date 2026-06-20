import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token || !token.startsWith('palrom-b2b-')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let authEmail = '';
    try {
      const encodedEmail = token.replace('palrom-b2b-', '');
      authEmail = Buffer.from(encodedEmail, 'base64').toString('utf8').toLowerCase().trim();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    if (!authEmail || !authEmail.includes('@')) {
      return NextResponse.json({ error: 'Invalid authenticated email' }, { status: 401 });
    }

    const localDbPath = path.join(process.cwd(), 'inquiries.json');
    let inquiries = [];

    if (fs.existsSync(localDbPath)) {
      try {
        const fileContent = fs.readFileSync(localDbPath, 'utf8');
        const allRecords = JSON.parse(fileContent);
        
        // Filter records matching authenticated email in reverse chronological order
        inquiries = allRecords
          .filter(record => record.client_email?.toLowerCase().trim() === authEmail)
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      } catch (err) {
        console.error('Failed to read or parse local inquiries file:', err);
      }
    }

    return NextResponse.json({
      success: true,
      inquiries
    });
  } catch (error) {
    console.error('[B2B Portal Inquiries] Internal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

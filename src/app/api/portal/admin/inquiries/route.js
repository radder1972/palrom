import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

const VALID_PASSCODES = ['palromadmin2026', 'admin2026'];

function getAdminPasscode() {
  return process.env.ADMIN_PASSCODE || 'palromadmin2026';
}

function verifyAuth(request) {
  const passcode = (request.headers.get('x-admin-passcode') || '').trim();
  const allowed = [...VALID_PASSCODES, getAdminPasscode()];
  return allowed.includes(passcode);
}

const hasPostgres = !!process.env.POSTGRES_URL || !!process.env.POSTGRES_URL_NON_POOLING;

const LOCAL_FILE = path.join(process.cwd(), 'inquiries.json');

function readLocalInquiries() {
  if (!fs.existsSync(LOCAL_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, 'utf8'));
  } catch (e) {
    console.error('Failed to read local inquiries file:', e);
    return [];
  }
}

function writeLocalInquiries(data) {
  try {
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write local inquiries file:', e);
  }
}

// GET: Retrieve all quote inquiries (admin only)
export async function GET(request) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let inquiries = [];

    if (hasPostgres || process.env.VERCEL) {
      try {
        const { rows } = await sql`
          SELECT * FROM quote_inquiries
          ORDER BY created_at DESC;
        `;
        inquiries = rows || [];
      } catch (dbErr) {
        console.error('Vercel Postgres query error fetching inquiries:', dbErr);
        throw dbErr;
      }
    } else {
      inquiries = readLocalInquiries();
      inquiries.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return NextResponse.json({ success: true, inquiries });

  } catch (err) {
    console.error('[Admin Get Inquiries] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch inquiries' }, { status: 500 });
  }
}

// PATCH: Update inquiry status (admin only)
export async function PATCH(request) {
  try {
    if (!verifyAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields: id and status' }, { status: 400 });
    }

    let updatedInDb = false;

    if (hasPostgres || process.env.VERCEL) {
      try {
        await sql`
          UPDATE quote_inquiries
          SET status = ${status}
          WHERE id = ${id};
        `;
        updatedInDb = true;
      } catch (dbErr) {
        console.error('Vercel Postgres update status error:', dbErr);
      }
    }

    // Always update local file inquiries.json for fallback auditing
    const inquiries = readLocalInquiries();
    const index = inquiries.findIndex(iq => iq.id === id);
    if (index !== -1) {
      inquiries[index].status = status;
      writeLocalInquiries(inquiries);
    } else {
      console.warn(`Inquiry ${id} not found in local file inquiries.json`);
    }

    return NextResponse.json({ success: true, updatedInDb });

  } catch (err) {
    console.error('[Admin Update Inquiry] Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update inquiry status' }, { status: 500 });
  }
}

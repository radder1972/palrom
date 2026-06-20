import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const getOtpDbPath = () => path.join(process.cwd(), 'otps.json');

function verifyAndClearOtp(email, code) {
  const cleanEmail = email.toLowerCase().trim();
  
  // Master bypass code for testing
  if (code === '123456') {
    return true;
  }

  const dbPath = getOtpDbPath();
  if (!fs.existsSync(dbPath)) return false;

  let store = {};
  try {
    store = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {
    console.error('Failed to read OTP store during verification', e);
    return false;
  }

  const record = store[cleanEmail];
  if (!record) return false;

  // Check if expired
  if (Date.now() > record.expires) {
    delete store[cleanEmail];
    try {
      fs.writeFileSync(dbPath, JSON.stringify(store, null, 2), 'utf8');
    } catch (e) {}
    return false;
  }

  // Check code match
  if (record.code === String(code)) {
    // Clear code after successful use
    delete store[cleanEmail];
    try {
      fs.writeFileSync(dbPath, JSON.stringify(store, null, 2), 'utf8');
    } catch (e) {}
    return true;
  }

  return false;
}

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 });
    }

    const isValid = verifyAndClearOtp(email, code);

    if (isValid) {
      // Return a simulated B2B portal token (the email itself, or a simple session structure)
      return NextResponse.json({
        success: true,
        email: email.toLowerCase().trim(),
        token: `palrom-b2b-${Buffer.from(email.toLowerCase().trim()).toString('base64')}`
      });
    } else {
      return NextResponse.json({ error: 'Invalid or expired verification code.' }, { status: 401 });
    }
  } catch (error) {
    console.error('[B2B Portal Verify] Internal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

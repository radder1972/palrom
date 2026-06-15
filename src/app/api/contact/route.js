import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, productType, message } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !productType || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, productType, and message are required.' },
        { status: 400 }
      );
    }

    const contactRecord = {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      company: company?.trim() || '',
      product_type: productType,
      message: message.trim(),
    };

    // Save locally to contacts.json for debugging/local parity
    const localDbPath = path.join(process.cwd(), 'contacts.json');
    let localRecords = [];
    try {
      if (fs.existsSync(localDbPath)) {
        const fileContent = fs.readFileSync(localDbPath, 'utf8');
        localRecords = JSON.parse(fileContent);
      }
    } catch (err) {
      console.error('Failed to read local contacts file:', err);
    }

    const newRecordWithMeta = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...contactRecord,
    };

    localRecords.push(newRecordWithMeta);

    try {
      fs.writeFileSync(localDbPath, JSON.stringify(localRecords, null, 2), 'utf8');
      console.log('Saved contact submission locally to contacts.json');
    } catch (err) {
      console.error('Failed to write to local contacts file:', err);
    }

    // Send email via Resend if API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO || 'office@palromproducts.ro';
    const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    let emailSent = false;
    if (resendApiKey) {
      try {
        const productInterestLabels = {
          dowels: 'Beukenhouten stokken',
          planed: 'Beukenhouten latten',
          profiles: 'Beukenhouten profielen',
          specials: 'Beukenhouten bestekken',
          general: 'Algemene Houtinkoop Aanvraag',
          careers: 'Sollicitatie / Werken bij',
        };
        const interestLabel = productInterestLabels[productType] || productType;

        const htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1a202c; line-height: 1.6;">
            <!-- Top brand bar -->
            <div style="margin-bottom: 32px; border-bottom: 1px solid #edf2f7; padding-bottom: 20px;">
              <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1e3a2b;">PALROM PRODUCTS</span>
              <h2 style="margin: 6px 0 0; font-size: 1.5rem; font-weight: 600; color: #1a202c;">Nieuw Contactbericht</h2>
            </div>

            <div style="margin-bottom: 32px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500; width: 140px;">Naam</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">E-mailadresse</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc;"><a href="mailto:${email}" style="color: #1e3a2b; text-decoration: none; border-bottom: 1px dotted #1e3a2b;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">Telefoonnummer</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${phone || 'Niet ingevuld'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">Bedrijf</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${company || 'Niet ingevuld'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #4a5568; font-weight: 500;">Interesse</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f7fafc; color: #1a202c;">${interestLabel}</td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 40px;">
              <h3 style="font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #718096; margin-bottom: 12px; margin-top: 0;">Bericht</h3>
              <div style="background-color: #f7fafc; padding: 24px; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; color: #2d3748; white-space: pre-line; border: 1px solid #edf2f7;">
                ${message}
              </div>
            </div>

            <div style="border-top: 1px solid #edf2f7; padding-top: 24px; text-align: center; font-size: 0.8rem; color: #a0aec0;">
              <p style="margin: 0 0 4px;">Dit bericht is verzonden via het contactformulier op de Palrom Products website.</p>
              <p style="margin: 0;">PALROM Products SRL • 8 Poienita St, Brad City, Hunedoara, Romania</p>
            </div>
          </div>
        `;

        const subjectLine = productType === 'careers'
          ? `[Sollicitatie] Nieuwe inzending van ${name}`
          : `[Contact] Bericht van ${name} (${interestLabel})`;

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: emailFrom,
            to: emailTo,
            subject: subjectLine,
            html: htmlContent
          })
        });

        if (!resendRes.ok) {
          const errText = await resendRes.text();
          console.error('Resend API error response:', errText);
        } else {
          console.log('Email sent successfully via Resend');
          emailSent = true;
        }
      } catch (err) {
        console.error('Failed to send email via Resend:', err);
      }
    } else {
      console.log('Resend API key not configured, skipping email delivery');
    }

    return NextResponse.json({
      success: true,
      message: 'Contact submission processed successfully',
      recordId: newRecordWithMeta.id,
      emailSent
    });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing contact submission.' },
      { status: 500 }
    );
  }
}

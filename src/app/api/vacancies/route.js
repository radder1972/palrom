import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const VALID_PASSCODES = ['palromadmin2026', 'admin2026'];

function getPasscode() {
  return process.env.ADMIN_PASSCODE || 'palromadmin2026';
}

function verifyAuth(request) {
  const passcode = (request.headers.get('x-admin-passcode') || '').trim();
  const allowed = [...VALID_PASSCODES, getPasscode()];
  return allowed.includes(passcode);
}

const hasPostgres = !!process.env.POSTGRES_URL || !!process.env.POSTGRES_URL_NON_POOLING;

const dbPath = path.join(process.cwd(), 'vacancies.json');

function readVacancies() {
  try {
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read vacancies database:', err);
  }
  return [];
}

function writeVacancies(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write vacancies database:', err);
    return false;
  }
}

export async function GET() {
  if (hasPostgres || process.env.VERCEL) {
    try {
      const { rows: data } = await sql`
        SELECT * FROM vacancies
        ORDER BY created_at DESC;
      `;

      if (data) {
        return NextResponse.json({ success: true, vacancies: data });
      }
    } catch (err) {
      console.error('Failed to fetch vacancies from Vercel Postgres:', err);
    }
  }

  const vacancies = readVacancies();
  return NextResponse.json({ success: true, vacancies });
}

export async function POST(request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid passcode' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, vacancy } = body;

    if (hasPostgres || process.env.VERCEL) {
      try {
        if (action === 'save') {
          if (!vacancy || !vacancy.title) {
            return NextResponse.json({ success: false, error: 'Invalid vacancy data' }, { status: 400 });
          }

          if (!vacancy.id) {
            const titleSlug = (vacancy.title.en || vacancy.title.nl || 'job')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            vacancy.id = `${titleSlug}-${Date.now().toString().slice(-4)}`;
          }

          await sql`
            INSERT INTO vacancies (
              id, title, department, location, type, description, requirements, salary
            ) VALUES (
              ${vacancy.id},
              ${JSON.stringify(vacancy.title)},
              ${JSON.stringify(vacancy.department)},
              ${vacancy.location || 'Brad, RO'},
              ${JSON.stringify(vacancy.type)},
              ${JSON.stringify(vacancy.description)},
              ${JSON.stringify(vacancy.requirements)},
              ${JSON.stringify(vacancy.salary)}
            )
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              department = EXCLUDED.department,
              location = EXCLUDED.location,
              type = EXCLUDED.type,
              description = EXCLUDED.description,
              requirements = EXCLUDED.requirements,
              salary = EXCLUDED.salary;
          `;
          return NextResponse.json({ success: true, vacancy });

        } else if (action === 'delete') {
          const { id } = body;
          if (!id) {
            return NextResponse.json({ success: false, error: 'Missing vacancy ID' }, { status: 400 });
          }

          await sql`DELETE FROM vacancies WHERE id = ${id}`;
          return NextResponse.json({ success: true, message: 'Vacancy deleted successfully' });
        } else if (action === 'export_local') {
          const { rows: data } = await sql`
            SELECT * FROM vacancies
            ORDER BY created_at DESC;
          `;

          if (data) {
            if (writeVacancies(data)) {
              try {
                const scriptPath = path.join(process.cwd(), 'scripts', 'upload.sh');
                const { stdout } = await execPromise(`bash "${scriptPath}"`);
                console.log('GitHub upload stdout:', stdout);
                return NextResponse.json({ success: true, message: 'Vacancies exported and uploaded to GitHub successfully' });
              } catch (uploadErr) {
                console.error('Failed to trigger GitHub upload:', uploadErr);
                return NextResponse.json({ success: true, message: 'Vacancies exported locally, but failed to upload to GitHub: ' + uploadErr.message });
              }
            } else {
              return NextResponse.json({ success: false, error: 'Failed to write to local file database' }, { status: 500 });
            }
          }
          return NextResponse.json({ success: false, error: 'No vacancies found in database to export' }, { status: 400 });
        } else if (action === 'sync_local') {
          const localVacancies = readVacancies();
          if (localVacancies.length > 0) {
            for (const vac of localVacancies) {
              await sql`
                INSERT INTO vacancies (
                  id, title, department, location, type, description, requirements, salary
                ) VALUES (
                  ${vac.id},
                  ${JSON.stringify(vac.title)},
                  ${JSON.stringify(vac.department)},
                  ${vac.location || 'Brad, RO'},
                  ${JSON.stringify(vac.type)},
                  ${JSON.stringify(vac.description)},
                  ${JSON.stringify(vac.requirements)},
                  ${JSON.stringify(vac.salary)}
                )
                ON CONFLICT (id) DO UPDATE SET
                  title = EXCLUDED.title,
                  department = EXCLUDED.department,
                  location = EXCLUDED.location,
                  type = EXCLUDED.type,
                  description = EXCLUDED.description,
                  requirements = EXCLUDED.requirements,
                  salary = EXCLUDED.salary;
              `;
            }
            return NextResponse.json({ success: true, message: 'Vacancies synced successfully' });
          }
          return NextResponse.json({ success: false, error: 'No local vacancies found to sync' }, { status: 400 });
        }
      } catch (dbErr) {
        console.error('Vercel Postgres vacancies write error:', dbErr);
        if (process.env.VERCEL) {
          return NextResponse.json({ 
            success: false, 
            error: `Database error: ${dbErr.message || 'Vercel Postgres error'}. Please verify that the 'vacancies' table exists in Vercel Postgres by running the SQL in schema.sql.` 
          }, { status: 500 });
        }
        console.log('Falling back to local file database...');
      }
    }

    let vacancies = readVacancies();

    if (action === 'save') {
      if (!vacancy || !vacancy.title) {
        return NextResponse.json({ success: false, error: 'Invalid vacancy data' }, { status: 400 });
      }

      if (!vacancy.id) {
        const titleSlug = (vacancy.title.en || vacancy.title.nl || 'job')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        vacancy.id = `${titleSlug}-${Date.now().toString().slice(-4)}`;
      }

      const existingIndex = vacancies.findIndex(v => v.id === vacancy.id);
      if (existingIndex > -1) {
        vacancies[existingIndex] = vacancy;
      } else {
        vacancies.push(vacancy);
      }

      if (writeVacancies(vacancies)) {
        return NextResponse.json({ success: true, vacancy });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to write to file database' }, { status: 500 });
      }
    } else if (action === 'delete') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Missing vacancy ID' }, { status: 400 });
      }

      vacancies = vacancies.filter(v => v.id !== id);

      if (writeVacancies(vacancies)) {
        return NextResponse.json({ success: true, message: 'Vacancy deleted successfully' });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to write to file database' }, { status: 500 });
      }
    } else if (action === 'sync_local') {
      return NextResponse.json({ success: true, message: 'Local JSON database active. No database to sync.' });
    } else if (action === 'export_local') {
      return NextResponse.json({ success: false, error: 'Supabase is not configured. Cannot export to local.' }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling vacancies API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

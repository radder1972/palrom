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

// Mapping helpers to match Supabase snake_case columns
function mapNewsToDb(newsItem) {
  return {
    id: newsItem.id,
    tag: newsItem.tag,
    date: newsItem.date,
    author: newsItem.author,
    title: newsItem.title,
    content: newsItem.content,
    link_url: newsItem.linkUrl,
    link_text: newsItem.linkText,
    image: newsItem.image,
    is_romania_only: !!newsItem.isRomaniaOnly
  };
}

function mapNewsFromDb(dbItem) {
  return {
    id: dbItem.id,
    tag: dbItem.tag,
    date: dbItem.date,
    author: dbItem.author,
    title: dbItem.title,
    content: dbItem.content,
    linkUrl: dbItem.link_url,
    linkText: dbItem.link_text,
    image: dbItem.image,
    isRomaniaOnly: !!dbItem.is_romania_only
  };
}

const dbPath = path.join(process.cwd(), 'news.json');

function readNews() {
  try {
    if (fs.existsSync(dbPath)) {
      const content = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read news database:', err);
  }
  return [];
}

function writeNews(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write news database:', err);
    return false;
  }
}

function parseLocalizedDate(dateObj) {
  if (!dateObj) return null;
  
  if (dateObj.en) {
    const d = new Date(dateObj.en);
    if (!isNaN(d.getTime())) return d;
  }
  
  if (dateObj.nl) {
    const d = new Date(dateObj.nl);
    if (!isNaN(d.getTime())) return d;
    
    const nlMonths = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    let str = dateObj.nl.toLowerCase();
    for (let i = 0; i < 12; i++) {
      if (str.includes(nlMonths[i])) {
        str = str.replace(nlMonths[i], enMonths[i]);
        const d2 = new Date(str);
        if (!isNaN(d2.getTime())) return d2;
        break;
      }
    }
  }
  
  if (dateObj.ro) {
    const roMonths = ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'];
    const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    let str = dateObj.ro.toLowerCase();
    for (let i = 0; i < 12; i++) {
      if (str.includes(roMonths[i])) {
        str = str.replace(roMonths[i], enMonths[i]);
        const d2 = new Date(str);
        if (!isNaN(d2.getTime())) return d2;
        break;
      }
    }
  }

  for (const lang of ['en', 'nl', 'de', 'ro']) {
    if (dateObj[lang]) {
      const d = new Date(dateObj[lang]);
      if (!isNaN(d.getTime())) return d;
    }
  }
  
  return null;
}

function sortNewsItems(items) {
  return [...items].sort((a, b) => {
    const dateA = parseLocalizedDate(a.date);
    const dateB = parseLocalizedDate(b.date);

    const timeA = dateA ? dateA.getTime() : 0;
    const timeB = dateB ? dateB.getTime() : 0;

    if (timeA !== timeB) {
      return timeB - timeA; // Descending (newest first)
    }

    return (b.id || '').localeCompare(a.id || '');
  });
}

export async function GET() {
  if (hasPostgres || process.env.VERCEL) {
    try {
      const { rows: data } = await sql`SELECT * FROM news`;

      if (data) {
        const mappedNews = data.map(mapNewsFromDb);
        return NextResponse.json({ success: true, news: sortNewsItems(mappedNews) });
      }
    } catch (err) {
      console.error('Failed to fetch news from Vercel Postgres:', err);
    }
  }

  const news = readNews();
  return NextResponse.json({ success: true, news: sortNewsItems(news) });
}

export async function POST(request) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid passcode' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, newsItem } = body;

    if (hasPostgres || process.env.VERCEL) {
      try {
        if (action === 'save') {
          if (!newsItem || !newsItem.title) {
            return NextResponse.json({ success: false, error: 'Invalid news article data' }, { status: 400 });
          }

          if (!newsItem.id) {
            const titleSlug = (newsItem.title.en || newsItem.title.nl || 'news')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            newsItem.id = `${titleSlug}-${Date.now().toString().slice(-4)}`;
          }

          const dbRecord = mapNewsToDb(newsItem);
          await sql`
            INSERT INTO news (
              id, tag, date, author, title, content, link_url, link_text, image, is_romania_only
            ) VALUES (
              ${dbRecord.id},
              ${JSON.stringify(dbRecord.tag)},
              ${JSON.stringify(dbRecord.date)},
              ${dbRecord.author},
              ${JSON.stringify(dbRecord.title)},
              ${JSON.stringify(dbRecord.content)},
              ${dbRecord.link_url},
              ${JSON.stringify(dbRecord.link_text)},
              ${dbRecord.image},
              ${dbRecord.is_romania_only}
            )
            ON CONFLICT (id) DO UPDATE SET
              tag = EXCLUDED.tag,
              date = EXCLUDED.date,
              author = EXCLUDED.author,
              title = EXCLUDED.title,
              content = EXCLUDED.content,
              link_url = EXCLUDED.link_url,
              link_text = EXCLUDED.link_text,
              image = EXCLUDED.image,
              is_romania_only = EXCLUDED.is_romania_only;
          `;
          return NextResponse.json({ success: true, newsItem });

        } else if (action === 'delete') {
          const { id } = body;
          if (!id) {
            return NextResponse.json({ success: false, error: 'Missing article ID' }, { status: 400 });
          }

          await sql`DELETE FROM news WHERE id = ${id}`;
          return NextResponse.json({ success: true, message: 'News article deleted successfully' });
        } else if (action === 'sync_local') {
          const localNews = readNews();
          if (localNews.length > 0) {
            for (const item of localNews) {
              const dbRecord = mapNewsToDb(item);
              await sql`
                INSERT INTO news (
                  id, tag, date, author, title, content, link_url, link_text, image, is_romania_only
                ) VALUES (
                  ${dbRecord.id},
                  ${JSON.stringify(dbRecord.tag)},
                  ${JSON.stringify(dbRecord.date)},
                  ${dbRecord.author},
                  ${JSON.stringify(dbRecord.title)},
                  ${JSON.stringify(dbRecord.content)},
                  ${dbRecord.link_url},
                  ${JSON.stringify(dbRecord.link_text)},
                  ${dbRecord.image},
                  ${dbRecord.is_romania_only}
                )
                ON CONFLICT (id) DO UPDATE SET
                  tag = EXCLUDED.tag,
                  date = EXCLUDED.date,
                  author = EXCLUDED.author,
                  title = EXCLUDED.title,
                  content = EXCLUDED.content,
                  link_url = EXCLUDED.link_url,
                  link_text = EXCLUDED.link_text,
                  image = EXCLUDED.image,
                  is_romania_only = EXCLUDED.is_romania_only;
              `;
            }
            return NextResponse.json({ success: true, message: 'News synced successfully' });
          }
          return NextResponse.json({ success: false, error: 'No local news items found to sync' }, { status: 400 });
        } else if (action === 'export_local') {
          const { rows: data } = await sql`SELECT * FROM news`;

          if (data) {
            const mappedNews = data.map(mapNewsFromDb);
            const sorted = sortNewsItems(mappedNews);
            if (writeNews(sorted)) {
              try {
                const scriptPath = path.join(process.cwd(), 'scripts', 'upload.sh');
                const { stdout } = await execPromise(`bash "${scriptPath}"`);
                console.log('GitHub upload stdout:', stdout);
                return NextResponse.json({ success: true, message: 'News articles exported and uploaded to GitHub successfully' });
              } catch (uploadErr) {
                console.error('Failed to trigger GitHub upload:', uploadErr);
                return NextResponse.json({ success: true, message: 'News articles exported locally, but failed to upload to GitHub: ' + uploadErr.message });
              }
            } else {
              return NextResponse.json({ success: false, error: 'Failed to write to local file database' }, { status: 500 });
            }
          }
          return NextResponse.json({ success: false, error: 'No news articles found in database to export' }, { status: 400 });
        }
      } catch (dbErr) {
        console.error('Vercel Postgres news write error:', dbErr);
        if (process.env.VERCEL) {
          return NextResponse.json({ 
            success: false, 
            error: `Database error: ${dbErr.message || 'Vercel Postgres error'}. Please verify that the 'news' table exists in Vercel Postgres by running the SQL in schema.sql.` 
          }, { status: 500 });
        }
        console.log('Falling back to local file database...');
      }
    }

    let news = readNews();

    if (action === 'save') {
      if (!newsItem || !newsItem.title) {
        return NextResponse.json({ success: false, error: 'Invalid news article data' }, { status: 400 });
      }

      if (!newsItem.id) {
        const titleSlug = (newsItem.title.en || newsItem.title.nl || 'news')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        newsItem.id = `${titleSlug}-${Date.now().toString().slice(-4)}`;
      }

      const existingIndex = news.findIndex(n => n.id === newsItem.id);
      if (existingIndex > -1) {
        news[existingIndex] = newsItem;
      } else {
        news.push(newsItem);
      }

      if (existingIndex === -1) {
        news.pop();
        news.unshift(newsItem);
      }

      if (writeNews(news)) {
        return NextResponse.json({ success: true, newsItem });
      } else {
        return NextResponse.json({ success: false, error: 'Failed to write to file database' }, { status: 500 });
      }
    } else if (action === 'delete') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'Missing article ID' }, { status: 400 });
      }

      news = news.filter(n => n.id !== id);

      if (writeNews(news)) {
        return NextResponse.json({ success: true, message: 'News article deleted successfully' });
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
    console.error('Error handling news API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

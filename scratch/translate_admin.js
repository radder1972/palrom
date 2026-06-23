const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/app/portal/admin/page.js');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Add imports and t dictionary at the top
const originalImports = `'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';`;

const newImports = `'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useInquiry } from '@/components/InquiryContext';

const t = {
  portalTitle: { nl: 'PALROM Website Console', en: 'PALROM Website Console', ro: 'Consolă Website PALROM' },
  authRequired: { 
    nl: 'Verificatie vereist voor het beheer van vacatures en nieuwsberichten.', 
    en: 'Authentication required to manage vacancies and news articles.', 
    ro: 'Autentificare necesară pentru gestionarea locurilor de muncă și a știrilor.' 
  },
  invalidPasscode: { nl: 'Ongeldige toegangscode. Probeer het opnieuw.', en: 'Invalid passcode. Please try again.', ro: 'Cod de acces nevalid. Vă rugăm să încercați din nou.' },
  adminPasscode: { nl: 'Beheerder Toegangscode', en: 'Admin Passcode', ro: 'Cod de Acces Administrator' },
  placeholderPasscode: { nl: 'Voer de toegangscode in', en: 'Enter administrator passcode', ro: 'Introduceți codul de acces' },
  authenticate: { nl: 'Aanmelden', en: 'Authenticate', ro: 'Autentificare' },
  verifying: { nl: 'Controleren...', en: 'Verifying...', ro: 'Se verifică...' },
  
  // Dashboard Header
  consoleTitle: { nl: 'Beheersconsole Website', en: 'Website Management Console', ro: 'Consolă Administrare Website' },
  viewLive: { nl: 'Bekijk Live Site', en: 'View Live Site', ro: 'Vezi Site-ul Live' },
  logout: { nl: 'Uitloggen', en: 'Logout', ro: 'Deconectare' },
  
  // Tabs
  vacanciesTab: { nl: 'Vacatures', en: 'Vacancies', ro: 'Locuri de muncă' },
  newsTab: { nl: 'Nieuws & Artikelen', en: 'News & Articles', ro: 'Știri și Articole' },
  
  // Vacancies Table
  activeOpenings: { nl: 'Actieve Vacatures', en: 'Active Career Openings', ro: 'Locuri de Muncă Active' },
  addVacancy: { nl: 'Vacature Toevoegen', en: 'Add Vacancy', ro: 'Adaugă Job' },
  noVacancies: { nl: 'Geen actieve vacatures gevonden. Klik op "Vacature Toevoegen" om er een te maken.', en: 'No active openings found. Click "Add Vacancy" to create one.', ro: 'Nu au fost găsite locuri de muncă active. Faceți clic pe "Adaugă Job" pentru a crea unul.' },
  idCode: { nl: 'ID / Code', en: 'ID / Code', ro: 'ID / Cod' },
  titleNl: { nl: 'Titel (NL)', en: 'Title (NL)', ro: 'Titlu (NL)' },
  titleEn: { nl: 'Titel (EN)', en: 'Title (EN)', ro: 'Titlu (EN)' },
  departmentCol: { nl: 'Afdeling', en: 'Department', ro: 'Departament' },
  typeCol: { nl: 'Type', en: 'Type', ro: 'Tip' },
  actionsCol: { nl: 'Acties', en: 'Actions', ro: 'Acțiuni' },
  editBtn: { nl: 'Bewerken', en: 'Edit', ro: 'Editează' },
  deleteBtn: { nl: 'Verwijderen', en: 'Delete', ro: 'Șterge' },
  
  // News Table
  publishedNews: { nl: 'Gepubliceerd Nieuws & Updates', en: 'Published News & Updates', ro: 'Știri și Noutăți Publicate' },
  addArticle: { nl: 'Artikel Toevoegen', en: 'Add Article', ro: 'Adaugă Articol' },
  noNews: { nl: 'Geen nieuwsartikelen gevonden. Klik op "Artikel Toevoegen" om er een te publiceren.', en: 'No news articles found. Click "Add Article" to publish one.', ro: 'Nu au fost găsite articole de știri. Faceți clic pe "Adaugă Articol" pentru a publica unul.' },
  thumbnail: { nl: 'Miniatuur', en: 'Thumbnail', ro: 'Miniatură' },
  tagDate: { nl: 'Tag / Datum (NL)', en: 'Tag / Date (NL)', ro: 'Etichetă / Dată (NL)' },
  titleNlCol: { nl: 'Titel (NL)', en: 'Title (NL)', ro: 'Titlu (NL)' },
  authorCol: { nl: 'Auteur', en: 'Author', ro: 'Autor' },
  targetLink: { nl: 'Doel Link', en: 'Target Link', ro: 'Link Destinație' },
  targeting: { nl: 'Doelgroep', en: 'Targeting', ro: 'Targetare' },
  romaniaOnly: { nl: 'Alleen Roemenië', en: 'Romania Only', ro: 'Doar România' },
  globalTarget: { nl: 'Wereldwijd', en: 'Global', ro: 'Global' },
  
  // Modals
  editVacancyTitle: { nl: 'Vacature Bewerken', en: 'Edit Vacancy', ro: 'Editează Locul de Muncă' },
  addNewVacancyTitle: { nl: 'Nieuwe Vacature Toevoegen', en: 'Add New Vacancy', ro: 'Adaugă un Nou Loc de Muncă' },
  editNewsTitle: { nl: 'Nieuwsartikel Bewerken', en: 'Edit News Article', ro: 'Editează Articolul de Știri' },
  addNewNewsTitle: { nl: 'Nieuw Artikel Toevoegen', en: 'Add New News Article', ro: 'Adaugă un Nou Articol' },
  translatingLabel: { nl: 'Vertalen:', en: 'Translating:', ro: 'Se traduce:' },
  autoTranslateBtn: { nl: 'Automatisch vertalen naar alle tabbladen', en: 'Auto-translate to all tabs', ro: 'Traducere automată în toate taburile' },
  translatingStatus: { nl: 'Vertalen...', en: 'Translating...', ro: 'Se traduce...' },
  cancelBtn: { nl: 'Annuleren', en: 'Cancel', ro: 'Anulează' },
  saveVacancyBtn: { nl: 'Vacature Opslaan', en: 'Save Vacancy', ro: 'Salvează Jobul' },
  savingStatus: { nl: 'Opslaan...', en: 'Saving...', ro: 'Se salvează...' },
  publishArticleBtn: { nl: 'Artikel Publiceren', en: 'Publish Article', ro: 'Publică Articolul' },
  publishingStatus: { nl: 'Publiceren...', en: 'Publishing...', ro: 'Se publică...' },
  
  // Vacancy Fields
  localizedInfo: { nl: 'Gelokaliseerde Info', en: 'Localized Info', ro: 'Informații Localizate' },
  jobTitleLabel: { nl: 'Functietitel', en: 'Job Title', ro: 'Titlul Jobului' },
  departmentLabel: { nl: 'Afdeling', en: 'Department', ro: 'Departament' },
  jobTypeLabel: { nl: 'Dienstverband', en: 'Job Type', ro: 'Tip Job' },
  salaryLabel: { nl: 'Salarisindicatie', en: 'Salary Rate', ro: 'Salariul' },
  descriptionLabel: { nl: 'Omschrijving', en: 'Description', ro: 'Descriere' },
  requirementsLabel: { nl: 'Functie-eisen Lijst', en: 'Job Requirements List', ro: 'Lista de Cerințe a Jobului' },
  newReqPlaceholder: { nl: 'Voeg nieuwe eis toe...', en: 'Add new requirement line...', ro: 'Adaugă o nouă cerință...' },
  addReqBtn: { nl: 'Toevoegen', en: 'Add', ro: 'Adaugă' },
  locationLabel: { nl: 'Fabriek Locatie (Globaal)', en: 'Factory Location (Global)', ro: 'Locație Fabrică (Global)' },
  identifierLabel: { nl: 'Unieke Identifier / Slug (Globaal)', en: 'Custom Identifier / Slug (Global)', ro: 'Identificator Unic / Slug (Global)' },
  slugNote: { nl: 'Automatisch gegenereerd indien leeg', en: 'Auto-generated if empty', ro: 'Generat automat dacă este gol' },
  
  // News Fields
  articleTitleLabel: { nl: 'Titel van het Artikel', en: 'Article Title', ro: 'Titlul Articolului' },
  categoryTagLabel: { nl: 'Categorie Etikette (Tag)', en: 'Category Tag', ro: 'Etichetă Categorie' },
  displayDateLabel: { nl: 'Weergavedatum', en: 'Display Date', ro: 'Data Afișată' },
  articleContentLabel: { nl: 'Inhoud van het Artikel', en: 'Article Content', ro: 'Conținutul Articolului' },
  redirectLinkLabel: { nl: 'Knop Link Tekst', en: 'Redirect Link Text', ro: 'Text Link Buton' },
  authorLabel: { nl: 'Auteur (Globaal)', en: 'Author (Global)', ro: 'Autor (Global)' },
  redirectUrlLabel: { nl: 'Link Doorverwijzings-URL (Globaal)', en: 'Link Redirect URL (Global)', ro: 'URL Redirecționare Buton (Global)' },
  imageLabel: { nl: 'Artikel Afbeelding (Globaal)', en: 'Article Image (Global)', ro: 'Imagine Articol (Global)' },
  uploadImageBtn: { nl: 'Upload Nieuw Afbeelding Bestand', en: 'Upload New Image File', ro: 'Încarcă un Fișier de Imagine Nou' },
  uploadingStatus: { nl: 'Uploaden...', en: 'Uploading...', ro: 'Se încarcă...' },
  romaniaOnlyCheckbox: { nl: 'Beperk artikel alleen tot Roemeense gebruikers', en: 'Limit article to Romanian users only', ro: 'Limitează articolul doar la utilizatorii din România' }
};`;

// 2. Initialize hook and consoleLang state at the start of AdminPortal
const originalFunctionStart = `export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);`;

const newFunctionStart = `export default function AdminPortal() {
  const { lang } = useInquiry();
  const [consoleLang, setConsoleLang] = useState('en');

  useEffect(() => {
    if (lang && ['nl', 'en', 'ro'].includes(lang)) {
      setConsoleLang(lang);
    }
  }, [lang]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);`;

content = content.replace(originalFunctionStart, newFunctionStart);

// 3. String replacements for Lock Screen
content = content.replace('<h2>\n              PALROM Website Portal\n            </h2>', '<h2>\n              {t.portalTitle[consoleLang]}\n            </h2>');
content = content.replace('Authentication required to manage vacancies, careers data, and news items.', '{t.authRequired[consoleLang]}');
content = content.replace('Invalid passcode. Please try again.', '{t.invalidPasscode[consoleLang]}');
content = content.replace('Admin Passcode', '{t.adminPasscode[consoleLang]}');
content = content.replace('placeholder="Enter administrator passcode"', 'placeholder={t.placeholderPasscode[consoleLang]}');
content = content.replace('<i className="fa-solid fa-spinner fa-spin"></i> Verifying...', '<i className="fa-solid fa-spinner fa-spin"></i> {t.verifying[consoleLang]}');
content = content.replace('<i className="fa-solid fa-key"></i> Authenticate', '<i className="fa-solid fa-key"></i> {t.authenticate[consoleLang]}');

// 4. Header Replacements (including language switcher injection)
const originalHeader = `            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-primary-dark)' }}>
                PALROM Products SRL
              </span>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-forest-dark)', margin: '4px 0 0', letterSpacing: '-0.5px' }}>
                Website Management Console
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/" target="_blank" style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                padding: '0.5rem 1rem',
                border: '1px solid #edf2f7',
                borderRadius: '6px',
                backgroundColor: '#ffffff'
              }}>
                <i className="fa-solid fa-up-right-from-square" style={{ marginRight: '0.4rem' }}></i> View Live Site
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  backgroundColor: 'transparent',
                  border: '1px solid #fee2e2',
                  color: '#b91c1c',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <i className="fa-solid fa-power-off"></i> Logout
              </button>
            </div>`;

const newHeader = `            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-primary-dark)' }}>
                PALROM Products SRL
              </span>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-forest-dark)', margin: '4px 0 0', letterSpacing: '-0.5px' }}>
                {t.consoleTitle[consoleLang]}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {/* Console Language Switcher */}
              <div style={{ display: 'flex', gap: '0.2rem', backgroundColor: '#edf2f7', padding: '0.2rem', borderRadius: '6px', border: '1px solid #edf2f7' }}>
                {['nl', 'en', 'ro'].map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setConsoleLang(l)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: 'none',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      backgroundColor: consoleLang === l ? '#ffffff' : 'transparent',
                      color: consoleLang === l ? 'var(--color-forest-dark)' : 'var(--color-text-muted)',
                      boxShadow: consoleLang === l ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <Link href="/" target="_blank" style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                padding: '0.5rem 1rem',
                border: '1px solid #edf2f7',
                borderRadius: '6px',
                backgroundColor: '#ffffff'
              }}>
                <i className="fa-solid fa-up-right-from-square" style={{ marginRight: '0.4rem' }}></i> {t.viewLive[consoleLang]}
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  backgroundColor: 'transparent',
                  border: '1px solid #fee2e2',
                  color: '#b91c1c',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <i className="fa-solid fa-power-off"></i> {t.logout[consoleLang]}
              </button>
            </div>`;

content = content.replace(originalHeader, newHeader);

// 5. Tabs
content = content.replace('Vacancies ({vacancies.length})', '{t.vacanciesTab[consoleLang]} ({vacancies.length})');
content = content.replace('News & Articles ({newsItems.length})', '{t.newsTab[consoleLang]} ({newsItems.length})');

// 6. Vacancies List & Table
content = content.replace('Active Career Openings', '{t.activeOpenings[consoleLang]}');
content = content.replace('<i className="fa-solid fa-plus"></i> Add Vacancy', '<i className="fa-solid fa-plus"></i> {t.addVacancy[consoleLang]}');
content = content.replace('<p>No active openings found. Click "Add Vacancy" to create one.</p>', '<p>{t.noVacancies[consoleLang]}</p>');
content = content.replace('Title (NL)', '{t.titleNl[consoleLang]}');
content = content.replace('Title (EN)', '{t.titleEn[consoleLang]}');
content = content.replace('<th>ID / Code</th>', '<th>{t.idCode[consoleLang]}</th>');
content = content.replace('<th>Department</th>', '<th>{t.departmentCol[consoleLang]}</th>');
content = content.replace('<th>Type</th>', '<th>{t.typeCol[consoleLang]}</th>');
content = content.replace('<th style={{ padding: \'12px 10px\', textAlign: \'right\' }}>Actions</th>', '<th style={{ padding: \'12px 10px\', textAlign: \'right\' }}>{t.actionsCol[consoleLang]}</th>');

// 7. News List & Table
content = content.replace('Published News & Updates', '{t.publishedNews[consoleLang]}');
content = content.replace('<i className="fa-solid fa-plus"></i> Add Article', '<i className="fa-solid fa-plus"></i> {t.addArticle[consoleLang]}');
content = content.replace('<p>No news articles found. Click "Add Article" to publish one.</p>', '<p>{t.noNews[consoleLang]}</p>');
content = content.replace('<th>Thumbnail</th>', '<th>{t.thumbnail[consoleLang]}</th>');
content = content.replace('Tag / Date (NL)', '{t.tagDate[consoleLang]}');
content = content.replace('<th>Title (NL)</th>', '<th>{t.titleNlCol[consoleLang]}</th>');
content = content.replace('<th>Author</th>', '<th>{t.authorCol[consoleLang]}</th>');
content = content.replace('<th>Target Link</th>', '<th>{t.targetLink[consoleLang]}</th>');
content = content.replace('<th>Targeting</th>', '<th>{t.targeting[consoleLang]}</th>');
content = content.replace('Romania Only', '{t.romaniaOnly[consoleLang]}');
content = content.replace('Global', '{t.globalTarget[consoleLang]}');

// 8. Shared table buttons (Edit & Delete) - make sure we replace globally
content = content.replaceAll('<i className="fa-solid fa-pen"></i> Edit', '<i className="fa-solid fa-pen"></i> {t.editBtn[consoleLang]}');
content = content.replaceAll('<i className="fa-solid fa-trash"></i> Delete', '<i className="fa-solid fa-trash"></i> {t.deleteBtn[consoleLang]}');

// 9. Modals header and generic buttons
const originalModalHeaderTitle = `              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
                {editingId 
                  ? \`Edit \${modalType === 'vacancy' ? 'Vacancy' : 'News Article'} (\${editingId})\` 
                  : \`Add New \${modalType === 'vacancy' ? 'Vacancy' : 'News Article'}\`
                }
              </h3>`;

const newModalHeaderTitle = `              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
                {editingId 
                  ? (modalType === 'vacancy' ? \`\${t.editVacancyTitle[consoleLang]} (\${editingId})\` : \`\${t.editNewsTitle[consoleLang]} (\${editingId})\`)
                  : (modalType === 'vacancy' ? t.addNewVacancyTitle[consoleLang] : t.addNewNewsTitle[consoleLang])
                }
              </h3>`;

content = content.replace(originalModalHeaderTitle, newModalHeaderTitle);
content = content.replace('Translating:', '{t.translatingLabel[consoleLang]}');
content = content.replace('Auto-translate to all tabs', '{t.autoTranslateBtn[consoleLang]}');
content = content.replace('<i className="fa-solid fa-spinner fa-spin"></i> Translating...', '<i className="fa-solid fa-spinner fa-spin"></i> {t.translatingStatus[consoleLang]}');
content = content.replaceAll('Cancel\n                    </button>', '{t.cancelBtn[consoleLang]}\n                    </button>');
content = content.replaceAll('Cancel\n                    </Link>', '{t.cancelBtn[consoleLang]}\n                    </Link>');
content = content.replaceAll('Cancel\n                      </button>', '{t.cancelBtn[consoleLang]}\n                      </button>');

// Save Vacancy buttons
content = content.replace('<i className="fa-solid fa-spinner fa-spin"></i> Saving...', '<i className="fa-solid fa-spinner fa-spin"></i> {t.savingStatus[consoleLang]}');
content = content.replace('<i className="fa-solid fa-floppy-disk"></i> Save Vacancy', '<i className="fa-solid fa-floppy-disk"></i> {t.saveVacancyBtn[consoleLang]}');

// Publish Article buttons
content = content.replace('<i className="fa-solid fa-spinner fa-spin"></i> Publishing...', '<i className="fa-solid fa-spinner fa-spin"></i> {t.publishingStatus[consoleLang]}');
content = content.replace('<i className="fa-solid fa-floppy-disk"></i> Publish Article', '<i className="fa-solid fa-floppy-disk"></i> {t.publishArticleBtn[consoleLang]}');

// 10. Vacancy Fields
content = content.replace('Localized Info ({activeFormLang.toUpperCase()})', '{t.localizedInfo[consoleLang]} ({activeFormLang.toUpperCase()})');
content = content.replace('Job Title ({activeFormLang}) *', '{t.jobTitleLabel[consoleLang]} ({activeFormLang}) *');
content = content.replace('Department ({activeFormLang})', '{t.departmentLabel[consoleLang]} ({activeFormLang})');
content = content.replace('Job Type ({activeFormLang})', '{t.jobTypeLabel[consoleLang]} ({activeFormLang})');
content = content.replace('Salary Rate ({activeFormLang})', '{t.salaryLabel[consoleLang]} ({activeFormLang})');
content = content.replace('Description ({activeFormLang})', '{t.descriptionLabel[consoleLang]} ({activeFormLang})');
content = content.replace('Job Requirements List ({activeFormLang})', '{t.requirementsLabel[consoleLang]} ({activeFormLang})');
content = content.replace('placeholder="Add new requirement line..."', 'placeholder={t.newReqPlaceholder[consoleLang]}');
content = content.replace('<i className="fa-solid fa-plus"></i> Add\n                        </button>', '<i className="fa-solid fa-plus"></i> {t.addReqBtn[consoleLang]}\n                        </button>');
content = content.replace('Factory Location (Global)', '{t.locationLabel[consoleLang]}');
content = content.replace('Custom Identifier / Slug (Global)', '{t.identifierLabel[consoleLang]}');
content = content.replace('placeholder="e.g. planing-operator (Auto-generated if empty)"', 'placeholder={t.slugNote[consoleLang]}');

// 11. News Fields
content = content.replace('Article Title ({activeFormLang}) *', '{t.articleTitleLabel[consoleLang]} ({activeFormLang}) *');
content = content.replace('Category Tag ({activeFormLang})', '{t.categoryTagLabel[consoleLang]} ({activeFormLang})');
content = content.replace('Display Date ({activeFormLang})', '{t.displayDateLabel[consoleLang]} ({activeFormLang})');
content = content.replace('Article Content ({activeFormLang})', '{t.articleContentLabel[consoleLang]} ({activeFormLang})');
content = content.replace('Redirect Link Text ({activeFormLang})', '{t.redirectLinkLabel[consoleLang]} ({activeFormLang})');
content = content.replace('Author (Global)', '{t.authorLabel[consoleLang]}');
content = content.replace('Link Redirect URL (Global)', '{t.redirectUrlLabel[consoleLang]}');
content = content.replace('Article Image (Global)', '{t.imageLabel[consoleLang]}');
content = content.replace('Upload New Image File', '{t.uploadImageBtn[consoleLang]}');
content = content.replace('<i className="fa-solid fa-spinner fa-spin"></i> Uploading...', '<i className="fa-solid fa-spinner fa-spin"></i> {t.uploadingStatus[consoleLang]}');
content = content.replace('Limit article to Romanian users only (isRomaniaOnly)', '{t.romaniaOnlyCheckbox[consoleLang]}');

content = content.replace(originalImports, newImports);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully completed replacement of portal text with multilingual translations!');

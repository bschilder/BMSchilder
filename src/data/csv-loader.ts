import Papa from 'papaparse';
import type { CVData, Education, Experience, Publication, Talk, Grant, Tool, Skill, Profile } from '../types/cv-data';

const CV_DATA_URL = 'https://raw.githubusercontent.com/bschilder/CV/main/cv_data/';
const cache = new Map<string, unknown[]>();

function collapseBullets<T extends Record<string, unknown>>(row: T): T & { bullets: string[] } {
  const bullets: string[] = [];
  const cleaned = { ...row } as Record<string, unknown> & { bullets: string[] };

  for (const key of Object.keys(cleaned)) {
    if (/^Bullet_\d+$/.test(key)) {
      const val = cleaned[key];
      if (val && typeof val === 'string' && val.trim() !== '' && val.trim() !== '-') {
        bullets.push(val.trim());
      }
      delete cleaned[key];
    }
  }

  cleaned.bullets = bullets;
  return cleaned as T & { bullets: string[] };
}

function cleanValue(val: unknown): unknown {
  if (val === '-' || val === '\\-' || val === 'NA' || val === '') return null;
  return val;
}

function cleanRow<T extends Record<string, unknown>>(row: T): T {
  const cleaned = {} as Record<string, unknown>;
  for (const [key, val] of Object.entries(row)) {
    cleaned[key.trim()] = cleanValue(val);
  }
  return cleaned as T;
}

async function fetchCSV<T>(filename: string): Promise<T[]> {
  if (cache.has(filename)) return cache.get(filename) as T[];

  const url = `${CV_DATA_URL}${filename}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${filename}: ${response.status}`);

  const text = await response.text();
  // Remove BOM if present
  const cleanText = text.replace(/^\uFEFF/, '');

  return new Promise((resolve, reject) => {
    Papa.parse<T>(cleanText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map(row => {
          const cleaned = cleanRow(row as Record<string, unknown>);
          return collapseBullets(cleaned);
        }) as T[];
        cache.set(filename, rows);
        resolve(rows);
      },
      error: (err: Error) => reject(err),
    });
  });
}

export async function loadAllData(): Promise<CVData> {
  const [education, experience, publications, talks, grants, tools, skills, profile] =
    await Promise.all([
      fetchCSV<Education>('education.csv'),
      fetchCSV<Experience>('experience.csv'),
      fetchCSV<Publication>('publications.csv'),
      fetchCSV<Talk>('talks.csv'),
      fetchCSV<Grant>('grants.csv'),
      fetchCSV<Tool>('tools.csv'),
      fetchCSV<Skill>('skills.csv'),
      fetchCSV<Profile>('profile.csv'),
    ]);

  return { education, experience, publications, talks, grants, tools, skills, profile };
}

export function getYearsExperience(experience: Experience[]): number {
  const research = experience.filter(e => e.Type === 'research');
  if (research.length === 0) return 0;
  const earliest = Math.min(...research.map(e => e.StartYear));
  return new Date().getFullYear() - earliest;
}

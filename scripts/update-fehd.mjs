import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const sources = {
  restaurants: 'https://www.fehd.gov.hk/tc_chi/licensing/license/text/LP_Restaurants_TC.XML',
  otherFood: 'https://www.fehd.gov.hk/tc_chi/licensing/license/text/LP_OtherFood_TC.XML'
};

await fs.mkdir('data/raw', { recursive: true });
const meta = { fetchedAt: new Date().toISOString(), sources: {} };

for (const [key, url] of Object.entries(sources)) {
  const res = await fetch(url, { headers: { 'user-agent': 'CEGO-Food-Radar/1.0' } });
  if (!res.ok) throw new Error(`${key}: ${res.status}`);
  const text = await res.text();
  await fs.writeFile(`data/raw/${key}.xml`, text);
  meta.sources[key] = {
    url,
    bytes: Buffer.byteLength(text),
    sha256: crypto.createHash('sha256').update(text).digest('hex')
  };
}

await fs.writeFile('data/fehd-meta.json', JSON.stringify(meta, null, 2));
console.log(meta);
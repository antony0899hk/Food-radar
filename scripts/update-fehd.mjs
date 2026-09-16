import fs from 'node:fs/promises';
import crypto from 'node:crypto';

const sources = {
  restaurants: 'https://www.fehd.gov.hk/tc_chi/licensing/license/text/LP_Restaurants_TC.XML',
  otherFood: 'https://www.fehd.gov.hk/tc_chi/licensing/license/text/LP_OtherFood_TC.XML'
};

const decodeXml = (s = '') => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .trim();

const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return m ? decodeXml(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim() : '';
};

const normalizeAddress = (s = '') => s.toUpperCase()
  .replace(/[，,。\.／/\-–—()（）\s]/g, '')
  .replace(/地下/g, 'G')
  .trim();

function parseLicences(xml) {
  const rows = [];
  for (const m of xml.matchAll(/<LP(?:\s[^>]*)?>([\s\S]*?)<\/LP>/gi)) {
    const b = m[1];
    const licno = tag(b, 'LICNO');
    const shopSign = tag(b, 'SS');
    const address = tag(b, 'ADR');
    const type = tag(b, 'TYPE');
    const expiry = tag(b, 'EXPDATE');
    if (!licno && !shopSign && !address) continue;
    rows.push({ licno, shopSign, address, addressKey: normalizeAddress(address), type, expiry });
  }
  return rows;
}

await fs.mkdir('data/raw', { recursive: true });
const meta = { fetchedAt: new Date().toISOString(), sources: {} };
const downloaded = {};

for (const [key, url] of Object.entries(sources)) {
  const res = await fetch(url, { headers: { 'user-agent': 'CEGO-Food-Radar/1.0' } });
  if (!res.ok) throw new Error(`${key}: ${res.status}`);
  const text = await res.text();
  downloaded[key] = text;
  await fs.writeFile(`data/raw/${key}.xml`, text);
  meta.sources[key] = {
    url,
    bytes: Buffer.byteLength(text),
    sha256: crypto.createHash('sha256').update(text).digest('hex')
  };
}

const restaurants = parseLicences(downloaded.restaurants);
const otherFood = parseLicences(downloaded.otherFood);
const lookup = {
  generatedAt: meta.fetchedAt,
  source: 'FEHD official XML',
  restaurants,
  byLicence: Object.fromEntries(restaurants.filter(x => x.licno).map(x => [x.licno, x])),
  stats: {
    restaurants: restaurants.length,
    restaurantsWithShopSign: restaurants.filter(x => x.shopSign).length,
    otherFood: otherFood.length
  }
};

await fs.writeFile('data/fehd-restaurants.json', JSON.stringify(lookup, null, 2));
await fs.writeFile('data/fehd-other-food.json', JSON.stringify({ generatedAt: meta.fetchedAt, source: 'FEHD official XML', rows: otherFood }, null, 2));
meta.parsed = lookup.stats;
await fs.writeFile('data/fehd-meta.json', JSON.stringify(meta, null, 2));
console.log(meta);

const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'src', 'pages', 'FindFoodPage.jsx');
const reviewPath = path.join(__dirname, '..', 'emoji-review.csv');
const fixPath = path.join(__dirname, '..', 'emoji-fix.csv');

const text = fs.readFileSync(srcPath, 'utf8');
const matches = [...text.matchAll(/"name"\s*:\s*"([^"]+)"[\s\S]*?"emoji"\s*:\s*"([^"]+)"/g)];
const items = matches.map((m) => ({ name: m[1], emoji: m[2] }));

const fruitRules = [
  { pattern: /กล้วย/u, expected: '🍌' },
  { pattern: /กีวี/u, expected: '🥝' },
  { pattern: /แคนตาลูป|แตงไทย/u, expected: '🍈' },
  { pattern: /แตงโม/u, expected: '🍉' },
  { pattern: /เชอรี่|ลิ้นจี่/u, expected: '🍒' },
  { pattern: /ชมพู่/u, expected: '🍎' },
  { pattern: /มะกอก/u, expected: '🫒' },
  { pattern: /ฝรั่ง|สาลี่/u, expected: '🍐' },
  { pattern: /พีช|ลูกพลับ/u, expected: '🍑' },
  { pattern: /มะม่วง/u, expected: '🥭' },
  { pattern: /สตรอเบอรี/u, expected: '🍓' },
  { pattern: /ส้ม/u, expected: '🍊' },
  { pattern: /สับปะรด/u, expected: '🍍' },
  { pattern: /องุ่น|ลูกเกด/u, expected: '🍇' },
  { pattern: /ลูกตาล/u, expected: '🥥' },
  {
    pattern:
      /แก้วมังกร|ขนุน|เงาะ|ทุเรียน|น้อยหน่า|พรุน|พุทรา|มะขาม|มะปราง|มะเฟือง|มะไฟ|มะยงชิด|มะละกอ|มังคุด|ระกำ|ลองกอง|ละมุด|ลางสาด|ลำไย|ลูกหว้า|สละ|อินทผลัม/u,
    expected: null,
  },
];

const vegRules = [
  { pattern: /มันฝรั่ง/u, expected: '🥔' },
  { pattern: /ข้าวโพด(?!อ่อน)/u, expected: '🌽' },
  { pattern: /บร็อคโคลี|ดอกกะหล่ำ/u, expected: '🥦' },
  { pattern: /กะหล่ำปลี|ผักคะน้า|แขนงคะน้า|คะน้าฮ่องกง/u, expected: '🥬' },
  { pattern: /แครอท/u, expected: '🥕' },
  { pattern: /มะเขือ/u, expected: '🍆' },
  { pattern: /กระเจี๊ยบ|มะระ/u, expected: '🥒' },
  { pattern: /ถั่วลันเตา/u, expected: '🫛' },
  { pattern: /ถั่วฝักยาว|สะตอ/u, expected: '🫘' },
  { pattern: /ถั่วงอก/u, expected: '🌱' },
  { pattern: /ข้าวโพดอ่อน/u, expected: '🌽' },
  { pattern: /หัวปลี/u, expected: '🌺' },
  { pattern: /ดอกแค/u, expected: '🌼' },
  { pattern: /หน่อไม้ฝรั่ง/u, expected: '🌿' },
  { pattern: /มะละกอดิบ/u, expected: '🥗' },
  { pattern: /ขนุนอ่อน/u, expected: null },
];

const dessertSet = new Set([
  '🍰',
  '🍪',
  '🥞',
  '🧁',
  '🍩',
  '🥮',
  '🥧',
  '🍮',
  '🍦',
  '🍧',
  '🥣',
  '🍞',
  '🥐',
  '🥯',
  '🥟',
  '🍘',
  '🍿',
  '🧋',
  '🌮',
  '🫓',
  '🌯',
]);

const noodleSet = new Set(['🍜', '🍝']);
const riceSet = new Set(['🍚', '🍛', '🥣']);
const dairySet = new Set(['🥛', '🧃', '🥣', '🥄', '🥫']);

const matchRule = (name, rules) => rules.find((rule) => rule.pattern.test(name))?.expected;

const testEmoji = (name, emoji) => {
  const vegExpected = matchRule(name, vegRules);
  if (vegExpected !== undefined) {
    if (vegExpected === null) {
      return { status: 'fix', reason: 'veg-no-emoji', expected: '(need image)' };
    }
    return emoji === vegExpected
      ? { status: 'ok', reason: 'veg-match', expected: vegExpected }
      : { status: 'fix', reason: 'veg-mismatch', expected: vegExpected };
  }

  const fruitExpected = matchRule(name, fruitRules);
  if (fruitExpected !== undefined) {
    if (fruitExpected === null) {
      return { status: 'fix', reason: 'fruit-no-emoji', expected: '(need image)' };
    }
    return emoji === fruitExpected
      ? { status: 'ok', reason: 'fruit-match', expected: fruitExpected }
      : { status: 'fix', reason: 'fruit-mismatch', expected: fruitExpected };
  }

  if (/บะหมี่|ก๋วยเตี๋ยว|เส้น|ผัดไทย|ผัดซีอิ๊ว|ราดหน้า|ขนมจีน|ก๋วยจั๊บ|อุด้ง|พาสต้า|มักกะโรนี|วุ้นเส้น/u.test(name)) {
    return noodleSet.has(emoji)
      ? { status: 'ok', reason: 'noodle-match', expected: [...noodleSet].join('') }
      : { status: 'fix', reason: 'noodle-mismatch', expected: [...noodleSet].join('') };
  }

  if (
    /ขนม|เค้ก|คุกกี้|พาย|โดนัท|บราวนี่|คัพเค้ก|วาฟเฟิล|เอแคร์|โอริโอ|ไอศกรีม|เจลาติน|ซาลาเปา|บิสกิต|ซีเรียล|ป๊อปคอร์น|แครกเกอร์|แพนเค้ก|ทองม้วน|เต้าทึง|ซาหริ่ม|บัวลอย|สาคู|ข้าวต้มมัด|ข้าวเหนียวปิ้ง|ข้าวเหนียวมูล|ข้าวเหนียวมูน|เฉาก๊วย|ทุเรียนทอด|ปาท่องโก๋|เดนิส|พอนเดอริง|ลูกชุบ|ขนมปัง|แป้งทาโก้|ตอร์ตีญ่า|โรตี|แผ่นปอเปี๊ยะ|แป้งเกี๊ยว|หมั่นโถว/u.test(
      name
    )
  ) {
    return dessertSet.has(emoji)
      ? { status: 'ok', reason: 'dessert-match', expected: [...dessertSet].join('') }
      : { status: 'fix', reason: 'dessert-mismatch', expected: [...dessertSet].join('') };
  }

  if (/ข้าว(?!โพด)|โจ๊ก/u.test(name)) {
    return riceSet.has(emoji)
      ? { status: 'ok', reason: 'rice-match', expected: [...riceSet].join('') }
      : { status: 'fix', reason: 'rice-mismatch', expected: [...riceSet].join('') };
  }

  if (/(^|[^ข])นม|โยเกิร์ต/u.test(name)) {
    return dairySet.has(emoji)
      ? { status: 'ok', reason: 'dairy-match', expected: [...dairySet].join('') }
      : { status: 'fix', reason: 'dairy-mismatch', expected: [...dairySet].join('') };
  }

  return { status: 'ok', reason: 'unclassified', expected: '' };
};

const report = items.map((item) => {
  const result = testEmoji(item.name, item.emoji);
  return {
    name: item.name,
    emoji: item.emoji,
    status: result.status,
    reason: result.reason,
    expected: result.expected,
  };
});

const csvEscape = (value) => `"${String(value).replace(/"/g, '""')}"`;
const toCsv = (rows) => {
  const header = ['name', 'emoji', 'status', 'reason', 'expected'];
  const lines = [header.map(csvEscape).join(',')];
  rows.forEach((row) => {
    lines.push(header.map((key) => csvEscape(row[key] ?? '')).join(','));
  });
  return `\uFEFF${lines.join('\n')}`;
};

fs.writeFileSync(reviewPath, toCsv(report), 'utf8');
fs.writeFileSync(fixPath, toCsv(report.filter((row) => row.status === 'fix')), 'utf8');

const summary = report.reduce(
  (acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  },
  { ok: 0, fix: 0 }
);

console.log(`ok: ${summary.ok}`);
console.log(`fix: ${summary.fix}`);

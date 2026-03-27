export const config = {
  runtime: 'edge'
};

const GIST_ID = 'fe73c32ddd8ad4ec118743edc3fcfd02';
const TOKEN = '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';
const FILE_NAME = 'gistfile1.txt';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { code, contact } = await req.json();

    // 1. 读取当前 Gist 数据
    const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: { Authorization: `token ${TOKEN}` }
    });
    const gistData = await gistRes.json();
    const currentData = JSON.parse(gistData.files[FILE_NAME].content);
    const records = currentData.records || [];

    // 2. 检查是否已存在
    const exists = records.find(item => item.code === code);
    if (exists) {
      return new Response(JSON.stringify({
        success: false,
        existContact: exists.contact || '您的伙伴没有留下联系方式'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. 不存在 → 新增
    records.push({ code, contact });
    const newData = { records };

    // 4. 写入 Gist
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        Authorization: `token ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          [FILE_NAME]: { content: JSON.stringify(newData, null, 2) }
        }
      })
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

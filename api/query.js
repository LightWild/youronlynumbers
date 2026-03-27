export const config = {
  runtime: 'edge'
};

const GIST_ID = 'fe73c32ddd8ad4ec118743edc3fcfd02';
const FILE_NAME = 'gistfile1.txt';

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response(JSON.stringify({ error: '缺少 code 参数' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`);
    const gistData = await gistRes.json();
    const currentData = JSON.parse(gistData.files[FILE_NAME].content);
    const records = currentData.records || [];
    const exists = records.find(item => item.code === code);

    return new Response(JSON.stringify({
      exists: !!exists,
      contact: exists ? (exists.contact || '您的伙伴没有留下联系方式') : null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

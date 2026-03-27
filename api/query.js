export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, msg: '方法不允许' });
  }

  try {
    // 模拟返回数据
    return res.json({ success: true, data: [] });
  } catch (error) {
    return res.status(500).json({ success: false, msg: '服务器错误' });
  }
}

export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, msg: '方法不允许' });
  }

  try {
    const { number, contact } = req.body;

    // 验证必填
    if (!number || !contact) {
      return res.json({ success: false, msg: '请填写完整信息' });
    }

    // 这里是模拟成功（你要存Gist我再给你加）
    return res.json({ success: true, msg: '登记成功' });
    
  } catch (error) {
    return res.status(500).json({ success: false, msg: '服务器错误' });
  }
}

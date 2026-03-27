export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, msg: '方法不允许' });
  }

  try {
    const { number, contact } = req.body;

    // 1. 验证格式：必须是 8 位 或 20 位纯数字
    const numRegex = /^\d+$/;
    if (!numRegex.test(number) || (number.length !== 8 && number.length !== 20)) {
      return res.json({
        success: false,
        msg: "编码必须是 8 位或 20 位纯数字"
      });
    }

    // 模拟已存在的记录（后面我帮你连Gist数据库）
    const mockData = [
      { number: "12345678", contact: "13800138000" },
      { number: "88888888", contact: "" },
      { number: "11223344556677889900", contact: "微信：abc123" }
    ];

    // 查重
    const exist = mockData.find(item => item.number === number);
    if (exist) {
      let tip = "";
      if (exist.contact && exist.contact.trim() !== "") {
        tip = `该编码已被登记，联系方式：${exist.contact}`;
      } else {
        tip = "该编码已被登记，您的伙伴没有留下联系方式";
      }
      return res.json({ success: false, msg: tip });
    }

    // 不存在 → 登记成功
    return res.json({
      success: true,
      msg: "✅ 登记成功！"
    });

  } catch (err) {
    return res.status(500).json({ success: false, msg: "服务器错误" });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, msg: '方法不允许' });
  }

  try {
    const { number, contact } = req.body;

    // 1. 格式校验：必须是 8 或 20 位纯数字
    const numRegex = /^\d+$/;
    if (!numRegex.test(number) || (number.length !== 8 && number.length !== 20)) {
      return res.json({
        success: false,
        msg: "⚠️ 编码必须是 8 位或 20 位纯数字"
      });
    }

    // --- 你的真实配置（已修正） ---
    const GIST_ID = "fe73c32ddd8ad4ec118743edc3fcfd02";
    const GIST_TOKEN = "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";
    const FILE_NAME = "data.json"; // ✅ 这才是你真实的文件名！

    // 2. 读取 Gist
    const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        'Authorization': `token ${GIST_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!gistRes.ok) {
      return res.json({ success: false, msg: `读取数据失败: ${gistRes.status}` });
    }

    const gistData = await gistRes.json();
    const fileContent = gistData.files[FILE_NAME].content;
    const db = JSON.parse(fileContent);

    // 3. 查重核心功能
    const found = db.records.find(item => item.code === number);
    if (found) {
      if (found.contact && found.contact.trim() !== "") {
        return res.json({
          success: false,
          msg: `❌ 该编码已登记，联系方式：${found.contact}`
        });
      } else {
        return res.json({
          success: false,
          msg: "❌ 该编码已登记，您的伙伴没有留下联系方式"
        });
      }
    }

    // 4. 写入新数据
    db.records.push({ code: number, contact: contact || "" });

    // 5. 更新 Gist
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: {
        'Authorization': `token ${GIST_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          [FILE_NAME]: {
            content: JSON.stringify(db, null, 2)
          }
        }
      })
    });

    return res.json({ success: true, msg: "✅ 登记成功！" });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, msg: "系统繁忙，请重试" });
  }
}

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
        msg: "编码必须是 8 位或 20 位纯数字"
      });
    }

    // 2. 读取 Gist 数据
    const GIST_ID = "你的GistID"; // 替换成你的 Gist ID
    const GIST_TOKEN = "你的GitHubToken"; // 替换成你的 Token
    const GIST_FILENAME = "data.json"; // 你的数据文件名

    const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        'Authorization': `token ${GIST_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!gistRes.ok) {
      return res.status(500).json({ success: false, msg: '读取数据库失败' });
    }

    const gistData = await gistRes.json();
    const fileContent = gistData.files[GIST_FILENAME].content;
    let data = JSON.parse(fileContent);

    // 3. 查重
    const existRecord = data.records.find(item => item.code === number);
    if (existRecord) {
      let tip = "";
      if (existRecord.contact && existRecord.contact.trim() !== "") {
        tip = `该编码已被登记，联系方式：${existRecord.contact}`;
      } else {
        tip = "该编码已被登记，您的伙伴没有留下联系方式";
      }
      return res.json({ success: false, msg: tip });
    }

    // 4. 写入新记录
    data.records.push({ code: number, contact: contact || "" });

    // 5. 更新 Gist
    const updateRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${GIST_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          [GIST_FILENAME]: {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });

    if (!updateRes.ok) {
      return res.status(500).json({ success: false, msg: '保存数据失败' });
    }

    return res.json({ success: true, msg: "✅ 登记成功！" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "服务器错误" });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, msg: '方法不允许' });
  }

  try {
    const GIST_ID = "fe73c32ddd8ad4ec118743edc3fcfd02";
    const GIST_TOKEN = "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";
    const GIST_FILENAME = "data.json";

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
    const data = JSON.parse(fileContent);

    return res.json({ success: true, data: data.records });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "服务器错误" });
  }
}

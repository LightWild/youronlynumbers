// 换成你自己的 Raw 链接
const rawUrl = "https://gist.githubusercontent.com/这里换成你真实的链接";

// 读取数据
async function loadData() {
  try {
    let res = await fetch(rawUrl);
    let data = await res.json();
    console.log("读取成功", data);
    return data;
  } catch (err) {
    console.error("读取失败", err);
    return null;
  }
}

// 提交保存（公开 Gist 只能读不能写，所以保存逻辑要改）
async function saveData(newData) {
  alert("当前为公开模式，仅能读取，不能保存数据");
}

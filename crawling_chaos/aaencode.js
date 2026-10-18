const targetUrl = "https://ksnctf.sweetduet.info/q/3/unya.html?";

console.log("1. 問題ページからコードを取得中...");
const res = await fetch(targetUrl);
const html = await res.text();

// 最も文字数が長い <script> タグ（難読化本体）を確実に抽出
const scriptMatches = [
  ...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi),
];
const targetScript = scriptMatches
  .map((m) => m[1].trim())
  .sort((a, b) => b.length - a.length)[0];

if (!targetScript) {
  throw new Error("難読化されたスクリプトが見つかりませんでした。");
}

console.log("2. レシーバーをセットアップ中...");

let decodedSource = "";

// 復元されたコードが最後に実行する $(function(){ ... }) の $ を定義して待ち受ける
globalThis.$ = function (callback) {
  if (typeof callback === "function") {
    decodedSource = callback.toString();
  }
  return {
    submit: () => {},
    val: () => "",
  };
};

// ブラウザ環境の最小ダミーオブジェクト
globalThis.window = globalThis;
globalThis.document = {
  getElementById: () => null,
  getElementsByTagName: () => [],
};

console.log("3. コードを評価中...");
try {
  // 非Strictモードで難読化スクリプトを実行
  new Function(targetScript)();
} catch (e) {
  // 万が一 $ 実行前に停止した場合でも、スタックトレースからコードを救出
  const stack = e.stack || e.toString();
  if (stack.includes("Array(")) {
    decodedSource = stack;
  }
}

if (decodedSource) {
  console.log("\n=== 復元されたコード ===");
  console.log(decodedSource);
}

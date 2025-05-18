// === 問答資料設定 ===
// 建立一個名為 questions 的陣列，內含三個題目物件。
// 每個物件都包含三個屬性：
// - q：題目文字
// - options：選項陣列（按順序呈現）
// - answer：正確答案在選項陣列中的索引值（從 0 開始）
const questions = [
  {
    q: "端午節是哪一天？",
    options: ["農曆五月初五", "農曆八月十五", "國曆五月五日"],
    answer: 0 // 正確答案是第一個（索引 0）
  },
  {
    q: "五月節愛食麼个？",
    options: ["粄圓", "粽仔", "秶粑"],
    answer: 1 // 正確答案是第二個（粽仔，索引 1）
  },
  {
    q: "五月節愛做麼个？",
    options: ["划龍舟", "泅水", "撈魚仔"],
    answer: 0 // 正確答案是第一個（划龍舟，不是端午節習俗）
  }
];

// === 狀態變數定義 ===
// 用來追蹤目前遊戲狀態
let current = 0;     // 表示目前正在進行第幾題（從第 0 題開始）
let score = 0;       // 用來記錄使用者目前得了幾分（每答對一題加一分）
let username = "";   // 用來儲存使用者輸入的暱稱（遊戲開始時會輸入）

// === 遊戲開始的函式 ===
// 這個函式會在使用者輸入名字並按下「開始遊戲」按鈕時被呼叫
function startQuiz() {
  // 取得使用者輸入框的值並去除空白
  const input = document.getElementById("username").value.trim();

  // 如果使用者沒有輸入名字，就跳出提示訊息
  if (!input) {
    alert("請輸入你的名字！");
    return;
  }

  // 儲存使用者輸入的名字到變數 username
  username = input;

  // 隱藏起始區塊（輸入名字與開始按鈕）
  document.getElementById("startBox").style.display = "none";

    // ✅ 在這裡加上 GA 追蹤「開始遊戲」
  gtag('event', 'start_game_click', {
    event_category: 'engagement',
    event_label: 'Start Game Button'
  });

    // ✅ 播放背景音樂
  const bgm = document.getElementById("bgm");
  if (bgm) {
    bgm.play().catch(err => {
      console.warn("背景音樂播放失敗（可能是瀏覽器限制）：", err);
    });
  }

  // 顯示第一題
  showQuestion();
}

// === 顯示題目的函式 ===
function showQuestion() {
  // 如果 current 的值已經等於或超過題目總數，代表題目都答完了
  if (current >= questions.length) {
    // 清空題目顯示區
    document.getElementById("quiz-container").innerHTML = "";

    // 顯示結果區塊
    document.getElementById("resultBox").style.display = "block";

    // 顯示結果文字：
    const resultMsg = (score === questions.length)
    ? `🎉 恭喜 ${username} 全部答對，過關成功！<br>記得"截圖存檔"，5月30日到兒童新樂園蓋過關章，就算搶先過1關喔!`
    : `😢 ${username}，再挑戰一次吧！`;
    document.getElementById("resultMessage").innerHTML = resultMsg;
    document.getElementById("quizHeader").style.display = "none";

    // 額外新增：全部答對才觸發動畫
    if (score === questions.length) {
    triggerEmojiAnimation(); // 執行飄落動畫
    }
    }

  // 如果還有題目沒做，就顯示目前這一題
  const q = questions[current]; // 取得目前題目的物件
  let html = `<div class="question-box"><h3>Q${current + 1}. ${q.q}</h3>`; // 題號 + 題目

  // 將所有選項轉成按鈕並加入 HTML 內容
  // 使用 forEach 來處理每個選項及其索引值 i
  q.options.forEach((opt, i) => {
    html += `<button class="answer-btn" onclick="checkAnswer(${i})">${opt}</button>`;
  });

  html += `</div>`;

  // 將產生好的 HTML 放進 quiz-container 區塊中
  document.getElementById("quiz-container").innerHTML = html;
}

// === 檢查答案是否正確的函式 ===
// 當使用者點選選項時會執行此函式，參數 i 是使用者選的選項索引
function checkAnswer(i) {
  // 如果使用者選的答案是正確的（等於預設的正確索引），就加一分
  if (i === questions[current].answer) {
    score++;
  }

  // 前往下一題（current 編號加一）
  current++;

  // 顯示下一題（或進入結算結果）
  showQuestion();
}

// === 飄落表情符號動畫函式 ===
function triggerEmojiAnimation() {
  const emojis = ["🎉", "🥳", "💯", "🎊", "🌟", "🎈"];
  const container = document.getElementById("emoji-container");

  // 一次產生 20 個表情符號
  for (let i = 0; i < 50; i++) {
    const emoji = document.createElement("div");
    emoji.classList.add("emoji");
    emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    // 隨機位置與延遲
    emoji.style.left = Math.random() * 100 + "vw";
    emoji.style.animationDelay = (Math.random() * 1) + "s";

    container.appendChild(emoji);

    // 動畫結束後移除 DOM 元素（避免太多）
    setTimeout(() => {
      emoji.remove();
    }, 3000);
  }
}

// === 重新開始遊戲的函式 ===
// 當使用者在結果區按下「重新開始」按鈕時會執行
function restartQuiz() {
  // 重設所有遊戲狀態變數
  current = 0;
  score = 0;
  username = "";

  // 清空使用者輸入欄位
  document.getElementById("username").value = "";

  // 顯示輸入名字與開始區塊
  document.getElementById("startBox").style.display = "block";

  // 清空題目顯示區
  document.getElementById("quiz-container").innerHTML = "";

  // 隱藏結果區塊
  document.getElementById("resultBox").style.display = "none";

  // 清空結果文字
  document.getElementById("resultMessage").innerText = "";
}
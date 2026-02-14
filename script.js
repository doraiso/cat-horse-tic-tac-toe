(() => {
  const CAT = "🐱";
  const HORSE = "🐴";

  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const resetBtn = document.getElementById("resetBtn");
  const aiToggle = document.getElementById("aiToggle");

  let board = Array(9).fill(null);
  let turn = CAT;
  let winner = null;
  let locked = false;

  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  function checkWinner(b) {
    for (const [a,c,d] of wins) {
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    }
    if (b.every(x => x)) return "draw";
    return null;
  }

  function setStatus() {
    if (winner === CAT) statusEl.textContent = "🐱の勝ち！";
    else if (winner === HORSE) statusEl.textContent = "🐴の勝ち！";
    else if (winner === "draw") statusEl.textContent = "引き分け";
    else statusEl.textContent = `${turn}の番`;
  }

  function render() {
    boardEl.innerHTML = "";
    board.forEach((v, i) => {
      const btn = document.createElement("button");
      btn.className = "cell" + (v ? " filled" : "");
      btn.type = "button";
      btn.textContent = v ?? "";
      btn.disabled = !!winner || locked; // 終了/CPU待ちだけ止める

      btn.addEventListener("click", () => onMove(i));
      boardEl.appendChild(btn);
    });
    setStatus();
  }

  function onMove(i) {
    if (locked || winner || board[i]) return;

    board[i] = turn;
    winner = checkWinner(board);

    if (!winner) turn = (turn === CAT ? HORSE : CAT);

    render();

    if (!winner && aiToggle.checked && turn === HORSE) {
      locked = true;
      render();
      setTimeout(() => {
        cpuMove();
        locked = false;
        render();
      }, 250);
    }
  }

  // かんたんCPU: 勝てる手→負けを防ぐ手→中央→角→それ以外
  function cpuMove() {
    const me = HORSE, you = CAT;
    const empty = board.map((v, i) => v ? null : i).filter(i => i !== null);

    const tryWin = (p) => {
      for (const i of empty) {
        const tmp = board.slice();
        tmp[i] = p;
        if (checkWinner(tmp) === p) return i;
      }
      return null;
    };

    const move =
      tryWin(me) ??
      tryWin(you) ??
      (board[4] ? null : 4) ??
      [0,2,6,8].find(i => !board[i]) ??
      empty[0];

    if (move == null) return;

    board[move] = me;
    winner = checkWinner(board);
    if (!winner) turn = CAT;
  }

  function reset() {
    board = Array(9).fill(null);
    turn = CAT;
    winner = null;
    locked = false;
    render();
  }

  resetBtn.addEventListener("click", reset);
  render();
})();

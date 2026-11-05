import os
import json

with open('quizzes/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

json_data = json.dumps(questions, ensure_ascii=False)

widget_html = f'''<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    ::-webkit-scrollbar {{ width: 5px; height: 5px; }}
    ::-webkit-scrollbar-thumb {{ background: rgba(150, 150, 150, 0.3); border-radius: 9999px; }}
  </style>
</head>
<body class="bg-transparent text-[var(--foreground)] antialiased p-2 sm:p-4">
  <div class="bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 max-w-2xl mx-auto">
    
    <!-- Header & Chapter Selector -->
    <div class="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-[var(--border)]">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-bold text-sm tracking-tight">Interactive Quiz Practice</span>
      </div>
      <div class="flex items-center gap-2">
        <select id="chapter-select" onchange="changeChapter(this.value)" class="text-xs font-medium bg-[var(--background)] border border-[var(--border)] rounded-lg px-2.5 py-1 text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="all">📚 ทุกบทเรียน (154 ข้อ)</option>
          <option value="ch1">บทที่ 1: Malware (18)</option>
          <option value="ch2">บทที่ 2: DoS & Lab 4 (20)</option>
          <option value="ch3">บทที่ 3: Scanning & Lab 3 (20)</option>
          <option value="ch4">บทที่ 4: IDPS & Lab 5 (20)</option>
          <option value="ch5">บทที่ 5: Firewall & Lab 6 (20)</option>
          <option value="ch6">บทที่ 6: Testing (18)</option>
          <option value="ch7">บทที่ 7: VPN & Lab 7 (20)</option>
          <option value="ch8">บทที่ 8: Cloud & IAM (18)</option>
        </select>
        <span id="score-badge" class="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
          0/0
        </span>
      </div>
    </div>

    <!-- Question Box -->
    <div class="space-y-3">
      <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span id="q-category" class="font-semibold text-indigo-400">บทที่ 1</span>
        <span id="q-index">ข้อที่ 1 / 20</span>
      </div>
      
      <div id="q-text" class="text-sm sm:text-base font-medium leading-relaxed">
        กำลังโหลดคำถาม...
      </div>
    </div>

    <!-- 4 Choices -->
    <div id="choices-box" class="space-y-2">
      <!-- choices here -->
    </div>

    <!-- Instant Answer / Explanation -->
    <div id="feedback-box" class="hidden rounded-xl border p-3.5 space-y-2 text-xs leading-relaxed transition-all">
      <div id="feedback-title" class="font-bold text-xs sm:text-sm flex items-center gap-1.5"></div>
      <div id="feedback-desc" class="opacity-90"></div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-between pt-2 border-t border-[var(--border)]">
      <button onclick="prevQ()" id="btn-p" class="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium hover:bg-[var(--background)] transition disabled:opacity-30 disabled:pointer-events-none">
        ⬅ ก่อนหน้า
      </button>
      <button onclick="shuffleQ()" class="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition flex items-center gap-1">
        🔀 สุ่ม
      </button>
      <button onclick="nextQ()" id="btn-n" class="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition disabled:opacity-30 disabled:pointer-events-none">
        ถัดไป ➡
      </button>
    </div>

  </div>

  <script>
    const QUESTIONS = {json_data};
    let currentChapter = 'all';
    let list = [...QUESTIONS];
    let idx = 0;
    let answers = {{}};

    function formatText(t) {{
      if (!t) return '';
      return t
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-black/30 text-emerald-300 font-mono text-[11px]">$1</code>')
        .replace(/\\*\\*([^\\*]+)\\*\\*/g, '<strong>$1</strong>');
    }}

    function changeChapter(val) {{
      currentChapter = val;
      list = (val === 'all') ? [...QUESTIONS] : QUESTIONS.filter(q => q.chapter_id === val);
      idx = 0;
      render();
    }}

    function shuffleQ() {{
      for (let i = list.length - 1; i > 0; i--) {{
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }}
      idx = 0;
      render();
    }}

    function render() {{
      if (list.length === 0) return;
      const q = list[idx];
      document.getElementById('q-category').textContent = q.chapter_title;
      document.getElementById('q-index').textContent = `ข้อที่ ${{idx + 1}} / ${{list.length}}`;
      document.getElementById('q-text').innerHTML = formatText(q.question);

      const box = document.getElementById('choices-box');
      box.innerHTML = '';
      const ans = answers[q.id];

      ['A', 'B', 'C', 'D'].forEach(letter => {{
        const btn = document.createElement('button');
        let style = 'bg-[var(--background)] hover:border-blue-400 border-[var(--border)] text-[var(--foreground)]';
        
        if (ans) {{
          btn.disabled = true;
          if (letter === q.answer) {{
            style = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold ring-1 ring-emerald-500';
          }} else if (ans.selected === letter) {{
            style = 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold';
          }} else {{
            style = 'opacity-40 border-[var(--border)] text-[var(--muted-foreground)]';
          }}
        }}

        btn.className = `w-full text-left p-2.5 sm:p-3 rounded-xl border transition flex items-start gap-2.5 text-xs sm:text-sm ${{style}}`;
        btn.onclick = () => choose(letter);
        btn.innerHTML = `
          <span class="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center font-bold text-[11px] border border-current">
            ${{letter}}
          </span>
          <span class="pt-0.5 leading-snug">${{formatText(q.choices[letter] || '')}}</span>
        `;
        box.appendChild(btn);
      }});

      const fb = document.getElementById('feedback-box');
      const fbt = document.getElementById('feedback-title');
      const fbd = document.getElementById('feedback-desc');

      if (ans) {{
        fb.classList.remove('hidden');
        if (ans.isCorrect) {{
          fb.className = 'rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 p-3 space-y-1.5';
          fbt.innerHTML = '<span>✓ ถูกต้อง!</span>';
        }} else {{
          fb.className = 'rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 p-3 space-y-1.5';
          fbt.innerHTML = `<span>✕ ยังไม่ถูกต้อง (คำตอบคือข้อ ${{q.answer}})</span>`;
        }}
        fbd.innerHTML = `<strong>เฉลย:</strong> ${{formatText(q.explanation)}}`;
      }} else {{
        fb.classList.add('hidden');
      }}

      document.getElementById('btn-p').disabled = (idx === 0);
      document.getElementById('btn-n').disabled = (idx === list.length - 1);
      updateScore();
    }}

    function choose(letter) {{
      const q = list[idx];
      if (answers[q.id]) return;
      answers[q.id] = {{ selected: letter, isCorrect: (letter === q.answer) }};
      render();
    }}

    function prevQ() {{ if (idx > 0) {{ idx--; render(); }} }}
    function nextQ() {{ if (idx < list.length - 1) {{ idx++; render(); }} }}

    function updateScore() {{
      let c = 0, t = 0;
      Object.values(answers).forEach(a => {{ t++; if (a.isCorrect) c++; }});
      document.getElementById('score-badge').textContent = `${{c}}/${{t}} ถูก (${{t>0?Math.round(c/t*100):0}}%)`;
    }}

    window.addEventListener('DOMContentLoaded', () => {{
      list = [...QUESTIONS];
      render();
    }});
  </script>
</body>
</html>'''

# Save widget to artifact dir
artifact_dir = r'C:\Users\khanu\.gemini\antigravity\brain\3cccfc97-b869-4d92-8e12-a0d22afbd6f5'
os.makedirs(artifact_dir, exist_ok=True)
widget_path = os.path.join(artifact_dir, 'quiz_widget.html')
with open(widget_path, 'w', encoding='utf-8') as out:
    out.write(widget_html)

# Also save to workspace
with open('quizzes/quiz_widget.html', 'w', encoding='utf-8') as out:
    out.write(widget_html)

print(f'Saved widget to {widget_path} successfully!')

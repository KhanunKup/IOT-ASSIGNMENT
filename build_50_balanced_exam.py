# -*- coding: utf-8 -*-
import json
import os
import random
from create_50_balanced_exam import questions_data

# Set seed for reproducible balance
random.seed(2026)

# Perfectly balance answer distribution: 13 A, 13 B, 12 C, 12 D
target_letters = ['A'] * 13 + ['B'] * 13 + ['C'] * 12 + ['D'] * 12
random.shuffle(target_letters)

for idx, q in enumerate(questions_data):
    target_letter = target_letters[idx]
    orig_answer = q['answer']
    if orig_answer != target_letter:
        q['choices'][orig_answer], q['choices'][target_letter] = (
            q['choices'][target_letter],
            q['choices'][orig_answer]
        )
        q['answer'] = target_letter

# Verification
ans_counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0}
for q in questions_data:
    ans_counts[q['answer']] += 1

print(f"Total questions: {len(questions_data)}")
print(f"Balanced answer distribution: {ans_counts}")

# 1. Generate Markdown File: quizzes/50_Mixed_Exam_Balanced.md
md_lines = [
    "# ชุดข้อสอบทบทวนรวม 50 ข้อ (คละเนื้อหา & ปรับความยาวตัวเลือกให้เท่ากัน)",
    "> **วิชา IT Infrastructure Security (06016421 IT/KMITL)**",
    "> ข้อสอบชุดนี้ผ่านการปรับสมดุลความยาวของตัวเลือก A, B, C, D ให้ใกล้เคียงกันทุกข้อ เพื่อป้องกันการเดาจากความยาวของช้อยส์ พร้อมทั้งกระจายเฉลย A, B, C, D อย่างเท่าเทียม (A: 13, B: 13, C: 12, D: 12 ข้อ)",
    "\n---"
]

for idx, q in enumerate(questions_data, 1):
    md_lines.append(f"\n### ข้อที่ {idx}")
    md_lines.append(f"**หมวด:** `{q['category']}`")
    md_lines.append(q['question'] + "\n")
    for letter in ['A', 'B', 'C', 'D']:
        md_lines.append(f"{letter}. {q['choices'][letter]}")
    md_lines.append(f"\n**เฉลย: {q['answer']}**")
    md_lines.append(f"**คำอธิบาย:** {q['explanation']}\n")
    md_lines.append("---")

os.makedirs('quizzes', exist_ok=True)
with open('quizzes/50_Mixed_Exam_Balanced.md', 'w', encoding='utf-8') as f:
    f.write("\n".join(md_lines))
print("Wrote quizzes/50_Mixed_Exam_Balanced.md")

# 2. Generate Interactive Standalone HTML: quizzes/interactive_50_quiz.html
json_questions = json.dumps(questions_data, ensure_ascii=False)

html_template = f'''<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>50 ข้อสอบทบทวนรวม: IT Infrastructure Security (ความยาวช้อยส์สมดุล)</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    ::-webkit-scrollbar {{ width: 6px; height: 6px; }}
    ::-webkit-scrollbar-track {{ background: transparent; }}
    ::-webkit-scrollbar-thumb {{ background: rgba(150, 150, 150, 0.3); border-radius: 9999px; }}
    ::-webkit-scrollbar-thumb:hover {{ background: rgba(150, 150, 150, 0.5); }}
    .code-font {{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }}
  </style>
</head>
<body class="bg-[var(--background)] text-[var(--foreground)] antialiased min-h-screen p-3 md:p-6 select-none">
  <div class="max-w-5xl mx-auto space-y-4">
    
    <!-- Top Header Card -->
    <header class="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 flex-wrap mb-1">
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            06016421 IT/KMITL
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            ชุดใหม่ 50 ข้อ (คละเนื้อหา)
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            ⚖️ ปรับช้อยส์ยาวเท่ากัน (Balanced Length)
          </span>
        </div>
        <h1 class="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)]">
          ชุดข้อสอบทบทวน 50 ข้อ (คละเนื้อหา & ปรับความยาวช้อยส์เท่ากัน)
        </h1>
        <p class="text-xs md:text-sm text-[var(--muted-foreground)] mt-0.5">
          กดตอบแล้วรู้ผลทันที (Instant Answer) • ตัวเลือก A, B, C, D ความยาวสูสีกัน หลอกเนียนทุกข้อ
        </p>
      </div>

      <!-- Quick Stats Widget -->
      <div class="flex items-center gap-4 bg-[var(--background)] px-4 py-2.5 rounded-xl border border-[var(--border)] self-start md:self-auto">
        <div class="text-center">
          <div class="text-xs text-[var(--muted-foreground)]">ตอบถูก</div>
          <div id="stat-correct" class="text-lg font-bold text-emerald-400">0</div>
        </div>
        <div class="h-8 w-px bg-[var(--border)]"></div>
        <div class="text-center">
          <div class="text-xs text-[var(--muted-foreground)]">ตอบผิด</div>
          <div id="stat-wrong" class="text-lg font-bold text-rose-400">0</div>
        </div>
        <div class="h-8 w-px bg-[var(--border)]"></div>
        <div class="text-center">
          <div class="text-xs text-[var(--muted-foreground)]">ความแม่นยำ</div>
          <div id="stat-accuracy" class="text-lg font-bold text-[var(--foreground)]">0%</div>
        </div>
      </div>
    </header>

    <!-- Category Filter Bar -->
    <nav class="flex gap-2 overflow-x-auto pb-1 text-xs md:text-sm">
      <button onclick="filterCategory('all')" id="tab-all" class="cat-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm">
        📚 ทั้งหมด (50 ข้อ)
      </button>
      <button onclick="filterCategory('Malware & Countermeasures')" id="tab-malware" class="cat-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        Malware (6)
      </button>
      <button onclick="filterCategory('DoS/DDoS & Lab 4')" id="tab-dos" class="cat-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        DoS & Lab 4 (7)
      </button>
      <button onclick="filterCategory('Cyber Attacks & Scanning Lab 3')" id="tab-scan" class="cat-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        Scanning & Lab 3 (7)
      </button>
      <button onclick="filterCategory('IDPS & Lab 5')" id="tab-idps" class="cat-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        IDPS & Lab 5 (7)
      </button>
      <button onclick="filterCategory('Firewall & Lab 6')" id="tab-fw" class="cat-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        Firewall & Lab 6 (7)
      </button>
      <button onclick="filterCategory('Security Testing NIST SP 800-115')" id="tab-test" class="cat-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        Testing (5)
      </button>
      <button onclick="filterCategory('VPN & Lab 7')" id="tab-vpn" class="cat-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        VPN & Lab 7 (6)
      </button>
      <button onclick="filterCategory('Cloud Security & IAM')" id="tab-cloud" class="cat-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        Cloud & IAM (5)
      </button>
    </nav>

    <!-- Main Workspace Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      
      <!-- Left/Main: Active Question Card -->
      <main class="lg:col-span-3 space-y-4">
        <div class="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 md:p-7 shadow-sm space-y-6">
          
          <!-- Question Header & Badges -->
          <div class="flex items-center justify-between border-b border-[var(--border)] pb-4 flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <span id="q-badge-category" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                หมวดหมู่
              </span>
              <span id="q-counter" class="text-xs font-medium text-[var(--muted-foreground)]">
                ข้อที่ 1 / 50
              </span>
            </div>
            
            <div class="flex items-center gap-2">
              <button onclick="toggleMistakes()" id="btn-filter-mistake" class="px-2.5 py-1 rounded-lg text-xs font-medium border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition flex items-center gap-1.5">
                <span>❌ ดูเฉพาะข้อที่ตอบผิด</span>
              </button>
              <button onclick="resetAll()" class="px-2.5 py-1 rounded-lg text-xs font-medium border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition flex items-center gap-1.5" title="ล้างคำตอบทั้งหมด">
                <span>🔄 รีเซ็ต</span>
              </button>
            </div>
          </div>

          <!-- Question Content -->
          <div id="question-text" class="text-base md:text-lg font-medium leading-relaxed text-[var(--foreground)]">
            กำลังโหลดคำถาม...
          </div>

          <!-- 4 Choices List -->
          <div id="choices-container" class="space-y-3">
            <!-- Choices inserted dynamically -->
          </div>

          <!-- Instant Feedback & Explanation Container -->
          <div id="explanation-box" class="hidden rounded-xl border p-4 md:p-5 space-y-3 transition-all duration-300">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <div id="feedback-status" class="flex items-center gap-2 font-bold text-sm md:text-base">
                <!-- Status icon + text -->
              </div>
              <button onclick="retryCurrent()" class="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline flex items-center gap-1">
                ลองตอบใหม่อีกครั้ง
              </button>
            </div>
            <div class="h-px bg-current opacity-15"></div>
            <div class="text-xs md:text-sm leading-relaxed space-y-1.5" id="explanation-content">
              <!-- Explanation text -->
            </div>
          </div>

          <!-- Bottom Navigation Controls -->
          <div class="flex items-center justify-between pt-4 border-t border-[var(--border)] gap-2">
            <button onclick="prevQ()" id="btn-prev" class="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs md:text-sm font-medium hover:bg-[var(--background)] transition flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none">
              <span>⬅ ข้อก่อนหน้า</span>
            </button>
            
            <div class="flex items-center gap-2">
              <button onclick="shuffleCurrent()" class="px-3 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition flex items-center gap-1.5" title="สุ่มลำดับคำถาม">
                <span>🔀 สุ่มข้อสอบ</span>
              </button>
            </div>

            <button onclick="nextQ()" id="btn-next" class="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs md:text-sm font-semibold hover:opacity-90 transition flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none shadow-sm">
              <span>ข้อถัดไป ➡</span>
            </button>
          </div>

        </div>
      </main>

      <!-- Right: Question Palette / Navigator -->
      <aside class="space-y-4">
        <div class="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 md:p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              แผงข้อสอบ (Palette)
            </h3>
            <span id="palette-progress" class="text-xs font-semibold text-[var(--foreground)]">
              0/50
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-[var(--background)] rounded-full h-2 overflow-hidden border border-[var(--border)]">
            <div id="progress-bar-fill" class="bg-emerald-500 h-full w-0 transition-all duration-300"></div>
          </div>

          <!-- Question Grid Numbers -->
          <div id="palette-grid" class="grid grid-cols-5 gap-2 max-h-[350px] overflow-y-auto pr-1">
            <!-- Button numbers injected via JS -->
          </div>

          <!-- Legend -->
          <div class="pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-2 text-xs text-[var(--muted-foreground)]">
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500"></div>
              <span>ถูกต้อง</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded-md bg-rose-500/20 border border-rose-500"></div>
              <span>ตอบผิด</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded-md bg-[var(--background)] border border-[var(--border)]"></div>
              <span>ยังไม่ตอบ</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded-md ring-2 ring-blue-500 bg-[var(--card)]"></div>
              <span>ข้อปัจจุบัน</span>
            </div>
          </div>

          <!-- Shortcuts -->
          <div class="bg-[var(--background)] rounded-xl p-2.5 border border-[var(--border)] text-xs text-[var(--muted-foreground)] space-y-1">
            <div class="font-medium text-[var(--foreground)]">คีย์ลัด (Shortcuts):</div>
            <div>• กดปุ่ม <kbd class="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] font-mono text-[10px]">A</kbd> <kbd class="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] font-mono text-[10px]">B</kbd> <kbd class="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] font-mono text-[10px]">C</kbd> <kbd class="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] font-mono text-[10px]">D</kbd> เพื่อตอบ</div>
            <div>• กดลูกศร <kbd class="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] font-mono text-[10px]">←</kbd> <kbd class="px-1.5 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] font-mono text-[10px]">→</kbd> เปลี่ยนข้อ</div>
          </div>

        </div>
      </aside>

    </div>

  </div>

  <script>
    const ALL_QUESTIONS = {json_questions};

    let activeCategory = 'all';
    let filteredList = [...ALL_QUESTIONS];
    let currentIndex = 0;
    let userAnswers = {{}};
    let showMistakesOnly = false;

    function formatText(t) {{
      if (!t) return '';
      let s = t
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-emerald-300 font-mono text-xs">$1</code>')
        .replace(/\\*\\*([^\\*]+)\\*\\*/g, '<strong class="text-[var(--foreground)] font-semibold">$1</strong>');
      return s;
    }}

    function init() {{
      filterCategory('all');
      document.addEventListener('keydown', handleKeyNav);
    }}

    function filterCategory(cat) {{
      activeCategory = cat;
      showMistakesOnly = false;
      const fBtn = document.getElementById('btn-filter-mistake');
      if (fBtn) fBtn.classList.remove('bg-rose-500/20', 'text-rose-400', 'border-rose-500');

      document.querySelectorAll('.cat-tab').forEach(b => {{
        b.className = 'cat-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]';
      }});

      const tabMap = {{
        'all': 'tab-all',
        'Malware & Countermeasures': 'tab-malware',
        'DoS/DDoS & Lab 4': 'tab-dos',
        'Cyber Attacks & Scanning Lab 3': 'tab-scan',
        'IDPS & Lab 5': 'tab-idps',
        'Firewall & Lab 6': 'tab-fw',
        'Security Testing NIST SP 800-115': 'tab-test',
        'VPN & Lab 7': 'tab-vpn',
        'Cloud Security & IAM': 'tab-cloud'
      }};

      const activeBtn = document.getElementById(tabMap[cat] || 'tab-all');
      if (activeBtn) {{
        activeBtn.className = 'cat-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm';
      }}

      applyFilters();
      currentIndex = 0;
      renderCurrent();
      renderPalette();
      updateStats();
    }}

    function toggleMistakes() {{
      showMistakesOnly = !showMistakesOnly;
      const fBtn = document.getElementById('btn-filter-mistake');
      if (showMistakesOnly) {{
        fBtn.classList.add('bg-rose-500/20', 'text-rose-400', 'border-rose-500');
      }} else {{
        fBtn.classList.remove('bg-rose-500/20', 'text-rose-400', 'border-rose-500');
      }}
      applyFilters();
      currentIndex = 0;
      renderCurrent();
      renderPalette();
    }}

    function applyFilters() {{
      let res = (activeCategory === 'all')
        ? [...ALL_QUESTIONS]
        : ALL_QUESTIONS.filter(q => q.category === activeCategory);

      if (showMistakesOnly) {{
        res = res.filter(q => userAnswers[q.id] && !userAnswers[q.id].isCorrect);
        if (res.length === 0) {{
          alert('ไม่พบข้อที่ตอบผิดในหมวดนี้ 🎉');
          showMistakesOnly = false;
          const fBtn = document.getElementById('btn-filter-mistake');
          if (fBtn) fBtn.classList.remove('bg-rose-500/20', 'text-rose-400', 'border-rose-500');
          res = (activeCategory === 'all') ? [...ALL_QUESTIONS] : ALL_QUESTIONS.filter(q => q.category === activeCategory);
        }}
      }}
      filteredList = res;
    }}

    function renderCurrent() {{
      if (filteredList.length === 0) return;
      if (currentIndex >= filteredList.length) currentIndex = filteredList.length - 1;
      if (currentIndex < 0) currentIndex = 0;

      const q = filteredList[currentIndex];
      document.getElementById('q-badge-category').textContent = q.category;
      document.getElementById('q-counter').textContent = `ข้อที่ ${{currentIndex + 1}} / ${{filteredList.length}}`;
      document.getElementById('question-text').innerHTML = formatText(q.question);

      const container = document.getElementById('choices-container');
      container.innerHTML = '';

      const ans = userAnswers[q.id];

      ['A', 'B', 'C', 'D'].forEach(letter => {{
        const btn = document.createElement('button');
        let style = 'bg-[var(--card)] hover:bg-[var(--background)] border-[var(--border)] hover:border-blue-400 text-[var(--foreground)] cursor-pointer';
        let badgeStyle = 'bg-[var(--background)] text-[var(--muted-foreground)]';

        if (ans) {{
          btn.disabled = true;
          if (letter === q.answer) {{
            style = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-semibold ring-1 ring-emerald-500 cursor-default';
            badgeStyle = 'bg-emerald-500 text-black border-emerald-500';
          }} else if (ans.selected === letter) {{
            style = 'bg-rose-500/20 border-rose-500 text-rose-400 font-semibold cursor-default';
            badgeStyle = 'bg-rose-500 text-white border-rose-500';
          }} else {{
            style = 'bg-[var(--card)] border-[var(--border)] opacity-40 text-[var(--muted-foreground)] cursor-default';
          }}
        }}

        btn.className = `w-full text-left p-3.5 md:p-4 rounded-xl border transition-all flex items-start gap-3 group ${{style}}`;
        btn.onclick = () => selectChoice(letter);
        btn.innerHTML = `
          <span class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs uppercase border border-current ${{badgeStyle}}">
            ${{letter}}
          </span>
          <span class="text-xs md:text-sm leading-relaxed pt-0.5">
            ${{formatText(q.choices[letter] || '')}}
          </span>
        `;
        container.appendChild(btn);
      }});

      const expBox = document.getElementById('explanation-box');
      const statusEl = document.getElementById('feedback-status');
      const expContent = document.getElementById('explanation-content');

      if (ans) {{
        expBox.classList.remove('hidden');
        if (ans.isCorrect) {{
          expBox.className = 'rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 p-4 md:p-5 space-y-2';
          statusEl.innerHTML = `
            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-black text-xs font-black">✓</span>
            <span class="text-emerald-400 font-bold">ถูกต้อง! ยอดเยี่ยมมาก</span>
          `;
        }} else {{
          expBox.className = 'rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 p-4 md:p-5 space-y-2';
          statusEl.innerHTML = `
            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-black">✕</span>
            <span class="text-rose-400 font-bold">ยังไม่ถูกต้อง! (คำตอบที่ถูกต้องคือข้อ ${{q.answer}})</span>
          `;
        }}
        expContent.innerHTML = `
          <div><strong class="text-[var(--foreground)] font-semibold">เฉลยข้อ:</strong> <span class="font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">${{q.answer}}</span></div>
          <div class="pt-1 text-[var(--foreground)]/90 font-normal">${{formatText(q.explanation)}}</div>
        `;
      }} else {{
        expBox.classList.add('hidden');
      }}

      document.getElementById('btn-prev').disabled = (currentIndex === 0);
      document.getElementById('btn-next').disabled = (currentIndex === filteredList.length - 1);

      renderPalette();
    }}

    function selectChoice(letter) {{
      const q = filteredList[currentIndex];
      if (userAnswers[q.id]) return;
      userAnswers[q.id] = {{ selected: letter, isCorrect: (letter === q.answer) }};
      updateStats();
      renderCurrent();
    }}

    function retryCurrent() {{
      const q = filteredList[currentIndex];
      delete userAnswers[q.id];
      updateStats();
      renderCurrent();
    }}

    function resetAll() {{
      if (confirm('คุณต้องการรีเซ็ตคำตอบทั้งหมดใช่หรือไม่?')) {{
        userAnswers = {{}};
        updateStats();
        renderCurrent();
        renderPalette();
      }}
    }}

    function shuffleCurrent() {{
      for (let i = filteredList.length - 1; i > 0; i--) {{
        const j = Math.floor(Math.random() * (i + 1));
        [filteredList[i], filteredList[j]] = [filteredList[j], filteredList[i]];
      }}
      currentIndex = 0;
      renderCurrent();
      renderPalette();
    }}

    function prevQ() {{ if (currentIndex > 0) {{ currentIndex--; renderCurrent(); }} }}
    function nextQ() {{ if (currentIndex < filteredList.length - 1) {{ currentIndex++; renderCurrent(); }} }}
    function jumpTo(i) {{ currentIndex = i; renderCurrent(); }}

    function renderPalette() {{
      const grid = document.getElementById('palette-grid');
      grid.innerHTML = '';
      let answered = 0;

      filteredList.forEach((q, i) => {{
        const btn = document.createElement('button');
        const ans = userAnswers[q.id];
        const isCurrent = (i === currentIndex);

        let c = 'bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)]';
        if (ans) {{
          answered++;
          c = ans.isCorrect
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 font-semibold'
            : 'bg-rose-500/20 text-rose-400 border-rose-500 font-semibold';
        }}
        if (isCurrent) {{
          c += ' ring-2 ring-blue-500 border-blue-500 scale-105 z-10';
        }}

        btn.className = `h-9 rounded-xl border text-xs flex items-center justify-center transition-all ${{c}}`;
        btn.textContent = i + 1;
        btn.onclick = () => jumpTo(i);
        grid.appendChild(btn);
      }});

      document.getElementById('palette-progress').textContent = `${{answered}}/${{filteredList.length}}`;
      const pct = filteredList.length > 0 ? (answered / filteredList.length) * 100 : 0;
      document.getElementById('progress-bar-fill').style.width = `${{pct}}%`;
    }}

    function updateStats() {{
      let c = 0, w = 0;
      Object.values(userAnswers).forEach(a => {{
        if (a.isCorrect) c++;
        else w++;
      }});
      const t = c + w;
      document.getElementById('stat-correct').textContent = c;
      document.getElementById('stat-wrong').textContent = w;
      document.getElementById('stat-accuracy').textContent = (t > 0 ? Math.round((c / t) * 100) : 0) + '%';
    }}

    function handleKeyNav(e) {{
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const k = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(k)) selectChoice(k);
      else if (k === 'ARROWLEFT') prevQ();
      else if (k === 'ARROWRIGHT') nextQ();
    }}

    window.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>'''

with open('quizzes/interactive_50_quiz.html', 'w', encoding='utf-8') as f:
    f.write(html_template)
print("Wrote quizzes/interactive_50_quiz.html")

# Write to artifact folder
artifact_dir = r'C:\Users\khanu\.gemini\antigravity\brain\3cccfc97-b869-4d92-8e12-a0d22afbd6f5'
os.makedirs(artifact_dir, exist_ok=True)
with open(os.path.join(artifact_dir, 'interactive_50_quiz.html'), 'w', encoding='utf-8') as f:
    f.write(html_template)
print("Wrote artifact interactive_50_quiz.html")

# 3. Generate Compact Widget for Chat: quizzes/widget_50.html
widget_template = f'''<!DOCTYPE html>
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
    
    <!-- Header -->
    <div class="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-[var(--border)]">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-bold text-sm tracking-tight">ชุดใหม่ 50 ข้อ (ช้อยส์ยาวเท่ากัน)</span>
      </div>
      <div class="flex items-center gap-2">
        <select id="w-cat-select" onchange="changeCat(this.value)" class="text-xs font-medium bg-[var(--background)] border border-[var(--border)] rounded-lg px-2.5 py-1 text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="all">📚 ทุกหมวด (50 ข้อ)</option>
          <option value="Malware & Countermeasures">Malware (6)</option>
          <option value="DoS/DDoS & Lab 4">DoS & Lab 4 (7)</option>
          <option value="Cyber Attacks & Scanning Lab 3">Scanning & Lab 3 (7)</option>
          <option value="IDPS & Lab 5">IDPS & Lab 5 (7)</option>
          <option value="Firewall & Lab 6">Firewall & Lab 6 (7)</option>
          <option value="Security Testing NIST SP 800-115">Testing (5)</option>
          <option value="VPN & Lab 7">VPN & Lab 7 (6)</option>
          <option value="Cloud Security & IAM">Cloud & IAM (5)</option>
        </select>
        <span id="w-score" class="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
          0/0
        </span>
      </div>
    </div>

    <!-- Question -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span id="w-category" class="font-semibold text-indigo-400">หมวด</span>
        <span id="w-index">ข้อที่ 1 / 50</span>
      </div>
      
      <div id="w-question" class="text-sm sm:text-base font-medium leading-relaxed">
        กำลังโหลดคำถาม...
      </div>
    </div>

    <!-- 4 Choices -->
    <div id="w-choices" class="space-y-2"></div>

    <!-- Instant Feedback -->
    <div id="w-feedback" class="hidden rounded-xl border p-3 space-y-1.5 text-xs leading-relaxed transition-all">
      <div id="w-fb-title" class="font-bold text-xs sm:text-sm flex items-center gap-1.5"></div>
      <div id="w-fb-desc" class="opacity-90"></div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-between pt-2 border-t border-[var(--border)]">
      <button onclick="prevQ()" id="w-btn-p" class="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium hover:bg-[var(--background)] transition disabled:opacity-30 disabled:pointer-events-none">
        ⬅ ก่อนหน้า
      </button>
      <button onclick="shuffleQ()" class="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition flex items-center gap-1">
        🔀 สุ่ม
      </button>
      <button onclick="nextQ()" id="w-btn-n" class="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition disabled:opacity-30 disabled:pointer-events-none">
        ถัดไป ➡
      </button>
    </div>

  </div>

  <script>
    const QUESTIONS = {json_questions};
    let curList = [...QUESTIONS];
    let curIdx = 0;
    let userAns = {{}};

    function fmt(t) {{
      if (!t) return '';
      return t
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-black/30 text-emerald-300 font-mono text-[11px]">$1</code>')
        .replace(/\\*\\*([^\\*]+)\\*\\*/g, '<strong>$1</strong>');
    }}

    function changeCat(c) {{
      curList = (c === 'all') ? [...QUESTIONS] : QUESTIONS.filter(q => q.category === c);
      curIdx = 0;
      render();
    }}

    function shuffleQ() {{
      for (let i = curList.length - 1; i > 0; i--) {{
        const j = Math.floor(Math.random() * (i + 1));
        [curList[i], curList[j]] = [curList[j], curList[i]];
      }}
      curIdx = 0;
      render();
    }}

    function render() {{
      if (curList.length === 0) return;
      const q = curList[curIdx];
      document.getElementById('w-category').textContent = q.category;
      document.getElementById('w-index').textContent = `ข้อที่ ${{curIdx + 1}} / ${{curList.length}}`;
      document.getElementById('w-question').innerHTML = fmt(q.question);

      const box = document.getElementById('w-choices');
      box.innerHTML = '';
      const ans = userAns[q.id];

      ['A', 'B', 'C', 'D'].forEach(letter => {{
        const btn = document.createElement('button');
        let style = 'bg-[var(--background)] hover:border-blue-400 border-[var(--border)] text-[var(--foreground)] cursor-pointer';

        if (ans) {{
          btn.disabled = true;
          if (letter === q.answer) {{
            style = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold ring-1 ring-emerald-500 cursor-default';
          }} else if (ans.selected === letter) {{
            style = 'bg-rose-500/20 border-rose-500 text-rose-400 font-bold cursor-default';
          }} else {{
            style = 'opacity-40 border-[var(--border)] text-[var(--muted-foreground)] cursor-default';
          }}
        }}

        btn.className = `w-full text-left p-2.5 sm:p-3 rounded-xl border transition flex items-start gap-2.5 text-xs sm:text-sm ${{style}}`;
        btn.onclick = () => choose(letter);
        btn.innerHTML = `
          <span class="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center font-bold text-[11px] border border-current">
            ${{letter}}
          </span>
          <span class="pt-0.5 leading-snug">${{fmt(q.choices[letter] || '')}}</span>
        `;
        box.appendChild(btn);
      }});

      const fb = document.getElementById('w-feedback');
      const fbt = document.getElementById('w-fb-title');
      const fbd = document.getElementById('w-fb-desc');

      if (ans) {{
        fb.classList.remove('hidden');
        if (ans.isCorrect) {{
          fb.className = 'rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 p-3 space-y-1';
          fbt.innerHTML = '<span>✓ ถูกต้อง! ยอดเยี่ยม</span>';
        }} else {{
          fb.className = 'rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 p-3 space-y-1';
          fbt.innerHTML = `<span>✕ ยังไม่ถูก (คำตอบคือข้อ ${{q.answer}})</span>`;
        }}
        fbd.innerHTML = `<strong>เฉลย:</strong> ${{fmt(q.explanation)}}`;
      }} else {{
        fb.classList.add('hidden');
      }}

      document.getElementById('w-btn-p').disabled = (curIdx === 0);
      document.getElementById('w-btn-n').disabled = (curIdx === curList.length - 1);
      updateScore();
    }}

    function choose(letter) {{
      const q = curList[curIdx];
      if (userAns[q.id]) return;
      userAns[q.id] = {{ selected: letter, isCorrect: (letter === q.answer) }};
      render();
    }}

    function prevQ() {{ if (curIdx > 0) {{ curIdx--; render(); }} }}
    function nextQ() {{ if (curIdx < curList.length - 1) {{ curIdx++; render(); }} }}

    function updateScore() {{
      let c = 0, t = 0;
      Object.values(userAns).forEach(a => {{ t++; if (a.isCorrect) c++; }});
      document.getElementById('w-score').textContent = `${{c}}/${{t}} ถูก (${{t > 0 ? Math.round(c / t * 100) : 0}}%)`;
    }}

    window.addEventListener('DOMContentLoaded', () => {{
      curList = [...QUESTIONS];
      render();
    }});
  </script>
</body>
</html>'''

with open('quizzes/widget_50.html', 'w', encoding='utf-8') as f:
    f.write(widget_template)
with open(os.path.join(artifact_dir, 'widget_50.html'), 'w', encoding='utf-8') as f:
    f.write(widget_template)
print("Wrote widget_50.html successfully!")

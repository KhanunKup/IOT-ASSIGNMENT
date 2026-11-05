import os
import re
import json

with open('quizzes/questions.json', 'r', encoding='utf-8') as f:
    questions = json.load(f)

json_data = json.dumps(questions, ensure_ascii=False)

html_content = f'''<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IT Infrastructure Security - Interactive Quiz</title>
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
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            Interactive Quiz (154 ข้อ)
          </span>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            เน้น Syntax & File Paths
          </span>
        </div>
        <h1 class="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)]">
          คลังข้อสอบ Interactive: IT Infrastructure Security
        </h1>
        <p class="text-xs md:text-sm text-[var(--muted-foreground)] mt-0.5">
          คลิกเลือกตัวเลือกเพื่อดูเฉลยและคำอธิบายโดยละเอียดทันที (Instant Answer & Feedback)
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

    <!-- Chapter Selection Tabs -->
    <nav class="flex gap-2 overflow-x-auto pb-1 text-xs md:text-sm">
      <button onclick="selectChapter('all')" id="tab-all" class="chapter-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm">
        📚 ทั้งหมด (154 ข้อ)
      </button>
      <button onclick="selectChapter('ch1')" id="tab-ch1" class="chapter-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        1. Malware (18)
      </button>
      <button onclick="selectChapter('ch2')" id="tab-ch2" class="chapter-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        2. DoS & Lab 4 (20)
      </button>
      <button onclick="selectChapter('ch3')" id="tab-ch3" class="chapter-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        3. Scanning & Lab 3 (20)
      </button>
      <button onclick="selectChapter('ch4')" id="tab-ch4" class="chapter-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        4. IDPS & Lab 5 (20)
      </button>
      <button onclick="selectChapter('ch5')" id="tab-ch5" class="chapter-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        5. Firewall & Lab 6 (20)
      </button>
      <button onclick="selectChapter('ch6')" id="tab-ch6" class="chapter-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        6. Testing & Assessment (18)
      </button>
      <button onclick="selectChapter('ch7')" id="tab-ch7" class="chapter-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        7. VPN & Lab 7 (20)
      </button>
      <button onclick="selectChapter('ch8')" id="tab-ch8" class="chapter-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]">
        8. Cloud & IAM (18)
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
              <span id="q-badge-chapter" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                บทที่ 1
              </span>
              <span id="q-counter" class="text-xs font-medium text-[var(--muted-foreground)]">
                ข้อที่ 1 / 20
              </span>
            </div>
            
            <div class="flex items-center gap-2">
              <button onclick="toggleMistakeFilter()" id="btn-filter-mistake" class="px-2.5 py-1 rounded-lg text-xs font-medium border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition flex items-center gap-1.5">
                <span>❌ ดูเฉพาะข้อที่ตอบผิด</span>
              </button>
              <button onclick="resetCurrentChapter()" class="px-2.5 py-1 rounded-lg text-xs font-medium border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition flex items-center gap-1.5" title="ล้างคำตอบบทนี้">
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
              <button onclick="retryCurrentQuestion()" class="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline flex items-center gap-1">
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
            <button onclick="prevQuestion()" id="btn-prev" class="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs md:text-sm font-medium hover:bg-[var(--background)] transition flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none">
              <span>⬅ ข้อก่อนหน้า</span>
            </button>
            
            <div class="flex items-center gap-2">
              <button onclick="shuffleQuestions()" class="px-3 py-2 rounded-xl border border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition flex items-center gap-1.5" title="สุ่มลำดับคำถาม">
                <span>🔀 สุ่มข้อสอบ</span>
              </button>
            </div>

            <button onclick="nextQuestion()" id="btn-next" class="px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs md:text-sm font-semibold hover:opacity-90 transition flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none shadow-sm">
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
              0/20
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

          <!-- Keyboard Shortcuts Tip -->
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
    // Questions Database
    const ALL_QUESTIONS = {json_data};

    // State
    let currentChapter = 'all';
    let filteredQuestions = [...ALL_QUESTIONS];
    let currentIndex = 0;
    let userAnswers = {{}};
    let showMistakesOnly = false;

    // Formatting helper for code tags and backticks
    function formatMarkdown(text) {{
      if (!text) return '';
      let escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      // Render triple backticks blocks
      escaped = escaped.replace(/```(?:bash|text|json)?\s*([\\s\\S]*?)```/g, function(match, p1) {{
        return '<div class="my-2 rounded-xl bg-black/60 p-3 border border-white/10 code-font text-xs text-emerald-300 overflow-x-auto whitespace-pre font-mono">' + p1.trim() + '</div>';
      }});

      // Render inline code backticks `code`
      escaped = escaped.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/30 border border-white/10 text-emerald-300 font-mono text-xs">$1</code>');

      // Bold text **text**
      escaped = escaped.replace(/\\*\\*([^\\*]+)\\*\\*/g, '<strong class="text-[var(--foreground)] font-semibold">$1</strong>');

      return escaped;
    }}

    function init() {{
      selectChapter('all');
      document.addEventListener('keydown', handleKeyNavigation);
    }}

    function selectChapter(chapterId) {{
      currentChapter = chapterId;
      showMistakesOnly = false;
      const fBtn = document.getElementById('btn-filter-mistake');
      if (fBtn) fBtn.classList.remove('bg-rose-500/20', 'text-rose-400', 'border-rose-500');

      document.querySelectorAll('.chapter-tab').forEach(tab => {{
        tab.className = 'chapter-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--card)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]';
      }});
      const activeTab = document.getElementById('tab-' + chapterId);
      if (activeTab) {{
        activeTab.className = 'chapter-tab px-3 py-2 rounded-xl border font-medium whitespace-nowrap transition bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm';
      }}

      applyFilters();
      currentIndex = 0;
      renderCurrentQuestion();
      renderPalette();
      updateStats();
    }}

    function toggleMistakeFilter() {{
      showMistakesOnly = !showMistakesOnly;
      const btn = document.getElementById('btn-filter-mistake');
      if (showMistakesOnly) {{
        btn.classList.add('bg-rose-500/20', 'text-rose-400', 'border-rose-500');
      }} else {{
        btn.classList.remove('bg-rose-500/20', 'text-rose-400', 'border-rose-500');
      }}
      applyFilters();
      currentIndex = 0;
      renderCurrentQuestion();
      renderPalette();
    }}

    function applyFilters() {{
      let list = (currentChapter === 'all') 
        ? [...ALL_QUESTIONS] 
        : ALL_QUESTIONS.filter(q => q.chapter_id === currentChapter);

      if (showMistakesOnly) {{
        list = list.filter(q => userAnswers[q.id] && !userAnswers[q.id].isCorrect);
        if (list.length === 0) {{
          alert('ไม่พบข้อที่ตอบผิดในหมวดนี้ 🎉');
          showMistakesOnly = false;
          const btn = document.getElementById('btn-filter-mistake');
          if (btn) btn.classList.remove('bg-rose-500/20', 'text-rose-400', 'border-rose-500');
          list = (currentChapter === 'all') 
            ? [...ALL_QUESTIONS] 
            : ALL_QUESTIONS.filter(q => q.chapter_id === currentChapter);
        }}
      }}

      filteredQuestions = list;
    }}

    function renderCurrentQuestion() {{
      if (filteredQuestions.length === 0) {{
        document.getElementById('question-text').innerHTML = 'ไม่มีข้อสอบในหมวดนี้';
        document.getElementById('choices-container').innerHTML = '';
        return;
      }}

      if (currentIndex >= filteredQuestions.length) currentIndex = filteredQuestions.length - 1;
      if (currentIndex < 0) currentIndex = 0;

      const q = filteredQuestions[currentIndex];
      
      document.getElementById('q-badge-chapter').textContent = q.chapter_title;
      document.getElementById('q-counter').textContent = 'ข้อที่ ' + (currentIndex + 1) + ' / ' + filteredQuestions.length;
      document.getElementById('question-text').innerHTML = formatMarkdown(q.question);

      const container = document.getElementById('choices-container');
      container.innerHTML = '';

      const letters = ['A', 'B', 'C', 'D'];
      const currentAns = userAnswers[q.id];

      letters.forEach(letter => {{
        const choiceText = q.choices[letter] || '';
        const btn = document.createElement('button');
        btn.className = 'w-full text-left p-3.5 md:p-4 rounded-xl border transition-all flex items-start gap-3 group ' + getChoiceStyle(letter, q, currentAns);
        
        btn.onclick = () => selectAnswer(letter);
        if (currentAns) {{
          btn.disabled = true;
        }}

        btn.innerHTML = `
          <span class="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs uppercase border border-current ${{getBadgeStyle(letter, q, currentAns)}}">
            ${{letter}}
          </span>
          <span class="text-xs md:text-sm leading-relaxed pt-0.5">
            ${{formatMarkdown(choiceText)}}
          </span>
        `;
        container.appendChild(btn);
      }});

      const expBox = document.getElementById('explanation-box');
      const statusEl = document.getElementById('feedback-status');
      const expContent = document.getElementById('explanation-content');

      if (currentAns) {{
        expBox.classList.remove('hidden');
        if (currentAns.isCorrect) {{
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
          <div class="pt-1 text-[var(--foreground)]/90 font-normal">${{formatMarkdown(q.explanation)}}</div>
        `;
      }} else {{
        expBox.classList.add('hidden');
      }}

      document.getElementById('btn-prev').disabled = (currentIndex === 0);
      document.getElementById('btn-next').disabled = (currentIndex === filteredQuestions.length - 1);

      renderPalette();
    }}

    function getChoiceStyle(letter, q, userAns) {{
      if (!userAns) {{
        return 'bg-[var(--card)] hover:bg-[var(--background)] border-[var(--border)] hover:border-blue-400 text-[var(--foreground)] cursor-pointer';
      }}
      if (letter === q.answer) {{
        return 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-semibold ring-1 ring-emerald-500';
      }}
      if (userAns.selected === letter && !userAns.isCorrect) {{
        return 'bg-rose-500/20 border-rose-500 text-rose-400 font-semibold';
      }}
      return 'bg-[var(--card)] border-[var(--border)] opacity-40 text-[var(--muted-foreground)] cursor-default';
    }}

    function getBadgeStyle(letter, q, userAns) {{
      if (!userAns) {{
        return 'bg-[var(--background)] group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500';
      }}
      if (letter === q.answer) {{
        return 'bg-emerald-500 text-black border-emerald-500';
      }}
      if (userAns.selected === letter && !userAns.isCorrect) {{
        return 'bg-rose-500 text-white border-rose-500';
      }}
      return 'bg-[var(--background)] text-[var(--muted-foreground)]';
    }}

    function selectAnswer(letter) {{
      const q = filteredQuestions[currentIndex];
      if (userAnswers[q.id]) return;

      const isCorrect = (letter.toUpperCase() === q.answer.toUpperCase());
      userAnswers[q.id] = {{ selected: letter, isCorrect: isCorrect }};

      updateStats();
      renderCurrentQuestion();
    }}

    function retryCurrentQuestion() {{
      const q = filteredQuestions[currentIndex];
      delete userAnswers[q.id];
      updateStats();
      renderCurrentQuestion();
    }}

    function resetCurrentChapter() {{
      if (confirm('คุณต้องการรีเซ็ตคำตอบทั้งหมดในหมวดหมู่นี้ใช่หรือไม่?')) {{
        filteredQuestions.forEach(q => {{
          delete userAnswers[q.id];
        }});
        updateStats();
        renderCurrentQuestion();
        renderPalette();
      }}
    }}

    function shuffleQuestions() {{
      for (let i = filteredQuestions.length - 1; i > 0; i--) {{
        const j = Math.floor(Math.random() * (i + 1));
        [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
      }}
      currentIndex = 0;
      renderCurrentQuestion();
      renderPalette();
    }}

    function prevQuestion() {{
      if (currentIndex > 0) {{
        currentIndex--;
        renderCurrentQuestion();
      }}
    }}

    function nextQuestion() {{
      if (currentIndex < filteredQuestions.length - 1) {{
        currentIndex++;
        renderCurrentQuestion();
      }}
    }}

    function jumpToQuestion(idx) {{
      currentIndex = idx;
      renderCurrentQuestion();
    }}

    function renderPalette() {{
      const grid = document.getElementById('palette-grid');
      grid.innerHTML = '';

      let answeredCount = 0;

      filteredQuestions.forEach((q, idx) => {{
        const btn = document.createElement('button');
        const ans = userAnswers[q.id];
        const isCurrent = (idx === currentIndex);

        let colorClasses = 'bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)]';

        if (ans) {{
          answeredCount++;
          if (ans.isCorrect) {{
            colorClasses = 'bg-emerald-500/20 text-emerald-400 border-emerald-500 font-semibold';
          }} else {{
            colorClasses = 'bg-rose-500/20 text-rose-400 border-rose-500 font-semibold';
          }}
        }}

        if (isCurrent) {{
          colorClasses += ' ring-2 ring-blue-500 border-blue-500 scale-105 z-10';
        }}

        btn.className = `h-9 rounded-xl border text-xs flex items-center justify-center transition-all ${{colorClasses}}`;
        btn.textContent = idx + 1;
        btn.onclick = () => jumpToQuestion(idx);
        grid.appendChild(btn);
      }});

      document.getElementById('palette-progress').textContent = `${{answeredCount}}/${{filteredQuestions.length}}`;
      const pct = filteredQuestions.length > 0 ? (answeredCount / filteredQuestions.length) * 100 : 0;
      document.getElementById('progress-bar-fill').style.width = `${{pct}}%`;
    }}

    function updateStats() {{
      let correct = 0;
      let wrong = 0;

      Object.values(userAnswers).forEach(ans => {{
        if (ans.isCorrect) correct++;
        else wrong++;
      }});

      const total = correct + wrong;
      const acc = total > 0 ? Math.round((correct / total) * 100) : 0;

      document.getElementById('stat-correct').textContent = correct;
      document.getElementById('stat-wrong').textContent = wrong;
      document.getElementById('stat-accuracy').textContent = acc + '%';
    }}

    function handleKeyNavigation(e) {{
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {{
        selectAnswer(key);
      }} else if (key === 'ARROWLEFT') {{
        prevQuestion();
      }} else if (key === 'ARROWRIGHT') {{
        nextQuestion();
      }}
    }}

    window.addEventListener('DOMContentLoaded', init);
  </script>
</body>
</html>
'''

# Write to workspace
with open('quizzes/interactive_quiz.html', 'w', encoding='utf-8') as out:
    out.write(html_content)

# Write to artifact directory
artifact_dir = r'C:\Users\khanu\.gemini\antigravity\brain\3cccfc97-b869-4d92-8e12-a0d22afbd6f5'
os.makedirs(artifact_dir, exist_ok=True)
artifact_file = os.path.join(artifact_dir, 'interactive_quiz.html')
with open(artifact_file, 'w', encoding='utf-8') as out:
    out.write(html_content)

print(f'Saved interactive quiz to {artifact_file} and quizzes/interactive_quiz.html successfully!')

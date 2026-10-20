(() => {
  const task = document.querySelector('.task-card');
  const computer = document.getElementById('computer');
  const source = document.getElementById('progressLabel');
  const complete = document.getElementById('complete');
  if (!task || !computer || !source || !complete) return;

  const guide = document.createElement('section');
  guide.className = 'lesson-guide';
  guide.setAttribute('aria-label', 'المهمة وتقدّم التطبيق');
  computer.before(guide);
  guide.append(task);
  const status = document.createElement('div');
  status.className = 'guide-status';
  const caption = document.createElement('span');
  caption.setAttribute('aria-live', 'polite');
  const count = document.createElement('span');
  status.append(caption, count);
  const meter = document.createElement('progress');
  meter.className = 'guide-progress';
  meter.setAttribute('aria-label', 'الخطوات المنجزة');
  guide.append(status, meter);

  const lessons = window.labLessons || [];
  const requested = new URLSearchParams(location.search).get('lesson');
  const current = location.pathname.endsWith('lab.html')
    ? (lessons.some(([id]) => id === requested) ? requested : 'format')
    : location.pathname.endsWith('cleanup.html') ? 'cleanup' : 'update';
  const next = lessons[lessons.findIndex(([id]) => id === current) + 1];
  const navigation = document.createElement('div');
  navigation.className = 'lesson-next';
  const note = document.createElement('p');
  const link = document.createElement('a');
  link.className = 'next-lesson-link';
  link.href = next ? next[2] : 'lessons.html';
  link.textContent = next ? `الدرس التالي: ${next[1]} ←` : 'العودة إلى بوابات التعلّم ←';
  navigation.append(note, link);
  complete.append(navigation);

  function sync() {
    const values = source.textContent.match(/\d+/g) || ['0', '1'];
    const total = Math.max(1, Number(values[1]));
    const finished = Math.min(Number(values[0]), total);
    const reviewing = current === 'review';
    const reviewFinished = !!document.querySelector('#quizOptions .completion-score');
    // Finishing the listed steps can precede a simulated installation or restart.
    const completed = !complete.hidden;
    caption.textContent = reviewing ? 'مراجعة الدرس' : completed
      ? '✓ اكتمل التطبيق العملي' : finished >= total
      ? 'جاري إكمال التطبيق — تابع المهمة أعلاه' : `الخطوة ${finished + 1} من ${total}`;
    count.textContent = reviewing ? '' : `${finished} من ${total} خطوات منجزة`;
    meter.max = total;
    meter.value = finished;
    meter.hidden = reviewing;
    navigation.hidden = !completed || (reviewing && !reviewFinished);
    note.textContent = reviewing ? 'أكملت المراجعة. تقدر ترجع لأي درس وتتدرّب من جديد.'
      : reviewFinished ? 'أنهيت التطبيق والمراجعة. جاهز للدرس التالي؟'
      : 'ثبّت معلوماتك بأسئلة المراجعة أدناه، وبعدها انتقل للدرس التالي.';
  }
  const observer = new MutationObserver(sync);
  observer.observe(source, { childList: true, characterData: true, subtree: true });
  observer.observe(complete, { attributes: true, attributeFilter: ['hidden'] });
  observer.observe(document.getElementById('quizOptions'), { childList: true });
  sync();
})();

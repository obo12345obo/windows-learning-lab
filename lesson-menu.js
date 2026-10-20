(() => {
  const lessons = [
    ['format','تهيئة الفلاش','lab.html?lesson=format'],
    ['update','تحديث Windows','update.html'],
    ['cleanup','تنظيف القرص','cleanup.html'],
    ['upgrade','التحديث والترقية','lab.html?lesson=upgrade'],
    ['check','فحص الأقراص','lab.html?lesson=check'],
    ['defrag','إلغاء التجزئة','lab.html?lesson=defrag'],
    ['storage','الملفات المؤقتة','lab.html?lesson=storage'],
    ['restart','إعادة التشغيل','lab.html?lesson=restart'],
    ['review','المراجعة النهائية','lab.html?lesson=review']
  ];
  window.labLessons = lessons;
  function read() {
    try { const value=JSON.parse(localStorage.getItem('my-lab-complete-v1') || '{}'); return value && typeof value === 'object' ? value : {}; }
    catch { return {}; }
  }
  window.markLessonComplete = id => {
    try { const p = read(); p[id] = true; localStorage.setItem('my-lab-complete-v1',JSON.stringify(p)); } catch {}
    render();
  };
  function render() {
    const el = document.getElementById('lessonMenu');
    if (!el) return;
    const query = new URLSearchParams(location.search).get('lesson');
    const current = location.pathname.endsWith('lessons.html') ? null : location.pathname.endsWith('lab.html')
      ? (lessons.some(([id])=>id===query) ? query : 'format')
      : location.pathname.includes('cleanup') ? 'cleanup' : 'update';
    const progress = read();
    el.innerHTML = lessons.map(([id,title,url],i) =>
      `<a href="${url}" class="${id===current?'active':''} ${progress[id]?'is-complete':''}" ${id===current?'aria-current="page"':''}><span class="lesson-index" aria-hidden="true">${progress[id]?'✓':String(i+1).padStart(2,'0')}</span><span class="lesson-link-copy"><strong>${title}</strong><small>${id===current?'أنت هنا':progress[id]?'مكتمل':id==='review'?'اختبر معلوماتك':'تطبيق تفاعلي'}</small></span><span class="lesson-arrow" aria-hidden="true">↗</span></a>`
    ).join('');
  }
  render();
  window.addEventListener('storage', event => { if(event.key==='my-lab-complete-v1') render(); });
})();

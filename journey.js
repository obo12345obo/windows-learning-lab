(() => {
  const menu = document.getElementById('lessonMenu');
  if (!menu) return;
  const descriptions = [
    'وصّل الذاكرة، هيّئها، وامنحها اسماً جديداً.',
    'اكتشف مسار التحديث وتابع تثبيته خطوة بخطوة.',
    'حدّد الملفات غير المطلوبة واستعد مساحة القرص.',
    'قارن الإصدارات وتعرّف الفرق بين Update وUpgrade.',
    'افحص القرص وتعرّف أدوات تشخيص الأخطاء.',
    'نظّم أجزاء الملفات واضبط جدول تحسين القرص.',
    'فعّل Storage Sense لإدارة التنظيف التلقائي.',
    'أعد تشغيل الحاسوب وتعامل مع تطبيق لا يستجيب.',
    'اربط ما تعلّمته بأسئلة وترتيب خطوات عملية.'
  ];
  // Inline symbols are decorative, local assets: no external icon dependency.
  const paths = [
    '<path d="M9 3h6v5h3v13H6V8h3V3Zm0 5h6M11 5v1m2-1v1"/>',
    '<path d="M20 8a8 8 0 0 0-14-2L3 9m0-5v5h5M4 16a8 8 0 0 0 14 2l3-3m0 5v-5h-5"/>',
    '<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6m4-6v6"/>',
    '<rect x="3" y="5" width="7" height="14" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/><path d="m10 12 4-2m-4 2 4 2"/>',
    '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6m-15-11 3 3 5-5"/>',
    '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    '<rect x="3" y="6" width="18" height="12" rx="6"/><circle cx="15" cy="12" r="3"/>',
    '<path d="M12 2v10m-5-7a9 9 0 1 0 10 0"/>',
    '<path d="M8 4H5v17h14V4h-3M8 2h8v5H8V2Zm0 12 3 3 5-6"/>'
  ];
  function decorate() {
    const links = [...menu.querySelectorAll('a')];
    links.forEach((link,i) => {
      const completed = link.classList.contains('is-complete');
      const title = window.labLessons[i][1];
      link.classList.add('portal-card');
      if(i===8) link.classList.add('review-portal');
      link.innerHTML=`<div class="portal-card-top"><span class="portal-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths[i]}</svg></span><span class="portal-order">${String(i+1).padStart(2,'0')}</span></div><span class="portal-kind">${i===8?'محطة المراجعة':'المختبر التفاعلي'}</span><h3>${title}</h3><p>${descriptions[i]}</p><div class="portal-card-bottom"><span class="portal-status">${completed?'✓ مكتمل':i===8?'اختبر معلوماتك':'جاهز للتجربة'}</span><span class="portal-open">${completed?'أعد التدريب':'افتح البوابة'} <b aria-hidden="true">←</b></span></div>`;
    });
    const completed=links.filter(link=>link.classList.contains('is-complete')).length;
    document.getElementById('completedCount').textContent=completed;
    document.getElementById('courseProgress').value=completed;
    const next=links.findIndex(link=>!link.classList.contains('is-complete'));
    const lesson=window.labLessons[next<0?8:next];
    const resume=document.getElementById('continueLesson');
    resume.href=lesson[2];
    resume.textContent=(completed===9?'راجع مهاراتك':completed?'تابع رحلتك: '+lesson[1]:'ابدأ بتهيئة الفلاش')+' ←';
  }
  decorate();
  // The menu replaces its direct children only when completion data changes.
  new MutationObserver(decorate).observe(menu,{childList:true});
})();

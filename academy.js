(() => {
  const header = document.querySelector('.wrap > header');
  const menu = document.getElementById('lessonMenu');
  const intro = document.querySelector('.intro');
  if (!header || !menu || !intro) return;
  header.querySelector('.brand small').textContent = 'مساحة المعرفة والتجربة';
  header.querySelector('.course-label').textContent = 'الرابع الإعدادي · مهارات الحاسوب';
  const skip=document.createElement('a');skip.className='skip-link';skip.href='#learningWorkspace';skip.textContent='انتقل إلى التطبيق العملي';document.body.prepend(skip);
  const trail=document.createElement('nav');trail.className='lab-breadcrumb';trail.setAttribute('aria-label','مسار الصفحة');
  trail.innerHTML='<a href="index.html">الترحيب</a><span aria-hidden="true">/</span><a href="lessons.html">بوابات التعلّم</a><span aria-hidden="true">/</span><span aria-current="page">التطبيق العملي</span><a class="return-portals" href="lessons.html">كل البوابات ←</a>';
  header.after(trail);
  intro.id='learningWorkspace';intro.tabIndex=-1;
  // Keep lesson switching available without putting the full catalogue before the activity.
  const switcher=document.createElement('details');switcher.className='lesson-switcher';
  const summary=document.createElement('summary');summary.textContent='انتقل إلى درس آخر';switcher.append(summary);menu.before(switcher);switcher.append(menu);
  const computer=document.getElementById('computer');
  const chrome=document.createElement('div');chrome.className='simulator-caption';chrome.innerHTML='<span><i aria-hidden="true"></i> مختبر افتراضي</span><span dir="ltr">WINDOWS / PRACTICE LAB</span>';computer.before(chrome);
  document.querySelector('footer').innerHTML='<div class="footer-brand"><strong>مختبري<span>✦</span></strong><span>مساحة للتعلّم. فرصة للإبداع.</span></div><span>صيانة البرمجيات · الرابع الإعدادي<br>جميع العمليات محاكاة تعليمية داخل المتصفح.</span><a href="lessons.html">العودة إلى بوابات التعلّم ←</a>';
})();

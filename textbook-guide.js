(() => {
  const definitions = {
    format:{page:'16',steps:[
      'أنقر على أيقونة This PC.',
      'أضع وحدة الذاكرة المحمولة (Flash Memory) في أحد منافذ USB.',
      'أضغط بزر الفأرة الأيمن على أيقونة تلك الوحدة الخزنية.',
      'أختار الأمر تهيئة (Format) للذاكرة المحمولة. ماذا ألاحظ؟',
      'أحاول تغيير اسم الذاكرة المحمولة. ماذا ألاحظ؟'
    ],detail:'أزرار Start وOK وحفظ الاسم تفصّل تنفيذ التهيئة وتغيير الاسم داخل المحاكي.'},
    update:{page:'17',steps:[
      'النقر على قائمة Start واختيار الأمر Settings.',
      'النقر على Update & Security من القائمة الظاهرة.',
      'النقر على Windows Update من يسار النافذة.',
      'النقر على Check for updates.'
    ],detail:'يرد اسم الزر في النص Check for Update؛ اسمه الظاهر في صورة Windows هو Check for updates. يتبع البحث تثبيت التحديث وإعادة التشغيل تلقائيًا.'},
    cleanup:{page:'18',steps:[
      'البحث عن الأمر Disk Cleanup من شريط البحث.',
      'اختيار القسم المطلوب (Drives) ثم النقر على OK.',
      'النقر على Previous Windows installation(s) عند وجود ترقية من نسخة Windows إلى نسخة أخرى.'
    ],detail:'يذكر الكتاب Temporary Internet Files كخيار إضافي. بعد تحديد الملفات، استخدم OK ثم Delete Files لتأكيد تنفيذ التنظيف؛ هذان الزران تفصيل للتنفيذ بعد خطوات الكتاب الثلاث.'},
    upgrade:{page:'18–19',steps:[
      'أشغّل جهازَي حاسوب: أحدهما مثبت عليه MS Word 2013 والآخر MS Word 2016.',
      'أقارن بين محتويات قائمة Review في التطبيقين.',
      'هل الأمر Inking ضمن قائمة Review متوفر في كلتا النسختين من التطبيق؟',
      'ماذا استنتجت؟'
    ],detail:'نفتح النسختين بالتتابع داخل محاكي واحد لتمثيل الجهازين. المقارنة تعليمية؛ الأداة المشتركة لا تعني أن الإصدارين متطابقان.'},
    check:{page:'19',steps:[
      'فتح This PC ثم النقر بزر الفأرة الأيمن على القسم الذي نرغب في فحصه.',
      'اختيار Properties ثم حقل الأدوات Tools.',
      'النقر على Check ثم Scan drive وانتظار إتمام الفحص وإظهار النتيجة.'
    ],detail:'يرد الأمر في النص باسم Scandrive؛ اسم الزر في واجهة Windows هو Scan drive. رقم القسم ونتيجة الفحص مثالان افتراضيان.'},
    defrag:{page:'19–20',steps:[
      'أ — النقر المزدوج على أيقونة This PC.',
      'ب — النقر بزر الفأرة الأيمن على القسم المطلوب ثم Properties للوصول إلى إجراء Disk Defragment.',
      'ج — من Tools نختار Optimize، ثم نحدّد القسم المطلوب في نافذة الأقراص ونختار Optimize.',
      'د — استخدام Change settings لضبط التحسين يوميًا أو أسبوعيًا أو شهريًا.'
    ],detail:'Disk Defragment اسم الإجراء في الكتاب، وOptimize زر تنفيذه في النافذة. يرد اسم الجدولة في النص Change setting؛ الاسم الظاهر بالواجهة Change settings.'},
    storage:{page:'20',steps:[
      'النقر على Start ثم اختيار Settings.',
      'اختيار System.',
      'الضغط على Storage ثم تشغيل Storage Sense بتحويل مفتاحها إلى On.'
    ],detail:'تفعيل Storage Sense هو نهاية التطبيق المطلوب؛ ليس حذف جميع الملفات فورًا.'},
    restart:{page:'20–21',steps:[
      'النقر على Start.',
      'النقر على Power.',
      'اختيار Restart.'
    ],detail:'عند عدم استجابة الحاسوب: Ctrl + Alt + Del ثم Task Manager لإغلاق التطبيق المتوقف، ثم إعادة التشغيل. يتاح ذلك في سيناريو التطبيق المتوقف داخل المختبر.'},
    review:{page:'21',steps:[
      'الإجابة عن أسئلة الفكرة الرئيسية الثلاثة.',
      'الإجابة عن سؤالَي المفردات: الإيقاف أو إعادة التشغيل، وإلغاء التجزئة.',
      'الإجابة عن سؤالَي التفكير الناقد: فائدة التحديث وحذف الملفات المؤقتة.'
    ],detail:'أسئلة الكتاب السبعة بالترتيب. الأسئلة الكتابية تُقارن بالنموذج، وأسئلة الخطوات تُرتّب تفاعليًا.'}
  };
  const requested=new URLSearchParams(location.search).get('lesson');
  const lesson=location.pathname.endsWith('lab.html')?(definitions[requested]?requested:'format'):location.pathname.endsWith('cleanup.html')?'cleanup':'update';
  const definition=definitions[lesson];
  const aside=document.querySelector('.sidebar');if(!aside)return;
  const card=document.createElement('section');card.className='lesson-card textbook-card';
  const label=document.createElement('span');label.className='card-label';label.textContent=`الدرس الأول — عملي · ص ${definition.page}`;
  const title=document.createElement('h3');title.textContent=lesson==='upgrade'?'نشاط الكتاب':'خطوات الكتاب';
  const list=document.createElement('ol');
  definition.steps.forEach(text=>{const item=document.createElement('li');item.textContent=text;list.append(item)});
  const detail=document.createElement('p');detail.className='textbook-detail';detail.textContent=definition.detail;
  card.append(label,title,list,detail);aside.prepend(card);
  const practiceCard=aside.querySelector('.lesson-card:not(.textbook-card)');
  if(practiceCard){const heading=document.createElement('h3');heading.textContent='تفصيل التنفيذ داخل المختبر';practiceCard.prepend(heading);}
  if(lesson==='defrag')document.querySelector('.interaction-note').textContent='افتح This PC بالنقر المزدوج. قائمة القسم: زر الفأرة الأيمن أو زر ⋮ على شاشة اللمس.';
})();

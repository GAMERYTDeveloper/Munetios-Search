(function () {
  const STORAGE_KEY = 'munetiosLanguage';
  const SUPPORTED_LANGS = [
    'en','es','fr','de','it','pt','ru','ja','ko','zh','zh-TW','ar','hi','bn','pa','jv','ms','id','vi','th','tr','pl','nl','sv','no','da','fi','cs','sk','hu','ro','bg','uk','el','he','fa','ur','ta','te','ml','kn','mr','gu','or','as','ne','si','my','km','lo','am','sw','zu','xh','af','az','yo','ig','ha','so','mg','sn','ny','st','tn','ts','ve','ss','rw','rn','lg','ak','ee','wo','ff','mi','sm','to','fj','haw','ceb','su','eu','ca','gl','cy','ga','gd','is','mt','lb','sq','sr','hr','sl','mk','bs','lt','lv','et'
  ];

  const TRANSLATIONS = {
    en: { home: 'Home', products: 'Products', blog: 'Blog', whatsNew: "What's New", about: 'About', labs: 'Labs', timeline: 'Timeline', manageData: 'Manage Data', privacyPolicy: 'Privacy Policy', faq: 'FAQ', apps: 'Apps', trademark: 'Trademark', productsList: 'Products List', searchLabs: 'Search Labs:', searchApps: 'Search apps', appsLauncher: 'Munetios Apps Launcher', aboutMunetios: 'About Munetios', exploreApps: 'Explore all our apps' },
    es: { home:'Inicio', products:'Productos', blog:'Blog', whatsNew:'Novedades', about:'Acerca de', labs:'Laboratorios', timeline:'Cronología', manageData:'Gestionar datos', privacyPolicy:'Política de privacidad', faq:'Preguntas frecuentes', apps:'Aplicaciones', trademark:'Marca registrada', productsList:'Lista de productos', searchLabs:'Buscar en Labs:', searchApps:'Buscar apps', appsLauncher:'Lanzador de Apps de Munetios', aboutMunetios:'Acerca de Munetios', exploreApps:'Explora todas nuestras apps' },
    fr: { home:'Accueil', products:'Produits', blog:'Blog', whatsNew:'Nouveautés', about:'À propos', labs:'Labos', timeline:'Chronologie', manageData:'Gérer les données', privacyPolicy:'Politique de confidentialité', faq:'FAQ', apps:'Applications', trademark:'Marque déposée', productsList:'Liste des produits', searchLabs:'Rechercher dans Labs :', searchApps:'Rechercher des apps', appsLauncher:'Lanceur d’apps Munetios', aboutMunetios:'À propos de Munetios', exploreApps:'Explorer toutes nos apps' },
    de: { home:'Startseite', products:'Produkte', blog:'Blog', whatsNew:'Neuigkeiten', about:'Über uns', labs:'Labs', timeline:'Zeitleiste', manageData:'Daten verwalten', privacyPolicy:'Datenschutzrichtlinie', faq:'FAQ', apps:'Apps', trademark:'Warenzeichen', productsList:'Produktliste', searchLabs:'Labs durchsuchen:', searchApps:'Apps suchen', appsLauncher:'Munetios App-Launcher', aboutMunetios:'Über Munetios', exploreApps:'Alle unsere Apps entdecken' },
    it: { home:'Home', products:'Prodotti', blog:'Blog', whatsNew:'Novità', about:'Informazioni', labs:'Laboratori', timeline:'Cronologia', manageData:'Gestisci dati', privacyPolicy:'Informativa sulla privacy', faq:'FAQ', apps:'App', trademark:'Marchio', productsList:'Elenco prodotti', searchLabs:'Cerca Labs:', searchApps:'Cerca app', appsLauncher:'Launcher App Munetios', aboutMunetios:'Informazioni su Munetios', exploreApps:'Esplora tutte le nostre app' },
    pt: { home:'Início', products:'Produtos', blog:'Blog', whatsNew:'Novidades', about:'Sobre', labs:'Laboratórios', timeline:'Linha do tempo', manageData:'Gerenciar dados', privacyPolicy:'Política de Privacidade', faq:'FAQ', apps:'Apps', trademark:'Marca registrada', productsList:'Lista de produtos', searchLabs:'Pesquisar Labs:', searchApps:'Pesquisar apps', appsLauncher:'Lançador de Apps Munetios', aboutMunetios:'Sobre a Munetios', exploreApps:'Explore todos os nossos apps' },
    ru: { home:'Главная', products:'Продукты', blog:'Блог', whatsNew:'Что нового', about:'О нас', labs:'Лаборатории', timeline:'Хронология', manageData:'Управление данными', privacyPolicy:'Политика конфиденциальности', faq:'Вопросы и ответы', apps:'Приложения', trademark:'Товарный знак', productsList:'Список продуктов', searchLabs:'Поиск в Labs:', searchApps:'Поиск приложений', appsLauncher:'Лаунчер приложений Munetios', aboutMunetios:'О Munetios', exploreApps:'Посмотреть все приложения' },
    ja: { home:'ホーム', products:'製品', blog:'ブログ', whatsNew:'新着情報', about:'概要', labs:'ラボ', timeline:'タイムライン', manageData:'データ管理', privacyPolicy:'プライバシーポリシー', faq:'よくある質問', apps:'アプリ', trademark:'商標', productsList:'製品一覧', searchLabs:'Labsを検索:', searchApps:'アプリを検索', appsLauncher:'Munetiosアプリランチャー', aboutMunetios:'Munetiosについて', exploreApps:'すべてのアプリを見る' },
    ko: { home:'홈', products:'제품', blog:'블로그', whatsNew:'새 소식', about:'소개', labs:'랩스', timeline:'타임라인', manageData:'데이터 관리', privacyPolicy:'개인정보 처리방침', faq:'FAQ', apps:'앱', trademark:'상표', productsList:'제품 목록', searchLabs:'Labs 검색:', searchApps:'앱 검색', appsLauncher:'Munetios 앱 런처', aboutMunetios:'Munetios 소개', exploreApps:'모든 앱 보기' },
    zh: { home:'主页', products:'产品', blog:'博客', whatsNew:'最新动态', about:'关于', labs:'实验室', timeline:'时间线', manageData:'管理数据', privacyPolicy:'隐私政策', faq:'常见问题', apps:'应用', trademark:'商标', productsList:'产品列表', searchLabs:'搜索 Labs：', searchApps:'搜索应用', appsLauncher:'Munetios 应用启动器', aboutMunetios:'关于 Munetios', exploreApps:'探索所有应用' },
    ar: { home:'الرئيسية', products:'المنتجات', blog:'المدونة', whatsNew:'ما الجديد', about:'حول', labs:'المختبرات', timeline:'الجدول الزمني', manageData:'إدارة البيانات', privacyPolicy:'سياسة الخصوصية', faq:'الأسئلة الشائعة', apps:'التطبيقات', trademark:'العلامة التجارية', productsList:'قائمة المنتجات', searchLabs:'بحث المختبرات:', searchApps:'ابحث عن التطبيقات', appsLauncher:'مشغل تطبيقات Munetios', aboutMunetios:'حول Munetios', exploreApps:'استكشف كل تطبيقاتنا' },
    hi: { home:'होम', products:'प्रोडक्ट्स', blog:'ब्लॉग', whatsNew:'नया क्या है', about:'परिचय', labs:'लैब्स', timeline:'टाइमलाइन', manageData:'डेटा प्रबंधित करें', privacyPolicy:'गोपनीयता नीति', faq:'सामान्य प्रश्न', apps:'ऐप्स', trademark:'ट्रेडमार्क', productsList:'प्रोडक्ट सूची', searchLabs:'लैब्स खोजें:', searchApps:'ऐप्स खोजें', appsLauncher:'Munetios ऐप लॉन्चर', aboutMunetios:'Munetios के बारे में', exploreApps:'हमारे सभी ऐप्स देखें' }
  };

  function getLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
    const candidates = [...(navigator.languages || []), navigator.language, document.documentElement.lang].filter(Boolean);
    for (const lang of candidates) {
      const norm = lang.trim();
      if (SUPPORTED_LANGS.includes(norm)) return norm;
      const base = norm.split('-')[0];
      if (SUPPORTED_LANGS.includes(base)) return base;
    }
    return 'en';
  }

  function t(key, lang) {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS[lang?.split('-')?.[0]]?.[key] || TRANSLATIONS.en[key] || '';
  }

  function applyTranslations() {
    const lang = getLanguage();
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = t(el.getAttribute('data-i18n'), lang);
      if (value) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const value = t(el.getAttribute('data-i18n-placeholder'), lang);
      if (value) el.setAttribute('placeholder', value);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const value = t(el.getAttribute('data-i18n-title'), lang);
      if (value) el.setAttribute('title', value);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyTranslations);
  else applyTranslations();
})();

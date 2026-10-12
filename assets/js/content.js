// Every fact and every word on the page lives here, so you can change them without touching the design.
// Facts come from the intake issue: https://github.com/labsuncut/ops/issues/3

const BUSINESS = {
  timezone: 'Asia/Amman',
  // Opening hours, 24-hour clock. A close time after midnight is written past 24:00 (01:00 = '25:00').
  open: '07:00',
  close: '25:00',
};

const TEXT = {
  en: {
    skip: 'Skip to content', lang_switch: 'عربي', menu_btn: 'Menu', close_btn: 'Close',
    load_1: 'Firing up the flat-top…', load_2: 'Flipping the patties…', load_3: 'Melting the cheese…',
    load_4: 'Toasting the buns…', load_5: 'Loading the truck…', load_done: 'Fuel is ready!',
    nav_home: 'Home', nav_menu: 'Menu', nav_way: 'The FUEL way', nav_delivery: 'Delivery', nav_visit: 'Visit',
    order: 'Order now', order_short: 'Order',

    hero_title: 'THE BURGER TRUCK', hero_word: 'FUEL',
    hero_st1: 'Abdoun\nAmman', hero_st2: 'Open till\n1 AM',
    hero_l: 'Burgers, shakes and coffee from the truck in Abdoun. Open every day, 7 AM to 1 AM.',
    hero_r: 'Order on the FUEL app and we bring it hot, anywhere in Amman.',

    st_tag: 'From the truck', st_title: 'HOT OFF\nTHE TRUCK',
    st_copy: 'Street food with a full tank. Burgers, combos, sides and shakes, handed over hot from the truck in Abdoun.',
    c_burgers: 'Burgers', c_sides: 'Sides', c_shakes: 'Shakes',

    exp_tag: 'The FUEL way', exp_title: 'MADE FOR\nTHE CRAVING',
    exp_l1: '7 AM to 1 AM', exp_l2: 'Every day', exp_l3: 'Abdoun, Amman',
    exp_r1: 'All of Amman', exp_r2: 'Delivery on the app', exp_r3: 'Or pick up at the truck',
    full_title: 'BUILT FOR\nTHE CRAVING.',

    menu_tag: 'The menu', menu_title: 'PICK YOUR\nFUEL',
    menu_note: 'Full menu and prices are in the FUEL app.',
    m_burgers: 'Burgers', m_combos: 'Combos', m_sides: 'Sides', m_shakes: 'Shakes',
    m_refreshers: 'Refreshers', m_coffee: 'Coffee', m_bev: 'Beverages',
    bed_tag: 'Ramadan 2026', bed_title: 'Bedouin Soft Serve',
    bed_copy: 'Soft serve meets Lazzagiyat, the Bedouin sweet. Launched with a film shot in Wadi Rum.',
    bed_cta: 'Read the story',

    del_tag: 'Delivery', del_title: 'HOT ANYWHERE\nIN AMMAN',
    del_copy: 'From the truck in Abdoun to your door. Order on the FUEL app or on the web.',
    s1_t: 'Order', s1_d: 'On the FUEL app or on the web.',
    s2_t: 'Track it', s2_d: 'Follow your driver on the map.',
    s3_t: 'Pay your way', s3_d: 'Cash or card.',
    s4_t: 'Collect points', s4_d: 'App-only deals and points on every order.',
    get_app: 'Get the app', order_web: 'Order on the web',

    visit_tag: 'Visit the truck', visit_title: 'COME SAY\nHI',
    visit_copy: 'Find the truck in Abdoun, Amman. Every day, 7 AM to 1 AM.',
    v_phone: 'Phone', v_ig: 'Instagram', directions: 'Directions', call: 'Call the truck', call_short: 'Call',
    open_now: 'Open now', closes: 'closes at 1 AM', closed_now: 'Closed now', opens: 'opens at 7 AM',

    foot_line: 'Burgers · Shakes · Coffee · Abdoun, Amman · Open till 1 AM', foot_small: 'Concept website preview',

    ph: 'Fuel photo goes here',
  },
  ar: {
    skip: 'تخطَّ إلى المحتوى', lang_switch: 'EN', menu_btn: 'القائمة', close_btn: 'إغلاق',
    load_1: 'عم نحمّي الصاج…', load_2: 'عم نقلب اللحمة…', load_3: 'عم تذوب الجبنة…',
    load_4: 'عم نحمّص الخبز…', load_5: 'عم نجهّز الترك…', load_done: 'فيول جاهز!',
    nav_home: 'الرئيسية', nav_menu: 'المنيو', nav_way: 'طريقة فيول', nav_delivery: 'التوصيل', nav_visit: 'زورونا',
    order: 'اطلب الآن', order_short: 'اطلب',

    hero_title: 'ترك البرغر', hero_word: 'فيول',
    hero_st1: 'عبدون\nعمّان', hero_st2: 'مفتوحين\nلحد 1',
    hero_l: 'برغر وميلك شيك وقهوة من الترك في عبدون. مفتوحين كل يوم من 7 الصبح لـ 1 بالليل.',
    hero_r: 'اطلب من تطبيق فيول وبنوصلك ياه سخن لأي مكان بعمّان.',

    st_tag: 'من الترك', st_title: 'سخن\nمن الترك',
    st_copy: 'أكل شارع بتانك مليان. برغر ووجبات وإضافات وميلك شيك، بيوصلك سخن من الترك في عبدون.',
    c_burgers: 'برغر', c_sides: 'إضافات', c_shakes: 'ميلك شيك',

    exp_tag: 'طريقة فيول', exp_title: 'معمول\nللجوع الحقيقي',
    exp_l1: 'من 7 الصبح لـ 1 بالليل', exp_l2: 'كل يوم', exp_l3: 'عبدون، عمّان',
    exp_r1: 'كل عمّان', exp_r2: 'توصيل عالتطبيق', exp_r3: 'أو استلم من الترك',
    full_title: 'معمول\nللجوع.',

    menu_tag: 'المنيو', menu_title: 'اختار\nوقودك',
    menu_note: 'المنيو الكامل والأسعار بتطبيق فيول.',
    m_burgers: 'برغر', m_combos: 'وجبات', m_sides: 'إضافات', m_shakes: 'ميلك شيك',
    m_refreshers: 'مشروبات منعشة', m_coffee: 'قهوة', m_bev: 'مشروبات',
    bed_tag: 'رمضان 2026', bed_title: 'سوفت سيرف بدوي',
    bed_copy: 'سوفت سيرف مع اللزاقيات، الحلو البدوي. انطلق بفيلم تصوّر في وادي رم.',
    bed_cta: 'اقرأ القصة',

    del_tag: 'التوصيل', del_title: 'سخن لأي مكان\nبعمّان',
    del_copy: 'من الترك في عبدون لباب بيتك. اطلب من تطبيق فيول أو من الموقع.',
    s1_t: 'اطلب', s1_d: 'من تطبيق فيول أو من الموقع.',
    s2_t: 'تابع طلبك', s2_d: 'شوف السائق عالخريطة.',
    s3_t: 'ادفع براحتك', s3_d: 'كاش أو بطاقة.',
    s4_t: 'اجمع نقاط', s4_d: 'عروض خاصة بالتطبيق ونقاط مع كل طلب.',
    get_app: 'نزّل التطبيق', order_web: 'اطلب من الموقع',

    visit_tag: 'زور الترك', visit_title: 'مرّ\nسلّم علينا',
    visit_copy: 'لاقي الترك في عبدون، عمّان. كل يوم من 7 الصبح لـ 1 بالليل.',
    v_phone: 'الهاتف', v_ig: 'إنستغرام', directions: 'الاتجاهات', call: 'اتصل بالترك', call_short: 'اتصل',
    open_now: 'مفتوح الآن', closes: 'بيسكّر الساعة 1', closed_now: 'مسكّر الآن', opens: 'بيفتح الساعة 7 الصبح',

    foot_line: 'برغر · ميلك شيك · قهوة · عبدون، عمّان · مفتوحين لحد الساعة 1', foot_small: 'نسخة تجريبية للموقع',

    ph: 'مكان صورة من فيول',
  },
};

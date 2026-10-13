// Every fact and every word on the page lives here, so you can change them without touching the design.
// Facts come from the intake issue (https://github.com/labsuncut/ops/issues/3), FUEL's Instagram and the team.

const BUSINESS = {
  timezone: 'Asia/Amman',
  // Opening hours by weekday (0 = Sunday), 24-hour clock.
  // A close time after midnight is written past 24:00 (01:00 = '25:00').
  // Team, 2026-10-13: "11-1 am on weekdays, and 11-2 on weekends". Weekend assumed to be Friday and Saturday.
  hours: {
    0: ['11:00', '25:00'], 1: ['11:00', '25:00'], 2: ['11:00', '25:00'], 3: ['11:00', '25:00'], 4: ['11:00', '25:00'],
    5: ['11:00', '26:00'], 6: ['11:00', '26:00'],
  },
};

// Prices in JD, from FUEL's menu story (21 Aug 2026). The team confirmed they are current.
// Item names stay as FUEL writes them, in both languages.
const MENU = [
  { key: 'm_burgers', note: 'n_burgers', rows: [['Single', '4.00'], ['Double', '5.50'], ['Triple', '7.00'], ['4*4', '8.50']] },
  { key: 'm_truffle', rows: [['Single', '5.00'], ['Double', '6.50'], ['Triple', '8.00']] },
  { key: 'm_combos', note: 'n_combos', rows: [['Single', '5.25', '7.00'], ['Double', '6.75', '8.50'], ['Triple', '8.00', '10.00']] },
  { key: 'm_sides', rows: [['Caviar Fries', '5.00'], ['Animal Fries', '3.50'], ['Skin On Fries', '2.00'], ['Fries', '1.50'], ['Fuel Sauce', '0.50']] },
  { key: 'm_shakes', note: 'n_shakes', rows: [['Mango Coco', '3.75'], ['Birthday Shake', '3.75'], ['Strawberry Cream', '3.75']] },
  { key: 'm_refreshers', note: 'n_refreshers', rows: [['McQueen', '3.50'], ['Green Lightning', '3.50'], ['Beach Breeze', '3.50'], ['Iced Tea', '3.50']] },
  { key: 'm_coffee', note: 'n_coffee', rows: [['Salted Caramel Frappe', '4.00'], ['Iced White Mocha', '4.00'], ['Matcha Frappe', '4.00'], ['Iced Spanish Latte', '3.50'], ['Hot / Iced Latte', '3.50'], ['Matcha Latte', '3.50'], ['Hot / Iced Americano', '3.00'], ['Double Espresso Shot', '2.50']] },
  { key: 'm_sweet', rows: [['S\'mores Hot Chocolate', '4.00'], ['Vanilla Salted Caramel Ice Cream', '3.00'], ['Matcha Ice Cream', '3.00']] },
];

const TEXT = {
  en: {
    skip: 'Skip to content', lang_switch: 'عربي', menu_btn: 'Menu', close_btn: 'Close',
    load_1: 'Engine on', load_2: 'Grill hot', load_3: 'Buns toasted', load_4: 'Cheese melting', load_5: 'Tank full', load_done: 'GO GO GO',
    nav_home: 'Home', nav_top: 'Top sellers', nav_fiesta: 'Fiesta', nav_menu: 'Menu', nav_race: 'Race Mode', nav_visit: 'Visit',
    order: 'Order now', order_short: 'Order',

    hero_title: 'YOUR FOODIE\nPIT STOP', hero_st1: 'Fill your\npassion tank', hero_st2: 'Open till\n2 AM',
    hero_l: 'Burgers, loaded fries, shakes and coffee from the FUEL container in Amman.',
    hero_r: 'Open every day from 11 AM. Order on the FUEL app, or pull in.',
    photo_note: 'Photos from @fuel_foodtruck',

    top_tag: 'decided by you', top_title: 'THE TOP\nSELLERS',
    top_copy: 'Four orders that keep the grill busy. Your favourites, ranked by you.',
    sig: 'Signature drink', jd: 'JD',
    t_classic: 'Double Classic', t_fries: 'Animal Fries', t_mango: 'Mango Coco', t_truffle: 'Double Truffle',

    tank_tag: 'The signature drink', tank_title: 'FILL YOUR\nPASSION TANK',
    tank_copy: 'Mango Coco, the shake in the cup with the bolt. Add whipped cream on top for 0.50 JD.',
    tank_l1: 'Sun to Thu', tank_l2: '11 AM – 1 AM',
    tank_r1: 'Fri & Sat', tank_r2: '11 AM – 2 AM',

    full_title: 'EAT. DRIVE.\nREPEAT!',

    fi_tag: 'Sabor del Verano!', fi_title: '¡FIESTA!',
    fi_copy: 'The new Mexican menu at FUEL. Four new items, on top of everything you already love.',
    fi_1: 'Mexican Burger', fi_1d: 'Beef, cheese, bacon, pico de gallo and jalapeños.',
    fi_2: 'Mexican Loaded Fries', fi_2d: 'Fries loaded Fiesta style, with guacamole and jalapeños.',
    fi_3: 'Jalapeño Poppers', fi_3d: 'Crispy, golden, with a kick.',
    fi_4: 'Mexican Refresher', fi_4d: 'Soda water, chamoy, tajín and mango.',
    fi_note: 'Fiesta prices at the container.', fi_go: '¡Vámonos!',

    menu_tag: 'Prices in JD', menu_title: 'THE MENU',
    m_burgers: 'Burgers', m_truffle: 'Truffle Burger', m_combos: 'Combos', m_sides: 'Sides', m_shakes: 'Shakes',
    m_refreshers: 'Refreshers', m_coffee: 'Coffee', m_sweet: 'Hot chocolate & ice cream',
    n_burgers: '', n_combos: 'With a soft drink, or with a milkshake for +2 JD.', combo_soft: 'Soft drink', combo_shake: 'Shake',
    n_shakes: 'Add whipped cream 0.50', n_refreshers: 'Add Red Bull 1.50', n_coffee: 'Extra shot 0.50',
    menu_note: 'Upgrade any drink to large for only 0.50 JD.',

    race_tag: 'Race Mode', race_title: 'HOW LOYAL\nARE YOU?',
    race_copy: 'Earn points with every order. Keep the card in your phone wallet and climb the leaderboard. Each month one Top Fueler takes the crown.',
    r_pts: 'points', r_15: '15% discount', r_20: 'Pick your reward, up to 20 JD',
    r_check: 'Checkpoint', race_cta: 'Join Race Mode',

    visit_tag: 'Pull in', visit_title: 'COME FILL\nUP',
    visit_copy: 'Find the FUEL container in Amman. Every day from 11 AM.',
    v_hours: 'Hours', v_week: 'Sun–Thu 11 AM – 1 AM', v_wkend: 'Fri–Sat 11 AM – 2 AM',
    v_phone: 'Phone', v_ig: 'Instagram', directions: 'Directions', call: 'Call FUEL', call_short: 'Call',
    get_app: 'Get the app', order_web: 'Order on the web',
    open_now: 'Open now', closed_now: 'Closed now', closes: 'closes at', opens: 'opens at 11 AM',

    foot_line: 'Eat. Drive. Repeat! · Burgers · Shakes · Coffee · Amman', foot_small: 'Concept website preview',
    scroll_cue: 'Scroll', fly_marker: '02 / Top sellers', hud_of: '/ 04', lineup_h: 'The top sellers',
  },
  ar: {
    skip: 'تخطَّ إلى المحتوى', lang_switch: 'EN', menu_btn: 'القائمة', close_btn: 'إغلاق',
    load_1: 'المحرك اشتغل', load_2: 'الصاج حامي', load_3: 'الخبز تحمّص', load_4: 'الجبنة عم تذوب', load_5: 'التانك فل', load_done: 'يلا انطلق',
    nav_home: 'الرئيسية', nav_top: 'الأكثر مبيعاً', nav_fiesta: 'فييستا', nav_menu: 'المنيو', nav_race: 'ريس مود', nav_visit: 'زورونا',
    order: 'اطلب الآن', order_short: 'اطلب',

    hero_title: 'محطتك\nللأكل الطيب', hero_st1: 'عبّي\nتانك الشغف', hero_st2: 'مفتوحين\nلحد 2',
    hero_l: 'برغر، بطاطا محمّلة، ميلك شيك وقهوة من كونتينر فيول في عمّان.',
    hero_r: 'مفتوحين كل يوم من 11 الصبح. اطلب من تطبيق فيول أو مرّ علينا.',
    photo_note: 'الصور من @fuel_foodtruck',

    top_tag: 'إنتو اخترتوها', top_title: 'الأكثر\nمبيعاً',
    top_copy: 'أربع طلبات ما بتخلّي الصاج يرتاح. المفضّلة عندكم، بترتيبكم.',
    sig: 'المشروب المميز', jd: 'د.أ',
    t_classic: 'Double Classic', t_fries: 'Animal Fries', t_mango: 'Mango Coco', t_truffle: 'Double Truffle',

    tank_tag: 'المشروب المميز', tank_title: 'عبّي تانك\nالشغف',
    tank_copy: 'مانجو كوكو، الشيك اللي بالكاسة أم البرق. زيد كريمة فوقه بـ 0.50 دينار.',
    tank_l1: 'الأحد للخميس', tank_l2: '11 الصبح – 1 بالليل',
    tank_r1: 'الجمعة والسبت', tank_r2: '11 الصبح – 2 بالليل',

    full_title: 'كُل. سوق.\nوعيد!',

    fi_tag: 'Sabor del Verano!', fi_title: '¡FIESTA!',
    fi_copy: 'المنيو المكسيكي الجديد في فيول. أربع أصناف جديدة، فوق كل إشي بتحبّه.',
    fi_1: 'Mexican Burger', fi_1d: 'لحمة، جبنة، بيكن، بيكو دي جايو وهالبينو.',
    fi_2: 'Mexican Loaded Fries', fi_2d: 'بطاطا محمّلة على طريقة الفييستا، مع واكامولي وهالبينو.',
    fi_3: 'Jalapeño Poppers', fi_3d: 'مقرمشة وذهبية، وفيها حرارة.',
    fi_4: 'Mexican Refresher', fi_4d: 'مي صودا، تشامُوي، تاهين ومانجا.',
    fi_note: 'أسعار الفييستا عند الكونتينر.', fi_go: '¡Vámonos!',

    menu_tag: 'الأسعار بالدينار', menu_title: 'المنيو',
    m_burgers: 'برغر', m_truffle: 'ترافل برغر', m_combos: 'وجبات', m_sides: 'إضافات', m_shakes: 'ميلك شيك',
    m_refreshers: 'مشروبات منعشة', m_coffee: 'قهوة', m_sweet: 'هوت تشوكلت وآيس كريم',
    n_burgers: '', n_combos: 'مع مشروب غازي، أو مع ميلك شيك بزيادة 2 دينار.', combo_soft: 'مشروب غازي', combo_shake: 'شيك',
    n_shakes: 'زيادة كريمة 0.50', n_refreshers: 'زيادة ريد بُل 1.50', n_coffee: 'شوت زيادة 0.50',
    menu_note: 'كبّر أي مشروب لحجم كبير بـ 0.50 دينار بس.',

    race_tag: 'ريس مود', race_title: 'قديش إنت\nوفي؟',
    race_copy: 'اجمع نقاط مع كل طلب. خلّي الكرت بمحفظة تلفونك واطلع بالترتيب. كل شهر في Top Fueler واحد بياخذ التاج.',
    r_pts: 'نقطة', r_15: 'خصم 15%', r_20: 'اختار هديتك، لحد 20 دينار',
    r_check: 'محطة', race_cta: 'اشترك بريس مود',

    visit_tag: 'مرّ علينا', visit_title: 'تعال\nعبّي',
    visit_copy: 'لاقي كونتينر فيول في عمّان. كل يوم من 11 الصبح.',
    v_hours: 'الدوام', v_week: 'الأحد–الخميس 11 الصبح – 1 بالليل', v_wkend: 'الجمعة–السبت 11 الصبح – 2 بالليل',
    v_phone: 'الهاتف', v_ig: 'إنستغرام', directions: 'الاتجاهات', call: 'اتصل بفيول', call_short: 'اتصل',
    get_app: 'نزّل التطبيق', order_web: 'اطلب من الموقع',
    open_now: 'مفتوح الآن', closed_now: 'مسكّر الآن', closes: 'بيسكّر الساعة', opens: 'بيفتح الساعة 11 الصبح',

    foot_line: 'كُل. سوق. وعيد! · برغر · ميلك شيك · قهوة · عمّان', foot_small: 'نسخة تجريبية للموقع',
    scroll_cue: 'اسحب', fly_marker: '02 / الأكثر مبيعاً', hud_of: '/ 04', lineup_h: 'الأكثر مبيعاً',
  },
};

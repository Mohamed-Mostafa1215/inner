export type ForceKey = "intuition" | "will" | "intellect" | "emotion" | "instinct";

export interface Force {
  key: ForceKey;
  number: number;
  name: string;
  subtitle: string;
  level: string;
  role: string;
  description: string;
  risk: string;
  color: string;
}

export const FORCES: Force[] = [
  {
    key: "intuition",
    number: 2,
    name: "الحدس",
    subtitle: "البوصلة الفطرية",
    level: "ليفل 5 — سلكان",
    role: "يقود",
    description:
      "إدراك فوري يتجاوز المنطق الخطي. هو الرماية الذهنية التي تصيب الهدف بدقة قبل التحليل.",
    risk: "تجاهله يؤدي للتيه وفقدان الاتجاه.",
    color: "from-amber-300 to-yellow-500",
  },
  {
    key: "will",
    number: 1,
    name: "الإرادة",
    subtitle: "السلاح التنفيذي",
    level: "القشرة الجبهية",
    role: "ينفّذ",
    description:
      "القوة الحاسمة التي تحوّل الرؤية إلى واقع. بدون بوصلة تصبح تهورًا، ومع الحدس تصبح قنّاصًا.",
    risk: "غيابها يجعل أعظم الرؤى مجرد أحلام.",
    color: "from-orange-400 to-red-500",
  },
  {
    key: "intellect",
    number: 5,
    name: "الذكاء",
    subtitle: "العقل المتحرك",
    level: "ليفل 3 — الناقل",
    role: "يخدم",
    description:
      "ناقل الحركة الذي يولّد البدائل ويناور بين العقبات. يخدم رؤية الحدس ولا يقود وحده.",
    risk: "وحده يؤدي لشلل التحليل والتبرير.",
    color: "from-sky-400 to-indigo-500",
  },
  {
    key: "emotion",
    number: 6,
    name: "العاطفة",
    subtitle: "الوقود الروحي",
    level: "ليفل 7 — مكتسب",
    role: "يُفرَّغ بوعي",
    description:
      "أعلى القوى تكلفة. تمنح العمق والمعنى، وتتطلب تفريغًا واعيًا وجرعات محسوبة.",
    risk: "كبتها يؤدي للاكتئاب، انفجارها يستنزف النظام.",
    color: "from-rose-400 to-fuchsia-500",
  },
  {
    key: "instinct",
    number: 4,
    name: "الغرائز",
    subtitle: "الكلاب الأربعة",
    level: "منطقة الاختبار",
    role: "تُروَّض",
    description:
      "الخوف، الغضب، الشهوة، الأنا. طاقة خام تتحول إلى أسود سوداء حين تُروَّض، أو إلى كلاب تنهش حين تنفلت.",
    risk: "انفلاتها يقود إلى التفكك الهيكلي.",
    color: "from-stone-400 to-zinc-700",
  },
];

export interface Identity {
  key: string;
  name: string;
  formula: string;
  description: string;
  behaviors: string[];
}

export const IDENTITIES: Identity[] = [
  {
    key: "warrior",
    name: "عقل المحارب",
    formula: "الإرادة (1) + ترويض الغرائز (4)",
    description:
      "خط الدفاع الأول. يحوّل الخوف والغضب إلى درع نفسي صلب، ويعمل تحت الضغط العالي.",
    behaviors: [
      "المواجهة المباشرة للمخاوف",
      "الانضباط في إنهاء المهام الثقيلة",
      "الصمت الاستراتيجي وقت الانفعال",
    ],
  },
  {
    key: "leader",
    name: "القائد",
    formula: "الحدس (2) + الإرادة (1) + ذكاء اجتماعي (5)",
    description:
      "البصيرة النافذة والحضور الطاغي. يقرأ البشر بحدسه ويحسم بإرادته بدون تبرير زائد.",
    behaviors: [
      "إيقاع هادئ وثابت في الكلام",
      "قرارات حاسمة بلا ضجيج",
      "قراءة دوافع الآخرين فورًا",
    ],
  },
  {
    key: "maker",
    name: "صانع المشروع",
    formula: "الذكاء (5) في خدمة الحدس (2) + تحييد المزاج",
    description:
      "مهندس الواقع. يحوّل الأفكار إلى نتائج تحت قانون: الإنجاز أهم من المزاج.",
    behaviors: [
      "العمل العميق (90 دقيقة تركيز)",
      "تمرين البدائل الثلاثة لكل عقبة",
      "القياس بالبيانات لا بالانطباعات",
    ],
  },
  {
    key: "sage",
    name: "الروحي العملي",
    formula: "العاطفة (6) تحت رقابة الحدس (2)",
    description:
      "بروتوكول صيانة العمق الإنساني. يعيد شحن النظام ويحفظ البوصلة من الضوضاء.",
    behaviors: [
      "تفريغ يومي (كتابة/صمت/حركة)",
      "ربط العمل بالمعنى الأكبر",
      "تأمل لتنقية البوصلة",
    ],
  },
];

export interface ScientificTerm {
  term: string;
  english: string;
  definition: string;
}

export interface ComparisonRow {
  aspect: string;
  positive: string;
  negative: string;
}

export interface ComparisonTableData {
  title: string;
  positiveLabel: string;
  negativeLabel: string;
  rows: ComparisonRow[];
}

export interface ForceInteraction {
  withForce: ForceKey;
  name: string;
  description: string;
}

export interface DevelopmentStep {
  title: string;
  description: string;
  steps: string[];
}

export interface ForceContent {
  key: ForceKey;
  sections: {
    title: string;
    content: string;
  }[];
  comparisonTable: ComparisonTableData;
  scientificTerms: ScientificTerm[];
  strengthSigns: string[];
  weaknessSigns: string[];
  strategicRisks: string[];
  interactions: ForceInteraction[];
  developmentProtocol: DevelopmentStep[];
}

export interface DecisionRecord {
  id: string;
  date: string;
  context: string;
  intuitionScan: string;
  alternatives: string[];
  activeInstinct: string;
  firstAction: string;
  emotionalImpact: number;
}

export interface WeeklySchedule {
  dayType: "warrior" | "leader" | "sage";
  name: string;
  focus: string;
  tasks: string[];
  forcesFocus: ForceKey[];
}

export interface AssessmentHistory {
  id: string;
  date: string;
  scores: Record<ForceKey, number>;
}

export interface ProtocolDay {
  day: number;
  phase: 1 | 2 | 3;
  title: string;
  tasks: string[];
  focusForce: ForceKey;
  identity: string;
}

// --- مهام متنوعة للمرحلة الأولى: تثبيت الأساس (أيام 1-20) ---
const phase1Pool: { tasks: string[]; focusForce: ForceKey; identity: string }[] = [
  {
    tasks: [
      "صمت الـ 10 دقائق الصباحي: اجلس بلا هاتف واسأل «ما الأولوية القصوى اليوم؟»",
      "اتبع الإحساس الأول في أول قرار يواجهك دون تحليل",
      "سجّل ملاحظة مسائية: هل كان الحدس صائبًا؟",
    ],
    focusForce: "intuition",
    identity: "القائد",
  },
  {
    tasks: [
      "قاعدة الـ 5 ثوانٍ: نفّذ أصعب مهمة في قائمتك فورًا عند العد التنازلي",
      "تمرين جسدي شاق لمدة 15 دقيقة (دش بارد أو تمارين ضغط)",
      "امنع نفسك من التأجيل في مهمة واحدة على الأقل",
    ],
    focusForce: "will",
    identity: "عقل المحارب",
  },
  {
    tasks: [
      "تسمية الكلب: عند أول انفعال اليوم، سَمِّ الغريزة بصوت داخلي",
      "الانتظار 10 دقائق قبل أي رد فعل غاضب أو مندفع",
      "راقب «الكلب» وهو يهدأ تحت سيطرتك وسجّل التجربة",
    ],
    focusForce: "instinct",
    identity: "عقل المحارب",
  },
  {
    tasks: [
      "بروتوكول الصباح: 10 دقائق صمت رقمي + سؤال البوصلة",
      "طبّق قاعدة الـ 5 ثوانٍ على قرار تأجلته بالأمس",
      "سجّل أي لحظة ظهر فيها «كلب» غرائزي واسمه",
    ],
    focusForce: "intuition",
    identity: "صانع المشروع",
  },
  {
    tasks: [
      "دش بارد صباحي لكسر كلب الراحة ثم مباشرة في أهم مهمة",
      "تمرين القرار الأول: اتبع الإحساس الأول في 3 قرارات صغيرة اليوم",
      "عند ظهور خوف أو تردد، سَمِّه وانتظر دون استجابة",
    ],
    focusForce: "will",
    identity: "عقل المحارب",
  },
];

// --- مهام متنوعة للمرحلة الثانية: تشغيل العقل الواعي (أيام 21-40) ---
const phase2Pool: { tasks: string[]; focusForce: ForceKey; identity: string }[] = [
  {
    tasks: [
      "تمرين البدائل الثلاثة: حدد عقبة اليوم وولّد 3 مسارات مختلفة",
      "اعرض البدائل على الحدس واختر المسار «السالك»",
      "تفريغ 10 دقائق مسائي: كتابة عشوائية بلا رقابة ذهنية",
    ],
    focusForce: "intellect",
    identity: "صانع المشروع",
  },
  {
    tasks: [
      "دورة قرار مصغرة: حدس → 3 بدائل → اختيار → تنفيذ فوري",
      "رياضة شاقة 20 دقيقة لتفريغ الطاقة العاطفية المتراكمة",
      "سجّل في اليومية: ما الذي تعلمته من قرارات اليوم؟",
    ],
    focusForce: "will",
    identity: "عقل المحارب",
  },
  {
    tasks: [
      "صمت صباحي 10 دقائق + سؤال البوصلة عن الأولوية",
      "عند مواجهة مشكلة، فعّل «شطرنج الاحتمالات» قبل الحسم",
      "تفريغ صوتي 5 دقائق: تحدث بصوت عالٍ عما تشعر به",
    ],
    focusForce: "intuition",
    identity: "القائد",
  },
  {
    tasks: [
      "تمرين البدائل الثلاثة على أكبر تحدٍ مهني تواجهه",
      "امنع ردود الفعل الاندفاعية طوال اليوم (قاعدة 10 دقائق)",
      "تفريغ حركي مسائي: مشي 30 دقيقة بلا هاتف",
    ],
    focusForce: "instinct",
    identity: "صانع المشروع",
  },
  {
    tasks: [
      "العمل العميق: 90 دقيقة تركيز مغلقة على المشروع الأهم",
      "راقب أي غريزة حاولت تشتيتك وسَمِّها",
      "تفريغ كتابي مسائي: ما الانتصارات الصغيرة اليوم؟",
    ],
    focusForce: "intellect",
    identity: "صانع المشروع",
  },
];

// --- مهام متنوعة للمرحلة الثالثة: الدمج والسيادة (أيام 41-60) ---
const phase3Pool: { tasks: string[]; focusForce: ForceKey; identity: string }[] = [
  {
    tasks: [
      "دورة القرار الكاملة: الحدس يحدد → التحليل يخطط → الإرادة تنفذ",
      "اختر هوية اليوم: محارب — تركيز على الانضباط والمواجهة",
      "راجع سرعة قرارك وثبات انفعالك مساءً",
    ],
    focusForce: "will",
    identity: "عقل المحارب",
  },
  {
    tasks: [
      "دورة القرار الكاملة على أهم قرار استراتيجي اليوم",
      "اختر هوية اليوم: قائد — تركيز على الحضور والحسم الاجتماعي",
      "تفريغ عاطفي واعٍ 15 دقيقة + مراجعة البوصلة",
    ],
    focusForce: "intuition",
    identity: "القائد",
  },
  {
    tasks: [
      "الدمج الكامل: حدس → 3 بدائل → فلترة الغرائز → تنفيذ حاسم",
      "اختر هوية اليوم: صانع — العمل العميق 90 دقيقة + قياس المخرجات",
      "تفريغ مسائي + تقييم: أي قوة كانت الأقوى اليوم؟",
    ],
    focusForce: "intellect",
    identity: "صانع المشروع",
  },
  {
    tasks: [
      "بروتوكول الدمج: 10 دقائق صمت → قرار بالحدس → تنفيذ فوري",
      "اختر هوية اليوم: روحي — صيانة العمق والتفريغ الواعي",
      "15 دقيقة صمت تام + كتابة عن المعنى الأعمق لعملك",
    ],
    focusForce: "emotion",
    identity: "الروحي العملي",
  },
  {
    tasks: [
      "المنظومة الكاملة: ابدأ بالحدس، خطط بالعقل، نفّذ بالإرادة، فرّغ العاطفة",
      "ترويض مكثف: حدد أقوى غريزة نشطة اليوم وواجهها عمدًا",
      "مراجعة أسبوعية: قارن أداءك مع بداية البروتوكول",
    ],
    focusForce: "instinct",
    identity: "عقل المحارب",
  },
];

export const PROTOCOL: ProtocolDay[] = Array.from({ length: 60 }, (_, i) => {
  const day = i + 1;

  if (day <= 20) {
    const pool = phase1Pool[i % phase1Pool.length];
    return {
      day,
      phase: 1 as const,
      title: "تثبيت الأساس",
      tasks: pool.tasks,
      focusForce: pool.focusForce,
      identity: pool.identity,
    };
  } else if (day <= 40) {
    const pool = phase2Pool[(i - 20) % phase2Pool.length];
    return {
      day,
      phase: 2 as const,
      title: "تشغيل العقل الواعي",
      tasks: pool.tasks,
      focusForce: pool.focusForce,
      identity: pool.identity,
    };
  } else {
    const pool = phase3Pool[(i - 40) % phase3Pool.length];
    return {
      day,
      phase: 3 as const,
      title: "الدمج والسيادة",
      tasks: pool.tasks,
      focusForce: pool.focusForce,
      identity: pool.identity,
    };
  }
});

export interface Exercise {
  key: string;
  name: string;
  force: ForceKey;
  duration: string;
  description: string;
  steps: string[];
}

export const EXERCISES: Exercise[] = [
  {
    key: "five-seconds",
    name: "قاعدة الـ 5 ثوانٍ",
    force: "will",
    duration: "فوري",
    description: "كسر التسويف بتنفيذ القرار خلال 5 ثوانٍ من ظهوره.",
    steps: [
      "لاحظ القرار أو الفعل المؤجل",
      "ابدأ العد التنازلي: 5-4-3-2-1",
      "تحرك جسديًا قبل وصولك للصفر",
    ],
  },
  {
    key: "ten-minutes",
    name: "قاعدة الـ 10 دقائق",
    force: "instinct",
    duration: "10 دقائق",
    description: "ترويض الغرائز قبل أن تختطف قرارك.",
    steps: [
      "اشعر بنبضة الغضب/الخوف/الشهوة",
      "سَمِّ الكلب: «هذا كلب الغضب يحاول القيادة»",
      "امنع أي رد فعل لمدة 10 دقائق",
      "راقب الوحش يهدأ تحت سيطرتك",
    ],
  },
  {
    key: "three-alternatives",
    name: "البدائل الثلاثة",
    force: "intellect",
    duration: "10 دقائق",
    description: "تمرين العقل المتحرك على المناورة لا الجمود.",
    steps: [
      "حدد العقبة بوضوح",
      "ولّد 3 بدائل مختلفة جذريًا",
      "اعرضها على الحدس واختر السالك",
    ],
  },
  {
    key: "first-instinct",
    name: "القرار الأول",
    force: "intuition",
    duration: "يومي",
    description: "بناء الثقة في البوصلة الفطرية.",
    steps: [
      "اتخذ قرارًا يوميًا صغيرًا بالإحساس الأول",
      "لا تتراجع ولا تحلل بعد القرار",
      "سجّل النتيجة لاحقًا",
    ],
  },
  {
    key: "emotional-release",
    name: "تفريغ العمق",
    force: "emotion",
    duration: "10–20 دقيقة",
    description: "إخراج العاطفة بوعي قبل أن تتراكم وتنفجر.",
    steps: [
      "اختر قناة: كتابة / صوت / رياضة / صمت",
      "افتح القناة دون رقابة ذهنية",
      "اغلق الجلسة بنفس عميق وصمت دقيقة",
    ],
  },
  {
    key: "deep-work",
    name: "العمل العميق",
    force: "intellect",
    duration: "90 دقيقة",
    description: "جلسة تركيز مغلقة لخدمة المشروع الأهم.",
    steps: [
      "أغلق كل المشتتات",
      "حدد مخرجًا واحدًا لهذه الجلسة",
      "اعمل 90 دقيقة بلا توقف",
      "سجّل المخرج عند الانتهاء",
    ],
  },
  {
    key: "deliberate-resistance",
    name: "المقاومة المتعمدة",
    force: "instinct",
    duration: "فوري",
    description:
      "كسر منطقة الراحة عمدًا لترويض كلب الكسل والرغبة في الراحة. تُعلِّم الغرائز أن الإرادة هي القائد.",
    steps: [
      "حدد الرغبة الغريزية في الراحة أو التأجيل",
      "افعل العكس تمامًا: دش بارد، تمرين شاق، أو مهمة ثقيلة",
      "راقب الغريزة وهي تخضع لسيطرتك",
    ],
  },
  {
    key: "morning-protocol",
    name: "بروتوكول الصباح",
    force: "intuition",
    duration: "10 دقائق",
    description:
      "معايرة البوصلة الداخلية في بداية اليوم. صمت رقمي يزيل الضوضاء ويُعيد الاتصال بالحدس الفطري.",
    steps: [
      "صمت رقمي كامل: لا هاتف، لا شاشات",
      "اسأل سؤال البوصلة: «ما الأولوية القصوى اليوم؟»",
      "التزم بالخيار الأول دون تحليل أو تردد",
    ],
  },
];

export const WEEKLY_SCHEDULE: WeeklySchedule[] = [
  {
    dayType: "warrior",
    name: "يوم المحارب — الأحد",
    focus: "ترويض الغرائز وتنفيذ المهام الثقيلة",
    tasks: [
      "تمرين المحارب: تنفيذ مهمة ثقيلة يومياً (دش بارد، رياضة شاقة، إنهاء ملف مؤجل)",
      "قاعدة الـ 10 دقائق: منع أي رد فعل غاضب أو مندفع قبل مرور 10 دقائق",
      "تسمية كل «كلب» يظهر خلال اليوم",
    ],
    forcesFocus: ["will", "instinct"],
  },
  {
    dayType: "warrior",
    name: "يوم المحارب — الاثنين",
    focus: "العمل العميق والإنجاز المركّز",
    tasks: [
      "جلسة عمل عميق 90 دقيقة على المشروع الأهم",
      "قاعدة الـ 5 ثوانٍ على كل مهمة فيها مقاومة",
      "تفريغ مسائي 10 دقائق (كتابة أو رياضة)",
    ],
    forcesFocus: ["will", "intellect"],
  },
  {
    dayType: "warrior",
    name: "يوم المحارب — الثلاثاء",
    focus: "المناورة الذهنية وحل المشكلات",
    tasks: [
      "تمرين البدائل الثلاثة لأكبر تحدٍ اليوم",
      "بروتوكول الصباح: صمت رقمي + سؤال البوصلة",
      "منع الاندفاع في القرارات الاجتماعية",
    ],
    forcesFocus: ["intellect", "intuition"],
  },
  {
    dayType: "warrior",
    name: "يوم المحارب — الأربعاء",
    focus: "التحمل والمقاومة المتعمدة",
    tasks: [
      "المقاومة المتعمدة: كسر الراحة بفعل شاق عند أول كسل",
      "جلسة عمل عميق ثانية 60 دقيقة",
      "رصد أي غريزة سيطرت وتحليل كيف تمت مواجهتها",
    ],
    forcesFocus: ["instinct", "will"],
  },
  {
    dayType: "warrior",
    name: "يوم المحارب — الخميس",
    focus: "الحسم وإنهاء الملفات المعلقة",
    tasks: [
      "إنهاء 3 مهام مؤجلة بالكامل قبل نهاية اليوم",
      "دورة قرار كاملة على أهم قضية معلقة",
      "تفريغ عاطفي مكثف مسائي (كتابة حرة 15 دقيقة)",
    ],
    forcesFocus: ["will", "emotion"],
  },
  {
    dayType: "leader",
    name: "يوم القائد — الجمعة",
    focus: "التفاعل الاجتماعي والحضور الواعي",
    tasks: [
      "تركيز على التفاعل الاجتماعي وممارسة الحضور الواعي",
      "اتخاذ قرارات واضحة دون تبرير أو شرح مطول",
      "قراءة دوافع الآخرين بالحدس وتسجيل الملاحظات",
    ],
    forcesFocus: ["intuition", "will", "intellect"],
  },
  {
    dayType: "sage",
    name: "يوم الروحي — السبت",
    focus: "صيانة العمق وإعادة شحن المنظومة",
    tasks: [
      "15 دقيقة صمت تام بلا مشتتات",
      "تفريغ عاطفي مكثف: كتابة حرة أو مشي طويل منفرد",
      "مراجعة إحداثيات البوصلة الداخلية وتقييم الأسبوع",
    ],
    forcesFocus: ["emotion", "intuition"],
  },
];

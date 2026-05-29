(function () {
  const characters = window.DAL_CHARACTERS || [];
  const games = window.DAL_GAMES || {};
  if (!characters.length) return;

  const params = new URLSearchParams(window.location.search);
  const pageType = document.body?.dataset?.page || "home";
  const toast = document.getElementById("toast");
  const storyScores = {};
  const storageKeys = {
    gachaUnlocks: "dal_gacha_unlocks",
    musicTheme: "dal_settings_music_theme",
    volume: "dal_settings_volume",
    mode: "dal_settings_mode",
    language: "dal_settings_language"
  };
  const defaultSettings = {
    musicTheme: "silly-game",
    volume: 68,
    mode: "day",
    language: "zh"
  };
  const supportedLanguages = ["zh", "en", "ja"];
  const musicThemeMeta = {
    mute: {
      label: "静音",
      description: "把这一页留给对白、画面和你自己的节奏。",
      i18n: {
        zh: { label: "静音", description: "把这一页留给对白、画面和你自己的节奏。" },
        en: { label: "Mute", description: "Leave the page to the dialogue, the visuals, and your own pace." },
        ja: { label: "消音", description: "台词と画面、それから自分のペースを静かに味わえる設定です。" }
      }
    },
    "silly-game": {
      label: "Silly Game",
      description: "轻快又带点俏皮感，适合从首页一路慢慢逛下去。",
      artist: "Go Sakabe",
      file: "assets/bgm/silly-game.mp3",
      i18n: {
        zh: { label: "Silly Game", description: "轻快又带点俏皮感，适合从首页一路慢慢逛下去。" },
        en: { label: "Silly Game", description: "Light and playful, perfect for wandering through the site at an easy pace." },
        ja: { label: "Silly Game", description: "軽やかで少しいたずらっぽく、サイトをのんびり巡る時にちょうどいい一曲です。" }
      }
    },
    "dal-nap": {
      label: "D.A.L.Nap",
      description: "更松弛一点，适合停在档案页和剧情页慢慢看。",
      artist: "Go Sakabe",
      file: "assets/bgm/dal-nap.mp3",
      i18n: {
        zh: { label: "D.A.L.Nap", description: "更松弛一点，适合停在档案页和剧情页慢慢看。" },
        en: { label: "D.A.L.Nap", description: "Softer and calmer, a better match for the archive and story pages." },
        ja: { label: "D.A.L.Nap", description: "少し肩の力が抜けた雰囲気で、資料ページや物語ページをじっくり眺めたい時に合います。" }
      }
    },
    seirei: {
      label: "Seirei",
      description: "精灵气息会更浓一些，拿来看剧情和设定很合适。",
      artist: "Go Sakabe",
      file: "assets/bgm/seirei.mp3",
      i18n: {
        zh: { label: "Seirei", description: "精灵气息会更浓一些，拿来看剧情和设定很合适。" },
        en: { label: "Seirei", description: "The Spirit atmosphere is stronger here, making it great for lore and story reading." },
        ja: { label: "Seirei", description: "精霊らしさがいっそう際立つので、設定や物語を追う時間によく似合います。" }
      }
    }
  };
  const settingsLocaleMeta = {
    zh: {
      languageOptions: {
        zh: { short: "ZH", long: "简体中文" },
        en: { short: "EN", long: "英语" },
        ja: { short: "JA", long: "日语" }
      },
      openSettingsAria: "打开设置中心",
      closeSettingsAria: "关闭设置",
      volumeAria: "背景音乐音量",
      modeToggleAria: "切换白天黑夜模式"
    },
    en: {
      languageOptions: {
        zh: { short: "ZH", long: "Simplified Chinese" },
        en: { short: "EN", long: "English" },
        ja: { short: "JA", long: "Japanese" }
      },
      openSettingsAria: "Open page settings",
      closeSettingsAria: "Close settings",
      volumeAria: "Background music volume",
      modeToggleAria: "Toggle day and night mode"
    },
    ja: {
      languageOptions: {
        zh: { short: "ZH", long: "簡体字中国語" },
        en: { short: "EN", long: "英語" },
        ja: { short: "JA", long: "日本語" }
      },
      openSettingsAria: "設定を開く",
      closeSettingsAria: "設定を閉じる",
      volumeAria: "BGM の音量",
      modeToggleAria: "昼夜モードを切り替える"
    }
  };
  const authorProfile = {
    gif: "assets/author/kkk.gif",
    name: "KurumiOvO",
    label: {
      zh: "一个为爱发电的约战小网站喵",
      en: "A small DATE A LIVE fan site built purely out of love for the series.",
      ja: "作品愛だけで作った、小さな『デート・ア・ライブ』ファンサイトです。"
    },
    detail: {
      zh: "这也是我第一次认真把喜欢的作品做成完整网页。",
      en: "It is also my first time turning something I truly love into a complete website.",
      ja: "好きな作品をきちんと一つのサイトとして形にしたのは、これが初めてです。"
    },
    note: {
      zh: "如果你也喜欢约战，或者有想补充的内容，欢迎来找我聊天。",
      en: "If you love DATE A LIVE too, or you want to suggest something, feel free to reach out.",
      ja: "約戦が好きな方も、追加してほしい内容がある方も、気軽に声をかけてください。"
    },
    contact: {
      zh: "联系：QQ 3090337499（北念）",
      en: "Contact: QQ 3090337499 (Beinian)",
      ja: "連絡先：QQ 3090337499（北念）"
    }
  };
  const resultFigureMap = {
    tohka: "assets/character-bg/official-tohka.png",
    origami: "assets/character-bg/official-origami.png",
    kotori: "assets/character-bg/official-kotori.png",
    yoshino: "assets/character-bg/official-yoshino.png",
    kurumi: "assets/character-bg/official-kurumi.png",
    kaguya: "assets/character-bg/official-kaguya.png",
    yuzuru: "assets/character-bg/official-yuzuru.png",
    miku: "assets/character-bg/official-miku.png",
    nia: "assets/character-bg/official-nia.png",
    natsumi: "assets/character-bg/official-natsumi.png",
    mukuro: "assets/character-bg/official-mukuro.png",
    mio: "assets/character-bg/official-mio.png"
  };
  const gachaArt = {
    deckPool: "assets/card-flip/deck-pool.png",
    singleBack: "assets/card-flip/card-back-single.png"
  };
  const gachaCharacterCopy = {
    tohka: {
      role: { en: "Sword Princess", ja: "剣の姫" },
      line: {
        en: "If it's with you, I don't mind seeing what waits beyond this card.",
        ja: "あなたと一緒なら、この一枚の先にあるものもきっと怖くありません。"
      }
    },
    kurumi: {
      role: { en: "Nightmare of Time", ja: "時の悪夢" },
      line: {
        en: "The sand in the hourglass has already begun to fall. Shall we watch the ending together?",
        ja: "砂時計はもう傾いていますわ。一緒にその結末を見届けてみませんか。"
      }
    },
    yoshino: {
      role: { en: "Snow Hermit", ja: "氷雪の隠者" },
      line: {
        en: "If you stay beside me, I think I can keep moving forward a little longer.",
        ja: "そばにいてくれるなら、もう少しだけ前に進める気がします。"
      }
    },
    origami: {
      role: { en: "Tactical Angel", ja: "戦術天使" },
      line: {
        en: "Target confirmed. From here on, I will remain with you until the end of the operation.",
        ja: "対象を確認しました。ここから先は、最後まであなたの傍で任務を続けます。"
      }
    },
    kotori: {
      role: { en: "Flame Commander", ja: "炎の司令官" },
      line: {
        en: "Don't lose focus. I already prepared the next move for the two of us.",
        ja: "ぼんやりしないで。次の一手なら、もう私がちゃんと用意してあるわ。"
      }
    },
    kaguya: {
      role: { en: "Yamai Twin: Kaguya", ja: "八舞姉妹・耶倶矢" },
      line: {
        en: "Behold. The wind itself has chosen this moment for my triumphant arrival.",
        ja: "見よ。この瞬間こそ、疾風が妾身を選び取った勝利の舞台である。"
      }
    },
    yuzuru: {
      role: { en: "Yamai Twin: Yuzuru", ja: "八舞姉妹・夕弦" },
      line: {
        en: "Correction. This reunion is more important than any hollow argument about victory.",
        ja: "訂正。この再会は、勝敗を語るよりもずっと大切です。"
      }
    },
    miku: {
      role: { en: "Diva of Dominion", ja: "支配の歌姫" },
      line: {
        en: "If you reached this card, then tonight's stage belongs to both of us.",
        ja: "このカードまで届いたのなら、今夜のステージはもう二人のものですわ。"
      }
    },
    nia: {
      role: { en: "All-Knowing Mangaka", ja: "全知の漫画家" },
      line: {
        en: "A fresh page has opened. Want me to show you the part of the story hidden from everyone else?",
        ja: "新しいページが開きましたよ。みんなにはまだ見えていない続きを覗いてみますか。"
      }
    },
    natsumi: {
      role: { en: "Shifting Witch", ja: "変身の魔女" },
      line: {
        en: "Even if I stop pretending for a moment, would you still choose this version of me?",
        ja: "少しだけ飾らない私になっても、それでも選んでくれますか。"
      }
    },
    mukuro: {
      role: { en: "Key of Sealing", ja: "封解の鍵" },
      line: {
        en: "If you call for me, I can open even the lock I once placed around my own heart.",
        ja: "あなたが呼んでくれるのなら、閉ざしていた心の鍵も解いてみせます。"
      }
    },
    mio: {
      role: { en: "Spirit of Origin", ja: "始源の精霊" },
      line: {
        en: "Every story begins with an encounter. Perhaps this card is where ours starts again.",
        ja: "すべての物語は出会いから始まります。この一枚が、その始まりになればいいですね。"
      }
    }
  };
  const characterLocaleMeta = {
    kurumi: {
      name: { en: "Kurumi Tokisaki", ja: "時崎狂三" },
      profile: {
        en: "Elegant on the surface and ruthless in motion, Kurumi bends clones, bait, and time gaps to control the battlefield while never letting go of her wish to return to the beginning.",
        ja: "優雅に振る舞いながらも決断は苛烈で、分身や誘導、時間差を駆使して戦場を支配します。その根底には、すべてが始まる前へ戻りたいという願いがあります。"
      },
      summary: {
        en: "Kurumi is one of the most overwhelming and mysterious Spirits in DATE A LIVE, famous for her black-and-crimson Gothic design and clockwork arsenal.",
        ja: "狂三は『デート・ア・ライブ』でも屈指の圧迫感と神秘性を持つ精霊で、黒と紅のゴシック霊装や時計を思わせる武装で知られています。"
      },
      detail: {
        en: "She first appears as a near-pure villain, but the story gradually reveals both her tragic origin and the ironclad conviction behind her actions.",
        ja: "初登場時はほとんど完全な敵役に見えますが、物語が進むにつれてその悲劇的な背景と揺るがない信念が少しずつ明らかになります。"
      },
      theme: { en: "Lavish, shadowed, and ruled by time.", ja: "絢爛、影、そして時間の気配。" },
      mood: { en: "Elegant · Dangerous", ja: "優雅・危険" }
    },
    tohka: {
      name: { en: "Tohka Yatogami", ja: "夜刀神十香" },
      profile: {
        en: "Tohka begins learning the world from the moment she meets Shido, carrying a bright, direct heart and an instinct to protect what matters to her.",
        ja: "十香は士道と出会った瞬間から世界を学び始めたような少女で、まっすぐで熱く、大切なものを守ろうとする本能を強く持っています。"
      },
      summary: {
        en: "As the series' first heroine, Tohka embodies both the disaster of a Spirit and the ordinary wish to live like a normal girl.",
        ja: "作品最初のヒロインである十香は、精霊という災厄性と普通の少女として生きたい願いを同時に背負っています。"
      },
      detail: {
        en: "That balance gives her both the clarity of a classic heroine and the weight of the story's deepest truth about origin and destiny.",
        ja: "その両面性が、王道ヒロインらしい明るさと、起源や運命に関わる主線の重みを同時に十香へ与えています。"
      },
      theme: { en: "Passionate, radiant, and protective.", ja: "情熱、輝き、守護。" },
      mood: { en: "Straightforward · Fiery", ja: "率直・情熱的" }
    },
    yoshino: {
      name: { en: "Yoshino", ja: "四糸乃" },
      profile: {
        en: "Gentle and painfully shy, Yoshino struggles to speak for herself at first and relies on Yoshinon until trust slowly teaches her to use her own voice.",
        ja: "穏やかでとても臆病な四糸乃は、最初は自分の気持ちをうまく言葉にできず、四糸奈を通して少しずつ本音を伝えられるようになります。"
      },
      summary: {
        en: "Yoshino represents the softest kind of growth in the series, built not on spectacle but on learning to trust and speak.",
        ja: "四糸乃はこの作品の中でもっとも柔らかな成長を担う存在で、派手さではなく信頼と自己表現の積み重ねで魅力を放ちます。"
      },
      detail: {
        en: "Her story becomes moving precisely because every small step forward feels earned and deeply personal.",
        ja: "一歩ずつ進むたびにその前進がちゃんと意味を持つからこそ、四糸乃の物語はとても繊細で心に残るものになります。"
      },
      theme: { en: "Soft, crystalline, and healing.", ja: "やわらかさ、氷晶、癒やし。" },
      mood: { en: "Shy · Gentle", ja: "恥ずかしがり・可憐" }
    },
    origami: {
      name: { en: "Origami Tobiichi", ja: "鳶一折紙" },
      profile: {
        en: "Quiet, analytical, and relentless, Origami throws herself at every chosen goal with almost frightening focus, whether as a soldier or as a Spirit.",
        ja: "寡黙で理性的、そして執念深い折紙は、兵士としても精霊としても、自分が定めた目標へ恐ろしいほど真っ直ぐに突き進みます。"
      },
      summary: {
        en: "Origami's appeal lies in contrast: a tactical prodigy with almost mechanical calm, yet one of the most emotionally direct girls in the cast.",
        ja: "折紙の魅力は反差にあります。機械のように冷静な戦術家でありながら、感情表現だけは作品でも屈指に真っ直ぐです。"
      },
      detail: {
        en: "Her arc turns the series toward trauma, paradox, and self-recognition more sharply than almost any other route.",
        ja: "折紙の物語は、作品をトラウマ、パラドックス、自己認識の領域へと一気に押し進める重要な転換点でもあります。"
      },
      theme: { en: "Restrained, precise, and mission-driven.", ja: "抑制、精密、遂行。" },
      mood: { en: "Calm · Focused", ja: "冷静・集中" }
    },
    kotori: {
      name: { en: "Kotori Itsuka", ja: "五河琴里" },
      profile: {
        en: "Kotori shifts almost seamlessly between little sister, commander, and Spirit, hiding a huge tactical burden behind a young face.",
        ja: "琴里は妹、司令官、精霊という三つの顔をほとんど隙なく切り替えながら、幼い見た目の裏で大きな責任を背負っています。"
      },
      summary: {
        en: "Few characters capture DATE A LIVE's mix of everyday warmth and battlefield tension as well as Kotori does.",
        ja: "日常の温度と戦場の緊張感をこれほど鮮やかに同居させるキャラクターは、作品の中でも琴里が際立っています。"
      },
      detail: {
        en: "She can tease Shido one moment and command an operation the next, making her one of the series' strongest bridges between home and war.",
        ja: "ついさっきまで士道と軽口を交わしていたかと思えば、次の瞬間には艦橋で冷静な指示を飛ばす。その落差が琴里の強さです。"
      },
      theme: { en: "Command, flame, and sharp contrast.", ja: "司令、烈火、反差。" },
      mood: { en: "Dual-sided · Reliable", ja: "二面性・頼もしさ" }
    },
    kaguya: {
      name: { en: "Kaguya Yamai", ja: "八舞耶倶矢" },
      profile: {
        en: "Kaguya speaks with theatrical grandeur and loves dramatic entrances, yet underneath the flair she is sensitive to rivalry, loneliness, and recognition.",
        ja: "大仰な言葉と派手な登場を好む耶倶矢ですが、その奥では競い合うこと、孤独でいること、認められたい気持ちにとても敏感です。"
      },
      summary: {
        en: "Her chuunibyou bravado gives the Yamai twins energy, but her real charm comes from the vulnerability hidden beneath all that confidence.",
        ja: "中二病めいた大げささが八舞姉妹に勢いを与えていますが、本当の魅力はその自信の下に隠れた不安や繊細さにあります。"
      },
      detail: {
        en: "The more she opens up, the more her need to stand beside Yuzuru as an equal becomes clear.",
        ja: "物語が進むほど、夕弦と対等な存在として並び立ちたいという耶倶矢の願いがはっきり見えてきます。"
      },
      theme: { en: "Storm, drama, and showmanship.", ja: "嵐、演出、華やかさ。" },
      mood: { en: "Proud · Dramatic", ja: "誇り高い・劇的" }
    },
    yuzuru: {
      name: { en: "Yuzuru Yamai", ja: "八舞夕弦" },
      profile: {
        en: "Yuzuru's clipped speech and quiet expression hide a deep loyalty, and she often says the gentlest thing in the bluntest possible way.",
        ja: "短く区切る独特の話し方と無表情の裏で、夕弦はとても深い思いやりと忠誠心を抱えています。"
      },
      summary: {
        en: "She balances Kaguya's intensity with calm precision, giving the Yamai twins their emotional symmetry.",
        ja: "耶倶矢の勢いに対して夕弦は静かな精密さで応え、八舞姉妹の感情的な釣り合いを作っています。"
      },
      detail: {
        en: "Her quiet sincerity is what turns the twins from a gimmick into one of the series' most lovable pairs.",
        ja: "夕弦の静かな誠実さがあるからこそ、八舞姉妹は単なるネタ役ではなく、心から愛される名コンビになっています。"
      },
      theme: { en: "Stillness, wind, and balance.", ja: "静けさ、風、均衡。" },
      mood: { en: "Cool · Steady", ja: "静穏・安定" }
    },
    miku: {
      name: { en: "Miku Izayoi", ja: "誘宵美九" },
      profile: {
        en: "Miku is dazzling, proud, and deeply shaped by how the world once consumed her voice, making devotion and control central to how she loves.",
        ja: "眩しいほど華やかな美九は、かつて自分の声が世界に消費された経験を強く抱えていて、愛し方にも独占と執着が色濃く現れます。"
      },
      summary: {
        en: "Her route takes the series into celebrity, manipulation, and emotional dependence, all filtered through the power of song.",
        ja: "美九の物語は、歌の力を通して名声、支配、依存といったテーマを作品の中心へ連れてきます。"
      },
      detail: {
        en: "Once she feels safe again, her affection turns from performance into something much softer and more earnest.",
        ja: "安心できる居場所を見つけたあとの美九は、舞台の演出ではない、ずっと柔らかく真っ直ぐな好意を見せるようになります。"
      },
      theme: { en: "Stage lights, control, and vulnerability.", ja: "舞台、支配、脆さ。" },
      mood: { en: "Radiant · Possessive", ja: "華やか・独占的" }
    },
    nia: {
      name: { en: "Nia Honjo", ja: "本条二亜" },
      profile: {
        en: "Playful, talkative, and endlessly creative, Nia hides loneliness behind her otaku humor while treating stories as the one thing that can still save people.",
        ja: "軽妙なおしゃべりとオタク気質で場を回す二亜ですが、その背後には強い孤独と、物語だけが人を救えるという信念があります。"
      },
      summary: {
        en: "Nia expands the series through creation itself, turning manga, records, and authorial perspective into core parts of the plot.",
        ja: "二亜は創作そのものを物語の主題へ引き込み、漫画、記録、作者視点といった要素を作品の核にまで押し上げます。"
      },
      detail: {
        en: "Her self-aware humor makes her easy to love, but what keeps her memorable is how seriously she believes in stories.",
        ja: "セルフツッコミ混じりの軽さで親しみやすい一方、物語の力を本気で信じているところが二亜を特別な存在にしています。"
      },
      theme: { en: "Ink, records, and playful imagination.", ja: "インク、記録、想像力。" },
      mood: { en: "Cheerful · Insightful", ja: "陽気・洞察的" }
    },
    natsumi: {
      name: { en: "Natsumi", ja: "七罪" },
      profile: {
        en: "Natsumi relies on transformation because she fears being seen as her true self, turning insecurity into the core of both her power and her pain.",
        ja: "七罪は本当の自分を見られることを恐れるあまり、変身という力に逃げ込んでおり、その不安こそが彼女の力と痛みの中心になっています。"
      },
      summary: {
        en: "Her arc is one of the clearest portraits of self-loathing in the series, and that honesty gives it lasting weight.",
        ja: "七罪の物語は、この作品でもっとも率直に自己嫌悪を描いたルートの一つであり、その正直さが強い余韻を残します。"
      },
      detail: {
        en: "What makes her growth matter is not becoming stronger, but daring to remain herself in front of someone else.",
        ja: "七罪の成長で本当に大事なのは強くなることではなく、誰かの前で自分のままでいようと決めることです。"
      },
      theme: { en: "Masks, doubt, and hidden tenderness.", ja: "仮面、不安、秘めた優しさ。" },
      mood: { en: "Guarded · Fragile", ja: "防御的・繊細" }
    },
    mukuro: {
      name: { en: "Mukuro Hoshimiya", ja: "星宮六喰" },
      profile: {
        en: "Mukuro seals away both the outside world and her own heart, speaking with distance until trust finally convinces her to open either lock.",
        ja: "六喰は外の世界だけでなく自分の心まで閉ざしてしまっていて、信頼できる相手が現れるまでは誰にも近づこうとしません。"
      },
      summary: {
        en: "Her presence brings the language of locks, keys, and isolation into the series in a way that feels both elegant and painful.",
        ja: "六喰の登場によって、鍵、封印、孤立というモチーフが作品の中に気高くも切ない形で持ち込まれます。"
      },
      detail: {
        en: "Once she chooses connection, the same girl who shut everything out becomes fiercely sincere in how she holds on to someone.",
        ja: "いったん誰かとの繋がりを選んだ六喰は、すべてを閉ざしていた頃とは反対に、とても真っ直ぐで強い執着を見せるようになります。"
      },
      theme: { en: "Locks, solitude, and devotion.", ja: "封印、孤独、執着。" },
      mood: { en: "Distant · Devoted", ja: "隔絶・一途" }
    },
    mio: {
      name: { en: "Mio Takamiya", ja: "崇宮澪" },
      profile: {
        en: "Mio stands at the origin of the entire story, carrying the tenderness of a beginning and the devastation of everything that followed from it.",
        ja: "澪は物語そのものの始点に立つ存在であり、すべての優しさの源であると同時に、その後に続く悲劇の根でもあります。"
      },
      summary: {
        en: "More than any other character, Mio reframes DATE A LIVE as a tragedy about love, creation, and impossible restoration.",
        ja: "澪という存在は『デート・ア・ライブ』を、恋と創造、そして取り戻せないものを巡る悲劇として決定づけています。"
      },
      detail: {
        en: "Every answer in the later story eventually bends back toward her, because she is both the miracle everyone needed and the wound no one could escape.",
        ja: "後半のあらゆる答えが最終的に澪へと帰っていくのは、彼女が誰もが求めた奇跡であると同時に、誰も逃れられない傷でもあるからです。"
      },
      theme: { en: "Origin, grief, and quiet divinity.", ja: "始源、喪失、静かな神性。" },
      mood: { en: "Still · Absolute", ja: "静謐・絶対" }
    }
  };
  const characterDetailLocaleMeta = {
    kurumi: {
      favoriteFood: {
        en: "Likes small animals; despises human hypocrisy and indifference",
        ja: "小動物が好き。人間の偽善と冷淡さを嫌う"
      },
      abilityDetail: {
        en: "Zafkiel is a time-based Angel built around numbered bullets, covering acceleration, rewind, foresight, stasis, and clone creation, making it one of the hardest powers to confront head-on.",
        ja: "刻々帝は『数字の弾丸』を軸にした時間系能力で、加速、逆行、未来視、停止、分身生成まで扱える、真正面から対処しにくい天使です。"
      },
      astralNote: {
        en: "Her dress centers on a black-and-crimson Gothic silhouette with clockwork motifs, flintlock pistols, and a predatory vampire-like elegance.",
        ja: "霊装は黒と紅のゴシックドレスを基調に、時計意匠、燧石銃、吸血鬼めいた危うい美しさをまとっています。"
      },
      personality: {
        en: ["Dangerous yet elegant", "Master strategist", "Deeply obsessive", "Hides her true heart well"],
        ja: ["危うくも優雅", "策に長ける", "執念が深い", "本心を隠すのがうまい"]
      },
      formsDetailed: {
        en: [
          { name: "Standard Astral Dress", type: "Astral Dress: Third", detail: "The black-and-crimson Gothic gown and twin guns form Kurumi's most iconic battle silhouette." },
          { name: "Territory Unleashed", type: "City of Devouring Time", detail: "A giant clockwork field that drains surrounding time to fuel the many bullets of Zafkiel." },
          { name: "Clone Tactics", type: "Temporal Duplicate", detail: "She summons versions of herself from past points in time to scout, encircle, and feint." }
        ],
        ja: [
          { name: "通常霊装", type: "神威霊装・参番", detail: "黒と紅のゴシックドレスと二丁拳銃が、狂三を象徴する戦闘姿です。" },
          { name: "領域展開", type: "食時の城", detail: "巨大な時計結界で周囲の時間を吸い上げ、刻々帝の弾丸へ霊力を供給します。" },
          { name: "分身戦術", type: "時間複製体", detail: "過去の時点の自分を呼び出し、偵察、包囲、陽動を同時に進めます。" }
        ]
      },
      storyFocus: {
        en: [
          { title: "The earliest overwhelming threat", detail: "Kurumi's debut instantly raised the danger level and made Shido and Ratatoskr face a Spirit who could not be won over easily." },
          { title: "Her motive is not simple bloodlust", detail: "As the truth unfolds, her actions keep pointing toward the Origin Spirit and past disasters, proving her cruelty serves a purpose." },
          { title: "A key variable in the endgame", detail: "Whether against DEM or while approaching Mio's truth, Kurumi repeatedly becomes the factor that changes the board." }
        ],
        ja: [
          { title: "序盤最大級の脅威", detail: "狂三の登場は物語の危険度を一気に引き上げ、士道と Ratatoskr に『容易には攻略できない精霊』を突きつけました。" },
          { title: "動機は単なる殺意ではない", detail: "真相が明らかになるほど、彼女の行動は始源の精霊と過去の災厄へ収束し、その残酷さが明確な目的に裏打ちされていると分かります。" },
          { title: "終局を動かす重要変数", detail: "DEM との対立でも、澪の真実へ迫る局面でも、狂三は何度も盤面を書き換える鍵になっています。" }
        ]
      },
      relationships: {
        en: [
          "Her bond with Shido mixes manipulation, testing, and trust, making them one of the most charged pairings in the series.",
          "She is obsessed with the Origin Spirit and the truth behind the old spacequakes; that obsession drives every move she makes.",
          "Date A Bullet further expands her branch of the world through her clones, the White Queen, and the wars of the Neighboring World."
        ],
        ja: [
          "士道との関係は、利用、試探、信頼が複雑に入り混じったもので、作中でも屈指の緊張感を持つ組み合わせです。",
          "始源の精霊と過去の空間震の真相に対する執着が、彼女のあらゆる行動の出発点になっています。",
          "『デート・ア・バレット』では、分身体、白の女王、隣界の戦場を通して、狂三の世界がさらに掘り下げられます。"
        ]
      },
      trivia: {
        en: [
          "Her left eye becomes a clock face, one of the clearest visual signs that Zafkiel is active.",
          "Kurumi is frightening not because of one move, but because intelligence gaps, time gaps, and mind games stack at once.",
          "In the main story she is both a formidable enemy and one of the first people to get close to the world's truth."
        ],
        ja: [
          "左目に時計盤が現れる演出は、刻々帝発動時を示す代表的なビジュアルです。",
          "狂三が恐ろしいのは単一の戦法ではなく、情報差、時間差、心理戦が同時に重なることにあります。",
          "本編では強敵であると同時に、世界の真相へもっとも早く迫った一人でもあります。"
        ]
      }
    },
    tohka: {
      favoriteFood: {
        en: "Likes kinako bread; hates injections",
        ja: "きなこパンが好き。注射が苦手"
      },
      abilityDetail: {
        en: "Sandalphon can manifest as a greatsword, a throne, and radiant blades, giving Tohka overwhelming melee power with the aura of a monarch.",
        ja: "鏖殺公は大剣、玉座、光刃へと姿を変え、王者の威圧感と圧倒的な近接火力を同時に備えています。"
      },
      astralNote: {
        en: "Her Tenth Astral Dress combines a princess-like gown and armor, colored in violet and reinforced by throne and holy sword motifs.",
        ja: "十番霊装は姫君の礼装と鎧を組み合わせた姿で、紫を基調に玉座と聖剣の意匠が重ねられています。"
      },
      personality: {
        en: ["Straightforward", "Always hungry", "Strong protective instinct", "Open with her feelings"],
        ja: ["率直", "食欲旺盛", "守りたい気持ちが強い", "感情表現がまっすぐ"]
      },
      formsDetailed: {
        en: [
          { name: "Princess Dress", type: "Astral Dress: Tenth", detail: "Tohka's classic combat form, wielding Sandalphon and regal armor for overwhelming close-range power." },
          { name: "Inversion Form", type: "Inverted Tohka", detail: "A darkened state born from total emotional collapse, far more aggressive and oppressive than usual." },
          { name: "Persona Shift", type: "Tenka", detail: "A sharper, colder personality that shares Tohka's body while changing her language, presence, and combat style." }
        ],
        ja: [
          { name: "姫の霊装", type: "神威霊装・十番", detail: "聖剣・鏖殺公と王座の鎧を携えた、十香を代表する近接戦闘形態です。" },
          { name: "反転形態", type: "反転十香", detail: "感情が完全に崩壊した末に生まれる黒化姿で、通常時を大きく上回る攻撃性を見せます。" },
          { name: "人格切替", type: "天香 / Tenka", detail: "十香と同じ身体を持ちながら、言葉遣いも気配も戦い方もより冷烈になる別人格です." }
        ]
      },
      storyFocus: {
        en: [
          { title: "The beginning of the story", detail: "Shido meeting Tohka turns the idea of sealing Spirits through dates into the central line of the series." },
          { title: "The shock of inversion", detail: "Tohka's inversion is one of the clearest emotional detonations in the franchise, tying a sweet heroine directly to catastrophe." },
          { title: "The heart of the truth", detail: "Her existence is deeply bound to Mio and to the idea of a life that was created, placing her at the center of the final emotional conflict." }
        ],
        ja: [
          { title: "物語の始点", detail: "士道と十香の出会いによって、『デートで精霊を封印する』という作品の主線が本格的に動き出します。" },
          { title: "反転の衝撃", detail: "十香の反転は作品屈指の感情爆発であり、甘いヒロイン像をそのまま主線級の災厄へつなげました。" },
          { title: "真相の中心", detail: "澪との関係や『創られた存在』という設定により、十香は終局の感情対立の中心に立つことになります。" }
        ]
      },
      relationships: {
        en: [
          "Her bond with Shido is the most stable and central emotional axis of the series.",
          "Her inverted self, Tenka, is both her opposite and part of what defines her whole existence.",
          "She shares a deeper link with Mio than appearances suggest, one tied to birth and meaning itself."
        ],
        ja: [
          "士道との関係は、作品全体でもっとも安定し、もっとも重要な感情の主軸です。",
          "反転人格の天香は、十香と対立しながらも彼女の存在全体を形作る片割れでもあります。",
          "澪とは表面以上に深い『誕生と意味付け』の繋がりを持っています。"
        ]
      },
      trivia: {
        en: [
          "She looks like a classic straightforward heroine, but her very existence connects directly to the ending's truth.",
          "Her appetite and childlike honesty keep the world's heavy lore grounded in everyday warmth.",
          "Her battle aesthetic centers on a princess and a holy sword, which contrasts sharply with the dating premise."
        ],
        ja: [
          "王道の直球ヒロインに見えながら、その存在自体が終局の真相へ直結しています。",
          "強い食欲と子どもっぽい素直さが、重い世界観の中にも日常の温度を残しています。",
          "『姫』と『聖剣』を核にした戦闘美学は、作品タイトルの『デート』と鮮やかな対比を成します。"
        ]
      }
    },
    yoshino: {
      favoriteFood: {
        en: "Likes cute hats; is afraid of crowded places",
        ja: "かわいい帽子が好き。人の多い場所は苦手"
      },
      abilityDetail: {
        en: "Zadkiel controls a giant ice puppet and blizzards, making Yoshino unexpectedly dangerous in defense and area control.",
        ja: "氷結傀儡は巨大な氷雪の人形と吹雪を操り、防御と制圧の両面で非常に強い圧力を持つ天使です。"
      },
      astralNote: {
        en: "Her Fourth Astral Dress is defined by the green rabbit-eared raincoat, balancing fairy-tale softness with defensive imagery.",
        ja: "四番霊装の核は緑のうさ耳レインコートで、童話のような柔らかさと防御性を同時にまとっています。"
      },
      personality: {
        en: ["Shy", "Lets Yoshinon speak for her", "Emotionally delicate", "Kind-hearted"],
        ja: ["恥ずかしがり", "四糸奈に気持ちを託しがち", "感受性が細やか", "心優しい"]
      },
      formsDetailed: {
        en: [
          { name: "Raincoat Dress", type: "Astral Dress: Fourth", detail: "Her iconic green rabbit-eared raincoat makes her look harmless, even though she can shift into battle instantly." },
          { name: "Ice Manifestation", type: "Zadkiel", detail: "Through a massive ice familiar and a freezing domain, she excels at broad-area defensive control." },
          { name: "Yoshinon Support", type: "Persona Support", detail: "Yoshinon handles part of her outward expression and remains a vital emotional anchor in how she faces the world." }
        ],
        ja: [
          { name: "レインコート霊装", type: "神威霊装・四番", detail: "象徴的な緑のうさ耳レインコートは無害そうに見えて、必要な時には即座に戦闘へ切り替わります。" },
          { name: "氷雪具現", type: "氷結傀儡", detail: "巨大な氷雪の傀儡と寒冰領域で圧をかける、防御寄りでありながら広範囲を支配できる天使です。" },
          { name: "四糸奈との連携", type: "人格補助", detail: "四糸奈は外向きの表現を支え、四糸乃が世界に向き合うための大切な心の支点でもあります。" }
        ]
      },
      storyFocus: {
        en: [
          { title: "From fear to trust", detail: "At first she is terrified of both the outside world and battle, but Shido helps her gradually accept the kindness of others." },
          { title: "Learning to speak for herself", detail: "Her most meaningful growth is not combat power, but speaking in her own voice without always relying on Yoshinon." },
          { title: "A gentle emotional anchor", detail: "Within the ensemble, Yoshino is one of the best at calming tension and softening the mood." }
        ],
        ja: [
          { title: "恐れから信頼へ", detail: "当初は外の世界も戦いも極度に恐れていましたが、士道との関わりを通して他者の優しさを受け入れていきます。" },
          { title: "自分の声で話せるようになる", detail: "四糸乃の本当の成長は戦力ではなく、四糸奈に頼り切らず自分の言葉で気持ちを伝えられるようになることです。" },
          { title: "やさしい支柱", detail: "群像劇の中で、四糸乃は空気を和らげ、感情を静かに整えてくれる存在の一人です。" }
        ]
      },
      relationships: {
        en: [
          "Yoshinon is both her puppet and the voice she leans on whenever facing the outside world becomes too hard.",
          "Her bond with Shido is built on patient companionship and gentle replies, which is why she dares to take her first step.",
          "Within Ratatoskr's everyday space, Yoshino slowly finds a place where she can finally feel safe."
        ],
        ja: [
          "四糸奈は手偶であると同時に、外の世界へ向き合う時の大切な『代弁者』でもあります。",
          "士道との関係は、辛抱強い付き添いと優しい応答の積み重ねによって築かれ、彼女が最初の一歩を踏み出す理由になりました。",
          "Ratatoskr の日常空間の中で、四糸乃は少しずつ安心していられる居場所を見つけていきます。"
        ]
      },
      trivia: {
        en: [
          "She is one of the clearest healing-type Spirits in the cast, yet her ice storms are anything but gentle in battle.",
          "Her real growth is about finding her own voice, not simply becoming stronger.",
          "Because her story treats being understood with such care, her popularity has remained remarkably steady."
        ],
        ja: [
          "作中でも代表的な癒やし系精霊ですが、戦闘時の氷雪規模はまったく穏やかではありません。",
          "四糸乃の成長の本質は、強くなることよりも、自分の声で話せるようになることにあります。",
          "『理解されること』をとても丁寧に描くキャラクターであるため、安定した人気を保ち続けています。"
        ]
      }
    },
    origami: {
      favoriteFood: {
        en: "Likes gratin dishes; dislikes celery",
        ja: "グラタン料理が好き。セロリは苦手"
      },
      abilityDetail: {
        en: "Metatron is known for its radiant wings and devastating artillery, combining air superiority, extreme mobility, and long-range annihilation.",
        ja: "絶滅天使は巨大な光翼と高火力砲撃を誇り、制空、高機動、遠距離殲滅を兼ね備えています。"
      },
      astralNote: {
        en: "Her First Astral Dress resembles a pure white bridal gown, echoing both her codename Angel and her shattered childhood image of happiness.",
        ja: "一番霊装は純白の花嫁衣装にも似ており、『天使』の代号だけでなく、彼女が抱いていた幸福な家庭像の残響も映しています。"
      },
      personality: {
        en: ["Highly decisive", "Calm and analytical", "Direct with feelings", "Obsessive by nature"],
        ja: ["行動力が高い", "冷静で理性的", "感情表現は直球", "執着が深い"]
      },
      formsDetailed: {
        en: [
          { name: "AST Operative", type: "Realizer Combat Gear", detail: "Her early mechanical anti-Spirit loadout showcases her elite soldier training and tactical awareness." },
          { name: "Angel Dress", type: "Astral Dress: First", detail: "A pure white ceremonial outfit with vast light wings that gives her a sacred and overwhelming ranged presence." },
          { name: "Inverted State", type: "Corrupted Origami", detail: "An extreme form born from emotional collapse and timeline shock, amplifying both aggression and scale of destruction." }
        ],
        ja: [
          { name: "AST 隊員", type: "顕現装置戦闘形態", detail: "序盤では対精霊特化の機械武装を用い、兵士としての高い資質と戦術眼を示します。" },
          { name: "天使の霊装", type: "神威霊装・壱番", detail: "純白の礼装と巨大な光翼が神聖さを強く印象づけ、遠距離制圧力も非常に高い姿です。" },
          { name: "反転状態", type: "悪魔化した折紙", detail: "感情崩壊と世界線の衝撃から現れた極端な姿で、攻撃性と破壊範囲が大きく増します。" }
        ]
      },
      storyFocus: {
        en: [
          { title: "Trauma as her starting point", detail: "The loss of her parents in a spacequake turns exterminating Spirits into her life's purpose and shapes all of her early choices." },
          { title: "The world turns against her", detail: "When she learns that she herself has become a Spirit, both her worldview and identity collapse at once." },
          { title: "A route into paradox", detail: "Origami's route pushes the series beyond everyday dating into deeper questions of fate, time, and self-recognition." }
        ],
        ja: [
          { title: "出発点はトラウマ", detail: "空間震で両親を失った傷が、『精霊を倒す』という人生目標を形作り、前半の行動原理を支えています。" },
          { title: "世界そのものが反転する", detail: "自分自身も精霊になっていたと知った瞬間、彼女の世界観と自己認識は同時に崩れ落ちます。" },
          { title: "悖論へ踏み込むルート", detail: "折紙の物語は、作品を日常攻略から、運命、時間、自己認識というさらに深い領域へ押し進めます。" }
        ]
      },
      relationships: {
        en: [
          "Her connection to Shido blends tactical reliance, unresolved grief, and startling emotional directness.",
          "As both an AST member and a Spirit, she stands at the conflict point between humanity and the girls she once hunted.",
          "Her past, her parents, and the altered timeline all tie her route tightly to the series' heaviest paradoxes."
        ],
        ja: [
          "士道との関係には、戦術的な依存、未解決の喪失感、そして驚くほど直線的な感情表現が同居しています。",
          "AST 隊員であり精霊でもある立場が、人間側と自ら追っていた存在の対立点へ彼女を置き続けています。",
          "両親の死と改変された時間線が、折紙の物語を作品屈指の重いパラドックスへ結び付けています。"
        ]
      },
      trivia: {
        en: [
          "She is both a cool tactical genius and one of the cast's most unexpectedly blunt romantics.",
          "Her inversion gives one of the franchise's clearest examples of grief, guilt, and self-hatred fused together.",
          "Few characters swing as hard between military precision and raw emotional exposure as Origami does."
        ],
        ja: [
          "冷静な戦術家である一方、作中でも指折りに感情表現が直球なロマンチストでもあります。",
          "彼女の反転は、悲嘆、罪悪感、自己嫌悪が結び付いた典型例として強い印象を残します。",
          "軍人的な精密さとむき出しの感情がここまで激しく同居する人物は、折紙以外にほとんどいません。"
        ]
      }
    },
    kotori: {
      favoriteFood: {
        en: "Likes Chupa Chups lollipops and spicy snacks; hates being treated like an ordinary child",
        ja: "Chupa Chups のキャンディーと辛いお菓子が好き。普通の子ども扱いされるのは嫌い"
      },
      abilityDetail: {
        en: "Camael combines scorching melee slashes, artillery-level firepower, and regeneration, making it a brutally destructive flame Angel.",
        ja: "灼爛殲鬼は高熱の斬撃、砲撃級の火力、再生能力を併せ持つ、破壊力の非常に高い炎系天使です。"
      },
      astralNote: {
        en: "Her Fifth Astral Dress reflects both commander-like sharpness and Spirit-grade violence, usually framed through black ribbons and burning motifs.",
        ja: "五番霊装は、司令官の鋭さと精霊としての暴力性を同時に映し出し、黒いリボンと烈火の意匠で印象づけられます。"
      },
      personality: {
        en: ["Dual-natured", "Reliable commander", "Sharp-tongued", "Mature beyond her age"],
        ja: ["二面性が鮮やか", "頼れる司令官", "口が鋭い", "年齢以上に大人びている"]
      },
      formsDetailed: {
        en: [
          { name: "Commander Persona", type: "Fraxinus Command Mode", detail: "Marked by the black ribbon and cold directives, this is the tactical core of Shido's rescue operations." },
          { name: "Flame Dress", type: "Astral Dress: Fifth", detail: "Once the dress unfolds, she gains crushing flame output and regeneration, turning into a ferocious close-to-mid range threat." },
          { name: "Family Face", type: "Little Sister Mode", detail: "Her softer role inside the home strengthens how important she is as family, not just as a strategist." }
        ],
        ja: [
          { name: "司令官の顔", type: "Fraxinus 指揮モード", detail: "黒リボンと冷静な指示を象徴とする、士道攻略作戦の中核です。" },
          { name: "炎の霊装", type: "神威霊装・伍番", detail: "霊装展開後は圧倒的な火力と再生能力を得て、近中距離で凶悪な戦闘力を発揮します。" },
          { name: "家族としての顔", type: "妹モード", detail: "家庭の中で見せる柔らかさが、戦術家としてだけでなく家族としての重要さをより強くします。" }
        ]
      },
      storyFocus: {
        en: [
          { title: "The switch that runs every operation", detail: "Almost every one of Shido's dates depends on Kotori and Fraxinus, making her the true control hub of the mission system." },
          { title: "Family and target overlap", detail: "The fact that Kotori herself is a Spirit is the first time the line between family and sealed target overlaps so directly." },
          { title: "Too many roles at once", detail: "She has to act as family member, commander, and fighter all at once, which forces her to mature far beyond her age." }
        ],
        ja: [
          { title: "作戦系統を動かす主電源", detail: "士道の攻略作戦のほとんどは琴里と Fraxinus の支援なしでは成り立たず、彼女は行動体系そのものの中枢にいます。" },
          { title: "家族と対象の重なり", detail: "琴里自身も精霊であるという事実が、『家族』と『攻略対象』を初めて真正面から重ね合わせました。" },
          { title: "多すぎる役割", detail: "家族、司令官、戦闘者を同時に担うことで、琴里は年齢以上の成熟を強いられています。" }
        ]
      },
      relationships: {
        en: [
          "As Shido's sister and commander, Kotori is tied to him through both family affection and operational dependence.",
          "Fraxinus and Ratatoskr function through her judgment, which gives even her casual scenes a hidden strategic weight.",
          "Her status as a Spirit means she belongs on both sides of the conflict at once."
        ],
        ja: [
          "妹であり司令官でもある立場から、琴里は士道と家族愛と作戦依存の両面で結び付いています。",
          "Fraxinus と Ratatoskr は彼女の判断を軸に動くため、日常シーンでさえ戦略的な重みを帯びています。",
          "精霊である以上、琴里は常に対立の両側へ同時に属している存在でもあります。"
        ]
      },
      trivia: {
        en: [
          "Few characters embody DATE A LIVE's mix of family comedy and battlefield command as cleanly as Kotori.",
          "Her ribbon color alone can completely change the atmosphere of a scene.",
          "Because she keeps everyone else moving, it is easy to forget how much pressure she carries alone."
        ],
        ja: [
          "日常の家族コメディと戦場の指揮官像をここまで自然に両立させるキャラクターは珍しいです。",
          "リボンの色ひとつで場の空気を大きく変えられるのも、琴里の象徴的な特徴です。",
          "常に周囲を動かしているため、彼女自身がどれほどの重圧を抱えているか見落とされがちです。"
        ]
      }
    },
    kaguya: {
      favoriteFood: {
        en: "Likes heavy metal music; hates garland chrysanthemum",
        ja: "ヘヴィメタルが好き。春菊は苦手"
      },
      abilityDetail: {
        en: "Raphael commands high-speed winds, revolving lances, and rushing mobility, with Kaguya leaning toward bold offense and theatrical pressure.",
        ja: "天際疾駆者は高速気流、回転槍刃、高機動を操り、耶倶矢側ではより攻め気の強い突進と派手な制圧へ傾きます。"
      },
      astralNote: {
        en: "Her Eighth Astral Dress shares the Yamai twins' wind motif, but Kaguya's side presents it with more flair, speed, and dramatic flair.",
        ja: "八番霊装は八舞姉妹共通の風の意匠を持ちながら、耶倶矢側ではより華やかでスピード感のある演出が強調されます。"
      },
      personality: {
        en: ["Theatrical", "Competitive", "Proud", "Cannot hide loneliness"],
        ja: ["芝居がかっている", "負けず嫌い", "誇り高い", "孤独を隠しきれない"]
      },
      formsDetailed: {
        en: [
          { name: "Twin Dress", type: "Astral Dress: Eighth", detail: "The Yamai sisters share its origin, but Kaguya expresses it through speed, direct offense, and showmanship." },
          { name: "Storm Assault", type: "Raphael", detail: "She charges through midrange with wind and lance arcs, keeping the tempo aggressive and flashy." },
          { name: "Perfect Sync", type: "Twin Resonance", detail: "When her will aligns with Yuzuru's, Kaguya's decisions become sharper and the twins' coordination rises dramatically." }
        ],
        ja: [
          { name: "双子の霊装", type: "神威霊装・八番", detail: "夕弦と同源の霊装ですが、耶倶矢側では速度、突撃、舞台映えがより前面に出ます。" },
          { name: "嵐の突撃", type: "天際疾駆者", detail: "飓風と槍刃を用いて中近距離へ切り込み、派手で攻撃的なテンポを作ります。" },
          { name: "完全同調", type: "双子共鳴", detail: "夕弦と心が噛み合うほど判断が鋭くなり、姉妹連携の完成度も大きく上がります。" }
        ]
      },
      storyFocus: {
        en: [
          { title: "Hiding fear behind pride", detail: "The Yamai arc first frames the twins as rivals who cannot both survive, so Kaguya keeps using confidence to cover her fear." },
          { title: "The louder one is often the softer one", detail: "Compared with Yuzuru, Kaguya shows her emotions more openly, which also makes her fragility easier to see." },
          { title: "Twinhood is her real role", detail: "Her value is never about standing apart from Yuzuru, but about making the idea of twins feel vivid and alive." }
        ],
        ja: [
          { title: "誇りの裏にある恐れ", detail: "八舞編前半では二人を『片方しか生き残れない』構図に置くため、耶倶矢は強気な姿勢で不安を覆い隠します。" },
          { title: "声が大きいほど柔らかい", detail: "夕弦に比べて喜怒哀楽を前面に出すぶん、耶倶矢の脆さもまた見えやすくなっています。" },
          { title: "双子であること自体が役割", detail: "彼女の価値は夕弦から切り離された単独性ではなく、『双生』をもっとも鮮やかに生きる点にあります。" }
        ]
      },
      relationships: {
        en: [
          "Her bond with Yuzuru is built on rivalry, dependence, and the refusal to imagine a world where only one remains.",
          "Shido's intervention matters because he gives the twins a way to choose each other instead of sacrifice.",
          "Kaguya's bravado often works as emotional cover for how much she treasures the person beside her."
        ],
        ja: [
          "夕弦との関係は、競争、依存、そして『片方だけが残る世界』を拒む気持ちの上に成り立っています。",
          "士道の介入が重要なのは、犠牲ではなく互いを選ぶ道を姉妹へ与えたからです。",
          "耶倶矢の大仰な振る舞いは、隣にいる相手をどれほど大切にしているかを隠すための感情の鎧でもあります。"
        ]
      },
      trivia: {
        en: [
          "Her over-the-top style is not just comic flavor; it is how she armors herself against insecurity.",
          "Without Yuzuru's balance, Kaguya's energy would feel far more unstable.",
          "The Yamai route works because Kaguya makes every emotional beat louder, brighter, and riskier."
        ],
        ja: [
          "誇張された語り口は単なるギャグではなく、不安から身を守るための鎧でもあります。",
          "夕弦という均衡役がいなければ、耶倶矢のエネルギーはもっと不安定に見えたはずです。",
          "八舞編の感情起伏を大きく、鮮やかに、危うくしている中心が耶倶矢です。"
        ]
      }
    },
    yuzuru: {
      favoriteFood: {
        en: "Likes heavy metal music; hates garland chrysanthemum",
        ja: "ヘヴィメタルが好き。春菊は苦手"
      },
      abilityDetail: {
        en: "Yuzuru uses the same Raphael but leans toward precise control, steadier judgment, and measured wind-based output.",
        ja: "同じ天際疾駆者を用いながらも、夕弦側ではより精密な制御、判断、安定した出力へ重点が置かれます。"
      },
      astralNote: {
        en: "The shared Eighth Astral Dress appears calmer on Yuzuru, emphasizing balance and control over spectacle.",
        ja: "共通の八番霊装も、夕弦側では派手さより均衡と制御を強く感じさせる見せ方になります。"
      },
      personality: {
        en: ["Composed", "Dry-witted", "Loyal", "Quietly sincere"],
        ja: ["落ち着いている", "淡々としたツッコミ", "忠実", "静かな誠実さを持つ"]
      },
      formsDetailed: {
        en: [
          { name: "Twin Dress", type: "Astral Dress: Eighth", detail: "The same twin-origin dress appears more restrained on Yuzuru, favoring control and support." },
          { name: "Measured Wind Control", type: "Raphael", detail: "She uses fewer movements to dictate tempo, turning the wind's mobility into a tactical advantage." },
          { name: "Unified Intent", type: "Twin Resonance", detail: "When she and Kaguya fully agree, Yuzuru can make the entire battle rhythm steadier and deadlier." }
        ],
        ja: [
          { name: "双子の霊装", type: "神威霊装・八番", detail: "同源の霊装でも、夕弦側ではより静かで制御寄りの性格が前に出ます。" },
          { name: "精密な風制御", type: "天際疾駆者", detail: "少ない動作で戦場のリズムを握り、風の機動力を判断優位へ変換します。" },
          { name: "意思統一", type: "双子共鳴", detail: "耶倶矢と心が一致した時、夕弦は戦闘全体のテンポをさらに安定かつ致命的なものへ整えます。" }
        ]
      },
      storyFocus: {
        en: [
          { title: "Emotion hidden under restraint", detail: "Her even tone and controlled expression make every obvious emotional shift carry extra weight." },
          { title: "The other half of the Yamai route", detail: "Kaguya ignites the feelings, but Yuzuru lands the judgment, which is why the route only works when both are seen together." },
          { title: "She wants the same thing", detail: "Her most important wish is identical to Kaguya's: she refuses a future where only one twin survives." }
        ],
        ja: [
          { title: "抑制の下にある感情", detail: "普段の声色と表情が静かなぶん、明確な感情の揺れが出た時の重みは非常に大きくなります。" },
          { title: "八舞編のもう半分", detail: "耶倶矢が感情を燃やし、夕弦が判断を着地させるからこそ、八舞編は二人そろって完成します。" },
          { title: "願いは同じ", detail: "夕弦のもっとも大切な願いも、耶倶矢と同じく『一人だけが残る形では生きたくない』というものです。" }
        ]
      },
      relationships: {
        en: [
          "Her bond with Kaguya is built on contrast, but the emotional core is that neither wants a life without the other.",
          "Shido matters because he recognizes their pain without forcing one sister to defeat the other.",
          "Yuzuru often says the gentlest truths in the bluntest language."
        ],
        ja: [
          "耶倶矢との関係は対照性の上に成り立ちながらも、その核には『相手なしでは生きたくない』という同じ感情があります。",
          "士道の存在が重要なのは、片方に勝たせるのではなく、二人の痛み自体を受け止めたからです。",
          "夕弦はもっとも優しい真実を、もっとも端的な言葉で言い切ることが多い人物です。"
        ]
      },
      trivia: {
        en: [
          "Her restrained speech style is one of the easiest ways to distinguish her from Kaguya, but also one of her strongest charms.",
          "She often appears calmer than she feels, which makes her rare open wishes hit much harder.",
          "Yuzuru turns the Yamai twins from a gimmick into a genuinely beloved pair."
        ],
        ja: [
          "簡潔に区切る話し方は耶倶矢との違いを際立たせるだけでなく、夕弦自身の大きな魅力にもなっています。",
          "感情を表に出しにくいぶん、たまに本音が見えた時の破壊力がとても大きいです。",
          "八舞姉妹を単なるネタ枠ではなく、本当に愛されるコンビへ押し上げている重要な柱が夕弦です。"
        ]
      }
    },
    miku: {
      favoriteFood: {
        en: "Loves songs and the stage; detests men",
        ja: "歌とステージが好き。男性を嫌う"
      },
      abilityDetail: {
        en: "Gabriel amplifies voice and mental domination, letting Miku command or sway large groups through song.",
        ja: "破軍歌姫は歌声と精神支配の効果を増幅し、大人数へ命令や共鳴を及ぼせる天使です。"
      },
      astralNote: {
        en: "Her Ninth Astral Dress is built like a radiant idol costume, completely dedicated to her stage authority and spotlight presence.",
        ja: "九番霊装は輝くアイドル衣装のように構成されており、舞台支配力と圧倒的な存在感のために磨き上げられています。"
      },
      personality: {
        en: ["Proud", "Stage-dominant", "Emotionally intense", "Yearns to be truly understood"],
        ja: ["高慢", "舞台支配欲が強い", "感情の振れ幅が大きい", "本当の理解を求めている"]
      },
      formsDetailed: {
        en: [
          { name: "Idol Dress", type: "Astral Dress: Ninth", detail: "A sparkling ceremonial outfit built around stage control, making it one of the most overtly idol-like Spirit forms." },
          { name: "Song Command", type: "Gabriel", detail: "Her voice can magnify commands directly, twisting group will and battlefield tempo at once." },
          { name: "Center Stage", type: "Spotlight Focus", detail: "The more the attention gathers on her, the stronger both Miku's presence and control instinct become." }
        ],
        ja: [
          { name: "アイドル霊装", type: "神威霊装・九番", detail: "きらびやかな礼装は舞台統治力のために設計されており、作中でも屈指の『アイドル感』を持つ精霊形態です。" },
          { name: "歌声支配", type: "破軍歌姫", detail: "歌声で命令効果を増幅し、集団の意思と戦場の流れそのものを塗り替えます。" },
          { name: "ステージ中央", type: "スポットライト集中", detail: "視線が自分に集まるほど、美九の存在感と支配欲はさらに強く立ち上がります。" }
        ]
      },
      storyFocus: {
        en: [
          { title: "Rejection as self-defense", detail: "Her hostility toward men is not a gimmick, but a shield formed after the injuries of idol life." },
          { title: "A different kind of dating battle", detail: "The Miku arc turns dating into a struggle over public opinion, influence, and control rather than simple intimacy." },
          { title: "The shell finally cracks", detail: "Only when she entrusts her real feelings to someone else does Miku's arrogant exterior finally split open." }
        ],
        ja: [
          { title: "拒絶は自己防衛", detail: "男性への強い拒否反応は単なる設定ではなく、アイドルとして傷ついた過去から生まれた防壁です。" },
          { title: "まったく別種の攻略戦", detail: "美九編は『デート攻略』を、親密さよりも世論、影響力、支配をめぐる戦いへ変えていきます。" },
          { title: "ようやく外殻が割れる", detail: "本当の感情を誰かへ託せた時、美九の傲慢な外殻はようやく本当にひび割れます。" }
        ]
      },
      relationships: {
        en: [
          "She wants devotion from those around her, yet what she truly longs for is someone who sees through the performance.",
          "Her route challenges Shido in ways physical force never could, because control and trust are the real battlefield.",
          "Even after softening, Miku's affection keeps a dramatic, all-consuming flavor unique to her."
        ],
        ja: [
          "周囲には献身を求めますが、本当に欲しいのは演出の奥にいる自分を見抜いてくれる相手です。",
          "美九編で士道が試されるのは力ではなく、支配と信頼が戦場そのものになる点にあります。",
          "心を開いた後も、美九の好意はどこか劇的で、一人にすべてを注ぎ込む彼女らしさを保っています。"
        ]
      },
      trivia: {
        en: [
          "Miku is not only an idol-themed Spirit; she also embodies celebrity trauma, control, and vulnerability.",
          "Her episodes shift the series toward spectacle and social influence more sharply than almost any other route.",
          "Once she feels safe, the tenderness beneath her diva persona becomes one of her strongest appeals."
        ],
        ja: [
          "美九は単なるアイドル精霊ではなく、名声の傷、支配、脆さまで抱えた存在です。",
          "彼女の編は作品を華やかな舞台性と社会的影響力の話へ大きく傾けました。",
          "安心できる場所を得た後に見せる柔らかさこそ、美九の大きな魅力の一つです。"
        ]
      }
    },
    nia: {
      favoriteFood: {
        en: "Likes alcohol, manga work, and 2D culture; hates heavy, gloomy atmospheres",
        ja: "酒と漫画制作、2D文化が好き。重苦しい空気は苦手"
      },
      abilityDetail: {
        en: "Rasiel can read, store, and answer information, making it the closest thing in the series to an omniscient book.",
        ja: "囁告篇帙は情報を読み、記録し、答えを返せる天使で、作中でもっとも『全知の書』に近い存在です。"
      },
      astralNote: {
        en: "Her Second Astral Dress resembles a teasing nun-like outfit, matching the feeling that she knows far more than anyone around her.",
        ja: "二番霊装はどこか戯画的な修道女服のようで、『知りすぎている』二亜の性質にとてもよく似合っています。"
      },
      personality: {
        en: ["Talkative", "Otaku-minded", "Playful", "Sharp-eyed"],
        ja: ["おしゃべり", "オタク気質", "軽妙", "観察眼が鋭い"]
      },
      formsDetailed: {
        en: [
          { name: "Author Dress", type: "Astral Dress: Second", detail: "Its playful clerical silhouette fits a girl who treats knowledge and story alike as sacred, dangerous tools." },
          { name: "Record and Response", type: "Rasiel", detail: "It can answer questions, trace truths, and read targets, making it the most information-war oriented Angel in the series." },
          { name: "Otaku at Rest", type: "Off-field Persona", detail: "Away from crisis she resembles a slacker shut-in, yet that very looseness preserves her unique perspective." }
        ],
        ja: [
          { name: "作者の霊装", type: "神威霊装・弐番", detail: "少し戯けた聖職者風のシルエットは、物語と知識の両方を危うい聖域として扱う二亜によく似合います。" },
          { name: "記録と回答", type: "囁告篇帙", detail: "問いへの回答、真相の追跡、対象情報の読解が可能で、作中でもっとも情報戦に特化した天使です。" },
          { name: "オフのオタク姿", type: "日常モード", detail: "戦場を離れるとだらしないオタクに見えますが、その緩さこそが独特の視点を守っています。" }
        ]
      },
      storyFocus: {
        en: [
          { title: "One of the few who sees the larger history", detail: "Nia is one of the rare Spirits able to view the Origin problem across a much longer span of time." },
          { title: "Freedom matters because she once lost it", detail: "Her long captivity under DEM shaped both her defensive posture and her fierce attachment to living freely." },
          { title: "Jokes carry the heaviest truths", detail: "Her most unique quality is that she often drops the darkest lore through gags and otaku references." }
        ],
        ja: [
          { title: "長い歴史で見られる数少ない精霊", detail: "二亜は精霊と始源の問題をより長い歴史の尺度で見られる、数少ない存在の一人です。" },
          { title: "自由が重いのは失ったから", detail: "DEM に長く囚われた過去が、防御的な姿勢と自由への強い執着の両方を形作っています。" },
          { title: "冗談の形で最重の真実を投げる", detail: "宅ネタや軽口で包みながら、作中でもっとも重い設定をさらりと差し出すのが二亜の特異さです。" }
        ]
      },
      relationships: {
        en: [
          "Her bond with stories is almost a faith: she believes narratives can still save people when little else can.",
          "Shido earns her trust not just by helping her, but by accepting both her jokes and her scars.",
          "Because she knows so much, Nia always stands half inside the cast and half above it as a witness."
        ],
        ja: [
          "二亜にとって物語との結び付きはほとんど信仰に近く、他に手がない時でも人を救えると本気で信じています。",
          "士道が彼女の信頼を得るのは、助けるからだけでなく、軽口も傷も両方受け止めるからです。",
          "知りすぎているがゆえに、二亜は常に当事者でありながら同時に観測者でもあります。"
        ]
      },
      trivia: {
        en: [
          "She broadens DATE A LIVE through manga, authorship, and recorded truth rather than through raw combat presence.",
          "Her slacker otaku mask makes it easy to forget that she is also one of the most important information holders in the story.",
          "Nia can make the same line sound like a joke, a spoiler, and a warning all at once."
        ],
        ja: [
          "二亜は戦闘力よりも、漫画、作者性、記録された真実を通じて作品世界を広げる存在です。",
          "だらけたオタクの仮面のせいで見落とされがちですが、彼女は物語でもっとも重要な情報保持者の一人です。",
          "ひとつの台詞を、冗談、ネタバレ、警告として同時に響かせられるのが二亜らしさです。"
        ]
      }
    },
    natsumi: {
      favoriteFood: {
        en: "Likes cute outfits and pranks; fears people judging her appearance",
        ja: "かわいい服装といたずらが好き。外見を否定されることを恐れている"
      },
      abilityDetail: {
        en: "Haniel allows appearance change, mimicry, and distorted perception, making it ideal for disguise and misdirection.",
        ja: "贋造魔女は変身、擬態、認識の撹乱を可能にし、偽装と攪乱に極めて向いた天使です。"
      },
      astralNote: {
        en: "Her Seventh Astral Dress carries the feeling of a witch's costume, but the more important motif is the tension between disguise and the self beneath it.",
        ja: "七番霊装は魔女装束らしい雰囲気を持ちつつ、その核には『偽装』と『素の自分』の緊張関係が宿っています。"
      },
      personality: {
        en: ["Timid", "Insecure", "Guarded", "Soft once trusted"],
        ja: ["臆病", "自己評価が低い", "警戒心が強い", "信じた相手には柔らかい"]
      },
      formsDetailed: {
        en: [
          { name: "True Form", type: "Original Natsumi", detail: "The real Natsumi is petite and visibly nervous, which is exactly why she is the self she hates exposing." },
          { name: "Ideal Disguise", type: "Constructed Persona", detail: "The mature, beautiful shell she built to escape judgment is her most common defensive mask." },
          { name: "Illusion Witchcraft", type: "Haniel", detail: "Together with Haniel, she specializes in fantasy, deception, and showy trick effects rather than brute force." }
        ],
        ja: [
          { name: "本来の姿", type: "素の七罪", detail: "本来の七罪は小柄で怯えた表情をしており、それこそが彼女がもっとも見せたくない自分でもあります。" },
          { name: "理想の仮面", type: "作られた人格", detail: "評価される恐怖から逃れるために用意した大人びて美しい外殻は、彼女の代表的な防御手段です。" },
          { name: "幻惑の魔女術", type: "贋造魔女", detail: "Haniel と組み合わさることで、力押しよりも幻想、偽装、トリックめいた欺きに長けます。" }
        ]
      },
      storyFocus: {
        en: [
          { title: "The real issue is self-acceptance", detail: "The core question of Natsumi's route is not whether she will attack, but whether she can bear to be herself." },
          { title: "Transformation as a symptom", detail: "She keeps becoming someone else not because she loves lies, but because she fears others rejecting the real her." },
          { title: "Being loved without disguise", detail: "Shido and the others accepting her lets Natsumi seriously imagine being cherished without hiding." }
        ],
        ja: [
          { title: "本題は自己受容", detail: "七罪編の中心にあるのは『攻撃するかどうか』ではなく、『本当の自分でいられるか』という問いです。" },
          { title: "変身は症状でもある", detail: "彼女が繰り返し他人へ化けるのは嘘が好きだからではなく、素の自分が拒絶されることを恐れているからです。" },
          { title: "偽装なしで愛されること", detail: "士道たちの受容によって、七罪は『飾らなくても好かれるかもしれない』と初めて本気で考えられるようになります。" }
        ]
      },
      relationships: {
        en: [
          "Her relationship with others is filtered through appearance anxiety, which makes trust far harder for her than combat.",
          "Shido matters because he treats the frightened real girl, not only the ideal mask she presents.",
          "Natsumi's route gives the series one of its clearest portraits of self-loathing."
        ],
        ja: [
          "他者との関係は常に外見不安を通して歪められており、戦うことより信じることの方が彼女には難しいのです。",
          "士道が重要なのは、彼女が見せる理想の仮面だけでなく、怯えた本当の少女そのものに向き合うからです。",
          "七罪の物語は、この作品でもっとも率直な自己嫌悪の描写の一つになっています。"
        ]
      },
      trivia: {
        en: [
          "Her power system directly turns body-image anxiety into plot and combat mechanics.",
          "The contrast between her ideal disguise and real form is the emotional engine of her route.",
          "Natsumi's growth matters because it is about staying visible as herself, not about becoming invincible."
        ],
        ja: [
          "彼女の能力設定は、外見不安そのものを物語と戦闘の仕組みへ直接組み込んでいます。",
          "理想の仮面と本来の姿の落差こそが、七罪編を動かす感情エンジンです。",
          "七罪の成長が重いのは、無敵になることではなく、自分のまま見られることを引き受けるからです。"
        ]
      }
    },
    mukuro: {
      favoriteFood: {
        en: "Likes sweet-potato yokan; hates lies",
        ja: "芋羊羹が好き。嘘は嫌い"
      },
      abilityDetail: {
        en: "Michael can seal and unseal memories, emotions, space, and other phenomena, making it both conceptually powerful and tactically devastating.",
        ja: "封解主は記憶、感情、空間、その他の現象まで封じたり解いたりできる、概念性と実戦性を兼ね備えた高位天使です。"
      },
      astralNote: {
        en: "Keys, chains, and orbital paths define her Eleventh Astral Dress, making it the clearest visual expression of Mukuro's sealing motif.",
        ja: "鍵、鎖、軌道を思わせる意匠が十一番霊装の核であり、六喰の『封印』というテーマをもっとも分かりやすく視覚化しています。"
      },
      personality: {
        en: ["Quiet", "Slow to warm up", "Possessive once attached", "Sensitive to rejection"],
        ja: ["物静か", "心を開くのが遅い", "懐くと独占欲が強い", "拒絶に敏感"]
      },
      formsDetailed: {
        en: [
          { name: "Keybound Dress", type: "Astral Dress: Eleventh", detail: "Keys, chains, and celestial orbit imagery make this Mukuro's signature Spirit appearance." },
          { name: "Concept Interference", type: "Michael", detail: "She applies the concepts of locking and unlocking to targets, giving her immense strategic value." },
          { name: "Opened Heart", type: "Emotional Shift", detail: "Once she truly opens up, her expression jumps from distant restraint to direct and powerful attachment." }
        ],
        ja: [
          { name: "鍵の霊装", type: "神威霊装・十一番", detail: "鍵、鎖、宇宙軌道の意匠が重なり合う、六喰を象徴する精霊姿です。" },
          { name: "概念干渉", type: "封解主", detail: "対象へ『閉じる』『開く』という概念干渉を行えるため、戦略価値が非常に高い能力体系です。" },
          { name: "心を開いた後", type: "感情転位", detail: "本当に心を開いた瞬間、感情表現は疎離から一転して、率直で強い執着へと変わります。" }
        ]
      },
      storyFocus: {
        en: [
          { title: "Isolation is self-protection", detail: "Mukuro's closed-off attitude is not simple coldness, but a shield built from long loneliness and fear of loss." },
          { title: "The lock she truly needs to undo", detail: "What most needs unlocking is not only her power, but her fear of intimacy itself." },
          { title: "From do not come closer to do not leave", detail: "Her route is defined by the shift from rejecting contact to clinging fiercely once she chooses someone." }
        ],
        ja: [
          { title: "孤立は自己防衛", detail: "六喰の閉鎖性は単なる冷たさではなく、長い孤独と喪失への恐れから築かれた防壁です。" },
          { title: "本当に解くべき鍵", detail: "彼女が解放されるべきなのは能力だけではなく、関係そのものを恐れる心でもあります。" },
          { title: "近づかないで、から、離れないで、へ", detail: "六喰線のいちばん鮮やかな変化は、拒絶から強い依着へと感情の向きが反転することです。" }
        ]
      },
      relationships: {
        en: [
          "Her attachment style changes violently once she decides someone is hers, which makes trust both beautiful and dangerous for her.",
          "Shido's role is to prove that choosing another person does not have to lead to loss again.",
          "Mukuro's story translates keys and locks into the language of intimacy, memory, and fear."
        ],
        ja: [
          "ひとたび『自分の人』だと認めると、六喰の依着は非常に強くなり、信頼そのものが美しくも危ういものになります。",
          "士道の役割は、『誰かを選ぶことは再び失うことと同義ではない』と彼女へ示すことにあります。",
          "六喰の物語は、鍵と錠前のモチーフを親密さ、記憶、恐れの言葉へと翻訳しています。"
        ]
      },
      trivia: {
        en: [
          "Her route stands out because emotional distance and cosmic-scale imagery are woven together almost seamlessly.",
          "Mukuro can seem cold at first glance, but she is one of the girls whose attachment becomes the most intense once accepted.",
          "The visual language of keys and seals makes her one of the most conceptually distinctive Spirits in later arcs."
        ],
        ja: [
          "感情的な距離感と宇宙規模のイメージがここまで自然に結び付いている点で、六喰編は後半でも際立っています。",
          "第一印象こそ冷淡ですが、受け入れられた後の執着の強さは作中でもかなり上位です。",
          "鍵と封印のビジュアル言語によって、後半の精霊の中でもひときわ概念的な個性を持っています。"
        ]
      }
    },
    mio: {
      favoriteFood: {
        en: "Likes the sea; hates farewells",
        ja: "海が好き。別れを嫌う"
      },
      abilityDetail: {
        en: "Mio wields origin-level power and can use Ain, Ain Soph, Ain Soph Aur, and even the Sephira crystals that shape the Spirits themselves.",
        ja: "澪は始源級の力を持ち、Ain、Ain Soph、Ain Soph Aur などの高位天使に加え、精霊を形作る Sephira 結晶そのものにも関与できます。"
      },
      astralNote: {
        en: "Her Origin Dress is less a single outfit than the visual weight of the First Spirit herself: absolute rank, quiet light, and godlike authority.",
        ja: "始源霊装は単なる一着の衣装というより、第一の精霊そのものが放つ絶対的な格、静かな光、神に近い威圧感を可視化したものです。"
      },
      personality: {
        en: ["Gentle", "Otherworldly", "Devoted", "Tragic"],
        ja: ["穏やか", "人外めいている", "一途", "悲劇を背負う"]
      },
      formsDetailed: {
        en: [
          { name: "Origin Form", type: "Origin Astral Dress", detail: "As the First Spirit's true form, it carries overwhelming rank and command over the entire system of Spirits." },
          { name: "Hidden Prime Mover", type: "Fate Intervention", detail: "For a long time she shapes everyone else's destiny from behind the curtain, acting as the true force behind many stories." },
          { name: "Mythic Authority", type: "Origin Power", detail: "Her strength is not a single weapon, but an almost mythic collection of origin-level abilities." }
        ],
        ja: [
          { name: "始源形態", type: "始源霊装", detail: "第一の精霊としての本体姿であり、精霊体系そのものを見下ろす圧倒的な位格を持ちます。" },
          { name: "影にいる起動者", type: "運命干渉", detail: "長く幕裏から他者の運命へ介入し、多くの精霊の物語を実質的に動かしてきた存在です。" },
          { name: "神話級の権能", type: "始源の力", detail: "単一武装ではなく、神話層に届くような始源級能力の集合としてその強さが現れます。" }
        ]
      },
      storyFocus: {
        en: [
          { title: "The true starting point", detail: "Spirits are not a natural phenomenon; Mio is the beginning of all of them and the origin of the tragedies that followed." },
          { title: "Love twists the worldline", detail: "Her love for Shinji drives the distortion and reconstruction of the whole worldline and becomes part of why Shido exists." },
          { title: "Truth becomes a person", detail: "Season five matters because it turns Mio from an abstract answer into a person with unbearable emotional weight." }
        ],
        ja: [
          { title: "本当の始点", detail: "精霊は自然発生した存在ではなく、澪こそがその起点であり、後に続く悲劇の根でもあります。" },
          { title: "愛が世界線を歪める", detail: "崇宮真士への愛が、世界線の捻じれと再構築を押し進め、五河士道という存在の意味にも深く関わります。" },
          { title: "真相が一人の人物になる", detail: "第五期が重要なのは、抽象的な『答え』だった澪を、耐え難い感情を持つ具体的な人物へ引き戻すからです。" }
        ]
      },
      relationships: {
        en: [
          "Almost every major Spirit route ultimately bends back toward Mio because she is both the miracle they inherit and the wound they cannot escape.",
          "Her bond with Shinji defines the entire tragedy at the core of the setting.",
          "Shido's existence cannot be separated from Mio's love, loss, and refusal to let go."
        ],
        ja: [
          "ほとんどすべての主要精霊ルートが最終的に澪へ帰っていくのは、彼女が受け継がれた奇跡であり、逃れられない傷でもあるからです。",
          "真士との関係こそが、この世界設定に横たわる悲劇全体の中心を規定しています。",
          "士道という存在そのものが、澪の愛、喪失、そして手放せなさから切り離せません。"
        ]
      },
      trivia: {
        en: [
          "Mio reframes DATE A LIVE less as a harem fantasy and more as a tragedy about creation and irreversible loss.",
          "Her calm tone makes the scale of what she has done feel even more haunting.",
          "Once her motives are clear, much of the story retroactively changes shape around her."
        ],
        ja: [
          "澪の存在は『デート・ア・ライブ』を、ハーレム的な楽しさ以上に、創造と取り戻せない喪失の悲劇として見せ直します。",
          "落ち着いた口調で語られるぶん、彼女の行為の規模はかえって不気味に響きます。",
          "動機が見えた瞬間、それまでの物語のかなりの部分が彼女を中心に再配置されて見えてきます。"
        ]
      }
    }
  };
  const sharedCharacterFieldLocaleMeta = {
    ability: {
      "鏖杀公": { en: "Sandalphon", ja: "鏖殺公" },
      "冰结傀儡": { en: "Zadkiel", ja: "氷結傀儡" },
      "绝灭天使": { en: "Metatron", ja: "絶滅天使" },
      "灼烂歼鬼": { en: "Camael", ja: "灼爛殲鬼" },
      "刻刻帝": { en: "Zafkiel", ja: "刻々帝" },
      "天际疾驰者": { en: "Raphael", ja: "天際疾駆者" },
      "破军歌姬": { en: "Gabriel", ja: "破軍歌姫" },
      "嗫告篇帙": { en: "Rasiel", ja: "囁告篇帙" },
      "赝造魔女": { en: "Haniel", ja: "贋造魔女" },
      "封解主": { en: "Michael", ja: "封解主" },
      "始源之力": { en: "Origin Power", ja: "始源の力" }
    },
    astralDress: {
      "神威灵装·一番": { en: "Astral Dress: First", ja: "神威霊装・壱番" },
      "神威灵装·三番": { en: "Astral Dress: Third", ja: "神威霊装・参番" },
      "神威灵装·四番": { en: "Astral Dress: Fourth", ja: "神威霊装・四番" },
      "神威灵装·五番": { en: "Astral Dress: Fifth", ja: "神威霊装・伍番" },
      "神威灵装·七番": { en: "Astral Dress: Seventh", ja: "神威霊装・七番" },
      "神威灵装·八番": { en: "Astral Dress: Eighth", ja: "神威霊装・八番" },
      "神威灵装·九番": { en: "Astral Dress: Ninth", ja: "神威霊装・九番" },
      "神威灵装·十番": { en: "Astral Dress: Tenth", ja: "神威霊装・十番" },
      "神威灵装·十一番": { en: "Astral Dress: Eleventh", ja: "神威霊装・十一番" },
      "神威灵装·二番": { en: "Astral Dress: Second", ja: "神威霊装・弐番" },
      "始源灵装": { en: "Origin Astral Dress", ja: "始源霊装" }
    },
    faction: {
      "精灵": { en: "Spirit", ja: "精霊" },
      "Ratatoskr / 精灵": { en: "Ratatoskr / Spirit", ja: "Ratatoskr / 精霊" },
      "AST / Ratatoskr / 精灵": { en: "AST / Ratatoskr / Spirit", ja: "AST / Ratatoskr / 精霊" },
      "八舞双子 / 精灵": { en: "Yamai Twins / Spirit", ja: "八舞姉妹 / 精霊" },
      "精灵 / 歌姬": { en: "Spirit / Diva", ja: "精霊 / 歌姫" },
      "精灵 / 魔女": { en: "Spirit / Witch", ja: "精霊 / 魔女" },
      "始源精灵": { en: "Origin Spirit", ja: "始源の精霊" }
    },
    debut: {
      "动画第一季第1话": { en: "Anime Season 1, Episode 1", ja: "アニメ第1期 第1話" },
      "动画第一季第4话": { en: "Anime Season 1, Episode 4", ja: "アニメ第1期 第4話" },
      "动画第一季第7话": { en: "Anime Season 1, Episode 7", ja: "アニメ第1期 第7話" },
      "动画第二季第2话": { en: "Anime Season 2, Episode 2", ja: "アニメ第2期 第2話" },
      "动画第二季第5话": { en: "Anime Season 2, Episode 5", ja: "アニメ第2期 第5話" },
      "动画第三季第1话": { en: "Anime Season 3, Episode 1", ja: "アニメ第3期 第1話" },
      "动画第四季第1话": { en: "Anime Season 4, Episode 1", ja: "アニメ第4期 第1話" },
      "动画第四季第4话": { en: "Anime Season 4, Episode 4", ja: "アニメ第4期 第4話" },
      "动画第四季末揭露 / 第五季核心登场": { en: "Revealed at the end of Season 4 / central in Season 5", ja: "第4期終盤で示唆 / 第5期で本格登場" }
    },
    mood: {
      "优雅·危险": { en: "Elegant · Dangerous", ja: "優雅・危険" },
      "直率·炽热": { en: "Straightforward · Fiery", ja: "率直・灼熱" },
      "腼腆·可爱": { en: "Shy · Gentle", ja: "内気・愛らしい" },
      "冷面·专注": { en: "Calm · Focused", ja: "冷静・集中" },
      "双面·可靠": { en: "Dual-sided · Reliable", ja: "二面性・頼れる" },
      "张扬·中二": { en: "Dramatic · Chuunibyou", ja: "奔放・中二" },
      "冷静·吐槽": { en: "Cool · Dry Humor", ja: "冷静・ツッコミ" },
      "华丽·执着": { en: "Radiant · Possessive", ja: "華やか・執着" },
      "轻快·宅系": { en: "Lively · Otaku-minded", ja: "軽快・オタク気質" },
      "自卑·敏感": { en: "Insecure · Sensitive", ja: "自卑・繊細" },
      "孤高·依恋": { en: "Distant · Attached", ja: "孤高・依恋" },
      "宁静·神性": { en: "Still · Divine", ja: "静謐・神性" }
    }
  };
  const characterOtherFormsLocaleMeta = {
    kurumi: {
      en: ["Astral Dress: Third", "City of Devouring Time", "Clone Combat Form", "School Uniform"],
      ja: ["神威霊装・参番", "食時の城", "分身体戦闘形態", "制服姿"]
    },
    tohka: {
      en: ["Astral Dress: Tenth", "Inverted Tohka", "Tenka Persona", "School Date Outfit"],
      ja: ["神威霊装・十番", "反転十香", "天香人格", "制服デート姿"]
    },
    yoshino: {
      en: ["Astral Dress: Fourth", "Yoshinon Coordinated Form", "Inversion Form", "Raincoat Casual Wear"],
      ja: ["神威霊装・四番", "四糸奈連携形態", "反転形態", "レインコート私服"]
    },
    origami: {
      en: ["AST Realizer Combat Gear", "Astral Dress: First", "Inverted Origami", "School Uniform"],
      ja: ["AST 顕現装置戦闘形態", "神威霊装・壱番", "反転折紙", "制服姿"]
    },
    kotori: {
      en: ["Fraxinus Commander Mode", "Astral Dress: Fifth", "White Ribbon Daily Mode", "Black Ribbon Commander Mode"],
      ja: ["Fraxinus 司令モード", "神威霊装・伍番", "白リボン日常モード", "黒リボン司令モード"]
    },
    kaguya: {
      en: ["Astral Dress: Eighth", "High-Speed Assault Form", "Twin Resonance Form", "Casual Wear"],
      ja: ["神威霊装・八番", "高速突撃形態", "双子共鳴形態", "私服姿"]
    },
    yuzuru: {
      en: ["Astral Dress: Eighth", "Silent Wind Sniper Form", "Twin Resonance Form", "Casual Wear"],
      ja: ["神威霊装・八番", "静風狙撃形態", "双子共鳴形態", "私服姿"]
    },
    miku: {
      en: ["Astral Dress: Ninth", "Concert Domination Form", "Academy Idol Style", "Formal Stage Dress"],
      ja: ["神威霊装・九番", "ライブ支配形態", "学園アイドル姿", "ステージドレス"]
    },
    nia: {
      en: ["Astral Dress: Second", "Rasiel Fully Open", "Inversion Form", "Mangaka Casual Wear"],
      ja: ["神威霊装・弐番", "ラジエル全開", "反転形態", "漫画家私服"]
    },
    natsumi: {
      en: ["True Young Form", "Adult Woman Disguise", "Astral Dress: Seventh", "Disguised School Uniform Form"],
      ja: ["少女の本体", "大人の女性擬態", "神威霊装・七番", "変装制服形態"]
    },
    mukuro: {
      en: ["Astral Dress: Eleventh", "Unlocked Seal Form", "Heart-Sealed State", "Drifting Space Form"],
      ja: ["神威霊装・十一番", "封印解除形態", "封心閉鎖態", "宇宙漂流姿"]
    },
    mio: {
      en: ["Origin Dress", "Phantom Form", "Ain Soph Aur Unleashed", "Endgame Manifestation"],
      ja: ["始源霊装", "ファントム姿態", "Ain Soph Aur 展開", "終局顕現姿態"]
    }
  };
  const angelResultLocaleMeta = {
    tohka: {
      title: {
        zh: "剑尖的余光慢慢收住时，十香终于愿意把那份直白的依赖留给你。",
        en: "As the light around Sandalphon finally settles, Tohka lets that honest dependence remain with you instead of pulling it back.",
        ja: "剣先の残光が静かに収まるころ、十香はようやくそのまっすぐな甘えを、あなたのそばへ残してくれました。"
      },
      lines: {
        zh: [
          "鏖杀公不再躁动，她看向你的眼神也比刚才更坦率了一点。",
          "如果这时候你朝她伸出手，她多半会一边嘴硬一边把下一次约会也认真记住。"
        ],
        en: [
          "Sandalphon is no longer trembling, and the way she looks at you is a little more open than before.",
          "If you reached out now, she would probably act stubborn for a second, then remember your next date with complete sincerity."
        ],
        ja: [
          "鏖殺公のざわめきはもう収まり、あなたへ向ける視線もさっきより少しだけ素直になっています。",
          "今ここで手を差し伸べれば、きっと照れながらも次のデートの約束までちゃんと覚えてくれるはずです。"
        ]
      },
      signature: {
        zh: "十香：和你一起的话，我好像真的什么都不怕了。",
        en: "Tohka: If I'm with you, I really feel like I don't have to fear anything.",
        ja: "十香：あなたと一緒なら、私、本当に何も怖くない気がする。"
      }
    },
    kurumi: {
      title: {
        zh: "钟摆终于肯为你停稳一瞬，狂三也没有再把距离重新拉开。",
        en: "For one brief instant the pendulum holds still for you, and Kurumi no longer pulls the distance back open.",
        ja: "振り子がようやくあなたのために一瞬だけ静まり、狂三ももう距離を引き戻しませんでした。"
      },
      lines: {
        zh: [
          "刻刻帝的躁动被你一点点安抚下来，她把最危险的那面藏得比平时更深。",
          "这份靠近还带着试探，可她已经默许你继续留在她的时间里。"
        ],
        en: [
          "You calm Zafkiel's unrest little by little, and she hides her most dangerous side more carefully than usual.",
          "That closeness still carries a trace of testing, but she has already allowed you to remain inside her time a little longer."
        ],
        ja: [
          "刻々帝のざわめきはあなたに少しずつ鎮められ、彼女はもっとも危うい一面を普段より深くしまい込みました。",
          "この近さにはまだ試すような気配もありますが、それでも彼女はあなたが自分の時間に残ることをもう許しています。"
        ]
      },
      signature: {
        zh: "狂三：呵呵……既然都走到这里了，就再陪我一会儿吧。",
        en: "Kurumi: Hehe... since we've come this far, stay with me a little longer.",
        ja: "狂三：ふふ……ここまで来たのですもの。もう少しだけ、お付き合いくださいませ。"
      }
    },
    yoshino: {
      title: {
        zh: "寒雾慢慢散开以后，四糸乃把藏着的话也一点点递到了你面前。",
        en: "Once the cold mist slowly clears, Yoshino begins to place the words she hid so carefully into your hands.",
        ja: "冷たい霧がゆっくり晴れていくにつれて、四糸乃は隠していた言葉を少しずつあなたへ差し出してくれました。"
      },
      lines: {
        zh: [
          "她原本紧张到发颤的灵波已经平静下来，连视线都没有再慌忙躲开。",
          "只要你再温柔一点回应她，她就会比刚才更愿意靠近你身边。"
        ],
        en: [
          "The trembling wave that had her on edge has finally calmed down, and even her gaze no longer rushes away from yours.",
          "If you answer her just a little more gently, she will want to move closer to your side than she did a moment ago."
        ],
        ja: [
          "張りつめて震えていた霊波はすっかり落ち着き、視線ももう慌てて逸らさなくなりました。",
          "ここであなたがもう少しだけやさしく応えてあげれば、彼女はさっきよりもっと自然にあなたのそばへ近づいてくれます。"
        ]
      },
      signature: {
        zh: "四糸乃：有你在的话……我真的会安心很多。",
        en: "Yoshino: If you're here... I really do feel much more at ease.",
        ja: "四糸乃：あなたがいてくれると……本当に、すごく安心します。"
      }
    },
    kotori: {
      title: {
        zh: "火焰落稳之后，琴里那点逞强的语气也跟着悄悄软了下来。",
        en: "After the flames finally settle, even Kotori's defiant tone softens before she realizes it herself.",
        ja: "炎がようやく落ち着くころ、琴里の強がった声色も気づかないうちに少しだけやわらいでいました。"
      },
      lines: {
        zh: [
          "灼烂歼鬼的热度已经被你稳稳接住，她也难得没有把那份依赖藏回去。",
          "她嘴上大概还是会装得很镇定，但这种偏心，多半只会留给你一个人看。"
        ],
        en: [
          "You catch Camael's heat without flinching, and for once she does not bother hiding that little bit of dependence again.",
          "She will probably keep talking like she is perfectly composed, but that kind of favoritism is almost certainly reserved for you alone."
        ],
        ja: [
          "灼爛殲鬼の熱はあなたにしっかり受け止められ、彼女も珍しくその頼りたさを隠し直しませんでした。",
          "口ではきっとまだ平然を装うのでしょうけれど、その偏ったやさしさを見せる相手は、たぶんあなただけです。"
        ]
      },
      signature: {
        zh: "琴里：哼，还算像样……接下来可不准中途掉队。",
        en: "Kotori: Hmph, not bad... and don't you dare fall behind from here on.",
        ja: "琴里：ふん、まあ及第点ね……ここから先は、ちゃんとついてきなさいよ。"
      }
    },
    miku: {
      title: {
        zh: "最后一个尾音落下时，美九把整段旋律里最柔软的部分留给了你。",
        en: "When the final note fades, Miku leaves the softest part of the entire melody in your hands.",
        ja: "最後の余韻が静かに落ちるころ、美九はその旋律のいちばんやわらかな部分をあなたへ残してくれました。"
      },
      lines: {
        zh: [
          "原本只属于聚光灯中央的目光，这一次明显是朝你一个人偏过去的。",
          "她现在等的不是掌声，而是你愿不愿意站得比舞台更近一点。"
        ],
        en: [
          "The gaze that once belonged only to the center of the stage now leans unmistakably toward you alone.",
          "What she is waiting for now is not applause, but whether you will stand a little closer than the stage itself."
        ],
        ja: [
          "本来ならスポットライトの中心だけに向いていた視線が、今ははっきりとあなただけへ傾いています。",
          "彼女が今待っているのは拍手ではなく、あなたが舞台より少し近くまで来てくれるかどうかです。"
        ]
      },
      signature: {
        zh: "美九：亲爱的，今晚这首歌……我只想唱给你听。",
        en: "Miku: Darling, tonight's song... I only want to sing it for you.",
        ja: "美九：ダーリン、今夜のこの歌は……あなただけに届けたいんですの。"
      }
    },
    mukuro: {
      title: {
        zh: "锁链轻轻松开的那一刻，六喰没有再把那扇心门重新合上。",
        en: "At the instant the chain finally loosens, Mukuro does not close that door to her heart again.",
        ja: "鍵の鎖がそっとほどけたその瞬間、六喰はもう心の扉を閉じ直しませんでした。"
      },
      lines: {
        zh: [
          "她原本封得极紧的情绪终于为你留出了一道缝隙，连依恋都变得清晰起来。",
          "如果你再向她靠近一步，她大概就再也不想把你推出门外了。"
        ],
        en: [
          "The feelings she kept sealed away at last leave a narrow opening for you, and even her attachment becomes easier to read.",
          "If you move one more step closer, she will probably never want to push you back outside that door again."
        ],
        ja: [
          "固く閉ざされていた感情はようやくあなたのために小さな隙間を残し、その依恋すらはっきり見えるようになりました。",
          "ここであなたがもう一歩だけ近づけば、彼女はきっと二度とあなたを扉の外へ押し戻したくなくなるはずです。"
        ]
      },
      signature: {
        zh: "六喰：若与你同行，妾身便不想再把心关上了。",
        en: "Mukuro: If I may walk beside you, then I no longer wish to close my heart again.",
        ja: "六喰：そなたと共に歩めるのなら、妾はもう心を閉ざしたくはありません。"
      }
    }
  };
  const resultModalMeta = {
    date: { className: "modal-card--date", tag: "约会结局" },
    angel: { className: "modal-card--angel", tag: "天使展开" },
    gacha: { className: "modal-card--gacha", tag: "图鉴解锁" },
    gallery: { className: "modal-card--gallery", tag: "图鉴查看" }
  };
  const rulesModalThemeMeta = {
    date: { theme: "date", accent: "#ff7999", soft: "rgba(255, 121, 153, 0.34)" },
    angel: { theme: "angel", accent: "#ffd978", soft: "rgba(255, 217, 120, 0.34)" },
    gacha: { theme: "gacha", accent: "#69e2ff", soft: "rgba(105, 226, 255, 0.34)" },
    gallery: { theme: "gallery", accent: "#9bd6ff", soft: "rgba(155, 214, 255, 0.34)" }
  };
  const uiCopy = {
    zh: {
      settingsKicker: "Settings",
      settingsTitle: "页面设置",
      settingsMusicTitle: "背景音乐",
      settingsMusicLabel: "切换曲目",
      settingsVolumeTitle: "音量大小",
      settingsModeTitle: "昼夜模式",
      settingsModeDay: "白天",
      settingsModeNight: "黑夜",
      settingsLanguageTitle: "语言切换",
      settingsLanguageNote: "切换后会同步更新当前页面的标题、说明和主要交互文案。",
      settingsAuthorTitle: "作者信息",
      settingsAuthorTag: "Info",
      settingsMusicTag: "当前曲目",
      settingsLanguageTag: "Language",
      modeToastDay: "已切换到白天模式",
      modeToastNight: "已切换到黑夜模式",
      volumeToast: "音量已调整为 {value}%",
      themeToast: "背景音乐已切换为 {theme}",
      muteToast: "背景音乐已静音",
      pageLoadedCharacter: "角色页已加载",
      pageLoadedGame: "{title} 已加载",
      toastCharacterSwitched: "{name} 已切换",
      toastPetQuote: "页宠把台词轻轻念给你听了",
      toastPetWave: "页宠朝你挥了挥手",
      trackMissingToast: "{theme} 文件未找到，请放入 assets/bgm",
      dateGameToastFinalReady: "最终结局已结算",
      dateGameToastStepSaved: "已记录第 {step} 轮选择",
      dateGameResultTitle: "约会结局：{name}",
      dateGameEndHeadline: "本轮已结束",
      dateGameBestMatch: "最佳匹配：{name}",
      dateGameEndBody: "三轮约会抉择已经全部完成，今夜最契合你的心意已经浮现。你可以重新开始，也可以继续翻看这位精灵的完整资料。",
      dateGameRoundTag: "第 {round} 轮",
      dateGameRestart: "再玩一次",
      dateGameViewCharacter: "查看 {name}",
      dateGameStepHeadline: "第 {step} / {total} 轮",
      dateGameStepTag: "命运选择",
      dateGameStepNote: "完成这一轮后会继续进入下一段分支，第三轮结束才会统一揭晓你的最终结局。",
      dateResultMoodTag: "今夜心动",
      dateResultLineOne: "今晚的步调刚好和 {name} 的心意重合了。",
      dateResultLineTwo: "如果你肯再向她靠近一步，这场约会还会继续变得更甜。",
      angelResultTitle: "天使展开：{name}",
      angelResultHeadline: "灵装共鸣试炼",
      angelResultMoodTag: "共鸣完成",
      soundStateOn: "音效：开",
      soundStateOff: "音效：关",
      homeBrand: "デート・ア・ライブ",
      homeTitle: "デート・ア・ライブ",
      homeArchiveTitle: "精灵档案入口",
      homeArchiveDesc: "把十二位精灵的资料、天使与灵装都收进同一页，想先认识谁，就从这里开始。",
      homeTimelineTitle: "剧情总览",
      homeTimelineDesc: "从天宫市初遇到澪揭晓真相，动画主线与外传线索会在这里重新串成一条清晰时间线。",
      homeGamesTitle: "小游戏区",
      homeGamesDesc: "把约会心动、天使共鸣和图鉴收集都做成了可直接游玩的互动小章节。",
      archiveBackLink: "返回首页",
      archiveTitle: "精灵档案入口",
      archiveLead: "如果说约会是靠近精灵的第一步，那这页档案更像真正认识她们的地方。名字、天使、灵装与故事重点，都已经替你整理好了。",
      characterBackLink: "返回档案页",
      characterHeroBadge: "角色词条",
      sectionOverviewTitle: "角色概述",
      sectionStoryTitle: "剧情定位",
      sectionFormsTitle: "能力与形态",
      sectionPersonalityTitle: "性格与关键词",
      sectionRelationsTitle: "相关关系",
      sectionTriviaTitle: "设定与轶事",
      infoboxProfileTitle: "基本资料",
      infoboxFormsTitle: "代表形态",
      infoboxDetailTitle: "角色印象",
      infoboxQuoteTitle: "代表台词",
      infoboxSourceTitle: "资料来源",
      petModeChip: "角色页宠",
      petWaveBtn: "打招呼",
      petQuoteBtn: "说台词",
      petSwitchBtn: "换角色",
      gamesBackLink: "返回首页",
      gamesHubTitle: "小游戏区",
      gamesHubLead: "想轻松逛一圈的话，就从这里开始。命运选择器像一次带着心跳的约会分支，天使试炼更像和精灵并肩把灵波稳住，翻牌图鉴则负责把每一次相遇都收进手心里。",
      gameBackLink: "返回小游戏区",
      openRules: "游戏规则",
      rulesTagDefault: "规则说明",
      resultTitleDefault: "结果",
      resultTagDefault: "结果展示",
      timelineBackLink: "返回首页",
      timelineTitle: "剧情总览",
      timelineLead: "从十香第一次现界开始，士道与精灵们的故事就注定不会停在普通校园日常。动画五季、万由里裁决与《Date A Bullet》把这段关于拯救、失去和重逢的长夜，一路推到了真正的答案面前。",
      timelineHeroTitle: "动画主线与外传补充",
      timelineHeroSub: "第一季至第五季 · OVA · 万由里裁决 · Date A Bullet",
      storyBackLink: "返回首页",
      storyTitle: "开篇剧情区",
      storyLead: "空间震撕开天宫市的平静之后，少年与精灵的相遇，也让这场关于战斗、救赎与约会的故事正式开始。",
      storyHeroTitle: "故事序章",
      storyHeroSub: "空间震降临 · 与精灵相遇 · 宿命正式开始",
      storyIntroLines: [
        "空间震一次次在城市上空炸开，人们惧怕精灵，也惧怕下一次来不及撤离的日常。",
        "而士道第一次见到十香时，看见的不是单纯的灾厄，而是一个同样会困惑、会愤怒、也会孤单的少女。",
        "从那之后，《约会大作战》的故事就不只是战斗了，它开始认真追问：如果世界把精灵当作灾难，是否仍有人愿意先伸出手。",
        "于是约会成了拯救的方式，心动也成了改写命运的一部分。"
      ],
      profileLabels: {
        name: "中文名",
        codename: "代号",
        role: "定位",
        birthday: "生日",
        height: "身高",
        faction: "阵营",
        cv: "日文配音",
        angel: "天使",
        ability: "能力",
        astralDress: "灵装",
        debut: "首次登场",
        favoriteFood: "喜欢的事物"
      },
      formsLabels: {
        angel: "天使",
        astralDress: "灵装"
      },
      detailLabels: {
        debut: "首次登场",
        mood: "当前气质"
      },
      cycleRolePrefix: "切换角色：",
      angelTrialChooseTitle: "选择要共鸣的精灵",
      angelTrialChooseHint: "切换后会从这一位精灵的试炼重新开始。",
      angelTrialStageSigil: "符文排序",
      angelTrialStagePulse: "灵波校准",
      angelTrialStageRelease: "灵力释放",
      angelTrialSigilLead: "请依次点亮 {sigils}",
      angelTrialSigilStateOn: "已点亮",
      angelTrialSigilStateOff: "待点亮",
      angelTrialPulseLead: "把灵波连续三次停在中央黄金区间",
      angelTrialPulseCounter: "成功锁定：",
      angelTrialPulseButton: "立即锁定",
      angelTrialReleaseLead: "连续释放灵力，把这一轮共鸣完整推到终点",
      angelTrialReleaseCounter: "脉冲次数：",
      angelTrialReleaseButton: "释放灵力",
      angelTrialToastSelected: "已切换到 {name} 的试炼",
      angelTrialToastSigilDone: "刻印顺序已经稳定，开始锁定灵波",
      angelTrialToastSigilReset: "顺序错了，刻印需要重新排列",
      angelTrialToastPulseHit: "锁定成功 {count} / 3",
      angelTrialToastPulseReset: "灵波偏离黄金区，锁定次数已清零",
      gameRulesSuffix: " · 游戏规则",
      ruleTags: {
        date: "路线指引",
        angel: "试炼说明",
        gacha: "召唤规则"
      },
      resultTags: {
        date: "约会结局",
        angel: "天使展开",
        gacha: "图鉴解锁",
        gallery: "图鉴查看"
      },
      gachaUi: {
        galleryTitle: "精灵图鉴",
        galleryLead: "这里会完整保存你已经翻出的精灵卡。点开任意已解锁卡面，就能把那次相遇重新翻出来。",
        galleryBadge: "独立图鉴页",
        galleryBack: "返回翻牌区",
        galleryCount: "已收录 {count} / {total}",
        pageBadge: "牌池回应",
        pageLead: "把手指落在牌池上，今晚先回应你的那张精灵卡会直接在舞台中央翻开。",
        idleTitle: "今夜的牌面还安静地合在牌池里。",
        idleDesc: "轻点牌池，把第一张精灵卡翻出来吧。",
        poolHint: "点击牌池翻开今夜的第一张卡",
        poolAria: "点击牌池翻牌",
        poolAlt: "精灵牌池",
        flipOnce: "翻开一张",
        flipAgain: "再翻一张",
        flipBusy: "翻牌中...",
        openGallery: "查看图鉴",
        reset: "重置图鉴",
        unlockedTag: "图鉴已解锁",
        lockedSeal: "未解锁",
        lockedBackLabel: "封存中",
        revealStatus: "今夜回应",
        galleryStatus: "图鉴收录",
        stageReady: "牌池已经准备好了，轻点一次就会开始翻牌。",
        stageStored: "{name} 的卡面已经留在这里。",
        stageFlipping: "牌池已经回应，卡背正在向你翻开。",
        stageUnlocked: "{name} 的卡面已经留在舞台中央，也会同步收入你的图鉴。",
        stageReturned: "{name} 再次回到了你的手中，这次重逢也会继续留在图鉴里。",
        toastLocked: "这一张卡还没有翻出来",
        toastReset: "图鉴已清空，可以重新翻牌",
        toastUnlocked: "{name} 已收入图鉴",
        toastReturned: "{name} 又回到你的手中了"
      }
    },
    en: {
      settingsKicker: "Settings",
      settingsTitle: "Page Settings",
      settingsMusicTitle: "Background Music",
      settingsMusicLabel: "Select Track",
      settingsVolumeTitle: "Volume",
      settingsModeTitle: "Day / Night",
      settingsModeDay: "Day",
      settingsModeNight: "Night",
      settingsLanguageTitle: "Language",
      settingsLanguageNote: "This updates the current page's titles, summaries, and major interaction text.",
      settingsAuthorTitle: "Creator",
      settingsAuthorTag: "Info",
      settingsMusicTag: "Track",
      settingsLanguageTag: "Language",
      modeToastDay: "Switched to day mode",
      modeToastNight: "Switched to night mode",
      volumeToast: "Volume set to {value}%",
      themeToast: "Background music switched to {theme}",
      muteToast: "Background music muted",
      pageLoadedCharacter: "Character page loaded",
      pageLoadedGame: "{title} loaded",
      toastCharacterSwitched: "Switched to {name}",
      toastPetQuote: "Your page companion softly recited a line",
      toastPetWave: "Your page companion greeted you",
      trackMissingToast: "{theme} file was not found. Please place it in assets/bgm",
      dateGameToastFinalReady: "Your final route has been decided",
      dateGameToastStepSaved: "Choice {step} has been recorded",
      dateGameResultTitle: "Date Ending: {name}",
      dateGameEndHeadline: "This round is complete",
      dateGameBestMatch: "Best Match: {name}",
      dateGameEndBody: "All three date choices are now complete, and tonight's best-matched answer has finally surfaced. You can start over, or move on to this Spirit's full profile.",
      dateGameRoundTag: "Round {round}",
      dateGameRestart: "Play Again",
      dateGameViewCharacter: "View {name}",
      dateGameStepHeadline: "Round {step} / {total}",
      dateGameStepTag: "Fate Choice",
      dateGameStepNote: "After this choice, the route moves into the next branch. The final ending is only revealed once the third round is over.",
      dateResultMoodTag: "Tonight's Spark",
      dateResultLineOne: "Tonight's pace lined up perfectly with {name}'s feelings.",
      dateResultLineTwo: "If you step a little closer, this date could grow even sweeter from here.",
      angelResultTitle: "Angel Release: {name}",
      angelResultHeadline: "Astral Dress Resonance Trial",
      angelResultMoodTag: "Resonance Complete",
      soundStateOn: "Sound: On",
      soundStateOff: "Sound: Off",
      homeBrand: "DATE A LIVE",
      homeTitle: "DATE A LIVE",
      homeArchiveTitle: "Spirit Archive",
      homeArchiveDesc: "One page gathers all twelve Spirits, their Angels, Astral Dresses, and the details that define them.",
      homeTimelineTitle: "Story Timeline",
      homeTimelineDesc: "From the first encounter in Tenguu City to Mio's truth, the anime and side stories are retold here as one clear timeline.",
      homeGamesTitle: "Mini Games",
      homeGamesDesc: "Choice routes, Angel trials, and the collection roulette turn the series into small interactive episodes.",
      archiveBackLink: "Back to Home",
      archiveTitle: "Spirit Archive",
      archiveLead: "If dating is the first step toward reaching a Spirit, this archive is where you truly get to know them. Names, Angels, Astral Dresses, and story roles are all lined up here.",
      characterBackLink: "Back to Archive",
      characterHeroBadge: "Character File",
      sectionOverviewTitle: "Overview",
      sectionStoryTitle: "Story Role",
      sectionFormsTitle: "Powers & Forms",
      sectionPersonalityTitle: "Traits & Keywords",
      sectionRelationsTitle: "Relationships",
      sectionTriviaTitle: "Trivia",
      infoboxProfileTitle: "Profile",
      infoboxFormsTitle: "Signature Forms",
      infoboxDetailTitle: "Impression",
      infoboxQuoteTitle: "Quote",
      infoboxSourceTitle: "Source",
      petModeChip: "Page Companion",
      petWaveBtn: "Greet",
      petQuoteBtn: "Quote",
      petSwitchBtn: "Switch",
      gamesBackLink: "Back to Home",
      gamesHubTitle: "Mini Games",
      gamesHubLead: "If you want something lighter first, start here. The Fate Selector feels like a date route with a little suspense, the Angel Trial turns resonance into a hands-on challenge, and the flip archive keeps every meeting in one place.",
      gameBackLink: "Back to Games",
      openRules: "Rules",
      rulesTagDefault: "Guide",
      resultTitleDefault: "Result",
      resultTagDefault: "Outcome",
      timelineBackLink: "Back to Home",
      timelineTitle: "Story Timeline",
      timelineLead: "Once Tohka appears, DATE A LIVE stops being just a school rom-com. Across five anime seasons, Mayuri Judgment, and Date A Bullet, the story keeps pushing toward its real answer through rescue, loss, and reunion.",
      timelineHeroTitle: "Main Anime and Side Stories",
      timelineHeroSub: "Season 1 to Season 5 · OVA · Mayuri Judgment · Date A Bullet",
      storyBackLink: "Back to Home",
      storyTitle: "Opening Story",
      storyLead: "When spacequakes tear through Tenguu City's peace, a boy's meeting with a Spirit becomes the first step in a story about battle, salvation, and dating.",
      storyHeroTitle: "Prologue",
      storyHeroSub: "Spacequake · First Encounter · Destiny Begins",
      storyIntroLines: [
        "Spacequakes keep tearing open the sky above the city, and people fear both the Spirits and the loss of ordinary days.",
        "Yet when Shido first meets Tohka, what he sees is not just a disaster, but a lonely girl who can rage, doubt, and hurt like anyone else.",
        "From that moment on, DATE A LIVE stops being only about fighting. It starts asking whether anyone would still reach out to a Spirit the world calls a catastrophe.",
        "That is why dating becomes a way to save someone, and why affection itself begins to change fate."
      ],
      profileLabels: {
        name: "Name",
        codename: "Codename",
        role: "Role",
        birthday: "Birthday",
        height: "Height",
        faction: "Faction",
        cv: "Voice Actor",
        angel: "Angel",
        ability: "Ability",
        astralDress: "Astral Dress",
        debut: "Debut",
        favoriteFood: "Favorite Things"
      },
      formsLabels: {
        angel: "Angel",
        astralDress: "Astral Dress"
      },
      detailLabels: {
        debut: "Debut",
        mood: "Mood"
      },
      cycleRolePrefix: "Switch Character: ",
      angelTrialChooseTitle: "Choose the Spirit to resonate with",
      angelTrialChooseHint: "Switching restarts the trial for that Spirit from the beginning.",
      angelTrialStageSigil: "Sigil Order",
      angelTrialStagePulse: "Wave Lock",
      angelTrialStageRelease: "Power Release",
      angelTrialSigilLead: "Light the sigils in this order: {sigils}",
      angelTrialSigilStateOn: "Lit",
      angelTrialSigilStateOff: "Standby",
      angelTrialPulseLead: "Stop the pulse inside the central golden zone three times",
      angelTrialPulseCounter: "Successful locks: ",
      angelTrialPulseButton: "Lock Now",
      angelTrialReleaseLead: "Trigger consecutive bursts to carry the resonance all the way through",
      angelTrialReleaseCounter: "Pulse bursts: ",
      angelTrialReleaseButton: "Release Power",
      angelTrialToastSelected: "Switched to {name}'s trial",
      angelTrialToastSigilDone: "Sigil order stabilized. Wave lock begins now.",
      angelTrialToastSigilReset: "Wrong order. The sigils have been reset.",
      angelTrialToastPulseHit: "Lock succeeded {count} / 3",
      angelTrialToastPulseReset: "The pulse missed the golden zone. Locks reset.",
      gameRulesSuffix: " · Rules",
      ruleTags: {
        date: "Route Guide",
        angel: "Trial Guide",
        gacha: "Summon Rules"
      },
      resultTags: {
        date: "Date Ending",
        angel: "Angel Release",
        gacha: "Archive Unlock",
        gallery: "Gallery View"
      },
      gachaUi: {
        galleryTitle: "Spirit Gallery",
        galleryLead: "Every Spirit card you have turned over is stored here. Open any unlocked card to relive that meeting on its own.",
        galleryBadge: "Standalone Gallery",
        galleryBack: "Back to Flip Zone",
        galleryCount: "Collected {count} / {total}",
        pageBadge: "Deck Response",
        pageLead: "Lay your hand on the deck, and the Spirit answering tonight will flip open at center stage.",
        idleTitle: "Tonight's card is still resting quietly inside the deck.",
        idleDesc: "Tap the deck and turn over your first Spirit card.",
        poolHint: "Tap the deck to reveal tonight's first card",
        poolAria: "Flip a card from the deck",
        poolAlt: "Spirit card deck",
        flipOnce: "Flip One Card",
        flipAgain: "Flip Again",
        flipBusy: "Flipping...",
        openGallery: "View Gallery",
        reset: "Reset Gallery",
        unlockedTag: "Unlocked",
        lockedSeal: "Locked",
        lockedBackLabel: "Sealed",
        revealStatus: "Tonight's Draw",
        galleryStatus: "Archive Stored",
        stageReady: "The deck is ready. Tap once to begin the draw.",
        stageStored: "{name}'s card is still waiting here.",
        stageFlipping: "The deck has answered. The card back is turning toward you now.",
        stageUnlocked: "{name}'s card now rests at center stage and has been stored in your gallery.",
        stageReturned: "{name} has returned to your hand, and that reunion is now preserved in your gallery as well.",
        toastLocked: "This card has not been revealed yet",
        toastReset: "The gallery has been cleared. You can start flipping again.",
        toastUnlocked: "{name} has been added to your gallery",
        toastReturned: "{name} returned to your hand again"
      }
    },
    ja: {
      settingsKicker: "Settings",
      settingsTitle: "ページ設定",
      settingsMusicTitle: "BGM",
      settingsMusicLabel: "楽曲を切り替える",
      settingsVolumeTitle: "音量",
      settingsModeTitle: "昼夜モード",
      settingsModeDay: "昼",
      settingsModeNight: "夜",
      settingsLanguageTitle: "言語切替",
      settingsLanguageNote: "現在のページの見出し、紹介文、主な操作文言をまとめて切り替えます。",
      settingsAuthorTitle: "作者情報",
      settingsAuthorTag: "Info",
      settingsMusicTag: "再生中",
      settingsLanguageTag: "Language",
      modeToastDay: "昼モードに切り替えました",
      modeToastNight: "夜モードに切り替えました",
      volumeToast: "音量を {value}% に調整しました",
      themeToast: "{theme} に切り替えました",
      muteToast: "BGM をミュートにしました",
      pageLoadedCharacter: "キャラクターページを読み込みました",
      pageLoadedGame: "{title} を読み込みました",
      toastCharacterSwitched: "{name} に切り替えました",
      toastPetQuote: "ページペットが台詞をそっと口にしました",
      toastPetWave: "ページペットが挨拶してくれました",
      trackMissingToast: "{theme} のファイルが見つかりません。assets/bgm に配置してください",
      dateGameToastFinalReady: "最終結果が確定しました",
      dateGameToastStepSaved: "{step} 回目の選択を記録しました",
      dateGameResultTitle: "デート結末：{name}",
      dateGameEndHeadline: "このラウンドは終了しました",
      dateGameBestMatch: "最適相手：{name}",
      dateGameEndBody: "三回の選択がすべて終わり、今夜もっとも波長が合う答えが浮かび上がりました。もう一度最初から遊ぶことも、この精霊の詳しい資料へ進むこともできます。",
      dateGameRoundTag: "第 {round} ラウンド",
      dateGameRestart: "もう一度遊ぶ",
      dateGameViewCharacter: "{name} を見る",
      dateGameStepHeadline: "第 {step} / {total} ラウンド",
      dateGameStepTag: "運命選択",
      dateGameStepNote: "この選択のあと、物語は次の分岐へ進みます。最終結果が明かされるのは第三ラウンド終了後です。",
      dateResultMoodTag: "今夜のときめき",
      dateResultLineOne: "今夜の歩幅は、{name} の気持ちとちょうどきれいに重なりました。",
      dateResultLineTwo: "もう少しだけ近づけたなら、このデートはまだ甘く続いていきそうです。",
      angelResultTitle: "天使展開：{name}",
      angelResultHeadline: "霊装共鳴試練",
      angelResultMoodTag: "共鳴完了",
      soundStateOn: "音：オン",
      soundStateOff: "音：オフ",
      homeBrand: "デート・ア・ライブ",
      homeTitle: "デート・ア・ライブ",
      homeArchiveTitle: "精霊アーカイブ",
      homeArchiveDesc: "十二精霊のプロフィール、天使、霊装をまとめて眺められる入口です。",
      homeTimelineTitle: "物語総覧",
      homeTimelineDesc: "天宮市での出会いから澪の真実まで、アニメ本編と外伝を一本の流れとして追えます。",
      homeGamesTitle: "ミニゲーム",
      homeGamesDesc: "選択、共鳴、図鑑収集を通して、作品のときめきを遊びとして味わえます。",
      archiveBackLink: "ホームへ戻る",
      archiveTitle: "精霊アーカイブ",
      archiveLead: "デートが精霊へ近づく最初の一歩なら、このページは本当に彼女たちを知るための場所です。名前、天使、霊装、物語での立ち位置をここにまとめました。",
      characterBackLink: "アーカイブへ戻る",
      characterHeroBadge: "キャラクター項目",
      sectionOverviewTitle: "概要",
      sectionStoryTitle: "物語での役割",
      sectionFormsTitle: "能力と形態",
      sectionPersonalityTitle: "性格とキーワード",
      sectionRelationsTitle: "関係性",
      sectionTriviaTitle: "設定と小話",
      infoboxProfileTitle: "基本情報",
      infoboxFormsTitle: "代表形態",
      infoboxDetailTitle: "印象",
      infoboxQuoteTitle: "代表台詞",
      infoboxSourceTitle: "出典",
      petModeChip: "キャラページペット",
      petWaveBtn: "あいさつ",
      petQuoteBtn: "台詞",
      petSwitchBtn: "切替",
      gamesBackLink: "ホームへ戻る",
      gamesHubTitle: "ミニゲーム",
      gamesHubLead: "まずは気軽に触れたいならここからです。運命選択はデート分岐のときめきを、天使試練は精霊と歩幅を合わせる感覚を、めくり図鑑は出会いを手元に残す楽しさを味わわせてくれます。",
      gameBackLink: "ミニゲームへ戻る",
      openRules: "ルール",
      rulesTagDefault: "案内",
      resultTitleDefault: "結果",
      resultTagDefault: "表示",
      timelineBackLink: "ホームへ戻る",
      timelineTitle: "物語総覧",
      timelineLead: "十香の現界をきっかけに、この物語は学園ラブコメだけでは終わらなくなります。アニメ五期、『万由里ジャッジメント』、そして『Date A Bullet』を通して、救いと喪失と再会の物語が本当の答えへ近づいていきます。",
      timelineHeroTitle: "アニメ本編と外伝補足",
      timelineHeroSub: "第一期から第五期 · OVA · 万由里ジャッジメント · Date A Bullet",
      storyBackLink: "ホームへ戻る",
      storyTitle: "物語のはじまり",
      storyLead: "空間震が天宮市の平穏を引き裂いた時、少年と精霊の出会いが、戦いと救済、そしてデートの物語を動かし始めます。",
      storyHeroTitle: "プロローグ",
      storyHeroSub: "空間震 · 出会い · 運命の始まり",
      storyIntroLines: [
        "空間震は何度も街の空を裂き、人々は精霊だけでなく、次に失われるかもしれない日常そのものを恐れていました。",
        "けれど士道が十香に初めて出会った時、彼の目に映ったのは災厄だけではなく、怒りも迷いも孤独も抱えたひとりの少女でした。",
        "そこから『デート・ア・ライブ』は、ただ戦うだけの物語ではなくなります。世界に災害と呼ばれても、誰かは先に手を差し伸べられるのかを問い始めるのです。",
        "だからこそ、デートは救いの方法になり、ときめきそのものが運命を書き換える力になっていきます。"
      ],
      profileLabels: {
        name: "名前",
        codename: "コードネーム",
        role: "立ち位置",
        birthday: "誕生日",
        height: "身長",
        faction: "所属",
        cv: "CV",
        angel: "天使",
        ability: "能力",
        astralDress: "霊装",
        debut: "初登場",
        favoriteFood: "好きなもの"
      },
      formsLabels: {
        angel: "天使",
        astralDress: "霊装"
      },
      detailLabels: {
        debut: "初登場",
        mood: "雰囲気"
      },
      cycleRolePrefix: "キャラ切替：",
      angelTrialChooseTitle: "共鳴したい精霊を選ぶ",
      angelTrialChooseHint: "切り替えると、その精霊の試練が最初から始まります。",
      angelTrialStageSigil: "刻印順",
      angelTrialStagePulse: "霊波固定",
      angelTrialStageRelease: "霊力解放",
      angelTrialSigilLead: "この順番で刻印を灯してください：{sigils}",
      angelTrialSigilStateOn: "点灯済み",
      angelTrialSigilStateOff: "待機中",
      angelTrialPulseLead: "中央の黄金ゾーンで霊波を三回止めてください",
      angelTrialPulseCounter: "成功固定：",
      angelTrialPulseButton: "今すぐ固定",
      angelTrialReleaseLead: "霊力を連続で解放し、共鳴を最後まで押し切りましょう",
      angelTrialReleaseCounter: "脈動回数：",
      angelTrialReleaseButton: "霊力を解放",
      angelTrialToastSelected: "{name} の試練に切り替えました",
      angelTrialToastSigilDone: "刻印順が安定しました。続いて霊波を固定します。",
      angelTrialToastSigilReset: "順番が違います。刻印を最初から並べ直してください。",
      angelTrialToastPulseHit: "固定成功 {count} / 3",
      angelTrialToastPulseReset: "黄金ゾーンを外れました。固定回数をリセットします。",
      gameRulesSuffix: " · ルール",
      ruleTags: {
        date: "ルート案内",
        angel: "試練説明",
        gacha: "召喚ルール"
      },
      resultTags: {
        date: "デート結末",
        angel: "天使展開",
        gacha: "図鑑解放",
        gallery: "図鑑閲覧"
      },
      gachaUi: {
        galleryTitle: "精霊図鑑",
        galleryLead: "これまでにめくった精霊カードはここに残っています。解放済みのカードを開けば、その出会いをもう一度見返せます。",
        galleryBadge: "独立図鑑ページ",
        galleryBack: "めくり場へ戻る",
        galleryCount: "収録 {count} / {total}",
        pageBadge: "カードの応答",
        pageLead: "デッキに触れれば、今夜あなたに応えてくれる精霊カードが舞台の中央でめくられます。",
        idleTitle: "今夜のカードはまだ静かにデッキの中で眠っています。",
        idleDesc: "デッキに触れて、最初の精霊カードをめくってみましょう。",
        poolHint: "デッキに触れて今夜の一枚をめくる",
        poolAria: "デッキからカードをめくる",
        poolAlt: "精霊カードデッキ",
        flipOnce: "一枚めくる",
        flipAgain: "もう一枚",
        flipBusy: "めくっています...",
        openGallery: "図鑑を見る",
        reset: "図鑑をリセット",
        unlockedTag: "解放済み",
        lockedSeal: "未解放",
        lockedBackLabel: "封印中",
        revealStatus: "今夜の応答",
        galleryStatus: "図鑑収録",
        stageReady: "デッキの準備は整っています。軽く触れればめくりが始まります。",
        stageStored: "{name} のカードはここであなたを待っています。",
        stageFlipping: "デッキが応えました。カードの裏面がこちらへ向き直っています。",
        stageUnlocked: "{name} のカードは舞台中央に残り、そのまま図鑑にも収録されました。",
        stageReturned: "{name} がもう一度あなたの手元へ戻ってきました。この再会も図鑑に残ります。",
        toastLocked: "このカードはまだめくられていません",
        toastReset: "図鑑を空にしました。もう一度最初から集め直せます。",
        toastUnlocked: "{name} を図鑑に収録しました",
        toastReturned: "{name} がもう一度手元に戻ってきました"
      }
    }
  };
  const timelineEntries = [
    {
      year: {
        zh: "第一季 · 2013",
        en: "Season 1 · 2013",
        ja: "第1期 · 2013"
      },
      text: {
        zh: "故事从空间震与十香的相遇开始，士道第一次真正站上“通过约会拯救精灵”的舞台。折纸、四糸乃、琴里与狂三先后登场，也让天宫市的日常、AST 的战线与 Ratatoskr 的攻略计划同时成形。",
        en: "Season 1 begins with the spacequake and Shido's meeting with Tohka, placing him on the path of saving Spirits through dating. Origami, Yoshino, Kotori, and Kurumi soon follow, establishing the everyday, military, and strategy layers of the series.",
        ja: "第一期は空間震と十香との出会いから始まり、士道が『デートで精霊を救う』という物語の中心へ踏み込んでいきます。折紙、四糸乃、琴里、狂三も続けて登場し、日常・AST・Ratatoskr の構図が一気に形になります。"
      }
    },
    {
      year: {
        zh: "OVA · Date to Date",
        en: "OVA · Date to Date",
        ja: "OVA · Date to Date"
      },
      text: {
        zh: "第一季之后的轻松插曲，重点放在约会气氛和角色相处上。它像一次短暂的喘息，让观众在主线推进前先重新感受作品的日常温度。",
        en: "This OVA works as a lighter interlude after Season 1, leaning into date vibes and character chemistry. It feels like a gentle pause before the larger plot continues.",
        ja: "第一期後の OVA では、デートらしい空気感とキャラクター同士の距離感に焦点が当てられています。本筋の続きへ進む前に、作品の日常らしさをもう一度味わえる小休止です。"
      }
    },
    {
      year: {
        zh: "第二季 · 2014",
        en: "Season 2 · 2014",
        ja: "第2期 · 2014"
      },
      text: {
        zh: "八舞姐妹与诱宵美九把故事推向新的关系层次。士道继续用交流理解精灵，而琴里的精灵身份与更复杂的阵营关系，也在这一季被进一步拉到台前。",
        en: "Season 2 introduces the Yamai twins and Miku, pushing the story into more layered emotional territory. Shido keeps learning Spirits through connection, while Kotori's own Spirit identity becomes more central.",
        ja: "第二期では八舞姉妹と美九が加わり、物語の感情線がさらに広がっていきます。士道は相手を理解するために対話を重ね、琴里の精霊としての一面もより前面に出てきます。"
      }
    },
    {
      year: {
        zh: "OVA · 狂三 Star Festival",
        en: "OVA · Kurumi Star Festival",
        ja: "OVA · 狂三 Star Festival"
      },
      text: {
        zh: "以狂三为中心的短篇外传，带着她特有的危险感与暧昧气息。虽然不直接推动主线，却很好地补足了她在日常氛围中的魅力。",
        en: "A Kurumi-focused side story with her signature danger and flirtation. It does not move the main plot forward, but it deepens her everyday charm in a memorable way.",
        ja: "狂三を中心に据えた短編外伝で、彼女特有の危うさと甘い空気が前面に出ています。本筋を大きく進めるわけではありませんが、日常側の魅力を濃く味わえる一本です。"
      }
    },
    {
      year: {
        zh: "剧场版 · 万由里裁决",
        en: "Film · Mayuri Judgment",
        ja: "劇場版 · 万由里ジャッジメント"
      },
      text: {
        zh: "2015 年上映的原创剧场版，以万由里与异常灵力现象为核心展开。它更像一场独立事件，但很适合作为第二季后的情绪补充观看。",
        en: "Released in 2015, Mayuri Judgment is an original film built around Mayuri and a new Spirit-related anomaly. It plays like a standalone event and works well after Season 2.",
        ja: "2015 年公開のオリジナル劇場版で、万由里と異常な霊力現象を軸に展開します。独立した事件として見やすく、第二期後の補足エピソードとして相性の良い作品です。"
      }
    },
    {
      year: {
        zh: "第三季 · 2019",
        en: "Season 3 · 2019",
        ja: "第3期 · 2019"
      },
      text: {
        zh: "折纸篇与七罪篇让《约会大作战》从攻略日常真正进入创伤、悖论与自我认同的深水区。折纸的反转与七罪的自卑，把故事的情绪重量明显抬高了一截。",
        en: "With Origami and Natsumi's arcs, Season 3 takes DATE A LIVE into deeper territory: trauma, paradox, and identity. Origami's reversal and Natsumi's self-image struggles raise the emotional stakes sharply.",
        ja: "第三期の折紙編と七罪編では、物語が『攻略型ラブコメ』の顔を越えて、トラウマやパラドックス、自己認識の問題へ深く踏み込みます。折紙の反転と七罪の自己否定が、作品の感情的な重みを大きく引き上げました。"
      }
    },
    {
      year: {
        zh: "外传 · Date A Bullet",
        en: "Spin-off · Date A Bullet",
        ja: "外伝 · Date A Bullet"
      },
      text: {
        zh: "狂三外传在 2020 年分成《Dead or Bullet》和《Nightmare or Queen》两部上映，把视角拉进邻界与狂三分身的战场。它不改写 TV 主线，却让狂三相关世界观一下子厚了很多。",
        en: "Released in 2020 as Dead or Bullet and Nightmare or Queen, Date A Bullet dives into the Neighboring World and Kurumi's alternate selves. It stands outside the TV main plot, yet greatly expands Kurumi's mythos.",
        ja: "2020 年公開の『Dead or Bullet』『Nightmare or Queen』は、狂三の分身たちと隣界の戦場へ視点を移します。TV 本編を直接書き換えるわけではありませんが、狂三まわりの世界観を大きく厚くしてくれる外伝です。"
      }
    },
    {
      year: {
        zh: "第四季 · 2022",
        en: "Season 4 · 2022",
        ja: "第4期 · 2022"
      },
      text: {
        zh: "本条二亚与星宫六喰相继登场，故事主题一路延伸到记录、创作、封印与孤独。与此同时，始源真相也终于不再只是隐约的影子，而开始有了明确轮廓。",
        en: "Season 4 brings in Nia and Mukuro, adding themes of creation, records, sealing, and loneliness. At the same time, the truth surrounding the Origin Spirit finally begins to take clear shape.",
        ja: "第四期では二亜と六喰が登場し、記録、創作、封印、孤独といったテーマが物語をさらに広げていきます。同時に、始源精霊にまつわる真相も、ぼんやりした影ではなく具体的な輪郭を持ち始めます。"
      }
    },
    {
      year: {
        zh: "第五季 · 2024",
        en: "Season 5 · 2024",
        ja: "第5期 · 2024"
      },
      text: {
        zh: "主线进入大战与揭晓阶段，狂三对抗 DEM、澪的身份以及众精灵诞生的根源逐步拼回完整。动画第五季于 2024 年 6 月 26 日播毕，TV 剧情也由此推进到原作第十九卷对应内容。",
        en: "Season 5 pushes the main story into revelation and all-out conflict, piecing together Kurumi's battle against DEM, Mio's identity, and the origin of the Spirits themselves. The season finished airing on June 26, 2024, covering material up to volume 19 of the novels.",
        ja: "第五期では物語が大戦と真相開示の段階へ入り、DEM と戦う狂三、澪の正体、そして精霊たちが生まれた根源が少しずつ一つに繋がっていきます。アニメ第五期は 2024 年 6 月 26 日に放送終了し、原作第十九巻相当までが映像化されました。"
      }
    }
  ];
  let toastTimer = null;
  let audioCtx = null;
  let bgmAudio = null;
  let audioOn = false;
  let audioUnlockArmed = false;
  let settingsDrawerOpen = false;
  const settingsState = { ...defaultSettings };
  let activeIndex = 0;
  let activeMode = "date";
  let activeGameId = params.get("game") || "date";
  let dateStep = 0;
  let dateTrail = [];
  let angelPulse = 0;
  let angelPulseTimer = null;
  let angelState = null;
  let selectedAngelTrialId = params.get("trial") || "";
  let gachaSpinning = false;
  let gachaUnlocked = [];
  let gachaView = params.get("view") === "gallery" ? "gallery" : "summon";
  let gachaCurrentCardId = null;
  let gachaRevealReady = false;
  let gachaFlipRunId = 0;
  let gachaRevealTimeout = null;
  let gachaFinalizeTimeout = null;
  const ANGEL_PULSE_ZONE = { min: 43, max: 63 };
  const ANGEL_PULSE_SPEED = 38;

  function getCharacterById(id) {
    return characters.find((character) => character.id === id) || characters[0];
  }

  function getCharacterIndexById(id) {
    if (!id) return -1;
    return characters.findIndex((character) => character.id === id.trim());
  }

  function getCharacterIndexByName(name) {
    if (!name) return -1;
    return characters.findIndex((character) => character.name === name.trim());
  }

  function getAngelTrials() {
    return games.angel?.trials || [];
  }

  function getAngelTrialByCharacterId(characterId) {
    return getAngelTrials().find((trial) => trial.characterId === characterId) || null;
  }

  function getCurrentAngelTrial() {
    const trials = getAngelTrials();
    if (!trials.length) return null;
    const direct = getAngelTrialByCharacterId(selectedAngelTrialId);
    if (direct) return direct;
    selectedAngelTrialId = trials[0].characterId;
    return trials[0];
  }

  function setAngelTrial(characterId, options = {}) {
    const trial = getAngelTrialByCharacterId(characterId);
    if (!trial) return;
    selectedAngelTrialId = trial.characterId;
    angelState = buildAngelState(trial.characterId);
    updateUrlParam("trial", trial.characterId);
    if (options.syncCharacter !== false) {
      const nextIndex = getCharacterIndexById(trial.characterId);
      if (nextIndex >= 0) {
        activeIndex = nextIndex;
        updateCharacterView(options.toast ? "switch" : "init");
      }
    }
    renderAngelGame();
    if (options.toast) {
      showToast(t("angelTrialToastSelected", { name: getCharacterById(trial.characterId).name }));
    }
  }

  function getInitialCharacterIndex() {
    const explicitId = document.body?.dataset?.defaultCharacter;
    const petName = document.getElementById("petName")?.textContent;
    const heroAlt = document.getElementById("heroFigure")?.alt;
    const candidates = [
      getCharacterIndexById(explicitId),
      getCharacterIndexByName(petName),
      getCharacterIndexByName(heroAlt)
    ];
    const found = candidates.find((index) => index >= 0);
    return found >= 0 ? found : 0;
  }

  function shuffle(list) {
    const clone = [...list];
    for (let i = clone.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  }

  function loadStoredIds(key) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveStoredIds(key, ids) {
    try {
      window.localStorage.setItem(key, JSON.stringify(ids));
    } catch (error) {
      return;
    }
  }

  function loadGachaUnlocked() {
    return loadStoredIds(storageKeys.gachaUnlocks).filter((id) => getCharacterIndexById(id) >= 0);
  }

  function persistGachaUnlocked() {
    saveStoredIds(storageKeys.gachaUnlocks, gachaUnlocked);
  }

  function clampVolume(value) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return defaultSettings.volume;
    return Math.min(100, Math.max(0, Math.round(numeric)));
  }

  function getStoredString(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function setStoredString(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  }

  function loadSettingsState() {
    const storedTheme = getStoredString(storageKeys.musicTheme, defaultSettings.musicTheme);
    const storedMode = getStoredString(storageKeys.mode, defaultSettings.mode);
    const storedVolume = clampVolume(getStoredString(storageKeys.volume, defaultSettings.volume));
    const storedLanguage = getStoredString(storageKeys.language, defaultSettings.language);
    settingsState.musicTheme = musicThemeMeta[storedTheme] ? storedTheme : defaultSettings.musicTheme;
    settingsState.mode = storedMode === "night" ? "night" : "day";
    settingsState.volume = storedVolume;
    settingsState.language = supportedLanguages.includes(storedLanguage) ? storedLanguage : defaultSettings.language;
    audioOn = settingsState.musicTheme !== "mute" && settingsState.volume > 0;
  }

  function persistSettingsState() {
    setStoredString(storageKeys.musicTheme, settingsState.musicTheme);
    setStoredString(storageKeys.volume, String(settingsState.volume));
    setStoredString(storageKeys.mode, settingsState.mode);
    setStoredString(storageKeys.language, settingsState.language);
  }

  function getLocale() {
    return supportedLanguages.includes(settingsState.language) ? settingsState.language : defaultSettings.language;
  }

  function pickLocalizedText(value, fallback = "") {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const locale = getLocale();
      return value[locale] || value.zh || value.en || value.ja || fallback;
    }
    return value ?? fallback;
  }

  function t(key, replacements = {}) {
    const locale = getLocale();
    const parts = key.split(".");
    let current = uiCopy[locale];
    for (const part of parts) {
      current = current?.[part];
    }
    let text = current ?? parts.reduce((acc, part) => acc?.[part], uiCopy.zh) ?? key;
    if (typeof text !== "string") return text;
    Object.entries(replacements).forEach(([name, value]) => {
      text = text.replaceAll(`{${name}}`, value);
    });
    return text;
  }

  function getSettingsLocaleMeta(language = getLocale()) {
    return settingsLocaleMeta[language] || settingsLocaleMeta.zh;
  }

  function getLanguageOptionMeta(optionLanguage, displayLanguage = getLocale()) {
    const meta = getSettingsLocaleMeta(displayLanguage);
    return meta.languageOptions?.[optionLanguage] || settingsLocaleMeta.zh.languageOptions[optionLanguage] || {
      short: optionLanguage.toUpperCase(),
      long: optionLanguage
    };
  }

  function gachaT(key, replacements = {}) {
    return t(`gachaUi.${key}`, replacements);
  }

  function getGachaRoleLabel(character) {
    if (!character) return "";
    const locale = getLocale();
    if (locale === "zh") return pickLocalizedText(character.role);
    return gachaCharacterCopy[character.id]?.role?.[locale] || character.codename;
  }

  function getGachaAliasLabel(character) {
    if (!character) return "";
    const locale = getLocale();
    if (locale === "zh") return pickLocalizedText(character.role, character.codename);
    if (locale === "ja") return gachaCharacterCopy[character.id]?.role?.ja || character.codename;
    return character.codename;
  }

  function getGachaFlavorLine(character) {
    if (!character) return "";
    const locale = getLocale();
    if (locale === "zh") return pickLocalizedText(character.quote);
    return gachaCharacterCopy[character.id]?.line?.[locale] || character.codename;
  }

  function getGachaCardNote(character) {
    if (!character) return "";
    let suffix = getGachaRoleLabel(character);
    if (!suffix || suffix === character.codename) suffix = character.angel;
    return `${character.codename} · ${suffix}`;
  }

  function getMusicThemeLocaleMeta(theme = settingsState.musicTheme) {
    const meta = musicThemeMeta[theme] || musicThemeMeta[defaultSettings.musicTheme];
    return meta.i18n?.[getLocale()] || meta.i18n?.zh || { label: meta.label, description: meta.description };
  }

  function getAngelTrialField(trial, key, fallback = "") {
    return pickLocalizedText(trial?.[key], fallback);
  }

  function getCharacterField(character, key, fallback = "") {
    const locale = getLocale();
    if (locale !== "zh" && character?.id) {
      const localized = characterLocaleMeta[character.id]?.[key]?.[locale];
      if (localized) return localized;
    }
    return pickLocalizedText(character?.[key], fallback);
  }

  function getCharacterDetailLocaleValue(character, key, fallback = null) {
    const locale = getLocale();
    if (locale !== "zh" && character?.id) {
      const localized = characterDetailLocaleMeta[character.id]?.[key]?.[locale];
      if (localized) return localized;
    }
    const original = character?.[key];
    if (original !== undefined) return original;
    return fallback;
  }

  function getSharedCharacterFieldValue(field, value, fallback = "") {
    const locale = getLocale();
    if (locale !== "zh" && typeof value === "string") {
      const localized = sharedCharacterFieldLocaleMeta[field]?.[value]?.[locale];
      if (localized) return localized;
    }
    return value ?? fallback;
  }

  function getCharacterName(character, fallback = "") {
    return getCharacterField(character, "name", fallback || character?.name || "");
  }

  function getCharacterRole(character, fallback = "") {
    const original = fallback || character?.role || "";
    const localized = getCharacterField(character, "role", original);
    if (localized && localized !== original) {
      return localized;
    }
    const locale = getLocale();
    if (locale !== "zh" && character?.id) {
      const fallbackRole = gachaCharacterCopy[character.id]?.role?.[locale];
      if (fallbackRole) return fallbackRole;
    }
    return localized;
  }

  function getCharacterAbility(character, fallback = "") {
    return getSharedCharacterFieldValue("ability", getCharacterField(character, "ability", fallback || character?.ability || ""), fallback || character?.ability || "");
  }

  function getCharacterAstralDress(character, fallback = "") {
    return getSharedCharacterFieldValue("astralDress", getCharacterField(character, "astralDress", fallback || character?.astralDress || ""), fallback || character?.astralDress || "");
  }

  function getAngelResultCopy(character) {
    const id = character?.id;
    const locale = getLocale();
    const localized = id ? angelResultLocaleMeta[id] : null;
    if (localized) {
      return {
        title: pickLocalizedText(localized.title),
        lines: pickLocalizedText(localized.lines, []),
        signature: pickLocalizedText(localized.signature)
      };
    }
    return {
      title: locale === "ja"
        ? `${getCharacterDisplayName(character, character?.name)} の霊波はもう静かに安定しています。`
        : locale === "en"
          ? `${getCharacterDisplayName(character, character?.name)}'s Spirit wave has finally settled into a stable rhythm.`
          : `${getCharacterDisplayName(character, character?.name)} 的灵波已经安稳落定。`,
      lines: locale === "ja"
        ? [
            "今回の共鳴は、彼女の心の揺れまでもあなたのほうへ静かに導きました。",
            "あなたがこのままそばにいてくれるなら、その返答はきっともう少し長く続いていきます。"
          ]
        : locale === "en"
          ? [
              "This resonance has gently guided even her feelings in your direction.",
              "If you choose to stay, that answer will likely continue a little longer."
            ]
          : [
              "这次共鸣把她的心绪也一并带向了你。",
              "只要你愿意停留，她会让这份回应继续延长下去。"
            ],
      signature: locale === "ja"
        ? `${getCharacterDisplayName(character, character?.name)}：今度は、もう少しだけあなたの近くにいさせてください。`
        : locale === "en"
          ? `${getCharacterDisplayName(character, character?.name)}: This time, let me stay a little closer to you.`
          : `${getCharacterDisplayName(character, character?.name)}：这一次，就让我更靠近你一点吧。`
    };
  }

  function getCharacterFaction(character, fallback = "") {
    return getSharedCharacterFieldValue("faction", getCharacterField(character, "faction", fallback || character?.faction || ""), fallback || character?.faction || "");
  }

  function getCharacterFavoriteFood(character, fallback = "") {
    const localized = getCharacterDetailLocaleValue(character, "favoriteFood");
    if (typeof localized === "string" && localized) return localized;
    return getCharacterField(character, "favoriteFood", fallback || character?.favoriteFood || "");
  }

  function getCharacterDebut(character, fallback = "") {
    return getSharedCharacterFieldValue("debut", getCharacterField(character, "debut", fallback || character?.debut || ""), fallback || character?.debut || "");
  }

  function getCharacterQuote(character, fallback = "") {
    const original = fallback || character?.quote || "";
    const localized = getCharacterField(character, "quote", original);
    if (localized && localized !== original) {
      return localized;
    }
    const locale = getLocale();
    if (locale !== "zh" && character?.id) {
      const fallbackQuote = gachaCharacterCopy[character.id]?.line?.[locale];
      if (fallbackQuote) return fallbackQuote;
    }
    return localized;
  }

  function getCharacterTheme(character, fallback = "") {
    return getCharacterField(character, "theme", fallback || character?.theme || "");
  }

  function getCharacterMood(character, fallback = "") {
    return getCharacterField(character, "mood", fallback || character?.mood || "");
  }

  function getCharacterAbilityDetail(character, fallback = "") {
    const localized = getCharacterDetailLocaleValue(character, "abilityDetail");
    if (typeof localized === "string" && localized) return localized;
    return pickLocalizedText(character?.abilityDetail, fallback || character?.abilityDetail || "");
  }

  function getCharacterAstralNote(character, fallback = "") {
    const localized = getCharacterDetailLocaleValue(character, "astralNote");
    if (typeof localized === "string" && localized) return localized;
    return pickLocalizedText(character?.astralNote, fallback || character?.astralNote || "");
  }

  function getCharacterPersonalityItems(character) {
    return getCharacterDetailLocaleValue(character, "personality", character?.personality || []) || [];
  }

  function getCharacterFormsDetailed(character) {
    return getCharacterDetailLocaleValue(character, "formsDetailed", character?.formsDetailed || []) || [];
  }

  function getCharacterOtherForms(character) {
    const locale = getLocale();
    if (locale !== "zh" && character?.id) {
      const localized = characterOtherFormsLocaleMeta[character.id]?.[locale];
      if (Array.isArray(localized) && localized.length) return localized;
    }
    return character?.otherForms || [];
  }

  function getCharacterStoryFocusItems(character) {
    return getCharacterDetailLocaleValue(character, "storyFocus", character?.storyFocus || []) || [];
  }

  function getCharacterRelationshipItems(character) {
    return getCharacterDetailLocaleValue(character, "relationships", character?.relationships || []) || [];
  }

  function getCharacterTriviaItems(character) {
    return getCharacterDetailLocaleValue(character, "trivia", character?.trivia || []) || [];
  }

  function getCharacterSourceNote(character, fallback = "") {
    const locale = getLocale();
    if (locale !== "zh" && character?.sourceNote && typeof character.sourceNote === "string") {
      return locale === "ja"
        ? "資料は Date A Live Wiki のキャラクターページ（確認日: 2026年5月25日）と、アニメ・原作の公開設定をもとに整理しています。"
        : "Compiled from Date A Live Wiki character pages (checked on May 25, 2026) together with publicly available anime and light novel setting materials.";
    }
    return getCharacterField(character, "sourceNote", fallback || character?.sourceNote || "");
  }

  function getCharacterDetailCopy(character, fallback = "") {
    return getCharacterField(character, "detail", fallback || character?.detail || "");
  }

  function getCharacterDisplayName(character, fallback = "") {
    return getCharacterName(character, fallback || character?.name || "");
  }

  function getCharacterFormValue(item) {
    return pickLocalizedText(item?.value, item?.value || item?.type || "");
  }

  function getPageTitle() {
    const locale = getLocale();
    const titleMap = {
      home: {
        zh: "デート・ア・ライブ",
        en: "DATE A LIVE",
        ja: "デート・ア・ライブ"
      },
      archive: {
        zh: "精灵档案入口 · 约会大作战",
        en: "Spirit Archive · DATE A LIVE",
        ja: "精霊アーカイブ · デート・ア・ライブ"
      },
      character: {
        zh: "角色详情 · 约会大作战",
        en: "Character Profile · DATE A LIVE",
        ja: "キャラクター詳細 · デート・ア・ライブ"
      },
      timeline: {
        zh: "剧情总览 · デート・ア・ライブ",
        en: "Story Timeline · DATE A LIVE",
        ja: "物語年表 · デート・ア・ライブ"
      },
      story: {
        zh: "开篇剧情区 · 约会大作战",
        en: "Story Prologue · DATE A LIVE",
        ja: "物語序章 · デート・ア・ライブ"
      },
      games: {
        zh: "小游戏区 · 约会大作战",
        en: "Mini Games · DATE A LIVE",
        ja: "ミニゲーム · デート・ア・ライブ"
      },
      game: {
        zh: "互动小游戏 · 约会大作战",
        en: "Interactive Game · DATE A LIVE",
        ja: "インタラクティブゲーム · デート・ア・ライブ"
      }
    };
    const pageTitle = titleMap[pageType] || titleMap.home;
    return pageTitle[locale] || pageTitle.zh;
  }

  function updateUrlParam(name, value) {
    if (pageType !== "game" && pageType !== "character") return;
    const url = new URL(window.location.href);
    if (value === null || value === undefined || value === "") url.searchParams.delete(name);
    else url.searchParams.set(name, value);
    window.history.replaceState({}, "", url);
  }

  function colorWithAlpha(color, alpha = 0.54) {
    if (!color) return `rgba(140, 125, 255, ${alpha})`;
    if (color.startsWith("rgba(")) {
      return color.replace(/rgba\(([^)]+),\s*[\d.]+\)/, `rgba($1, ${alpha})`);
    }
    if (color.startsWith("rgb(")) {
      return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
    }
    if (color.startsWith("#")) {
      let hex = color.slice(1);
      if (hex.length === 3) hex = hex.split("").map((part) => part + part).join("");
      const r = Number.parseInt(hex.slice(0, 2), 16);
      const g = Number.parseInt(hex.slice(2, 4), 16);
      const b = Number.parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return color;
  }

  function getResultSceneVariant(gameId, characterId) {
    return `result-scene--${gameId} result-scene--${characterId}`;
  }

  function getGameResultFigure(gameId, character) {
    return resultFigureMap[character.id] || character.image;
  }

  function buildResultFrame(character, lines = [], signature = "", moodTag = "") {
    const content = lines
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join("");
    return `
      <div class="result-frame">
        ${moodTag ? `<span class="result-frame__tag">${moodTag}</span>` : ""}
        <div class="result-frame__body">
          ${content}
        </div>
        ${signature ? `<div class="result-frame__signature">${signature}</div>` : ""}
      </div>
    `;
  }

  function buildCharacterScene(character, options = {}) {
    const background = options.background || character.bg;
    const figure = options.figure || character.image;
    const backgroundUrl = new URL(background, window.location.href).href;
    const figureUrl = new URL(figure, window.location.href).href;
    const kicker = options.kicker || character.angel;
    const body = options.body || character.quote;
    const extra = options.extra || "";
    const className = options.className || "";
    const headlineNote = options.headlineNote || "";
    const nameMeta = options.nameMeta || `${character.codename} · ${character.angel}`;
    return `
      <section class="result-scene ${className}" style="--scene-bg:url('${backgroundUrl}');--scene-accent:${character.accent};--scene-glow:${character.glow};">
        <div class="result-scene__shade"></div>
        ${options.showFigure === false ? "" : `<img class="result-scene__figure" src="${figureUrl}" alt="${getCharacterDisplayName(character, character.name)}" />`}
        <div class="result-scene__copy">
          <span class="result-kicker">${kicker}</span>
          <div class="result-nameplate">
            ${headlineNote ? `<span class="result-nameplate__eyebrow">${headlineNote}</span>` : ""}
            <h4>${getCharacterDisplayName(character, character.name)}</h4>
            <span class="result-nameplate__meta">${nameMeta}</span>
          </div>
          <p class="result-scene__lead">${body}</p>
          ${extra}
        </div>
      </section>
    `;
  }

  function applyResultModalTheme(theme = "date", character = null) {
    const resultModal = document.getElementById("resultModal");
    const resultCard = resultModal?.querySelector(".modal-card");
    const resultTag = resultModal?.querySelector(".detail-top .tag");
    if (!resultCard) return;
    Object.values(resultModalMeta).forEach((meta) => resultCard.classList.remove(meta.className));
    const activeMeta = resultModalMeta[theme] || resultModalMeta.date;
    resultCard.classList.add(activeMeta.className);
    const accent = character?.accent || "#8c7dff";
    const soft = character?.glow || "rgba(140, 125, 255, 0.42)";
    resultCard.style.setProperty("--modal-accent", accent);
    resultCard.style.setProperty("--modal-soft", soft);
    if (resultTag) resultTag.textContent = activeMeta.tag;
  }

  function applyRulesModalTheme(theme = "date") {
    const rulesModal = document.getElementById("rulesModal");
    const rulesCard = rulesModal?.querySelector(".modal-card");
    if (!rulesCard) return;

    Object.values(resultModalMeta).forEach((meta) => rulesCard.classList.remove(meta.className));
    const activeTheme = rulesModalThemeMeta[theme] || rulesModalThemeMeta.date;
    const activeMeta = resultModalMeta[activeTheme.theme] || resultModalMeta.date;

    rulesCard.classList.add(activeMeta.className);
    rulesCard.style.setProperty("--modal-accent", activeTheme.accent);
    rulesCard.style.setProperty("--modal-soft", activeTheme.soft);
  }

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function getMasterGainValue(gain = 1) {
    if (!audioOn) return 0;
    return Math.max(0, Math.min(0.24, gain * (settingsState.volume / 100)));
  }

  function ensureAudio() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    return audioCtx;
  }

  function tone(freq, duration = 0.14, type = "sine", gain = 0.05) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const masterGain = getMasterGainValue(gain);
    if (masterGain <= 0) return;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(amp);
    amp.connect(ctx.destination);
    const now = ctx.currentTime;
    amp.gain.setValueAtTime(0, now);
    amp.gain.linearRampToValueAtTime(masterGain, now + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  function queueTone(freq, delay, duration, type, gain) {
    window.setTimeout(() => tone(freq, duration, type, gain), delay);
  }

  function getMusicThemeLabel(theme = settingsState.musicTheme) {
    return getMusicThemeLocaleMeta(theme).label;
  }

  function ensureBgmAudio() {
    if (!bgmAudio) {
      bgmAudio = new Audio();
      bgmAudio.loop = true;
      bgmAudio.preload = "auto";
    }
    bgmAudio.volume = Math.max(0, Math.min(1, settingsState.volume / 100));
    return bgmAudio;
  }

  function getCurrentMusicMeta() {
    return musicThemeMeta[settingsState.musicTheme] || null;
  }

  function playAmbient() {
    const track = getCurrentMusicMeta();
    if (!audioOn || !track || settingsState.musicTheme === "mute" || !track.file) return;
    const audio = ensureBgmAudio();
    const targetSrc = new URL(track.file, window.location.href).href;
    if (audio.src !== targetSrc) {
      audio.src = targetSrc;
      audio.load();
    }
    audio.volume = Math.max(0, Math.min(1, settingsState.volume / 100));
    return audio.play().catch(() => {});
  }

  function bindBgmStatus() {
    const audio = ensureBgmAudio();
    audio.addEventListener("error", () => {
      const track = getCurrentMusicMeta();
      if (!track || settingsState.musicTheme === "mute") return;
      showToast(t("trackMissingToast", { theme: getMusicThemeLabel(settingsState.musicTheme) }));
    });
  }

  function syncTheme(index) {
    const c = characters[index];
    if (!c) return;
    document.documentElement.style.setProperty("--accent", c.accent);
    document.documentElement.style.setProperty("--accent-soft", c.glow);
    document.documentElement.style.setProperty("--pet-glow", c.glow);
  }

  function syncCycleRoleLabel() {
    const cycleRoleBtn = document.getElementById("cycleRole");
    if (!cycleRoleBtn || pageType !== "character" || !characters[activeIndex]) return;
    cycleRoleBtn.textContent = `${t("cycleRolePrefix")}${getCharacterName(characters[activeIndex], characters[activeIndex].name)}`;
  }

  function setElementBackground(element, background, overlay) {
    if (!element || !background) return;
    element.style.backgroundImage = `${overlay}, url('${background}')`;
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
  }

  function applyCharacterBackground(character) {
    const art = document.getElementById("characterArt");
    const petWrap = document.querySelector(".themed-pet");
    if (art && character.bg) {
      setElementBackground(
        art,
        character.bg,
        "linear-gradient(180deg, rgba(8, 10, 22, 0.26), rgba(8, 10, 22, 0.82))"
      );
    }
    if (petWrap && character.bg) {
      setElementBackground(
        petWrap,
        character.bg,
        "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(9,8,22,0.74))"
      );
    }
  }

  function setBodyMode(mode) {
    document.body.dataset.mode = mode === "night" ? "night" : "day";
  }

  function applyModeSetting() {
    setBodyMode(settingsState.mode);
    const toggle = document.getElementById("modeToggle");
    const thumb = document.getElementById("modeToggleThumb");
    if (toggle) toggle.setAttribute("aria-checked", String(settingsState.mode === "day"));
    if (thumb) thumb.textContent = settingsState.mode === "day" ? "☀" : "☾";
    const modeTag = document.getElementById("modeTag");
    if (modeTag) modeTag.textContent = settingsState.mode === "day" ? t("settingsModeDay") : t("settingsModeNight");
  }

  function stopAmbientLoop() {
    const audio = ensureBgmAudio();
    audio.pause();
  }

  function startAmbientLoop(options = {}) {
    audioOn = settingsState.musicTheme !== "mute" && settingsState.volume > 0;
    if (!audioOn || !options.ensureUnlocked) return;
    playAmbient();
  }

  function syncSoundToggleLabel() {
    const soundToggle = document.getElementById("soundToggle");
    if (!soundToggle) return;
    soundToggle.textContent = audioOn ? t("soundStateOn") : t("soundStateOff");
    soundToggle.dataset.state = audioOn ? "on" : "off";
    soundToggle.hidden = true;
    soundToggle.setAttribute("aria-hidden", "true");
  }

  function syncMusicThemeSelector() {
    const select = document.getElementById("musicThemeSelect");
    const trigger = document.getElementById("musicThemeTrigger");
    const label = document.getElementById("musicThemeCurrent");
    const hint = document.getElementById("musicThemeHint");
    const meta = getMusicThemeLocaleMeta(settingsState.musicTheme);
    if (select) select.value = settingsState.musicTheme;
    if (trigger) trigger.querySelector(".settings-select__value").textContent = meta.label;
    if (label) label.textContent = meta.label;
    if (hint) hint.textContent = meta.description;
    document.querySelectorAll("[data-music-option]").forEach((option) => {
      option.classList.toggle("is-active", option.dataset.musicOption === settingsState.musicTheme);
      const optionMeta = getMusicThemeLocaleMeta(option.dataset.musicOption);
      option.querySelector(".settings-option__title").textContent = optionMeta.label;
      option.querySelector(".settings-option__desc").textContent = optionMeta.description;
    });
  }

  function syncVolumeControl() {
    const range = document.getElementById("volumeRange");
    const value = document.getElementById("volumeValue");
    if (range) range.value = String(settingsState.volume);
    if (value) value.textContent = `${settingsState.volume}%`;
  }

  function syncLanguageControl() {
    document.querySelectorAll("[data-language-option]").forEach((option) => {
      const optionLanguage = option.dataset.languageOption;
      const labels = getLanguageOptionMeta(optionLanguage);
      option.classList.toggle("is-active", optionLanguage === getLocale());
      const strong = option.querySelector("strong");
      const span = option.querySelector("span");
      if (strong) strong.textContent = labels.short;
      if (span) span.textContent = labels.long;
    });
  }

  function renderAuthorCard() {
    const authorCard = document.getElementById("authorCard");
    if (!authorCard) return;
    authorCard.innerHTML = `
      <img class="author-card__gif" src="${authorProfile.gif}" alt="${authorProfile.name}" />
      <div class="author-card__title">
        <strong>${authorProfile.name}</strong>
        <span>${pickLocalizedText(authorProfile.label)}</span>
      </div>
      <p>${pickLocalizedText(authorProfile.detail)}</p>
      <p>${pickLocalizedText(authorProfile.note)}</p>
      <span class="author-card__contact">${pickLocalizedText(authorProfile.contact)}</span>
    `;
  }

  function applyStaticCopy() {
    const settingsMeta = getSettingsLocaleMeta();
    const textMap = {
      homeBrand: t("homeBrand"),
      homeTitle: t("homeTitle"),
      homeArchiveTitle: t("homeArchiveTitle"),
      homeArchiveDesc: t("homeArchiveDesc"),
      homeTimelineTitle: t("homeTimelineTitle"),
      homeTimelineDesc: t("homeTimelineDesc"),
      homeGamesTitle: t("homeGamesTitle"),
      homeGamesDesc: t("homeGamesDesc"),
      archiveBackLink: t("archiveBackLink"),
      archiveTitle: t("archiveTitle"),
      archiveLead: t("archiveLead"),
      characterBackLink: t("characterBackLink"),
      heroBadge: t("characterHeroBadge"),
      sectionOverviewTitle: t("sectionOverviewTitle"),
      sectionStoryTitle: t("sectionStoryTitle"),
      sectionFormsTitle: t("sectionFormsTitle"),
      sectionPersonalityTitle: t("sectionPersonalityTitle"),
      sectionRelationsTitle: t("sectionRelationsTitle"),
      sectionTriviaTitle: t("sectionTriviaTitle"),
      infoboxProfileTitle: t("infoboxProfileTitle"),
      infoboxFormsTitle: t("infoboxFormsTitle"),
      infoboxDetailTitle: t("infoboxDetailTitle"),
      infoboxQuoteTitle: t("infoboxQuoteTitle"),
      infoboxSourceTitle: t("infoboxSourceTitle"),
      petModeChip: t("petModeChip"),
      petWaveBtn: t("petWaveBtn"),
      petQuoteBtn: t("petQuoteBtn"),
      petSwitchBtn: t("petSwitchBtn"),
      gamesBackLink: t("gamesBackLink"),
      gamesHubTitle: t("gamesHubTitle"),
      gamesHubLead: t("gamesHubLead"),
      gameBackLink: t("gameBackLink"),
      openRules: t("openRules"),
      timelineBackLink: t("timelineBackLink"),
      timelineTitle: t("timelineTitle"),
      timelineLead: t("timelineLead"),
      timelineHeroTitle: t("timelineHeroTitle"),
      timelineHeroSub: t("timelineHeroSub"),
      storyBackLink: t("storyBackLink"),
      storyTitle: t("storyTitle"),
      storyLead: t("storyLead"),
      storyHeroTitle: t("storyHeroTitle"),
      storyHeroSub: t("storyHeroSub"),
      settingsKicker: t("settingsKicker"),
      settingsTitle: t("settingsTitle"),
      settingsMusicTitle: t("settingsMusicTitle"),
      settingsMusicLabel: t("settingsMusicLabel"),
      settingsVolumeTitle: t("settingsVolumeTitle"),
      settingsModeTitle: t("settingsModeTitle"),
      settingsLanguageTitle: t("settingsLanguageTitle"),
      settingsLanguageNote: t("settingsLanguageNote"),
      settingsAuthorTitle: t("settingsAuthorTitle")
    };
    Object.entries(textMap).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = value;
    });

    const storyIntro = document.getElementById("storyIntroLines");
    if (storyIntro) {
      storyIntro.innerHTML = t("storyIntroLines").map((line) => `<span>${line}</span>`).join("");
    }

    const modeTag = document.getElementById("modeTag");
    if (modeTag) modeTag.textContent = settingsState.mode === "day" ? t("settingsModeDay") : t("settingsModeNight");
    syncCycleRoleLabel();

    const settingsToggle = document.getElementById("settingsToggle");
    if (settingsToggle) settingsToggle.setAttribute("aria-label", settingsMeta.openSettingsAria);

    const settingsClose = document.getElementById("settingsClose");
    if (settingsClose) settingsClose.setAttribute("aria-label", settingsMeta.closeSettingsAria);

    const volumeRange = document.getElementById("volumeRange");
    if (volumeRange) volumeRange.setAttribute("aria-label", settingsMeta.volumeAria);

    const modeToggle = document.getElementById("modeToggle");
    if (modeToggle) modeToggle.setAttribute("aria-label", settingsMeta.modeToggleAria);

    document.documentElement.lang = getLocale() === "zh" ? "zh-CN" : getLocale();
    document.title = getPageTitle();
  }

  function syncSettingsUI() {
    syncSoundToggleLabel();
    syncMusicThemeSelector();
    syncVolumeControl();
    syncLanguageControl();
    renderAuthorCard();
    applyStaticCopy();
    applyModeSetting();
  }

  function buildSettingsDrawerMarkup() {
    const settingsMeta = getSettingsLocaleMeta();
    return `
      <button class="settings-fab" id="settingsToggle" type="button" aria-label="${settingsMeta.openSettingsAria}" aria-expanded="false">
        <span class="settings-fab__gear">⚙</span>
      </button>
      <div class="settings-overlay" id="settingsOverlay" hidden></div>
      <aside class="settings-drawer" id="settingsDrawer" aria-hidden="true">
        <div class="settings-drawer__header">
          <div>
            <span class="settings-kicker" id="settingsKicker">${t("settingsKicker")}</span>
            <h3 id="settingsTitle">${t("settingsTitle")}</h3>
          </div>
          <button class="settings-close" id="settingsClose" type="button" aria-label="${settingsMeta.closeSettingsAria}">×</button>
        </div>
        <section class="settings-section">
          <div class="settings-section__head">
            <strong id="settingsMusicTitle">${t("settingsMusicTitle")}</strong>
            <span class="tag" id="musicThemeCurrent">${getMusicThemeLabel()}</span>
          </div>
          <p class="settings-note" id="musicThemeHint">${getMusicThemeLocaleMeta(settingsState.musicTheme).description}</p>
          <label class="settings-label" id="settingsMusicLabel" for="musicThemeSelect">${t("settingsMusicLabel")}</label>
          <div class="settings-select-wrap" id="musicThemeWrap">
            <button class="settings-select" id="musicThemeTrigger" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span class="settings-select__value">${getMusicThemeLabel()}</span>
              <span class="settings-select__arrow">⌄</span>
            </button>
            <div class="settings-select-panel" id="musicThemePanel" aria-hidden="true">
              ${Object.keys(musicThemeMeta).map((id) => {
                const meta = getMusicThemeLocaleMeta(id);
                return `
                <button class="settings-option" type="button" data-music-option="${id}">
                  <span class="settings-option__title">${meta.label}</span>
                  <span class="settings-option__desc">${meta.description}</span>
                </button>
              `;
              }).join("")}
            </div>
          </div>
          <select class="settings-select-native" id="musicThemeSelect" aria-hidden="true" tabindex="-1">
            ${Object.keys(musicThemeMeta).map((id) => `<option value="${id}">${getMusicThemeLocaleMeta(id).label}</option>`).join("")}
          </select>
        </section>
        <section class="settings-section">
          <div class="settings-section__head">
            <strong id="settingsVolumeTitle">${t("settingsVolumeTitle")}</strong>
            <span class="tag" id="volumeValue">68%</span>
          </div>
          <input class="settings-range" id="volumeRange" type="range" min="0" max="100" step="1" value="68" aria-label="${settingsMeta.volumeAria}" />
        </section>
        <section class="settings-section">
          <div class="settings-section__head">
            <strong id="settingsModeTitle">${t("settingsModeTitle")}</strong>
            <span class="tag" id="modeTag">${settingsState.mode === "day" ? t("settingsModeDay") : t("settingsModeNight")}</span>
          </div>
          <button class="mode-toggle" id="modeToggle" type="button" role="switch" aria-checked="true" aria-label="${settingsMeta.modeToggleAria}">
            <span class="mode-toggle__icon mode-toggle__icon--moon">☾</span>
            <span class="mode-toggle__track">
              <span class="mode-toggle__thumb" id="modeToggleThumb">☀</span>
            </span>
            <span class="mode-toggle__icon mode-toggle__icon--sun">☀</span>
          </button>
        </section>
        <section class="settings-section">
          <div class="settings-section__head">
            <strong id="settingsLanguageTitle">${t("settingsLanguageTitle")}</strong>
            <span class="tag">${t("settingsLanguageTag")}</span>
          </div>
          <p class="settings-note" id="settingsLanguageNote">${t("settingsLanguageNote")}</p>
          <div class="language-switch">
            <div class="language-switch__row" id="languageSwitchRow">
              <button class="language-option" type="button" data-language-option="zh">
                <strong>${getLanguageOptionMeta("zh").short}</strong>
                <span>${getLanguageOptionMeta("zh").long}</span>
              </button>
              <button class="language-option" type="button" data-language-option="en">
                <strong>${getLanguageOptionMeta("en").short}</strong>
                <span>${getLanguageOptionMeta("en").long}</span>
              </button>
              <button class="language-option" type="button" data-language-option="ja">
                <strong>${getLanguageOptionMeta("ja").short}</strong>
                <span>${getLanguageOptionMeta("ja").long}</span>
              </button>
            </div>
          </div>
        </section>
        <section class="settings-section settings-section--author">
          <div class="settings-section__head">
            <strong id="settingsAuthorTitle">${t("settingsAuthorTitle")}</strong>
            <span class="tag">${t("settingsAuthorTag")}</span>
          </div>
          <div class="author-card" id="authorCard">
            <img class="author-card__gif" src="${authorProfile.gif}" alt="${authorProfile.name}" />
            <div class="author-card__title">
              <strong>${authorProfile.name}</strong>
              <span>${pickLocalizedText(authorProfile.label)}</span>
            </div>
            <p>${pickLocalizedText(authorProfile.detail)}</p>
            <p>${pickLocalizedText(authorProfile.note)}</p>
            <span class="author-card__contact">${pickLocalizedText(authorProfile.contact)}</span>
          </div>
        </section>
      </aside>
    `;
  }

  function injectSettingsDrawer() {
    if (document.getElementById("settingsDrawer")) return;
    document.body.insertAdjacentHTML("beforeend", buildSettingsDrawerMarkup());
  }

  function setSettingsDrawerState(open) {
    settingsDrawerOpen = open;
    const drawer = document.getElementById("settingsDrawer");
    const overlay = document.getElementById("settingsOverlay");
    const toggle = document.getElementById("settingsToggle");
    if (!drawer || !overlay || !toggle) return;
    drawer.classList.toggle("is-open", open);
    overlay.hidden = !open;
    overlay.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggle.classList.remove("is-opening", "is-closing");
    toggle.classList.add(open ? "is-opening" : "is-closing");
    if (!open) {
      window.setTimeout(() => {
        if (!settingsDrawerOpen) toggle.classList.remove("is-closing");
      }, 380);
    }
    document.body.classList.toggle("drawer-open", open);
  }

  function cycleMode() {
    settingsState.mode = settingsState.mode === "day" ? "night" : "day";
    persistSettingsState();
    applyModeSetting();
    showToast(settingsState.mode === "day" ? t("modeToastDay") : t("modeToastNight"));
  }

  function applyLanguage(language) {
    settingsState.language = supportedLanguages.includes(language) ? language : defaultSettings.language;
    persistSettingsState();
    syncSettingsUI();
    renderTimelinePage();
    if (pageType === "archive") renderDossiers();
    if (pageType === "games") renderGames();
    if (pageType === "game") {
      renderGameDetail();
      renderGameBoard();
    }
    if (pageType === "character") {
      updatePet();
      renderCharacterDetails();
    }
  }

  function applyMusicTheme(theme, options = {}) {
    settingsState.musicTheme = musicThemeMeta[theme] ? theme : defaultSettings.musicTheme;
    audioOn = settingsState.musicTheme !== "mute" && settingsState.volume > 0;
    persistSettingsState();
    syncSettingsUI();
    if (audioOn) {
      startAmbientLoop({ ensureUnlocked: audioUnlockArmed });
      if (options.preview !== false) tone(540, 0.14, "triangle", 0.03);
    } else {
      stopAmbientLoop();
    }
  }

  function applyVolume(value, options = {}) {
    settingsState.volume = clampVolume(value);
    audioOn = settingsState.musicTheme !== "mute" && settingsState.volume > 0;
    persistSettingsState();
    syncSettingsUI();
    if (!audioOn) {
      stopAmbientLoop();
      return;
    }
    if (audioUnlockArmed) {
      startAmbientLoop({ ensureUnlocked: true });
      if (options.preview !== false) tone(480, 0.1, "sine", 0.03);
    }
  }

  function bindSettingsDrawer() {
    const toggle = document.getElementById("settingsToggle");
    const close = document.getElementById("settingsClose");
    const overlay = document.getElementById("settingsOverlay");
    const drawer = document.getElementById("settingsDrawer");
    const themeSelect = document.getElementById("musicThemeSelect");
    const themeTrigger = document.getElementById("musicThemeTrigger");
    const themePanel = document.getElementById("musicThemePanel");
    const volumeRange = document.getElementById("volumeRange");
    const modeToggle = document.getElementById("modeToggle");
    const languageOptions = document.querySelectorAll("[data-language-option]");

    function setThemePanelState(open) {
      if (!themeTrigger || !themePanel) return;
      themeTrigger.setAttribute("aria-expanded", String(open));
      themeTrigger.classList.toggle("is-open", open);
      themePanel.classList.toggle("is-open", open);
      themePanel.setAttribute("aria-hidden", String(!open));
    }

    function closeThemePanel() {
      setThemePanelState(false);
    }

    toggle?.addEventListener("click", () => {
      const nextOpen = !settingsDrawerOpen;
      if (!nextOpen) closeThemePanel();
      setSettingsDrawerState(nextOpen);
    });
    close?.addEventListener("click", () => {
      closeThemePanel();
      setSettingsDrawerState(false);
    });
    overlay?.addEventListener("click", () => {
      closeThemePanel();
      setSettingsDrawerState(false);
    });
    themeTrigger?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const expanded = themeTrigger.getAttribute("aria-expanded") === "true";
      setThemePanelState(!expanded);
    });
    themeSelect?.addEventListener("change", (event) => {
      audioUnlockArmed = true;
      applyMusicTheme(event.target.value);
      showToast(`背景音乐已切换为${getMusicThemeLabel()}`);
      closeThemePanel();
    });
    document.querySelectorAll("[data-music-option]").forEach((option) => {
      option.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (themeSelect) themeSelect.value = option.dataset.musicOption;
        themeSelect?.dispatchEvent(new Event("change", { bubbles: true }));
        closeThemePanel();
      });
    });
    themePanel?.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    volumeRange?.addEventListener("input", (event) => {
      audioUnlockArmed = true;
      applyVolume(event.target.value, { preview: false });
    });
    volumeRange?.addEventListener("change", (event) => {
      audioUnlockArmed = true;
      applyVolume(event.target.value);
      showToast(t("volumeToast", { value: settingsState.volume }));
    });
    modeToggle?.addEventListener("click", cycleMode);
    languageOptions.forEach((option) => {
      option.addEventListener("click", () => applyLanguage(option.dataset.languageOption));
    });
    document.addEventListener("click", (event) => {
      if (!themeTrigger || !themePanel) return;
      if (themeTrigger.contains(event.target) || themePanel.contains(event.target)) return;
      closeThemePanel();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (themeTrigger?.getAttribute("aria-expanded") === "true") {
        closeThemePanel();
        return;
      }
      setSettingsDrawerState(false);
    });
  }

  function updateEntryThumbs() {
    const thumbMap = {
      archive: "assets/module-bg/archive-3333.jpg",
      storyline: "assets/entry-art/timeline-555.jpg",
      games: "assets/module-bg/games-222.jpg"
    };
    document.querySelectorAll(".entry-thumb[data-slot]").forEach((slot) => {
      const key = slot.dataset.slot;
      const asset = thumbMap[key];
      if (!asset) return;
      slot.innerHTML = `<img src="${asset}" alt="${key} cover" />`;
    });
  }

  function renderTimelinePage() {
    const timelineGrid = document.getElementById("timelineGrid");
    if (!timelineGrid) return;
    timelineGrid.innerHTML = timelineEntries.map((entry) => `
      <div class="timeline-item">
        <strong>${pickLocalizedText(entry.year)}</strong>
        <p>${pickLocalizedText(entry.text)}</p>
      </div>
    `).join("");
  }

  function bindHeroFigure() {
    const heroFigure = document.getElementById("heroFigure");
    if (!heroFigure) return;
    const c = characters[activeIndex];
    heroFigure.src = c.image;
    heroFigure.alt = getCharacterName(c, c.name);
  }

  function updatePet() {
    const c = characters[activeIndex];
    const petAvatar = document.getElementById("petAvatar");
    const petName = document.getElementById("petName");
    const petRole = document.getElementById("petRole");
    const petBubble = document.getElementById("petBubble");
    const petAbility = document.getElementById("petAbility") || document.getElementById("petAbilityChip");
    const petMood = document.getElementById("petMood");
    if (petAvatar) {
      petAvatar.src = c.image;
      petAvatar.alt = getCharacterName(c, c.name);
    }
    if (petName) petName.textContent = getCharacterName(c, c.name);
    if (petRole) petRole.textContent = getCharacterRole(c, c.role);
    if (petBubble) petBubble.textContent = getCharacterQuote(c, c.quote);
    if (petAbility) petAbility.textContent = getCharacterAbility(c, c.ability);
    if (petMood) petMood.textContent = getCharacterMood(c, c.mood);
    applyCharacterBackground(c);
  }

  function renderArchiveDetail() {
    const detailPanel = document.getElementById("detailPanel");
    if (!detailPanel) return;
    const c = characters[activeIndex];
    detailPanel.innerHTML = `
      <div class="detail-top">
        <h3>${c.name}</h3>
        <span class="tag">${c.codename}</span>
        <span class="tag">${c.angel}</span>
      </div>
      <p>${c.profile}</p>
      <div class="detail-list">
        <div class="metric"><span>生日</span><strong>${c.birthday}</strong></div>
        <div class="metric"><span>身高</span><strong>${c.height}</strong></div>
        <div class="metric"><span>灵装</span><strong>${c.astralDress}</strong></div>
      </div>
      <a class="btn inline-btn" href="character.html?id=${c.id}">查看 ${c.name} 资料</a>
    `;
  }

  function renderDossiers() {
    const dossierGrid = document.getElementById("dossierGrid");
    if (!dossierGrid) return;
    dossierGrid.innerHTML = characters.map((c, index) => `
      <a class="dossier-item ${index === activeIndex ? "active" : ""}" href="character.html?id=${c.id}" data-index="${index}">
        <div class="mini-art"><img src="${c.image}" alt="${getCharacterName(c, c.name)}" /></div>
        <div class="dossier-copy">
          <strong>${getCharacterName(c, c.name)}</strong>
          <small>${getCharacterRole(c, c.role)}<br />${c.angel} · ${c.codename}</small>
        </div>
      </a>
    `).join("");
  }

  function renderCharacterDetails() {
    const c = characters[activeIndex];
    const map = {
      characterName: getCharacterName(c, c.name),
      characterProfile: getCharacterField(c, "profile", c.profile)
    };
    Object.entries(map).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = value;
    });

    const characterMeta = document.getElementById("characterMeta");
    if (characterMeta) {
      characterMeta.innerHTML = `
        <span class="tag">${getCharacterRole(c, c.role)}</span>
        <span class="tag">${c.angel}</span>
        <span class="tag">${getCharacterAstralDress(c, c.astralDress)}</span>
        <span class="tag">${c.birthday}</span>
      `;
    }

    const characterCodenameLine = document.getElementById("characterCodenameLine");
    if (characterCodenameLine) {
      characterCodenameLine.textContent = `${c.codename} / ${getCharacterRole(c, c.role)}`;
    }

    const characterProfileList = document.getElementById("characterProfileList");
    if (characterProfileList) {
      const profileItems = [
        [t("profileLabels.name"), getCharacterName(c, c.name)],
        [t("profileLabels.codename"), c.codename],
        [t("profileLabels.role"), getCharacterRole(c, c.role)],
        [t("profileLabels.birthday"), c.birthday],
        [t("profileLabels.height"), c.height],
        [t("profileLabels.faction"), getCharacterFaction(c, c.faction)],
        [t("profileLabels.cv"), c.cv || "N/A"],
        [t("profileLabels.angel"), c.angel],
        [t("profileLabels.ability"), getCharacterAbility(c, c.ability)],
        [t("profileLabels.astralDress"), getCharacterAstralDress(c, c.astralDress)],
        [t("profileLabels.debut"), getCharacterDebut(c, c.debut)],
        [t("profileLabels.favoriteFood"), getCharacterFavoriteFood(c, c.favoriteFood)]
      ];
      characterProfileList.innerHTML = profileItems.map(([label, value]) => `
        <div class="wiki-infobox-row">
          <dt>${label}</dt>
          <dd>${value}</dd>
        </div>
      `).join("");
    }

    const characterPersonality = document.getElementById("characterPersonality");
    if (characterPersonality) {
      characterPersonality.innerHTML = getCharacterPersonalityItems(c).map((item) => `<span class="chip">${pickLocalizedText(item)}</span>`).join("");
    }

    const characterTrivia = document.getElementById("characterTrivia");
    if (characterTrivia) {
      characterTrivia.innerHTML = getCharacterTriviaItems(c).map((item) => `<li>${pickLocalizedText(item)}</li>`).join("");
    }

    const characterLead = document.getElementById("characterLead");
    if (characterLead) {
      const leadParagraphs = [getCharacterField(c, "summary", c.summary), getCharacterField(c, "detail", c.detail), getCharacterField(c, "profile", c.profile)]
        .filter(Boolean)
        .map((item) => `<p>${item}</p>`)
        .join("");
      characterLead.innerHTML = leadParagraphs;
    }

    const characterFormsDetail = document.getElementById("characterFormsDetail");
    if (characterFormsDetail) {
      const formsDetailed = getCharacterFormsDetailed(c);
      const forms = [
        { label: t("formsLabels.angel"), value: c.angel, note: getCharacterAbilityDetail(c, pickLocalizedText(c.abilityDetail || c.ability)) },
        { label: t("formsLabels.astralDress"), value: getCharacterAstralDress(c, c.astralDress), note: getCharacterAstralNote(c, pickLocalizedText(c.astralNote || c.theme)) },
        ...formsDetailed.map((item) => ({ label: pickLocalizedText(item.name), value: getCharacterFormValue(item), note: pickLocalizedText(item.detail) }))
      ];
      characterFormsDetail.innerHTML = forms.map((item) => `
        <article class="wiki-stack-item">
          <div class="wiki-stack-item__head">
            <span class="tag">${item.label}</span>
            <strong>${item.value}</strong>
          </div>
          <p>${item.note}</p>
        </article>
      `).join("");
    }

    const characterOtherForms = document.getElementById("characterOtherForms");
    const formChipsMarkup = getCharacterOtherForms(c)
      .filter(Boolean)
      .map((item) => `<span class="tag">${pickLocalizedText(item)}</span>`)
      .join("");
    if (characterOtherForms) {
      characterOtherForms.innerHTML = formChipsMarkup;
    }

    const characterFormsChips = document.getElementById("characterFormsChips");
    if (characterFormsChips) {
      characterFormsChips.innerHTML = formChipsMarkup;
    }

    const characterStoryFocus = document.getElementById("characterStoryFocus");
    if (characterStoryFocus) {
      characterStoryFocus.innerHTML = getCharacterStoryFocusItems(c).map((item) => `
        <article class="wiki-story-item">
          <strong>${pickLocalizedText(item.title)}</strong>
          <p>${pickLocalizedText(item.detail)}</p>
        </article>
      `).join("");
    }

    const characterRelationships = document.getElementById("characterRelationships");
    if (characterRelationships) {
      characterRelationships.innerHTML = getCharacterRelationshipItems(c).map((item) => `<li>${pickLocalizedText(item)}</li>`).join("");
    }

    const characterSource = document.getElementById("characterSource");
    if (characterSource) characterSource.textContent = getCharacterSourceNote(c, c.sourceNote);

    const characterDetail = document.getElementById("characterDetail");
    if (characterDetail) {
      characterDetail.innerHTML = `
        <p>${getCharacterDetailCopy(c, c.detail)}</p>
        <p>${getCharacterTheme(c, c.theme)}</p>
        <div class="wiki-mini-metrics">
          <div class="wiki-mini-metric">
            <span>${t("detailLabels.debut")}</span>
            <strong>${getCharacterDebut(c, c.debut)}</strong>
          </div>
          <div class="wiki-mini-metric">
            <span>${t("detailLabels.mood")}</span>
            <strong>${getCharacterMood(c, c.mood)}</strong>
          </div>
        </div>
      `;
    }

    const characterQuote = document.getElementById("characterQuote");
    if (characterQuote) characterQuote.textContent = getCharacterQuote(c, c.quote);

    bindHeroFigure();
  }

  function renderGames() {
    const gameGrid = document.getElementById("gameGrid");
    if (!gameGrid) return;
    gameGrid.innerHTML = Object.values(games).map((game) => `
      <a class="game-card ${game.id === activeGameId ? "active" : ""}" href="game.html?game=${game.id}">
        <div class="entry-thumb ${game.id === "date" ? "portrait" : ""}"><img src="${game.thumb || game.cover}" alt="${game.title}" /></div>
        <strong>${pickLocalizedText(game.title)}</strong>
        <p>${pickLocalizedText(game.summary)}</p>
        <span class="soon">${pickLocalizedText(game.tagline)}</span>
      </a>
    `).join("");
  }

  function renderGameDetail() {
    const game = games[activeGameId] || games.date;
    const isGachaGallery = activeGameId === "gacha" && gachaView === "gallery";
    const modalTheme = isGachaGallery ? "gallery" : game.id;
    const nodes = {
      gameTitle: isGachaGallery ? gachaT("galleryTitle") : pickLocalizedText(game.title),
      gameSummary: isGachaGallery ? gachaT("galleryLead") : pickLocalizedText(game.summary),
      gameBadge: isGachaGallery ? gachaT("galleryBadge") : pickLocalizedText(game.tagline),
      rulesTitle: `${isGachaGallery ? gachaT("galleryTitle") : pickLocalizedText(game.title)}${t("gameRulesSuffix")}`
    };
    Object.entries(nodes).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = value;
    });

    applyRulesModalTheme(modalTheme);

    const rulesTag = document.querySelector("#rulesModal .detail-top .tag");
    if (rulesTag) {
      const ruleTags = {
        date: t("ruleTags.date"),
        angel: t("ruleTags.angel"),
        gacha: t("ruleTags.gacha")
      };
      rulesTag.textContent = ruleTags[game.id] || t("rulesTagDefault");
    }

    const gameRules = document.getElementById("gameRules");
    if (gameRules) {
      gameRules.innerHTML = game.rules.map((item) => `<li>${pickLocalizedText(item)}</li>`).join("");
    }

    const gamePage = document.getElementById("gamePage");
    if (gamePage) {
      gamePage.classList.toggle("game-stage-panel--gallery", isGachaGallery);
      setElementBackground(
        gamePage,
        game.cover,
        "linear-gradient(180deg, rgba(246, 249, 255, 0.14), rgba(58, 69, 132, 0.72))"
      );
    }
    const gameBackLink = document.getElementById("gameBackLink");
    if (gameBackLink) {
      gameBackLink.textContent = isGachaGallery ? gachaT("galleryBack") : t("gameBackLink");
      gameBackLink.href = isGachaGallery ? "game.html?game=gacha" : "games.html";
    }
    document.title = `${isGachaGallery ? gachaT("galleryTitle") : pickLocalizedText(game.title)} · ${t("homeTitle")}`;
  }

  function toggleModal(id, open) {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (open) {
      modal.hidden = false;
      document.body.classList.add("modal-open");
    } else {
      modal.hidden = true;
      if (Array.from(document.querySelectorAll(".modal-shell")).every((node) => node.hidden)) {
        document.body.classList.remove("modal-open");
      }
    }
  }

  function syncResultTag(theme = "date") {
    const resultModal = document.getElementById("resultModal");
    const resultTag = resultModal?.querySelector(".detail-top .tag");
    if (resultTag) resultTag.textContent = t(`resultTags.${theme}`) || t("resultTagDefault");
  }

  function openResultModal(title, html, theme = "date", character = null) {
    const titleNode = document.getElementById("resultTitle");
    const bodyNode = document.getElementById("resultBody");
    toggleModal("rulesModal", false);
    applyResultModalTheme(theme, character);
    syncResultTag(theme);
    if (titleNode) titleNode.textContent = title;
    if (bodyNode) bodyNode.innerHTML = html;
    toggleModal("resultModal", true);
  }

  function bindGameModals() {
    const openRules = document.getElementById("openRules");
    if (openRules) {
      openRules.addEventListener("click", () => toggleModal("rulesModal", true));
    }

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => toggleModal(button.dataset.closeModal, false));
    });

    document.querySelectorAll(".modal-shell").forEach((modal) => {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) toggleModal(modal.id, false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        toggleModal("rulesModal", false);
        toggleModal("resultModal", false);
      }
    });
  }

  function updateCharacterView(cause) {
    syncTheme(activeIndex);
    if (pageType === "character") {
      updateUrlParam("id", characters[activeIndex].id);
      updatePet();
      bindHeroFigure();
      renderCharacterDetails();
    }
    document.querySelectorAll(".dossier-item").forEach((card, idx) => {
      card.classList.toggle("active", idx === activeIndex);
    });
    syncCycleRoleLabel();
    if (pageType === "game" && activeGameId === "angel") {
      syncAngelGameCharacterMeta();
    }
    if (cause === "switch") showToast(t("toastCharacterSwitched", { name: characters[activeIndex].name }));
  }

  function nextCharacter() {
    activeIndex = (activeIndex + 1) % characters.length;
    updateCharacterView("switch");
    tone(660, 0.1, "sine", 0.05);
    tone(990, 0.12, "triangle", 0.03);
  }

  function previousCharacter() {
    activeIndex = (activeIndex - 1 + characters.length) % characters.length;
    updateCharacterView("switch");
  }

  function resetDateGame() {
    dateStep = 0;
    dateTrail = [];
    Object.keys(storyScores).forEach((key) => delete storyScores[key]);
  }

  function getTopDateCharacter() {
    let topId = characters[0].id;
    let topScore = -1;
    Object.entries(storyScores).forEach(([id, score]) => {
      if (score > topScore) {
        topId = id;
        topScore = score;
      }
    });
    return getCharacterById(topId);
  }

  function buildDateResultMarkup(winner) {
    const route = games.date.resultMap[winner.id] || games.date.resultMap.tohka;
    const winnerName = getCharacterDisplayName(winner, winner.name);
    const winnerQuote = getCharacterQuote(winner, winner.quote);
    return buildCharacterScene(winner, {
      background: route.art,
      figure: getGameResultFigure("date", winner),
      kicker: pickLocalizedText(route.label),
      body: pickLocalizedText(route.description),
      className: getResultSceneVariant("date", winner.id),
      extra: `
        <div class="result-highlight">
          <strong>${winner.angel}</strong>
          <div>${pickLocalizedText(route.note)}</div>
        </div>
        ${buildResultFrame(
          winner,
          [
            t("dateResultLineOne", { name: winnerName }),
            t("dateResultLineTwo", { name: winnerName })
          ],
          `${winnerName}：${winnerQuote}`,
          t("dateResultMoodTag")
        )}
      `
    });
  }

  function renderDateGame() {
    const game = games.date;
    const stage = game.choices[dateStep];
    const gameBoard = document.getElementById("gameBoard");
    if (!gameBoard) return;

    if (!stage) {
      const winner = getTopDateCharacter();
      const winnerName = getCharacterDisplayName(winner, winner.name);
      activeIndex = getCharacterIndexById(winner.id);
      updateCharacterView("switch");
      gameBoard.innerHTML = `
        <div class="play-card">
          <div class="play-top">
            <strong>${t("dateGameEndHeadline")}</strong>
            <span class="tag">${t("dateGameBestMatch", { name: winnerName })}</span>
          </div>
          <p>${t("dateGameEndBody")}</p>
          <div class="route-log">
            ${dateTrail.map((item, index) => `
              <div class="route-log__item">
                <span class="tag">${t("dateGameRoundTag", { round: index + 1 })}</span>
                <strong>${pickLocalizedText(item.title)}</strong>
                <small>${pickLocalizedText(item.result)}</small>
              </div>
            `).join("")}
          </div>
          <div class="play-actions">
            <button class="btn" type="button" id="restartDateGame">${t("dateGameRestart")}</button>
            <a class="btn" href="character.html?id=${winner.id}">${t("dateGameViewCharacter", { name: winnerName })}</a>
          </div>
        </div>
      `;
      openResultModal(t("dateGameResultTitle", { name: winnerName }), buildDateResultMarkup(winner), "date", winner);
      document.getElementById("restartDateGame")?.addEventListener("click", () => {
        resetDateGame();
        renderDateGame();
      });
      return;
    }

    gameBoard.innerHTML = `
      <div class="play-card">
        <div class="play-top">
          <strong>${t("dateGameStepHeadline", { step: dateStep + 1, total: game.choices.length })}</strong>
          <span class="tag">${t("dateGameStepTag")}</span>
        </div>
        <h3>${pickLocalizedText(stage.prompt)}</h3>
        <p class="play-note">${t("dateGameStepNote")}</p>
        <div class="choice-list">
          ${stage.options.map((option, idx) => `
            <button class="choice-btn" type="button" data-date-choice="${idx}">
              <strong>${pickLocalizedText(option.title)}</strong>
              <span>${pickLocalizedText(option.result)}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;

    gameBoard.querySelectorAll("[data-date-choice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const option = stage.options[Number(btn.dataset.dateChoice)];
        storyScores[option.target] = (storyScores[option.target] || 0) + option.score;
        dateTrail.push(option);
        activeIndex = getCharacterIndexById(option.target);
        updateCharacterView("switch");
        dateStep += 1;
        renderDateGame();
        showToast(
          dateStep >= game.choices.length
            ? t("dateGameToastFinalReady")
            : t("dateGameToastStepSaved", { step: dateStep })
        );
        tone(540 + dateStep * 80, 0.09, "triangle", 0.04);
      });
    });
  }

  function buildAngelState(forcedCharacterId = selectedAngelTrialId) {
    const trial = getAngelTrialByCharacterId(forcedCharacterId) || getCurrentAngelTrial();
    if (!trial) return null;
    selectedAngelTrialId = trial.characterId;
    const character = getCharacterById(trial.characterId);
    const sequence = shuffle([...trial.sigils, ...trial.decoys]).slice(0, 6);
    return {
      trial,
      character,
      stage: "sigil",
      sequence,
      progress: [],
      pulseHits: 0,
      pulseValue: 26,
      pulseDirection: 1,
      pulseLastTick: 0,
      pulsePauseUntil: 0,
      release: 0,
      releaseBursts: 0
    };
  }

  function syncAngelGameCharacterMeta() {
    if (activeGameId !== "angel") return;
    const trial = getCurrentAngelTrial();
    if (!trial) return;
    const character = getCharacterById(trial.characterId);
    const index = getCharacterIndexById(character.id);
    if (index >= 0) {
      activeIndex = index;
      syncTheme(activeIndex);
    }
    updateUrlParam("trial", trial.characterId);
  }

  function stopAngelPulse() {
    if (angelPulseTimer) {
      window.cancelAnimationFrame(angelPulseTimer);
      angelPulseTimer = null;
    }
  }

  function updateAngelPulseDisplay() {
    if (!angelState) return;
    const marker = document.getElementById("angelPulseMarker");
    const count = document.getElementById("angelPulseCount");
    if (marker) marker.style.left = `${angelState.pulseValue}%`;
    if (count) count.textContent = `${angelState.pulseHits} / 3`;
  }

  function tickAngelPulse(timestamp) {
    if (!angelState || angelState.stage !== "pulse") return;
    if (!angelState.pulseLastTick) angelState.pulseLastTick = timestamp;
    const delta = Math.min(32, timestamp - angelState.pulseLastTick);
    angelState.pulseLastTick = timestamp;

    if (timestamp >= (angelState.pulsePauseUntil || 0)) {
      angelState.pulseValue += angelState.pulseDirection * ANGEL_PULSE_SPEED * (delta / 1000);
      if (angelState.pulseValue >= 100) {
        angelState.pulseValue = 100 - (angelState.pulseValue - 100);
        angelState.pulseDirection = -1;
      } else if (angelState.pulseValue <= 0) {
        angelState.pulseValue = Math.abs(angelState.pulseValue);
        angelState.pulseDirection = 1;
      }
      angelPulse = angelState.pulseValue;
      updateAngelPulseDisplay();
    }

    angelPulseTimer = window.requestAnimationFrame(tickAngelPulse);
  }

  function finishAngelTrial() {
    if (!angelState) return;
    const { character, trial } = angelState;
    activeIndex = getCharacterIndexById(character.id);
    updateCharacterView("switch");
    const resultCopy = getAngelResultCopy(character);
    openResultModal(
      t("angelResultTitle", { name: getCharacterDisplayName(character, character.name) }),
      buildCharacterScene(character, {
        background: character.bg,
        figure: getGameResultFigure("angel", character),
        kicker: getAngelTrialField(trial, "title", trial.title),
        body: resultCopy.title,
        headlineNote: t("angelResultHeadline"),
        nameMeta: `${character.codename} · ${character.angel} · ${getCharacterAstralDress(character, character.astralDress)}`,
        className: getResultSceneVariant("angel", character.id),
        extra: `
          <div class="result-highlight">
            <strong>${character.angel}</strong>
            <div>${getAngelTrialField(trial, "briefing", trial.briefing)}</div>
            <div>${getCharacterDetailCopy(character, character.detail)}</div>
          </div>
          ${buildResultFrame(
            character,
            resultCopy.lines,
            resultCopy.signature,
            t("angelResultMoodTag")
          )}
        `
      }),
      "angel",
      character
    );
    angelState = buildAngelState(character.id);
    renderAngelGame();
  }

  function bindAngelTrialPicker(gameBoard) {
    gameBoard.querySelectorAll("[data-angel-trial]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextId = button.dataset.angelTrial;
        if (!nextId || nextId === selectedAngelTrialId) return;
        setAngelTrial(nextId, { syncCharacter: true, toast: true });
        tone(620, 0.1, "sine", 0.045);
      });
    });
  }

  function bindAngelSigils(gameBoard) {
    gameBoard.querySelectorAll("[data-sigil]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!angelState || angelState.stage !== "sigil") return;
        const value = button.dataset.sigil;
        const expected = angelState.trial.sigils[angelState.progress.length];
        if (value === expected) {
          angelState.progress.push(value);
          button.classList.add("correct");
          button.disabled = true;
          button.setAttribute("aria-pressed", "true");
          tone(520 + angelState.progress.length * 70, 0.08, "triangle", 0.035);
          if (angelState.progress.length >= angelState.trial.sigils.length) {
            angelState.stage = "pulse";
            showToast(t("angelTrialToastSigilDone"));
            renderAngelGame();
          }
        } else {
          button.classList.add("wrong");
          window.setTimeout(() => button.classList.remove("wrong"), 320);
          angelState.progress = [];
          gameBoard.querySelectorAll("[data-sigil]").forEach((node) => {
            node.classList.remove("correct");
            node.disabled = false;
            node.setAttribute("aria-pressed", "false");
          });
          showToast(t("angelTrialToastSigilReset"));
          tone(240, 0.12, "sawtooth", 0.02);
          renderAngelGame();
        }
      });
    });
  }

  function bindAngelPulse(gameBoard) {
    const lockBtn = document.getElementById("angelPulseLock");
    stopAngelPulse();
    angelPulse = angelState?.pulseValue || 26;
    angelState.pulseLastTick = 0;
    angelState.pulsePauseUntil = 0;
    updateAngelPulseDisplay();
    angelPulseTimer = window.requestAnimationFrame(tickAngelPulse);

    lockBtn?.addEventListener("click", () => {
      if (!angelState || angelState.stage !== "pulse") return;
      const inZone = angelState.pulseValue >= ANGEL_PULSE_ZONE.min && angelState.pulseValue <= ANGEL_PULSE_ZONE.max;
      if (inZone) {
        angelState.pulseHits += 1;
        angelState.pulsePauseUntil = performance.now() + 140;
        tone(640 + angelState.pulseHits * 60, 0.08, "sine", 0.04);
        showToast(t("angelTrialToastPulseHit", { count: angelState.pulseHits }));
        if (angelState.pulseHits >= 3) {
          angelState.stage = "release";
          stopAngelPulse();
          renderAngelGame();
        }
      } else {
        angelState.pulseHits = 0;
        angelState.pulsePauseUntil = 0;
        showToast(t("angelTrialToastPulseReset"));
        tone(220, 0.12, "square", 0.018);
      }
      updateAngelPulseDisplay();
    });
  }

  function bindAngelRelease() {
    const btn = document.getElementById("angelReleaseBtn");
    btn?.addEventListener("click", () => {
      if (!angelState || angelState.stage !== "release") return;
      angelState.release = Math.min(100, angelState.release + 12);
      angelState.releaseBursts += 1;
      const fill = document.getElementById("angelReleaseFill");
      const value = document.getElementById("angelReleaseValue");
      const burst = document.getElementById("angelReleaseBurst");
      if (fill) fill.style.width = `${angelState.release}%`;
      if (value) value.textContent = `${angelState.release}%`;
      if (burst) burst.textContent = `${angelState.releaseBursts} / 9`;
      tone(540 + angelState.release * 2, 0.08, "triangle", 0.035);
      if (angelState.release >= 100 || angelState.releaseBursts >= 9) {
        finishAngelTrial();
      }
    });
  }

  function renderAngelGame() {
    const gameBoard = document.getElementById("gameBoard");
    if (!gameBoard) return;
    if (!angelState) angelState = buildAngelState(selectedAngelTrialId);
    syncAngelGameCharacterMeta();
    const { trial, character, stage } = angelState;
    const trialOptions = getAngelTrials().map((item) => {
      const optionCharacter = getCharacterById(item.characterId);
      return `
        <button
          class="angel-picker__btn ${item.characterId === selectedAngelTrialId ? "is-active" : ""}"
          type="button"
          data-angel-trial="${item.characterId}"
          aria-pressed="${item.characterId === selectedAngelTrialId ? "true" : "false"}"
        >
          <span class="angel-picker__name">${getCharacterDisplayName(optionCharacter, optionCharacter.name)}</span>
          <small>${getAngelTrialField(item, "title", item.title)}</small>
        </button>
      `;
    }).join("");
    gameBoard.innerHTML = `
      <div class="play-card angel-card">
        <div class="play-top">
          <strong>${getAngelTrialField(trial, "title", trial.title)}</strong>
          <span class="tag">${getCharacterDisplayName(character, character.name)}</span>
        </div>
        <p class="play-note angel-copy-line">${getAngelTrialField(trial, "briefing", trial.briefing)}</p>
        <section class="angel-picker">
          <div class="angel-picker__top">
            <strong>${t("angelTrialChooseTitle")}</strong>
            <span>${t("angelTrialChooseHint")}</span>
          </div>
          <div class="angel-picker__grid">
            ${trialOptions}
          </div>
        </section>
        <div class="trial-flow">
          <span class="tag ${stage === "sigil" ? "active" : ""}">1. ${t("angelTrialStageSigil")}</span>
          <span class="tag ${stage === "pulse" ? "active" : ""}">2. ${t("angelTrialStagePulse")}</span>
          <span class="tag ${stage === "release" ? "active" : ""}">3. ${t("angelTrialStageRelease")}</span>
        </div>
        ${stage === "sigil" ? `
          <div class="angel-stage">
            <strong class="angel-stage__headline">${t("angelTrialSigilLead", { sigils: trial.sigils.join(" → ") })}</strong>
            <div class="sigil-progress">
              ${trial.sigils.map((sigil, index) => `
                <div class="sigil-progress__item ${angelState.progress[index] ? "is-on" : ""}">
                  <strong>${sigil}</strong>
                  <small>${angelState.progress[index] ? t("angelTrialSigilStateOn") : t("angelTrialSigilStateOff")}</small>
                </div>
              `).join("")}
            </div>
            <div class="sigil-grid">
              ${angelState.sequence.map((sigil) => `
                <button class="sigil-btn" type="button" data-sigil="${sigil}">${sigil}</button>
              `).join("")}
            </div>
          </div>
        ` : ""}
        ${stage === "pulse" ? `
          <div class="angel-stage">
            <strong class="angel-stage__headline">${t("angelTrialPulseLead")}</strong>
            <div class="pulse-track">
              <span class="pulse-zone"></span>
              <span class="pulse-marker" id="angelPulseMarker" style="left:${angelState.pulseValue}%;"></span>
            </div>
            <div class="play-actions">
              <span class="tag">${t("angelTrialPulseCounter")}<strong id="angelPulseCount">${angelState.pulseHits} / 3</strong></span>
              <button class="btn" type="button" id="angelPulseLock">${t("angelTrialPulseButton")}</button>
            </div>
          </div>
        ` : ""}
        ${stage === "release" ? `
          <div class="angel-stage">
            <strong class="angel-stage__headline">${t("angelTrialReleaseLead")}</strong>
            <div class="charge-wrap">
              <div class="charge-track">
                <div class="charge-fill" id="angelReleaseFill" style="width:${angelState.release}%;"></div>
              </div>
              <span id="angelReleaseValue">${angelState.release}%</span>
            </div>
            <div class="play-actions">
              <span class="tag">${t("angelTrialReleaseCounter")}<strong id="angelReleaseBurst">${angelState.releaseBursts} / 9</strong></span>
              <button class="btn large-btn" type="button" id="angelReleaseBtn">${t("angelTrialReleaseButton")}</button>
            </div>
          </div>
        ` : ""}
      </div>
    `;
    bindAngelTrialPicker(gameBoard);
    if (stage === "sigil") bindAngelSigils(gameBoard);
    if (stage === "pulse") bindAngelPulse(gameBoard);
    if (stage === "release") bindAngelRelease();
  }

  function pickGachaCharacter() {
    const targetIndex = Math.floor(Math.random() * characters.length);
    return characters[targetIndex];
  }

  function getPreferredGachaPreviewCharacter() {
    if (gachaCurrentCardId && gachaUnlocked.includes(gachaCurrentCardId)) {
      return getCharacterById(gachaCurrentCardId);
    }
    const latestUnlockedId = gachaUnlocked[gachaUnlocked.length - 1];
    return latestUnlockedId ? getCharacterById(latestUnlockedId) : null;
  }

  function buildFlipCardFront(character, options = {}) {
    const note = options.note || `${character.codename} · ${getCharacterRole(character, character.role)}`;
    const status = options.status || character.angel;
    const caption = options.caption || getCharacterQuote(character, character.quote);
    return `
      <div class="flip-card-front" style="--card-accent:${character.accent};--card-glow:${character.glow};">
        <div class="flip-card-front__halo"></div>
        <div class="flip-card-front__frame"></div>
        <div class="flip-card-front__foil"></div>
        <div class="flip-card-front__namebar">
          <div class="flip-card-front__titleblock">
            <span class="flip-card-front__name">${getCharacterDisplayName(character, character.name)}</span>
            <span class="flip-card-front__codename">${character.codename}</span>
          </div>
          <span class="flip-card-front__angel">${character.angel}</span>
        </div>
        <div class="flip-card-front__artframe">
          <div class="flip-card-front__bg" style="background-image:linear-gradient(180deg, rgba(255,255,255,.10), rgba(14,12,28,.54)), url('${character.bg}')"></div>
          <div class="flip-card-front__artglow"></div>
          <div class="flip-card-front__figure-wrap">
            <img class="flip-card-front__figure" src="${character.image}" alt="${getCharacterDisplayName(character, character.name)}" />
          </div>
        </div>
        <div class="flip-card-front__lore">
          <div class="flip-card-front__statusrow">
            <div class="flip-card-front__status">${status}</div>
            <div class="flip-card-front__note">${note}</div>
          </div>
          <p class="flip-card-front__caption">${caption}</p>
        </div>
      </div>
    `;
  }

  function buildFlipCardBack() {
    return `
      <div class="flip-card-back" aria-hidden="true">
        <div class="flip-card-back__art" style="background-image:url('${gachaArt.singleBack}')"></div>
        <div class="flip-card-back__focus-shell">
          <div class="flip-card-back__focus" style="background-image:url('${gachaArt.singleBack}')"></div>
        </div>
        <div class="flip-card-back__veil"></div>
        <div class="flip-card-back__edge flip-card-back__edge--outer"></div>
        <div class="flip-card-back__edge flip-card-back__edge--inner"></div>
      </div>
    `;
  }

  function buildGachaFrontStage(character, options = {}) {
    if (!character) return "";
    return `
      <section class="flip-stage flip-stage--revealed-static" style="--card-accent:${character.accent};--card-glow:${character.glow};">
        <div class="flip-stage__glow"></div>
        <div class="flip-stage__single-card ${options.animated ? "is-animated" : ""}">
          ${buildFlipCardFront(character, {
            status: options.status || gachaT("galleryStatus"),
            note: options.note || getGachaCardNote(character),
            caption: options.caption || `${getCharacterDisplayName(character, character.name)}：${getGachaFlavorLine(character)}`
          })}
        </div>
      </section>
    `;
  }

  function buildGachaRevealMarkup(character) {
    if (!character) {
      return `
        <section class="flip-stage flip-stage--idle">
          <div class="flip-stage__placeholder">
            <strong>${gachaT("idleTitle")}</strong>
            <p>${gachaT("idleDesc")}</p>
          </div>
        </section>
      `;
    }
    return buildGachaFrontStage(character, {
      status: gachaT("galleryStatus"),
      note: getGachaCardNote(character),
      caption: `${getCharacterDisplayName(character, character.name)}：${getGachaFlavorLine(character)}`
    });
  }

  function buildGachaGalleryCard(id) {
    const character = getCharacterById(id);
    const unlocked = gachaUnlocked.includes(id);
    const active = gachaCurrentCardId === id;
    const displayName = getCharacterDisplayName(character, character.name);
    const displayAlias = getGachaAliasLabel(character);
    return `
      <article class="flip-gallery-card ${unlocked ? "is-unlocked" : "is-locked"} ${active ? "is-active" : ""}" data-gallery-card="${id}">
        <div class="flip-gallery-card__body">
          ${unlocked
            ? `
              <div class="flip-gallery-thumb" style="--card-accent:${character.accent};--card-glow:${character.glow};">
                <div class="flip-gallery-thumb__bg" style="background-image:linear-gradient(180deg, rgba(255,255,255,.14), rgba(10,13,30,.46)), url('${character.bg}')"></div>
                <div class="flip-gallery-thumb__halo"></div>
                <div class="flip-gallery-thumb__figure">
                  <img src="${character.image}" alt="${displayName}" />
                </div>
                <div class="flip-gallery-thumb__titleplate">
                  <strong>${displayName}</strong>
                  <span>${displayAlias}</span>
                </div>
              </div>
            `
            : `
              <div class="flip-gallery-card__locked">
                ${buildFlipCardBack()}
                <span class="flip-gallery-card__seal">${gachaT("lockedSeal")}</span>
              </div>
            `}
        </div>
      </article>
    `;
  }

  function bindGachaGalleryPreview(gameBoard) {
    gameBoard.querySelectorAll("[data-gallery-card]").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.galleryCard;
        if (!gachaUnlocked.includes(id)) {
          showToast(gachaT("toastLocked"));
          return;
        }
        gachaCurrentCardId = id;
        gachaRevealReady = true;
        renderGachaGame();
        const stage = document.getElementById("gachaRevealStage");
        stage?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  function flipGachaCard() {
    if (gachaSpinning) return;
    gachaSpinning = true;
    gachaRevealReady = false;
    gachaFlipRunId += 1;
    const runId = gachaFlipRunId;
    if (gachaRevealTimeout) {
      window.clearTimeout(gachaRevealTimeout);
      gachaRevealTimeout = null;
    }
    if (gachaFinalizeTimeout) {
      window.clearTimeout(gachaFinalizeTimeout);
      gachaFinalizeTimeout = null;
    }
    const character = pickGachaCharacter();
    const wasUnlocked = gachaUnlocked.includes(character.id);
    const triggerButtons = document.querySelectorAll("[data-gacha-flip-trigger]");
    const status = document.getElementById("gachaStatus");
    const stage = document.getElementById("gachaRevealStage");
    triggerButtons.forEach((button) => {
      button.disabled = true;
      if (button.id === "gachaFlipBtn") button.textContent = gachaT("flipBusy");
    });
    if (status) status.textContent = gachaT("stageFlipping");

    if (stage) {
      delete stage.dataset.revealed;
      stage.innerHTML = `
        <section class="flip-stage flip-stage--drawing flip-stage--show-back" style="--card-accent:${character.accent};--card-glow:${character.glow};">
          <div class="flip-stage__glow"></div>
          <div class="flip-stage__card is-concealed" id="gachaFlipCard" data-run-id="${runId}">
            <div class="flip-stage__panel flip-stage__panel--back">
              ${buildFlipCardBack()}
            </div>
          </div>
        </section>
      `;
      stage.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const mountFinalGachaCard = () => {
      const drawingStage = document.getElementById("gachaRevealStage");
      if (!drawingStage || drawingStage.dataset.revealed === "true" || runId !== gachaFlipRunId) return;
      drawingStage.dataset.revealed = "true";
      drawingStage.innerHTML = buildGachaFrontStage(character, {
        animated: true,
        status: gachaT("revealStatus"),
        note: getGachaCardNote(character),
        caption: `${getCharacterDisplayName(character, character.name)}：${getGachaFlavorLine(character)}`
      });
      drawingStage.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    tone(780, 0.12, "triangle", 0.045);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (runId !== gachaFlipRunId) return;
        const flipCard = document.getElementById("gachaFlipCard");
        if (flipCard) {
          flipCard.classList.replace("is-concealed", "is-revealed");
          flipCard.addEventListener("transitionend", (event) => {
            if (runId !== gachaFlipRunId) return;
            if (event.propertyName === "opacity") mountFinalGachaCard();
          }, { once: true });
        }
        tone(980, 0.12, "sine", 0.05);
      });
    });

    gachaRevealTimeout = window.setTimeout(() => {
      if (runId !== gachaFlipRunId) return;
      mountFinalGachaCard();
      gachaRevealTimeout = null;
    }, 720);

    gachaFinalizeTimeout = window.setTimeout(() => {
      if (runId !== gachaFlipRunId) return;
      gachaSpinning = false;
      gachaCurrentCardId = character.id;
      gachaRevealReady = true;
      if (!wasUnlocked) {
        gachaUnlocked = [...gachaUnlocked, character.id];
        persistGachaUnlocked();
      }
      activeIndex = getCharacterIndexById(character.id);
      updateCharacterView("switch");
      if (status) {
        status.textContent = wasUnlocked
          ? gachaT("stageReturned", { name: getCharacterDisplayName(character, character.name) })
          : gachaT("stageUnlocked", { name: getCharacterDisplayName(character, character.name) });
      }
      triggerButtons.forEach((button) => {
        button.disabled = false;
        if (button.id === "gachaFlipBtn") button.textContent = gachaT("flipAgain");
      });
      showToast(
        wasUnlocked
          ? gachaT("toastReturned", { name: getCharacterDisplayName(character, character.name) })
          : gachaT("toastUnlocked", { name: getCharacterDisplayName(character, character.name) })
      );
      gachaFinalizeTimeout = null;
    }, 1460);
  }

  function renderGachaGame() {
    const gameBoard = document.getElementById("gameBoard");
    if (!gameBoard) return;

    if (gachaView === "gallery") {
      const previewCharacter = getPreferredGachaPreviewCharacter();
      if (previewCharacter) {
        gachaCurrentCardId = previewCharacter.id;
        gachaRevealReady = true;
      } else {
        gachaCurrentCardId = null;
        gachaRevealReady = false;
      }
      const galleryCards = characters.map((character) => buildGachaGalleryCard(character.id)).join("");
      gameBoard.innerHTML = `
        <div class="play-card flip-gallery-page">
          <div class="flip-gallery-page__hero">
            <div class="play-top">
              <strong>${gachaT("galleryTitle")}</strong>
              <span class="tag">${gachaT("galleryCount", { count: gachaUnlocked.length, total: characters.length })}</span>
            </div>
            <p class="play-note">${pickLocalizedText(games.gacha.gallerySummary)}</p>
            <div class="play-actions">
              <button class="btn" type="button" id="galleryBackBtn">${gachaT("galleryBack")}</button>
              <button class="btn" type="button" id="gachaResetBtn">${gachaT("reset")}</button>
            </div>
          </div>
          <div class="flip-gallery-page__layout">
            <div class="flip-gallery-page__grid">
            <div class="flip-gallery-grid">${galleryCards}</div>
            </div>
            <aside class="flip-gallery-page__preview" id="gachaRevealStage">
              ${buildGachaRevealMarkup(previewCharacter)}
            </aside>
          </div>
        </div>
      `;
      document.getElementById("galleryBackBtn")?.addEventListener("click", () => {
        window.location.href = "game.html?game=gacha";
      });
      document.getElementById("gachaResetBtn")?.addEventListener("click", () => {
        gachaUnlocked = [];
        gachaCurrentCardId = null;
        gachaRevealReady = false;
        persistGachaUnlocked();
        showToast(gachaT("toastReset"));
        renderGachaGame();
      });
      bindGachaGalleryPreview(gameBoard);
      return;
    }

    const currentCharacter = gachaCurrentCardId ? getCharacterById(gachaCurrentCardId) : null;
    gameBoard.innerHTML = `
      <div class="play-card flip-card-play">
        <div class="play-top">
          <strong>${pickLocalizedText(games.gacha.title)}</strong>
          <span class="tag">${gachaT("pageBadge")}</span>
        </div>
        <p class="play-note">${gachaT("pageLead")}</p>
        <div class="flip-arena">
          <button class="flip-pool" type="button" id="gachaPoolTrigger" data-gacha-flip-trigger="pool" aria-label="${gachaT("poolAria")}">
            <img src="${gachaArt.deckPool}" alt="${gachaT("poolAlt")}" />
            <span class="flip-pool__hint">${gachaT("poolHint")}</span>
          </button>
          <div class="flip-stage-wrap">
            <div class="flip-status" id="gachaStatus">${currentCharacter ? gachaT("stageStored", { name: currentCharacter.name }) : gachaT("stageReady")}</div>
            <div id="gachaRevealStage">
              ${buildGachaRevealMarkup(currentCharacter)}
            </div>
            <div class="play-actions">
              <button class="btn large-btn" type="button" id="gachaFlipBtn" data-gacha-flip-trigger="button">${currentCharacter ? gachaT("flipAgain") : gachaT("flipOnce")}</button>
              <button class="btn" type="button" id="openGalleryBtn">${gachaT("openGallery")}</button>
              <button class="btn" type="button" id="gachaResetBtn">${gachaT("reset")}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll("[data-gacha-flip-trigger]").forEach((node) => {
      node.addEventListener("click", flipGachaCard);
    });
    document.getElementById("openGalleryBtn")?.addEventListener("click", () => {
      window.location.href = "game.html?game=gacha&view=gallery";
    });
    document.getElementById("gachaResetBtn")?.addEventListener("click", () => {
      gachaUnlocked = [];
      gachaCurrentCardId = null;
      gachaRevealReady = false;
      persistGachaUnlocked();
      showToast(gachaT("toastReset"));
      renderGachaGame();
    });
  }

  function renderGameBoard() {
    if (activeGameId === "date") renderDateGame();
    if (activeGameId === "angel") renderAngelGame();
    if (activeGameId === "gacha") renderGachaGame();
  }

  function bindPet() {
    const pet = document.getElementById("petDock");
    const petBubble = document.getElementById("petBubble");
    if (!pet) return;
    pet.addEventListener("click", (event) => {
      const actionBtn = event.target.closest("[data-say]");
      if (!actionBtn) return;
      event.stopPropagation();
      const action = actionBtn.dataset.say;
      if (action === "quote") {
        if (petBubble) petBubble.textContent = getCharacterQuote(characters[activeIndex], characters[activeIndex].quote);
        showToast(t("toastPetQuote"));
        tone(780, 0.12, "sine", 0.04);
      } else if (action === "wave") {
        if (petBubble) petBubble.textContent = getCharacterQuote(characters[activeIndex], characters[activeIndex].greeting || characters[activeIndex].quote);
        showToast(t("toastPetWave"));
        tone(520, 0.1, "triangle", 0.03);
      } else if (action === "switch") {
        nextCharacter();
      }
    });
  }

  function bindGlobal() {
    const cycleRoleBtn = document.getElementById("cycleRole");
    const soundToggle = document.getElementById("soundToggle");

    if (cycleRoleBtn) cycleRoleBtn.addEventListener("click", nextCharacter);
    if (soundToggle) {
      soundToggle.addEventListener("click", () => {
        audioUnlockArmed = true;
        if (audioOn) {
          applyMusicTheme("mute", { preview: false });
          showToast(t("muteToast"));
        } else {
          const fallbackTheme = settingsState.musicTheme === "mute" ? defaultSettings.musicTheme : settingsState.musicTheme;
          applyMusicTheme(fallbackTheme, { preview: false });
          startAmbientLoop({ ensureUnlocked: true });
          showToast(t("themeToast", { theme: getMusicThemeLabel() }));
        }
      });
    }

    document.addEventListener("pointermove", (event) => {
      const x = ((event.clientX / window.innerWidth) - 0.5) * 32;
      const y = ((event.clientY / window.innerHeight) - 0.5) * 32;
      document.documentElement.style.setProperty("--look-x", `${x.toFixed(2)}px`);
      document.documentElement.style.setProperty("--look-y", `${y.toFixed(2)}px`);
    });

    window.addEventListener("scroll", () => {
      document.documentElement.style.setProperty("--scroll-shift", `${window.scrollY}px`);
    }, { passive: true });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && settingsDrawerOpen) {
        setSettingsDrawerState(false);
      }
      if (pageType !== "character") return;
      if (event.key === "ArrowRight") nextCharacter();
      if (event.key === "ArrowLeft") previousCharacter();
    });
  }

  function initArchivePage() {
    renderDossiers();
    updateCharacterView("init");
  }

  function initCharacterPage() {
    const id = params.get("id") || document.body.dataset.defaultCharacter || characters[0].id;
    const index = getCharacterIndexById(id);
    activeIndex = index >= 0 ? index : 0;
    updateCharacterView("init");
  }

  function initGamesHubPage() {
    renderGames();
    updateCharacterView("init");
  }

  function initGameDetailPage() {
    activeGameId = params.get("game") || "date";
    activeMode = activeGameId;
    gachaUnlocked = loadGachaUnlocked();
    if (activeGameId === "angel") {
      const initialTrial = getCurrentAngelTrial();
      selectedAngelTrialId = initialTrial?.characterId || selectedAngelTrialId;
      angelState = buildAngelState(selectedAngelTrialId);
      syncAngelGameCharacterMeta();
    }
    renderGameDetail();
    bindGameModals();
    renderGameBoard();
    showToast(t("pageLoadedGame", { title: pickLocalizedText(games[activeGameId]?.title || games.date.title) }));
  }

  function initTimelineOrStory() {
    syncTheme(activeIndex);
    renderTimelinePage();
  }

  function init() {
    loadSettingsState();
    setBodyMode(settingsState.mode);
    injectSettingsDrawer();
    bindSettingsDrawer();
    bindBgmStatus();
    syncSettingsUI();
    activeIndex = getInitialCharacterIndex();
    updateEntryThumbs();

    if (pageType === "archive") initArchivePage();
    else if (pageType === "character") initCharacterPage();
    else if (pageType === "games") initGamesHubPage();
    else if (pageType === "game") initGameDetailPage();
    else if (pageType === "timeline" || pageType === "story" || pageType === "home") initTimelineOrStory();
    else updateCharacterView("init");

    if (pageType === "character") bindPet();
    bindGlobal();
    applyModeSetting();
    if (pageType === "character") showToast(t("pageLoadedCharacter"));
  }

  init();
})();


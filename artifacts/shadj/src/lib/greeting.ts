export interface Greeting {
  headline: string;
  sub: string;
  emoji: string;
}

export function getTimeGreeting(name: string): Greeting {
  const hour = new Date().getHours();

  if (hour >= 23 || hour < 5) {
    return {
      headline: `مين اللي مصحّيكِ دلوقتي؟! 😂`,
      sub: `والله هقتّله! أهلاً يا ${name}`,
      emoji: "🌙",
    };
  }
  if (hour >= 5 && hour < 12) {
    return {
      headline: `مساء الفل يا ${name}! 😄`,
      sub: `(إيه إيه صبح ولا مساء؟ مش مهم، يلا نشتغل 😂)`,
      emoji: "☀️",
    };
  }
  if (hour >= 12 && hour < 18) {
    return {
      headline: `مساء الخير يا ${name}! ✨`,
      sub: `يلا بينا نعمل حاجة حلوة النهارده!`,
      emoji: "🌸",
    };
  }
  return {
    headline: `مساء الفل يا ${name}! 🌙`,
    sub: `إيه أخبار الشغل النهارده؟`,
    emoji: "🌙",
  };
}

export type FavoriteTag = 'leadership' | 'programming' | 'general'
export type FavoriteCategory = 'article' | 'tweet' | 'video'

export interface FavoriteItem {
  id: string
  tag: FavoriteTag
  category: FavoriteCategory
  title: string
  author: string | null
  siteName: string | null
  sourceUrl: string
  imageUrl: string | null
  summary: string | null
  tweetId: string | null
}

export const FAVORITES: FavoriteItem[] = [
  // Leadership
  {
    id: 'melting-gold-organizational-capacity',
    tag: 'leadership',
    category: 'article',
    title: 'Melting Gold, and Organizational Capacity',
    author: null,
    siteName: 'LessWrong',
    sourceUrl:
      'https://www.lesswrong.com/posts/mL7PJKu3NEkHLZ9vP/melting-gold-and-organizational-capacity',
    imageUrl:
      'https://res.cloudinary.com/lesswrong-2-0/image/upload/v1654295382/new_mississippi_river_fjdmww.jpg',
    summary:
      "There's a saying for communities: if you're not gaining members, you're losing members. On why growing organizational capacity matters even when you like your current size.",
    tweetId: null,
  },
  {
    id: 'ask-vs-guess-culture',
    tag: 'leadership',
    category: 'article',
    title: 'Ask vs guess culture',
    author: 'Jean Hsu',
    siteName: 'Substack',
    sourceUrl: 'https://jeanhsu.substack.com/p/ask-vs-guess-culture',
    imageUrl:
      'https://substackcdn.com/image/fetch/$s_!0ot9!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5d15f5ae-994c-49b5-99a6-5efff02b7eca_1456x816.png',
    summary:
      'When unreasonable requests are followed up with "but you could have just said no!" Exploring the clashes of ask culture and guess culture, at home and at work.',
    tweetId: null,
  },
  {
    id: 'optimal-amount-of-fraud',
    tag: 'leadership',
    category: 'article',
    title: 'The optimal amount of fraud is non-zero',
    author: 'Patrick McKenzie',
    siteName: 'Bits about Money',
    sourceUrl:
      'https://www.bitsaboutmoney.com/archive/optimal-amount-of-fraud/',
    imageUrl:
      'https://images.unsplash.com/photo-1509479200622-4503f27f12ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDE1fHxoYWNrZXJ8ZW58MHx8fHwxNjYyMTMyMDEz&ixlib=rb-1.2.1&q=80&w=2000',
    summary:
      "Counterintuitively, businesses, customers, and society prefer having fraud to what they'd need to do to not have it.",
    tweetId: null,
  },
  {
    id: 'calling-out-room-dynamics',
    tag: 'leadership',
    category: 'article',
    title: 'The Art of Calling Out Room Dynamics',
    author: null,
    siteName: 'Leadership Garden',
    sourceUrl: 'https://leadership.garden/calling-out-room-dynamics/',
    imageUrl:
      'https://leadership.garden/content/images/2024/11/calling-out-room-dynamics.png',
    summary:
      'A practical guide to naming what is happening in tense meetings so teams can move past avoidance and get honest.',
    tweetId: null,
  },
  {
    id: 'tweet-hnshah-1904596897387491765',
    tag: 'leadership',
    category: 'tweet',
    title: 'Most founders don’t manage. They just react.',
    author: 'Hiten Shah (@hnshah)',
    siteName: 'X',
    sourceUrl: 'https://x.com/hnshah/status/1904596897387491765',
    imageUrl: null,
    summary:
      'Most founders don’t manage. They just react. They confuse motion with momentum.',
    tweetId: '1904596897387491765',
  },
  {
    id: 'tweet-thenanyu-1884963324464361677',
    tag: 'leadership',
    category: 'tweet',
    title: 'Nan Yu on product & technology leadership',
    author: 'Nan Yu (@thenanyu)',
    siteName: 'X',
    sourceUrl: 'https://x.com/thenanyu/status/1884963324464361677',
    imageUrl: null,
    summary:
      "I generally write about product and technology from a practitioner's point of view.",
    tweetId: '1884963324464361677',
  },
  {
    id: 'are-you-serious',
    tag: 'leadership',
    category: 'article',
    title: 'Are you serious?',
    author: 'Visakan Veerasamy',
    siteName: 'Substack',
    sourceUrl: 'https://visakanv.substack.com/p/are-you-serious',
    imageUrl:
      'https://substackcdn.com/image/fetch/$s_!2QCb!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcef984b1-d85c-4b34-8557-b71fa2f078cf_915x610.jpeg',
    summary:
      'Search your heart. What are you serious about? How far will you go?',
    tweetId: null,
  },

  // Programming
  {
    id: 'dhh-stop-celebrating-incompetence',
    tag: 'programming',
    category: 'article',
    title: 'Programmers should stop celebrating incompetence',
    author: 'DHH',
    siteName: 'HEY World',
    sourceUrl:
      'https://world.hey.com/dhh/programmers-should-stop-celebrating-incompetence-de1a4725',
    imageUrl:
      'https://world.hey.com/dhh/de1a4725/representations/eyJfcmFpbHMiOnsiZGF0YSI6NjE2NjQ3ODkyLCJwdXIiOiJibG9iX2lkIn19--1f1f64293fde20d21e91db80f6a178dd401f3fe67e31356fd783478fdd3af275/eyJfcmFpbHMiOnsiZGF0YSI6eyJyZXNpemVfdG9fZmlsbCI6WzEyMDAsNjMwXSwicXVhbGl0eSI6NDAsInN0cmlwIjp0cnVlfSwicHVyIjoidmFyaWF0aW9uIn19--850460abb6619f326eb585ef63fdb0b416ee8bffff0b16dfc60dcb6699d89ebd/i%20have%20no%20idea%20what%20i%20am%20doing%20dog%20meme.jpg',
    summary:
      "In the valiant effort to combat imposter syndrome and gatekeeping, the programming world has taken a bad turn down a blind alley by celebrating incompetence.",
    tweetId: null,
  },
  {
    id: 'grug-brained-developer',
    tag: 'programming',
    category: 'article',
    title: 'The Grug Brained Developer',
    author: 'grug',
    siteName: 'grugbrain.dev',
    sourceUrl: 'https://grugbrain.dev/',
    imageUrl: null,
    summary:
      'A layman’s guide to thinking like the self-aware smol brained: complexity very, very bad.',
    tweetId: null,
  },
  {
    id: 'mind-the-gap-ryan-florence',
    tag: 'programming',
    category: 'video',
    title: '"Mind The Gap" by Ryan Florence at Big Sky Dev Con 2024',
    author: 'Montana Programmers',
    siteName: 'YouTube',
    sourceUrl: 'https://www.youtube.com/watch?v=zqhE-CepH2g&t=663s',
    imageUrl: 'https://i.ytimg.com/vi/zqhE-CepH2g/hqdefault.jpg',
    summary:
      'Ryan Florence on bridging the network gap and building resilient web UIs.',
    tweetId: null,
  },
  {
    id: 'composition-is-all-you-need',
    tag: 'programming',
    category: 'video',
    title:
      'Composition Is All You Need | Fernando Rojo at React Universe Conf 2025',
    author: 'Callstack',
    siteName: 'YouTube',
    sourceUrl: 'https://www.youtube.com/watch?v=4KvbVq3Eg5w&t=1s',
    imageUrl: 'https://i.ytimg.com/vi/4KvbVq3Eg5w/hqdefault.jpg',
    summary:
      'Building flexible React components by breaking them into small composable parts instead of prop-heavy monoliths.',
    tweetId: null,
  },
  {
    id: 'tweet-mitchellh-2100249348345057389',
    tag: 'programming',
    category: 'tweet',
    title: 'The "whiteboard defense"',
    author: 'Mitchell Hashimoto (@mitchellh)',
    siteName: 'X',
    sourceUrl: 'https://x.com/mitchellh/status/2100249348345057389',
    imageUrl: null,
    summary:
      'The "whiteboard defense:" I should be able to pull you aside at any moment and ask you to explain how the system works and why key choices were made.',
    tweetId: '2100249348345057389',
  },

  // General
  {
    id: 'dying-daily-this-is-your-life',
    tag: 'general',
    category: 'article',
    title: 'What Man Understands That He Is Dying Daily? (This Is Your Life)',
    author: 'Brett & Kate McKay',
    siteName: 'The Art of Manliness',
    sourceUrl:
      'https://www.artofmanliness.com/character/self-improvement/what-man-understands-that-he-is-dying-daily-this-is-your-life/',
    imageUrl: 'https://content.artofmanliness.com/uploads/2011/03/dadbrett.jpg',
    summary:
      "You're dying every day. Meditate upon that fact to motivate yourself to do great things. What are you doing today to seize the day?",
    tweetId: null,
  },
  {
    id: 'yes-i-got-that-reference-but-who-cares',
    tag: 'general',
    category: 'article',
    title: 'Yes, I Got That Reference. But Who Cares?',
    author: 'Freddie deBoer',
    siteName: 'Substack',
    sourceUrl:
      'https://freddiedeboer.substack.com/p/yes-i-got-that-reference-but-who',
    imageUrl:
      'https://substackcdn.com/image/fetch/$s_!4Esm!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2Ffe7eb7f4-5d6d-43fc-880a-0c520f201756_1200x630.png',
    summary:
      'Why modern pop culture mistakes recognizing a reference for actual meaning.',
    tweetId: null,
  },
  {
    id: 'give-sports-a-chance',
    tag: 'general',
    category: 'article',
    title: 'Give Sports a Chance',
    author: 'Holden Karnofsky',
    siteName: 'Cold Takes',
    sourceUrl: 'https://www.cold-takes.com/give-sports-a-chance/',
    imageUrl:
      'https://storage.ghost.io/c/c1/87/c187484b-b759-4728-8cb3-1c009c2c024e/content/images/2021/08/mic---sports---twitter-dimensions.png',
    summary:
      'A case for keeping an open mind about sports — and why following them can be surprisingly rewarding.',
    tweetId: null,
  },
  {
    id: 'do-not-end-the-week-with-nothing',
    tag: 'general',
    category: 'article',
    title: "Don't End The Week With Nothing",
    author: 'Patrick McKenzie',
    siteName: 'Kalzumeus',
    sourceUrl:
      'https://training.kalzumeus.com/newsletters/archive/do-not-end-the-week-with-nothing',
    imageUrl: null,
    summary:
      'A bit of inspiration and actionable advice for folks who are still working at day jobs.',
    tweetId: null,
  },
  {
    id: 'paul-graham-having-kids',
    tag: 'general',
    category: 'article',
    title: 'Having Kids',
    author: 'Paul Graham',
    siteName: 'paulgraham.com',
    sourceUrl: 'https://paulgraham.com/kids.html',
    imageUrl: null,
    summary:
      'On how having children reshapes ambition, happiness, and what matters.',
    tweetId: null,
  },
  {
    id: 'tending-the-garden-of-my-psychospace',
    tag: 'general',
    category: 'article',
    title: 'Tending the Garden of my PsychoSpace',
    author: 'Reggie James',
    siteName: 'Substack',
    sourceUrl:
      'https://hipcityreg.substack.com/p/tending-the-garden-of-my-psychospace',
    imageUrl:
      'https://substackcdn.com/image/fetch/$s_!wy2m!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F218d807a-abea-4d54-b444-d0b9af73bcb0_768x507.jpeg',
    summary:
      'On curating your mental environment and treating attention like a garden.',
    tweetId: null,
  },
  {
    id: 'whats-the-point-if-we-cant-have-fun',
    tag: 'general',
    category: 'article',
    title: 'What’s the Point If We Can’t Have Fun?',
    author: 'David Graeber',
    siteName: 'The Baffler',
    sourceUrl:
      'https://thebaffler.com/salvos/whats-the-point-if-we-cant-have-fun',
    imageUrl:
      'https://thebaffler.com/wp-content/uploads/2014/01/DrescherGraeberB24.3_60.jpg',
    summary:
      'David Graeber on play, curiosity, and why joy and playfulness sit at the root of life itself.',
    tweetId: null,
  },
  {
    id: 'tweet-visakanv-1223823933658451969',
    tag: 'general',
    category: 'tweet',
    title: 'you can’t think your way out of a courage deficit',
    author: 'Visakan Veerasamy (@visakanv)',
    siteName: 'X',
    sourceUrl: 'https://x.com/visakanv/status/1223823933658451969',
    imageUrl: null,
    summary: 'you can’t think your way out of a courage deficit',
    tweetId: '1223823933658451969',
  },
]

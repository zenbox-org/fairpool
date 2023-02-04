import { Influencer, InfluencerSchema, mapInfluencerD, parseInfluencerUid } from 'libs/fairpool/models/Influencer'
import { spreadPerson } from 'libs/fairpool/models/Influencer/spreadPerson'
import { parseChannelByUrl as c } from 'libs/fairpool/models/SocialChannel'
import { BTC, HEX } from 'libs/finance/data/allAssets'
import { Tamil } from 'libs/generic/data/allLanguages'
import { getFinder, getInserter, getName } from 'libs/utils/zod'
import { AltcoinBuffet, Business, Crypto, CryptoCharts, Gaming, Health, Lifestyle, PlayToEarn, Wellness } from './allInfluencerTags'
import { AaronVanKampen, AdamGoodall, AlexanderCraft, AlexanderLegin, AlexanderLeskov, AnatoliLos, AnnaWhiteMagic, AriRover, BlackPrince, ChrisDelaney, CilinixCrypto, CopperPitch, CryptoAndy, CryptoArchie, CryptoBoat, CryptoGains, CryptoGeeks, CryptoIsh, DefiDefenders, eOne, EverythingIsCrypto, IlyaBelashov, InvestingNerd, IvyCrypto, JeromeTan, JohnMasterson, JordanVoorhees, LeviRietveldCryptoKing, MindYourCrypto, NiomiSmart, OlgaKulakova, PacoWeb, PassiveBase, RandiHipperMissTeenCrypto, SimonGlavin, Spike, SuperTradeish, TamaraOdonata, ThisIsCrypto, TwoBitCrypto, VickyBuddhaCafe } from './allPersons'

export const allInfluencers: Influencer[] = []

export const addInfluencer = getInserter<Influencer>(getName(InfluencerSchema), InfluencerSchema, parseInfluencerUid, allInfluencers)

export const findInfluencer = getFinder(parseInfluencerUid, allInfluencers)

const addInfluencerD = mapInfluencerD(addInfluencer)

export const AlexanderLeskovInfluencer = addInfluencerD({
  ...spreadPerson(AlexanderLeskov),
  title: 'Александр Лесков',
  username: 'lollellillal',
  symbol: 'LES',
  channels: [
    c('https://www.youtube.com/channel/UCtx9F36ay4WDGJrqCbhbllw/videos', 91, new Date('2022-10-14')),
    c('https://t.me/lollellillal', 147, new Date('2022-10-14')),
  ],
  tags: [PlayToEarn],
})

export const IlyaBelashovInfluencer = addInfluencerD({
  ...spreadPerson(IlyaBelashov),
  title: 'Колумб на крипте',
  username: 'columbus',
  symbol: 'COL',
  channels: [
    c('https://www.youtube.com/channel/UCS4tZvL9ys0O73PR1zrN-iA/videos', 10900, new Date('2022-10-14')),
    c('https://t.me/columbusblog', 1819, new Date('2022-10-14')),
  ],
  tags: [PlayToEarn],
  notes: 'No available contacts',
})

export const CopperPitchInfluencer = addInfluencerD({
  ...spreadPerson(CopperPitch),
  title: 'CopperPitch',
  username: 'CopperPitch',
  symbol: 'PITCH',
  channels: [
    c('https://www.youtube.com/c/CopperPitch', 11400, new Date('2022-10-14')),
    c('https://twitter.com/CopperPitch', 3262, new Date('2022-10-14')),
    c('https://www.twitch.tv/CopperPitch', 4900, new Date('2022-10-14')),
  ],
  tags: [PlayToEarn],
})

export const OlgaKulakovaInfluencer = addInfluencerD({
  ...spreadPerson(OlgaKulakova),
  title: 'Ольга | Коуч управления состоянием',
  username: 'olgajivaya',
  symbol: 'OLGA',
  description: `
    💎 Исцеляю танцами и коучингом
    🏝 Живу на острове, делюсь красотой
    🧠 Настраиваю мышление на счастье
  `,
  website: 'https://olgakulakova.youcanbook.me/',
  channels: [
    c('https://www.instagram.com/olgajivaya/', 1800, new Date('2023-02-04')),
  ],
  tags: [Wellness],
})

export const AlexanderCraftInfluencer = addInfluencerD({
  ...spreadPerson(AlexanderCraft),
  title: 'Александр Крафт',
  username: 'battletraders',
  symbol: 'ALEX',
  channels: [
    c('https://www.youtube.com/c/%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80%D0%9A%D1%80%D0%B0%D1%84%D1%82/videos', 14600, new Date('2022-10-14')),
  ],
  website: 'https://battletraders.ru/',
  tags: [PlayToEarn],
})

export const AnatoliLosInfluencer = addInfluencerD({
  ...spreadPerson(AnatoliLos),
  title: 'CrypTime AnatoliLos',
  username: 'CrypTime',
  symbol: 'ALOS',
  channels: [
    c('https://www.youtube.com/c/CrypTime/videos', 11300, new Date('2022-10-14')),
    c('https://twitter.com/Tolik_los', 268, new Date('2022-10-14')),
    c('https://t.me/CrypTime_Channel', 8067, new Date('2022-10-14')),
  ],
  tags: [PlayToEarn],
})

export const eOneInfluencer = addInfluencerD({
  ...spreadPerson(eOne),
  title: 'eOne',
  username: 'eOne',
  symbol: 'EONE',
  channels: [
    c('https://www.youtube.com/c/eOne_club/videos', 15900, new Date('2022-10-14')),
    c('https://t.me/youtube_mama', 30, new Date('2022-10-14')),
  ],
  tags: [PlayToEarn],
})

export const ThisIsCryptoInfluencer = addInfluencerD({
  ...spreadPerson(ThisIsCrypto),
  title: 'Это - Крипто Blog',
  username: 'BountyBlogICO',
  symbol: 'TIC',
  channels: [
    c('https://www.youtube.com/c/BountyBLogICO/videos', 12200, new Date('2022-10-14')),
    c('https://t.me/krupto_blog', 3724, new Date('2022-10-14')),
  ],
  tags: [PlayToEarn],
})

export const JordanVoorheesInfluencer = addInfluencerD({
  ...spreadPerson(JordanVoorhees),
  title: 'Crypto Romo',
  username: 'BroskiMM',
  symbol: 'ROMO',
  channels: [
    c('https://www.youtube.com/channel/UCtuctzKeLfRgARcwpY0jJVw', 6100, new Date('2022-10-14')),
  ],
  tags: [PlayToEarn],
})

export const TamaraOdonataInfluencer = addInfluencerD({
  ...spreadPerson(TamaraOdonata),
  title: 'Тамара, какого хрена?',
  username: 'odonata_live',
  symbol: 'TAM',
  channels: [
    c('https://vk.com/odonata_live', 125000, new Date('2022-10-20')),
  ],
  tags: [Lifestyle],
})

export const AnnaWhiteMagicInfluencer = addInfluencerD({
  ...spreadPerson(AnnaWhiteMagic),
  title: 'White Magic',
  username: 'WhiteMagic',
  symbol: 'MAGIC',
  channels: [],
  tags: [Gaming],
})

export const JeromeTanInfluencer = addInfluencerD({
  ...spreadPerson(JeromeTan),
  title: 'Jerome | Transformation Coach',
  username: 'primalphysique',
  symbol: 'TAN',
  channels: [
    c('https://instagram.com/primalphysique', 166401, new Date('2022-11-02')),
  ],
  tags: [Wellness],
})

export const AlexanderLeginInfluencer = addInfluencerD({
  ...spreadPerson(AlexanderLegin),
  title: 'Александр Легин',
  description: `
    💲 Наставник предпринимателей и лидеров современности
    🎓 Эксперт №1 в СНГ по работе со страхами по методике Терапия Отказами
    🎯 Мастер игровых челленджей для экспертов и предпринимателей.
    🔥 5000 выпускников
  `,
  username: 'alex_legin',
  symbol: 'LEGIN',
  channels: [
    c('https://www.instagram.com/alex_legin', 3833, new Date('2023-02-04')),
  ],
  tags: [Business],
})

export const VickyBuddhaCafeInfluencer = addInfluencerD({
  ...spreadPerson(VickyBuddhaCafe),
  title: 'Vicky',
  username: 'vicky',
  symbol: 'VIC',
  channels: [],
  tags: [Lifestyle],
})

export const NiomiSmartInfluencer = addInfluencerD({
  ...spreadPerson(NiomiSmart),
  title: 'Niomi Smart',
  username: 'niomismart',
  symbol: 'NIOMI',
  channels: [
    c('https://www.instagram.com/niomismart/', 1300000, new Date('2022-11-02')),
  ],
  tags: [Health],
})

export const BlackPrinceInfluencer = addInfluencerD({
  ...spreadPerson(BlackPrince),
  title: 'Black Prince',
  username: 'BlackPrince',
  symbol: 'PRINCE',
  channels: [
    // see notes
  ],
  tags: [
    // no channels - no tags
  ],
  notes: `
    * TikTok - 6.3 million
    * YouTube - 2 million
  `,
})

export const PacoWebInfluencer = addInfluencerD({
  ...spreadPerson(PacoWeb),
  title: 'Paco Web',
  username: 'paco_web',
  symbol: 'PAC',
  description: `
    Growth Hacking Empresas. Marketing digital. Emprendimiento
  `,
  channels: [
    c('https://instagram.com/paco_web', 48300, new Date('2022-11-02')),
    c('https://tiktok.com/@paco.web', 3800000, new Date('2022-11-02')),
    c('https://www.youtube.com/channel/UCB80UAu8v0IexBRR2lzqb7w', 115000, new Date('2022-11-02')),
    c('https://www.twitch.tv/pacoplaysgames', 13900, new Date('2022-11-02')),
  ],
  tags: [],
})

export const AriRoverInfluencer = addInfluencerD({
  ...spreadPerson(AriRover),
  title: 'jSK Vibes',
  username: 'ari_rover',
  symbol: 'KAY',
  channels: [
    c('https://instagram.com/ari_rover', 21300, new Date('2022-11-02')),
    c('https://tiktok.com/@ari_rover', 671800, new Date('2022-11-02')),
    c('https://youtube.com/c/jSKarirover', 177000, new Date('2022-11-02')),
    c('https://twitter.com/ari_rover', 3493, new Date('2022-11-02')),
  ],
  tags: [Lifestyle],
})

export const AaronVanKampenInfluencer = addInfluencerD({
  ...spreadPerson(AaronVanKampen),
  title: 'Aaron Van Kampen',
  username: 'aaronvankampen',
  symbol: 'AVK',
  description: `
    Traveling the world and meeting the incredibly successful.

    TikTok @ Aaron.vankampen
    IG @ AaronVankampen 
    Snapchat: Millionaire Mansions
  `,
  channels: [
    c('https://instagram.com/aaronvankampen', 209000, new Date('2022-11-02')),
    c('https://tiktok.com/@aaron.vankampen', 5700000, new Date('2022-11-02')),
    c('https://www.youtube.com/channel/UCFkoTLQnJu4cQELnmgwDqgA', 150000, new Date('2022-11-02')),
  ],
  tags: [Crypto],
})

export const AdamGoodallInfluencer = addInfluencerD({
  ...spreadPerson(AdamGoodall),
  title: 'Online Income Streams',
  username: 'onlineincomestreams',
  symbol: 'ADM',
  description: `
    Helping You Make Money Online Through No BS Step-By-Step Methods Other 'Gurus' Won't Show You..

    How I Quit My Job Thanks To Side Hustles!
    
    This Channel Revolves Around Making Money Online Methods Including: Affiliate Marketing, CPA Marketing, Crypto and Other Side Hustles That Have Made Me Money!
  `,
  channels: [
    c('https://www.youtube.com/c/onlineincomestreams', 4500, new Date('2022-11-03')),
  ],
  tags: [Crypto],
})

export const LeviRietveldCryptoKingInfluencer = addInfluencerD({
  ...spreadPerson(LeviRietveldCryptoKing),
  title: 'Crypto King',
  username: 'CryptoKing',
  symbol: 'KING',
  description: `
    Leading The Crypto Revolution. 

    Earn And Burn $LUNC: http://burnandbuild.org
  `,
  channels: [
    c('https://www.youtube.com/c/CryptoKingg', 70300, new Date('2022-11-04')),
    c('https://twitter.com/CryptoKing_NFT', 67600, new Date('2022-11-10')),
  ],
  tags: [Crypto],
})

export const CryptoAndyInfluencer = addInfluencerD({
  ...spreadPerson(CryptoAndy),
  title: 'Crypto Andy',
  username: 'CryptoAndy',
  symbol: 'ANDY',
  description: `
    Crypto Investor & YouTuber
    Daily Updates on the hottest projects in Crypto
  `,
  channels: [
    c('https://www.youtube.com/c/CryptoAndy', 8300, new Date('2022-11-04')),
    c('https://discord.gg/F5PDCzMPU9', 895, new Date('2022-11-04')),
    c('https://t.me/+6SHedhcU9SYxMjUx', 474, new Date('2022-11-04')),
    c('https://twitter.com/TheCryptoAndy', 1360, new Date('2022-11-04')),
  ],
  tags: [AltcoinBuffet],
})

export const TwoBitCryptoInfluencer = addInfluencerD({
  ...spreadPerson(TwoBitCrypto),
  title: '2Bit Crypto',
  username: '2BitCrypto',
  symbol: '2BIT',
  channels: [
    c('https://www.youtube.com/c/2BitCrypto', 12600, new Date('2022-11-04')),
    c('https://twitter.com/2bitcrypto_YT', 3156, new Date('2022-11-04')),
  ],
  tags: [Crypto],
})

export const CryptoIshInfluencer = addInfluencerD({
  ...spreadPerson(CryptoIsh),
  title: 'Crypto Ish',
  username: 'cryptoishy',
  symbol: 'ISH',
  description: `
    Be informed with the newest and best Crypto projects with insider info. DYOR of course.
  `,
  channels: [
    c('https://www.youtube.com/channel/UChO44hGMFTMUiQMgp9TjjmQ', 14800, new Date('2022-11-04')),
    c('https://twitter.com/cryptoishy', 3524, new Date('2022-11-04')),
    c('https://www.tiktok.com/@cryptoishy', 1, new Date('2022-11-04')),
  ],
  tags: [Crypto],
})

const assortedInfluencers = [
  {
    channels: [
      c('https://www.youtube.com/channel/UCTt7JL7E3DfSClhyidGLJtw', 12700, new Date('2022-11-04')),
    ],
    assetsInFocus: [BTC],
    tags: [CryptoCharts],
    // * currencies Hex
  },
  {
    channels: [
      c('https://www.youtube.com/c/CodexCrypto_', 3200, new Date('2022-11-04')),
    ],
    tags: [CryptoCharts],
  },
  {
    channels: [
      c('https://www.youtube.com/channel/UCk1ZZD4f6PxZz-SAvlRdfnw', 16300, new Date('2022-11-04')),
    ],
    language: Tamil,
  },
  {
    channels: [
      c('https://www.youtube.com/c/GymRatCrypto', 4500, new Date('2022-11-04')),
    ],
    assetsInFocus: [HEX],
  },
  {
    ...spreadPerson(RandiHipperMissTeenCrypto),
    notes: 'No shitcoin reviews, only education',
  },
]

export const EverythingIsCryptoInfluencer = addInfluencerD({
  ...spreadPerson(EverythingIsCrypto),
  title: 'EverythingIsCrypto',
  username: 'EverythingIsCrypto',
  symbol: 'EIC',
  description: `
    I am someone who loves everything crypto related! We are all information about crypto.. Subscribe to stay updated with the latest crypto news and predictions. 

    I am not a financial advisor, Just an avid Crypto Enthusiast who brings you the #1 best Cryptocurrencies on the market today!
    
    I cover many different altcoins to help you make a better decision on your investment. Some gems I have predicted went up 10x, 25x heck even 100x! However always do your own research as we make the videos about these amazing projects to help you pick the best project that suits your investment style!
    
    We hope you invest early and retire wealthy. 
  `,
  pageCheckedAt: new Date('2022-11-17'),
  channels: [
    c('https://www.youtube.com/c/EverythingIsCrypto', 4230, new Date('2022-11-04')),
  ],
  tags: [AltcoinBuffet],
})

export const PassiveBaseInfluencer = addInfluencerD({
  ...spreadPerson(PassiveBase),
  title: 'Passive Base',
  username: 'PassiveBase',
  symbol: 'BASED',
  description: `
    Passive Base is where we talk about everything crypto!  Website coming soon!
  `,
  channels: [
    c('https://www.youtube.com/c/PassiveBase', 4820, new Date('2022-11-04')),
    c('https://t.me/passivebase', 192, new Date('2022-11-04')),
  ],
  tags: [AltcoinBuffet],
})

export const IvyCryptoInfluencer = addInfluencerD({
  ...spreadPerson(IvyCrypto),
  title: 'IVY Crypto',
  username: 'IVYCrypto',
  symbol: 'IVY',
  description: `
    IVY Crypto covers altcoins focusing on new potential 50-100x crypto's and new NFT projects. Brining you the top news, new coins and long/short term flips in the crypto space. Keep up to date with the latest events in Ethereum, Cardano, Polkadot, Binance and much more. 
  `,
  channels: [
    c('https://www.youtube.com/c/IVYCrypto', 5380, new Date('2022-11-04')),
    c('https://twitter.com/IVYcrypto21', 1246, new Date('2022-11-04')),
  ],
  tags: [AltcoinBuffet],
})

export const CryptoBoatInfluencer = addInfluencerD({
  ...spreadPerson(CryptoBoat),
  title: 'Crypto Boat',
  username: 'CryptoBoat',
  symbol: 'BOAT',
  description: `
    Here at CRYPTO BOAT , We Cover The Projects in CRYPTO Including Token Reviews, Exchange Reviews, IEO ( Initial Exchange Offering ) ICO ( Initial Coin Offering ), Crypto Wallet Reviews, Investment Based Websites, Mining Website Reviews, Defi Projects And Many More
    
    ❌❌ BEWARE OF FAKE ACCOUNTS ❌❌ Check Telegram ID and Email ID Properly
    
    ALL Partnerships must be finalized by the CRYPTO BOAT Owner By Above Provided Contact Details. 
    We are not responsible for any losses due to your Negligence.
    
    Thanks & Have A Nice Day :)
    
    Disclaimer – We Make Videos For Educating People , So If you Decide To Invest After Watching Our Video Then We Will Not Be Liable For Any Profit Or Loss Encountered By You In The Process . 
  `,
  channels: [
    c('https://www.youtube.com/c/CryptoBoatYT', 82500, new Date('2022-11-04')),
  ],
  tags: [AltcoinBuffet],
})

export const SpikeInfluencer = addInfluencerD({
  ...spreadPerson(Spike),
  title: 'Spike',
  username: 'SpikeReacts',
  symbol: 'SPIKE',
  channels: [
    c('https://www.youtube.com/c/SpikeReacts', 1990, new Date('2022-11-08')),
    c('https://www.twitch.tv/spikereacts', 7800, new Date('2022-11-08')),
    c('https://twitter.com/SpikeReacts_', 73300, new Date('2022-11-08')),
    c('https://www.instagram.com/Spikereacts/', 54, new Date('2022-11-08')),
    c('https://www.tiktok.com/@spikereacts', 318, new Date('2022-11-08')),
  ],
  tags: [PlayToEarn],
})

export const SimonGlavinInfluencer = addInfluencerD({
  ...spreadPerson(SimonGlavin),
  title: 'SG Crypto',
  username: 'SGCrypto',
  symbol: 'SG',
  channels: [
    c('https://www.youtube.com/channel/UCrIB_zGp8V4zoXWtMR8pq3Q', 1960, new Date('2022-11-08')),
    c('https://twitter.com/simonglav', 73, new Date('2022-11-08')),
    c('https://www.instagram.com/simon.glavin/', 290, new Date('2022-11-08')),
  ],
  tags: [AltcoinBuffet],
})

export const CdrocksProjectsInfluencer = addInfluencerD({
  ...spreadPerson(ChrisDelaney),
  title: 'Cdrocks Projects',
  username: 'CdrocksProjects',
  symbol: 'CD',
  description: `
    Cdrocks Projects is a channel for people that are wanting to make money online. I also will be doing reviews and updates about the platforms that I am in.
  `,
  channels: [
    c('https://www.youtube.com/c/CdrocksProjects', 3810, new Date('2022-11-08')),
    c('https://t.me/cdrocksprojects', 1287, new Date('2022-11-08')),
    c('https://www.tiktok.com/@cdrocksprojects', 561, new Date('2022-11-08')),
    c('https://www.instagram.com/cdrocksprojects/', 4126, new Date('2022-11-08')),
    c('https://web.facebook.com/groups/1300251817000798', 487, new Date('2022-11-08')),
  ],
  tags: [AltcoinBuffet],
})

export const JohnMastersonInfluencer = addInfluencerD({
  ...spreadPerson(JohnMasterson),
  title: 'The John Masterson Show',
  username: 'johnmasterQ',
  symbol: 'JMQ',
  description: `
    Hello, My Friends: This channel focuses on Crypto Currency, Staking, Angel Investing and Passive Income. Thanks for looking...John

    PS: Please remember that this is for entertainment only. This channel gives you the baby and NOT all the labor. Homework is required...John
  `,
  pageCheckedAt: new Date('2022-11-17'),
  channels: [
    c('https://www.youtube.com/channel/UCsTLiCZwzlSJ91nwmb-agZg', 3640, new Date('2022-11-08')),
  ],
  tags: [Crypto],
})

export const CryptoArchieInfluencer = addInfluencerD({
  ...spreadPerson(CryptoArchie),
  title: 'Crypto Archie',
  username: 'CryptoArchieYT',
  symbol: 'ARCH',
  channels: [
    c('https://www.youtube.com/channel/UCboO9lZEbjfBHvQrAvwBUaQ', 1140, new Date('2022-11-09')),
    c('https://twitter.com/CryptoArchieYT', 47, new Date('2022-11-09')),
    c('https://www.tiktok.com/@cryptoarchieyt', 1, new Date('2022-11-09')),
    c('https://discord.gg/DvDVhtZnve', 62, new Date('2022-11-09')),
  ],
  tags: [Crypto],
})

export const CryptoGainsInfluencer = addInfluencerD({
  ...spreadPerson(CryptoGains),
  title: 'Crypto Gains',
  username: 'CryptoGains',
  symbol: 'GAIN',
  description: `
    Hi! :)  Welcome to my channel where I talk mainly on potential Crypto gains. coins that could potentially 10x, 100x, 1000x and so on. 

    Hope you enjoy my content. 
    
    Please Like & Subscribe
    
    PLEASE NOTE: I am NOT a financial advisor and i am strictly operating off of opinion and information found publicly online. My videos are NOT buy or sell signals. All investments you make are on you. Use my channel as a starting off point & do your research!
  `,
  channels: [
    c('https://www.youtube.com/channel/UCbFFuUCrfkahTOwO3nUqISw', 93500, new Date('2022-11-09')),
    c('https://twitter.com/cryptogains9', 2723, new Date('2022-11-09')),
    c('https://t.me/CryptoGainsGroup', 2553, new Date('2022-11-09')),
    c('https://www.instagram.com/jayden_toretto/', 155000, new Date('2022-11-09')),
  ],
  tags: [Crypto],
})

export const InvestingNerdInfluencer = addInfluencerD({
  ...spreadPerson(InvestingNerd),
  title: 'Investing Nerd',
  username: 'InvestingNerd',
  symbol: 'NERD',
  description: `
    Hey, I'm Alex and on this channel I talk about the latest news, trends, and strategies to help you be successful in crypto, NFT's, and investing overall. The most educated investors are the most successful. 

    We will be covering:
    ✷ Stocks 
    ✷ Retirement
    ✷ Real Estate
    ✷ Gold & Silver 
    ✷ Crypto
    ✷ Taxes 
    
    You will learn:
    ✓ Investing strategies based on your goals
    ✓ How to build an investment portfolio
    ✓ How to save more money  
    ✓ Strategies to reach financial freedom
    
    Our Mission 
    🎯 To help thousands of people build meaningful financial wealth for themselves and their families 
    
    Our Values:
    ➤ Learning 
    ➤ Positivity 
    ➤ Perseverance 
    
    Disclaimer: This channel is for education purposes only. You should seek investment advice from a registered professional before making any investment decision. This channel is not responsible for any investment actions taken by viewers
  `,
  channels: [
    c('https://www.youtube.com/c/InvestingNerd', 5000, new Date('2022-11-10')),
    c('https://twitter.com/investingnrd', 1287, new Date('2022-11-10')),
  ],
  tags: [Crypto],
})

export const DefiDefendersInfluencer = addInfluencerD({
  ...spreadPerson(DefiDefenders),
  title: 'Defi Defenders',
  username: 'DefiDefenders',
  symbol: 'DEF',
  description: `
    Defi Defenders are the protectors of the Decentralized Crypto Space! We scour the rabbit holes in search of 10x 100x 1000x projects when they are in the early stages. Me and my team have created multiple 6 figure crypto investors and we are looking to impact even more! We will be hosting AMA's, Reviewing Projects, Live Fair Launches, Presales & Whitelists, Major Crypto News Updates, & Even Crypto Gaming Streams! Make sure u subscribe, like, comment and be sure to join our free telegram to stay plugged in. t.me/DefiDefenders

    We are not financial advisors we are just purely researching and speculating a new asset class, always do your own research. We try our best to minimize the risks of investing in this crazy crypto space, but as with any investing there are significant risks you can lose your investment due to extreme volatility and unforeseen circumstances.
  `,
  channels: [
    c('https://www.youtube.com/c/DefiDefenders', 4930, new Date('2022-11-10')),
    c('https://twitter.com/defidefenders', 350, new Date('2022-11-10')),
  ],
  tags: [Crypto],
})

export const CilinixCryptoInfluencer = addInfluencerD({
  ...spreadPerson(CilinixCrypto),
  title: 'Cilinix Crypto',
  username: 'CilinixCrypto',
  symbol: 'CNX',
  channels: [
    c('https://www.youtube.com/c/CilinixCrypto', 16100, new Date('2022-11-16')),
    c('https://www.instagram.com/cilinixcrypto/', 169, new Date('2022-11-16')),
    c('https://t.me/CilinixCrypto', 9, new Date('2022-11-16')),
  ],
  tags: [AltcoinBuffet],
})

export const MindYourCryptoInfluencer = addInfluencerD({
  ...spreadPerson(MindYourCrypto),
  title: 'MindYourCrypto',
  username: 'MindYourCrypto',
  symbol: 'MYC',
  channels: [
    c('https://www.youtube.com/channel/UCCB7qEYcbFyiC_cjoVK23lQ', 11700, new Date('2022-11-16')),
    c('https://twitter.com/MindYourCrypto1', 378, new Date('2022-11-16')),
    c('https://t.me/MindYourCrypto_growtogether', 540, new Date('2022-11-16')),
  ],
  tags: [AltcoinBuffet],
})

export const SuperTradeishInfluencer = addInfluencerD({
  ...spreadPerson(SuperTradeish),
  title: 'SuperTradeish',
  username: 'SuperTradeish',
  symbol: 'TRADE',
  channels: [
    c('https://www.youtube.com/c/SuperTradeish', 9650, new Date('2022-11-16')),
    c('https://twitter.com/supertradeish', 202, new Date('2022-11-16')),
    c('https://t.me/supertradeish', 680, new Date('2022-11-16')),
  ],
  tags: [AltcoinBuffet],
})

export const CryptoGeeksInfluencer = addInfluencerD({
  ...spreadPerson(CryptoGeeks),
  title: 'CryptoGeeks',
  username: 'CryptoGeeks',
  symbol: 'CG',
  channels: [
    c('https://www.youtube.com/c/CryptoGeeksChannel', 2030, new Date('2022-11-16')),
    c('https://discord.com/invite/83y3Dyz2tS', 60, new Date('2022-11-16')),
    c('https://twitter.com/CryptoGeeks', 202, new Date('2022-11-16')),
    c('https://www.instagram.com/cryptogeeks7/', 29, new Date('2022-11-16')),
  ],
  tags: [AltcoinBuffet],
})

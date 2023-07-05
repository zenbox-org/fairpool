import { dsc } from 'libs/discord/models/DiscordUsername/helpers'
import { parsePersonUid, Person, PersonSchema } from 'libs/fairpool/models/Person'
import { mapPersonFL, mapPersonN, mapPersonU } from 'libs/fairpool/models/Person/mapPerson'
import { spreadName } from 'libs/fairpool/models/Person/spreadName'
import { English, Romanian, Russian, Telugu } from 'libs/generic/data/allLanguages'
import { Contact, mailto } from 'libs/generic/models/Contact'
import { getIdFromUrl } from 'libs/generic/models/Id/getIdFromUrl'
import { Url } from 'libs/generic/models/Url'
import { tg } from 'libs/telegram/models/TelegramUsername/helpers'
import { getFinder, getInserter, getName } from 'libs/utils/zod'
import { Optional } from 'ts-toolbelt/out/Object/Optional'

/**
 * WARNING: Don't add personal contacts here, since this file is a part of a "libs/fairpool" repo (a submodule of zenbox and fairpool repos)
 */
const personal: Contact[] = [/* hidden for privacy */]

export const allPersons: Person[] = []

export const addPerson = getInserter<Person>(getName(PersonSchema), PersonSchema, parsePersonUid, allPersons)

export const findPerson = getFinder(parsePersonUid, allPersons)

const addPersonFL = mapPersonFL(addPerson)

const addPersonN = mapPersonN(addPerson)

const addPersonU = mapPersonU(addPerson)

function addPersonFLPE(firstname: string, lastname: string, nickname = firstname, person: Optional<Person, 'id' | 'name' | 'nickname' | 'language' | 'contacts'> = {}, language = English, contacts = personal) {
  return addPersonFL(firstname, lastname, nickname, language, contacts, person)
}

function addPersonFLPR(firstname: string, lastname: string, nickname = firstname, person: Optional<Person, 'id' | 'name' | 'nickname' | 'language' | 'contacts'> = {}, language = Russian, contacts = personal) {
  return addPersonFL(firstname, lastname, nickname, language, contacts, person)
}

export function addPersonFreelancer(url: Url, shortname: string | undefined) {
  return addPerson({
    id: getIdFromUrl(url),
    shortname,
    contacts: [url],
    language: English,
  })
}

export const OlgaKulakova = addPersonFL('Olga', 'Kulakova', 'Ольга', Russian)

export const TamaraOdonata = addPerson({
  id: 'TamaraOdonata',
  name: 'Tamara Odonata',
  shortname: 'Тамара',
  contacts: personal,
  language: Russian,
})

export const AnastasiaAsheylova = addPerson({
  id: 'AnastasiaAsheylova',
  name: 'Anastasia Asheylova',
  shortname: 'Настя',
  contacts: personal,
  language: Russian,
})

export const AnnaWhiteMagic = addPerson({
  id: 'AnnaWhiteMagic',
  name: 'Anna',
  shortname: 'Аня',
  contacts: personal,
  language: Russian,
})

export const RossKP = addPerson({
  id: 'RossKP',
  name: 'Ross',
  shortname: 'Ross',
  contacts: personal,
  language: English,
})

export const JeromeTan = addPersonFLPE('Jerome', 'Tan')

export const TimHeathmont = addPersonFLPE('Tim', 'Heathmont')

export const AlexanderKuzmenko = addPersonFLPR('Alexander', 'Kuzmenko', 'Саша')

export const ImamudinNaseem = addPersonFLPE('Imamudin', 'Naseem')

export const ElenaMarunich = addPersonFLPR('Elena', 'Marunich', 'Лена')

export const AlexanderAvdonin = addPersonFLPR('Alexander', 'Avdonin', 'Саша')

export const PetrKorolev = addPersonFLPR('Petr', 'Korolev', 'Петя')

export const JuliaVoynova = addPersonFLPR('Julia', 'Voynova', 'Юля')

export const AitorUrbina = addPersonFLPE('Aitor', 'Urbina')

export const AleksandraKuznetsova = addPersonFLPR('Aleksandra', 'Kuznetsova', 'Саша')

export const NikitaRyabov = addPersonFLPR('Nikita', 'Ryabov', 'Никита')

export const DmitryShurupov = addPersonFLPR('Dmitry', 'Shurupov', 'Дима')

export const VladimirZimin = addPersonFLPR('Vladimir', 'Zimin', 'Вова')

export const TatianaMalyutina = addPersonFLPR('Tatiana', 'Malyutina', 'Таня')

export const PavelBaricev = addPersonFLPR('Pavel', 'Baricev', 'Паша')

export const AnnaSolodkova = addPersonFLPR('Anna', 'Solodkova', 'Аня')

export const AlexanderEnns = addPersonFLPE('Alexander', 'Jens', 'Alex')

export const AntonK = addPersonFLPR('Anton', 'K', 'Антон')

export const AlexanderLegin = addPersonFLPR('Alexander', 'Legin', 'Саша')

export const TheoCremel = addPersonFLPE('Theo', 'Cremel')

export const VickyBuddhaCafe = addPersonFLPE('Vicky', '', 'Vicky', {
  notes: 'Met at Buddha Cafe',
})

export const NiomiSmart = addPersonFL('Niomi', '', undefined, English, [
  'https://www.instagram.com/niomismart/',
])

export const BlackPrince = addPersonFL('Black', 'Prince', 'Саша', Russian, [
  'https://t.me/ttblackpanther',
])

export const BisonTrades = addPersonN('Bizon', English, [
  'https://twitter.com/BisonTrades',
  mailto('BisonTrades@protonmail.com'),
])

export const NikitaLezhankin = addPersonFL('Никита', 'Лежанкин', undefined, Russian, [
  'https://t.me/iporf',
  'https://t.me/Nikson777',
], {
  id: 'NikitaLezhankin',
})

export const ProInvesting = addPersonN('antoniusatori', Russian, [
  'https://t.me/procryptonum',
  tg('@antoniusatori'),
])

export const GreasonTV = addPersonN('Greason', English, [
  // none
])

export const AlexanderLeskov = addPersonFL('Александр', 'Лесков', undefined, Russian, [
  tg('@dfdsfsdfsdf'), // yes, it's real
], {
  id: 'AlexanderLeskov',
})

export const FocusedAlpha = addPersonU('FocusedAlpha', English, [
  'https://twitter.com/focusedalphaNFT',
])

export const IlyaBelashov = addPersonFL('Илья', 'Белашов', undefined, Russian, [
  'https://www.instagram.com/belashov_ilya',
], {
  id: 'IlyaBelashov',
})

export const CopperPitch = addPersonFL('Copper', 'Pitch', undefined, English, [
  'https://twitter.com/CopperPitch',
  'https://discord.gg/Hz3ubbK',
])

export const AlexanderCraft = addPersonFL('Александр', 'Крафт', undefined, Russian, [
  'https://vk.com/trading_kraft',
], {
  id: 'AlexanderCraft',
})

export const AnatoliLos = addPersonFL('Анатолий', '', undefined, Russian, [
  tg('@AnatoLiLos'),
], {
  id: 'AnatoliLos',
})

export const eOne = addPersonN('eOne', Russian, [
  tg('@eOne_tube'),
], {
  notes: 'Фамилия: Кабанов',
})

export const ThisIsCrypto = addPersonFL('Сергей', '', undefined, Russian, [
  tg('@kopirax'),
], {
  id: 'ThisIsCrypto',
})

export const JordanVoorhees = addPersonFL('Jordan', 'Voorhees', undefined, English, [
  'https://www.fiverr.com/jordanvoor',
  tg('BroskiMM'),
  'https://www.cryptopromotionagency.com',
])

export const IrinaTatarinova = addPerson({
  ...spreadName('Irina', 'Tatarinova', 'Ира'),
  language: Russian,
  contacts: [
    tg('@mikeshina'),
  ],
})

export const PacoWeb = addPerson({
  ...spreadName(undefined, undefined, 'Paco', 'PacoWeb'),
  language: English,
  contacts: [
    mailto('hola@pacoweb.com.mx'),
    'https://collabstr.com/pacoweb',
    'https://web.facebook.com/Pacowwweb',
  ],
})

export const AriRover = addPerson({
  ...spreadName('Ari', 'Rover'),
  language: English,
  contacts: [
    'https://collabstr.com/jskvibe',
    mailto('artbyrover@gmail.com'),
    'https://www.instagram.com/ari_rover/',
    'https://web.facebook.com/artbyrover',
  ],
})

export const AaronVanKampen = addPerson({
  ...spreadName('Aaron', 'Van Kampen'),
  language: English,
  contacts: [
    mailto('management@avk.tv'),
    'https://collabstr.com/aaronvankampen',
    'https://instagram.com/aaronvankampen',
    'https://tiktok.com/@aaron.vankampen',
    'https://www.youtube.com/channel/UCFkoTLQnJu4cQELnmgwDqgA',
  ],
})

export const Cryptonita = addPerson({
  ...spreadName(undefined, undefined, 'Cryptonita'),
  language: Romanian,
  contacts: [
    'https://instagram.com/cryptonita.eth',
    'https://tiktok.com/@cryptonitaro',
    'https://www.youtube.com/c/CryptonitaRO',
    'https://twitter.com/cryptonita_ro',
  ],
})

export const AdamGoodall = addPerson({
  ...spreadName('Adam', 'Goodall'),
  language: English,
  contacts: [
    mailto('adamgoodall@onlineincomestreams.club'),
    'https://tiktok.com/@online_income_streams',
    'https://www.youtube.com/onlineincomestreams',
  ],
})

export const LeviRietveldCryptoKing = addPerson({
  ...spreadName('Levi', 'Rietveld'),
  language: English,
  contacts: [
    mailto('business@axieking.com'),
    'https://twitter.com/CryptoKing_NFT',
  ],
})

export const CryptoAndy = addPerson({
  ...spreadName('Andy', undefined, undefined, 'CryptoAndy'),
  language: English,
  contacts: [
    mailto('thecryptoandy@gmail.com'),
    tg('TheCryptoAndy'),
    dsc('Crypto Andy#2897'),
  ],
})

export const TwoBitCrypto = addPerson({
  ...spreadName('Mike', undefined, '2Bit', 'TwoBitCrypto'),
  language: English,
  contacts: [
    mailto('2bitcrypto@gmail.com'),
    tg('twobitcryptoYT'),
    'https://twitter.com/2bitcrypto_YT',
  ],
})

export const MumbaiPilla = addPerson({
  ...spreadName('Pilla', undefined),
  language: Telugu,
  contacts: [
    mailto('ss.entertainments1993@gmail.com'),
    'https://www.facebook.com/mumbaipillaa',
    'https://www.instagram.com/sushmaverse/',
  ],
})

export const CryptoIsh = addPerson({
  ...spreadName(undefined, undefined, 'Ish', 'CryptoIsh'),
  language: English,
  contacts: [
    mailto('cryptoishy@gmail.com'),
    tg('cryptoishy'),
    'https://twitter.com/cryptoishy',
  ],
})

export const EverythingIsCrypto = addPerson({
  ...spreadName(undefined, undefined, undefined, 'EverythingIsCrypto'),
  language: English,
  contacts: [
    mailto('EverythingIsCryptoNow@gmail.com'),
    tg('eicmedia'),
  ],
})

export const PassiveBase = addPerson({
  ...spreadName(undefined, undefined, 'PB', 'PassiveBase'),
  language: English,
  contacts: [
    mailto('ItsPassivebase@gmail.com'),
    tg('PassivebaseOfficial'),
    'https://twitter.com/PassiveBase',
    'https://www.patreon.com/passivebase',
  ],
})

export const IvyCrypto = addPerson({
  ...spreadName(undefined, undefined, 'Ivy', 'IvyCrypto'),
  language: English,
  contacts: [
    mailto('ivycrypto21@gmail.com'),
    'https://twitter.com/IVYcrypto21',
  ],
})

export const RandiHipperMissTeenCrypto = addPerson({
  ...spreadName('Randi', 'Hipper', undefined, 'MissTeenCrypto'),
  language: English,
  contacts: [
    mailto('manager@missteencrypto.com'),
    'https://missteencrypto.com/',
  ],
})

export const CryptoBoat = addPerson({
  ...spreadName(undefined, undefined, 'Crypto Boat', 'CryptoBoat'),
  language: English,
  contacts: [
    mailto('cryptoinvyt@gmail.com'),
    tg('Boatcrypto'),
    tg('Boatcrypto1'),
    tg('CRYPTOINVYT'),
  ],
})

export const Spike = addPerson({
  ...spreadName(undefined, undefined, 'Spike', 'Spike'),
  language: English,
  contacts: [
    mailto('web3spike@gmail.com'),
    'https://web.facebook.com/SpikeReacts',
  ],
})

export const SimonGlavin = addPerson({
  ...spreadName('Simon', 'Glavin', 'SG'),
  language: English,
  contacts: [
    mailto('sgcryptoedu@gmail.com'),
    'https://calendly.com/glavinholdings',
    'https://www.glavinholdings.com/',
    'https://linktr.ee/Simonglavin',
    'https://twitter.com/simonglav',
    'https://www.instagram.com/simon.glavin/',
    'https://www.linkedin.com/in/simon-glavin-160494190/',
    'https://www.facebook.com/profile.php?id=100086652302231',
  ],
})

export const MichaelHazilias = addPerson({
  ...spreadName('Michael', 'Hazilias'),
  language: English,
  contacts: [],
})

export const PhilDiasinos = addPerson({
  ...spreadName('Phil', 'Diasinos'),
  language: English,
  contacts: [],
})

export const WassimDabboussi = addPerson({
  ...spreadName('Wassim', 'Dabboussi'),
  language: English,
  contacts: [],
})

export const MatthewBattieri = addPerson({
  ...spreadName('Matthew', 'Battieri'),
  language: English,
  contacts: [],
})

export const ChrisDelaney = addPerson({
  ...spreadName('Chris', 'Delaney'),
  language: English,
  contacts: [
    mailto('chrisdelaney2@gmx.com'),
  ],
})

export const JohnMasterson = addPerson({
  ...spreadName('John', 'Masterson'),
  language: English,
  contacts: [
    mailto('johnmasterson80@yahoo.com'),
  ],
})

export const CryptoArchie = addPerson({
  ...spreadName(undefined, undefined, 'Archie', 'CryptoArchie'),
  language: English,
  contacts: [
    mailto('CryptoArchieYT@gmail.com'),
    'https://www.patreon.com/CryproArchie',
  ],
})

export const CryptoGains = addPerson({
  ...spreadName('Jayden', 'Toretto', undefined, 'CryptoGains'),
  language: English,
  contacts: [
    mailto('info.cryptogains@gmail.com'),
    'https://www.patreon.com/Cryptogains',
    'https://www.instagram.com/jayden_toretto/',
    'https://twitter.com/cryptogains9',
  ],
})

export const InvestingNerd = addPerson({
  ...spreadName('Alex', undefined, 'Alex', 'InvestingNerd'),
  language: English,
  contacts: [
    mailto('investingnerdco@gmail.com'),
    'https://twitter.com/investingnrd',
  ],
})

export const DefiDefenders = addPerson({
  ...spreadName(undefined, undefined, 'Defenders', 'DefiDefenders'),
  language: English,
  contacts: [
    mailto('cryptoceez@defidefenders.com'),
    'https://twitter.com/defidefenders',
    'https://defidefenders.com/',
  ],
})

export const CilinixCrypto = addPerson({
  ...spreadName(undefined, undefined, 'Cilinix', 'CilinixCrypto'),
  language: English,
  contacts: [
    mailto('cilinixfxcapital@gmail.com'),
    'http://www.cilinix.com/',
    'https://www.instagram.com/cilinixcrypto/',
    'https://t.me/CilinixCrypto',
  ],
})

export const MindYourCrypto = addPerson({
  ...spreadName('Bill', undefined, undefined, 'MindYourCrypto'),
  language: English,
  contacts: [
    mailto('billlp793@gmail.com'),
    'https://t.me/MindYourCrypto_Bill',
    'https://billmindsyourcrypto.com/',
    'https://twitter.com/MindYourCrypto1',
    // 'https://www.patreon.com/MindYourCrypto',
    'https://www.buymeacoffee.com/MindYourCrypto',
  ],
})

export const SuperTradeish = addPerson({
  ...spreadName(undefined, undefined, undefined, 'SuperTradeish'),
  language: English,
  contacts: [
    mailto('supertradeish@gmail.com'),
    'https://www.patreon.com/supertradeish',
  ],
})

export const CryptoGeeks = addPerson({
  ...spreadName(undefined, undefined, undefined, 'CryptoGeeks'),
  language: English,
  contacts: [
    mailto('ozedota@gmail.com'),
    'https://discord.com/channels/963623972832935986/1010437990662799431',
    'https://www.patreon.com/cryptogeeks',
    'https://twitter.com/Cryptogeeks7',
    'https://web.facebook.com/profile.php?id=100084881405845',
  ],
})

export const AdamCochran = addPerson({
  ...spreadName('Adam', 'Cochran', undefined, 'AdamCochran'),
  language: English,
  contacts: [
    'https://twitter.com/adamscochran',
    'https://cochran.io/',
    'https://cehv.com/',
    'ens:adamscochran.eth',
  ],
})

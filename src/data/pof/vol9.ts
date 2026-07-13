import type { PofEpisode } from './types'

// Volume 9 — masters 141–180 (document order). Spoken text only.
export const vol9: PofEpisode[] = [
  {
    id: 'pof-m141',
    seq: 161,
    title: '#141 · The First Worm',
    body: `[#141 · ~75s · origin legend]

The first great internet security disaster was a measurement experiment — with one untested number inside it. This is The Point of Failure, episode [N].

1988. The internet is a village — some sixty thousand computers, academic, trusting, mostly unlocked doors. A Cornell graduate student, Robert Tappan Morris, writes a program to explore it — self replicating, hopping machine to machine through known weak points — a debug door here, an overflow there, borrowed passwords — not to destroy anything — per the record, to measure. To count the village.

Morris even built in politeness — the worm asks machines — are you already infected? — and moves on if so. But he foresaw defenders faking that answer — so he added a throttle — one time in seven, reinfect anyway. One in seven. A number chosen by feel — never simulated, never tested at scale. And at scale, **one in seven** is not politeness. Machines accumulate copies — five, twenty, fifty — each copy consuming resources — until the computers of the village are kneeling under the weight of being counted.

**A tenth of the internet** goes down. Universities amputate themselves from the network to stop the spread — days of cleanup, panic in the era's small press. The reckoning invents modern security — Morris becomes the first conviction under America's new computer crime law — and the chaos births CERT — the first computer emergency response team — the institution every incident response you have ever heard of descends from. Morris, in the fullness of irony, becomes a beloved MIT professor.

And the engineering epitaph belongs on this arc's wall — the worm's cruelty was not in its intent but in its untested throttle — a single magic number, chosen by intuition, deployed to sixty thousand machines. Every rate limit, every retry count, every one in N in your codebase is a **hypothesis about scale**. The first worm is what a hypothesis looks like... field tested on everyone at once.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m142',
    seq: 162,
    title: '#142 · 376 Bytes in 10 Minutes',
    body: `[#142 · ~60s · velocity shock]

It was **three hundred seventy six bytes** — smaller than this sentence's paragraph — and it conquered the vulnerable internet in ten minutes. This is The Point of Failure, episode [N].

3 a.m., January 25th, 2003. A worm called SQL Slammer begins to move — one tiny packet per target, aimed at a known flaw in Microsoft's database server. Known — as in, the patch had existed for six months. Each infected server immediately starts spraying that same tiny packet at random addresses, thousands per second — and every hit creates another sprayer. The population doubles roughly every **eight and a half seconds**. Read that again. Not hours. Seconds.

Ten minutes — most of the seventy five thousand vulnerable exposed servers on earth — infected. And here is the strange part — Slammer destroyed nothing. No files, no ransom, no payload. The damage was **pure congestion** — tens of thousands of servers screaming random packets saturated networks worldwide. Bank ATMs went dark. Airline systems stumbled. South Korea — nearly the whole country — dropped off the internet for hours. The worm did not attack any of them. It just... breathed loudly enough to crush them.

The autopsy fits in one breath — at that speed, human response was mathematically irrelevant — no one reacts in eight and a half seconds. The only defenses that could have existed were built beforehand — the six month old patch, applied — networks segmented so a database server cannot scream at the planet. Slammer is the arc's purest proof that some failures cannot be fought — **only pre empted**. The race was over before anyone woke up.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m143',
    seq: 163,
    title: '#143 · The Love Letter',
    body: `[#143 · ~75s · global nostalgia]

The subject line said I LOVE YOU. Tens of millions of people opened it. By the weekend, the Pentagon had turned off its email. This is The Point of Failure, episode [N].

May 4th, 2000. An email lands — subject — ILOVEYOU — attachment — a love letter, apparently a harmless text file. It is not a text file. It is a script — its true nature hidden by a default Windows setting that politely concealed file extensions — a default that turned disguise into a feature. One click, and it overwrites your files — photos, documents — then mails itself to everyone in your address book. Which is the genius and the horror — the next victim receives it from someone they know. The worm did not spread through computers. It spread through **trust**.

Within days — tens of millions of machines. The Pentagon, the CIA, the British Parliament — shutting down email defensively, like closing storm shutters. Damage estimates in the billions. And when investigators traced it to Manila, to a student named Onel de Guzman — the story took its strangest turn — the Philippines had no law against what he had done. None existed. He walked free — and the country wrote its first cybercrime law in the aftermath. The internet had outrun the statute books by exactly one disaster.

Three keepers from the love letter. **Defaults are security decisions** — the hidden extension setting made millions of disguises — audit what your products decide for users silently. Trust is an attack channel — the payload arrived wearing a friend's name, and **no firewall filters affection**. And the law will always lag the network — which means the first defense was, and remains, the design — because you cannot prosecute your way out of a worm that already loves everyone.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m144',
    seq: 164,
    title: '#144 · The Day the Hospitals Locked',
    body: `[SERIOUS — measured, low energy, no smile]

Hospitals turned ambulances away. Nineteen thousand appointments vanished. The ransom note was on the screens where patient records should have been. This is The Point of Failure, episode [N].

May 12th, 2017. A ransomware worm called WannaCry detonates across the world — two hundred thousand machines, a hundred fifty countries, in days. Its engine — an exploit called EternalBlue, developed by America's NSA for intelligence work — stolen and leaked onto the open internet weeks before. Microsoft's patch had existed since March. Two months. The worm's entire kingdom was the gap between a patch existing... and a patch being applied.

Nowhere did that gap cost more than Britain's National Health Service. Roughly eighty hospital trusts disrupted — screens locked mid shift, systems dark in wards running on aging, end of life Windows machines that could not easily be patched or replaced. Ambulances diverted. Around nineteen thousand appointments and operations canceled — scans, clinics, surgeries — **medicine rescheduled by malware**. The reviews attributed no deaths — and this show adds nothing to that record — the weight of a hospital running on paper is heavy enough.

The ending arrived absurdly, wonderfully — a young researcher, Marcus Hutchins, analyzing the malware, noticed it checked an unregistered web domain — so he registered it — a few dollars — and the worm, by its own design, stopped spreading. A kill switch its authors had left, tripped by curiosity. Governments later attributed the attack to North Korean state actors. The save was one person and a domain name.

The lessons braid — a two month patch gap is **a policy, not an accident** — measure yours — especially where machines touch lives. End of life systems in critical care are debt with interest paid in canceled surgeries — a truth this series returns to in the life critical arc. And stockpiled weapons of code do not stay in their vaults. May 2017 taught all three at once — at the price of nineteen thousand appointments.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m145',
    seq: 165,
    title: '#145 · One Misconfigured Firewall',
    body: `[#145 · ~75s · cloud era forensic]

Nobody broke the cloud. Nobody broke the encryption. One firewall was configured to be helpful in exactly the wrong direction — and **a hundred six million** people's applications walked out. This is The Point of Failure, episode [N].

2019. Capital One is one of banking's proudest cloud pioneers — sophisticated, modern, all in. In front of its cloud applications stands a web application firewall — a guard whose job is inspecting traffic. But this guard is misconfigured with a strange courtesy — it can be induced to relay requests onward — including inward — to addresses inside the cloud environment itself.

And inside every cloud server's neighborhood sits a special address — the metadata service — the concierge that hands servers their own temporary credentials. The induced firewall asks the concierge on a visitor's behalf... and passes back credentials for its own role — a role whose permissions, in the fatal detail, were **broader than its job required**. Those credentials opened storage buckets — and in them, a hundred six million credit applications — names, addresses, credit scores, some Social Security numbers.

The person behind it — a former cloud industry employee who posted about the data — was arrested and convicted. The bank paid an eighty million dollar regulatory penalty and a hundred ninety million in settlements — and the industry hardened the concierge itself — session based metadata access is now standard, largely because of this case. But hold the sharpest fact — **nothing here was a zero day**. The chatty firewall, the reachable concierge, the overweight role — every link was sitting in configuration files, discoverable by anyone who reviewed them like an adversary. The cloud was not hacked. The settings were.

The keeper for the cloud age — your architecture is code, and code gets tested — so configurations must be too — adversarially, continuously, permission by permission. Ask of every role what this episode asks — not what does it do — **what COULD it reach on its worst day**? A hundred six million records sat one honest answer away.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m146',
    seq: 166,
    title: "#146 · The Password Manager's Bad Year",
    body: `[#146 · ~90s · layered forensic]

The company guarding millions of people's passwords was breached — through the home computer of one engineer — and the thieves left carrying the vaults themselves. This is The Point of Failure, episode [N].

2022. LastPass — tens of millions of users storing every password they own inside encrypted vaults. In August, breach number one — a developer environment compromised, source code and technical details taken. Assessed, disclosed, described as contained. But information is a lockpick set — and the attackers had just learned exactly how the building was constructed... and who held which keys.

Stage two, per the company's own disclosures, is the part this arc exists for. Among all employees, only a small handful of senior engineers held access to the most critical vault infrastructure. The attackers picked one — and went to his house. His home computer ran a vulnerable third party media application — through it, they implanted a keylogger — and simply... watched him type his master credentials. The corporate perimeter — the firewalls, the badges, the monitoring — was never touched. The perimeter had quietly grown to include a living room, and **nobody had tested the living room**.

With those credentials — copies of customer vault backups. Encrypted, yes — each with its user's master password — but with some fields, notably the website addresses, readable in the clear — a map of everyone's digital life, plus a locked box per site. Overnight, the security of millions rested on two things users never thought about — the strength of their own master password, and technical strengthening settings that, on older accounts, were documented as weaker. Later reporting linked cryptocurrency thefts to cracked vaults — alleged, litigated, attributed exactly that far and no further. And the staged, evolving disclosures drew a criticism this arc endorses — in a breach, **the communication is part of the product**.

Three keepers. Access concentration is a targeting list — your handful of golden key holders are being enumerated by someone — test their whole lives' attack surface, because the adversary will. Encrypted is a spectrum — metadata, settings, legacy defaults — audit what your encryption actually covers. And when the worst happens — **disclose like you will be quoted for a decade**. You will be.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m166',
    seq: 167,
    title: '#166 · The Game Patch That Broke Windows',
    body: `[#166 · ~60s · gamer legend]

Players installed a graphics upgrade for their favorite spaceship game. Then they restarted their computers... and the computers never came back. This is The Point of Failure, episode [N].

December 2007. EVE Online — the galaxy sized spaceship MMO — ships its Trinity expansion, with an optional installer for gorgeous new graphics. Deep in that installer, a cleanup routine, and a fatal coincidence — the game's own folder contains a file named boot.ini. So does Windows XP — at the root of the drive — where it is nothing less than the machine's instructions for how to start itself. The installer's path logic reaches for the game's file... and **deletes the operating system's**.

The cruelty was the delayed fuse — nothing happened immediately. Players finished installing, played all evening, spaceships gleaming. Then, whenever they next restarted — nothing. No Windows. A computer that booted fine yesterday, dead today — with the cause hours in the past and wearing a video game's name. Forums filled with detective work before the truth landed — **the patch broke Windows**.

CCP owned it fast — repair instructions, support, apology — and the story ascended into gaming folklore instead of a grave. The engineering keeper is deadly serious though — installers are **the most dangerous code most companies ship** — they run with full privileges on a million machines you have never seen, and a single path bug becomes a house call. Test installers like weapons. And never, ever name your file after the operating system's.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m167',
    seq: 168,
    title: '#167 · 23 Days of Silence',
    body: `[#167 · ~90s · era defining]

Seventy seven million accounts exposed. And then the part nobody had ever seen — the company turned its own global platform off... for **twenty three days**. This is The Point of Failure, episode [N].

April 2011. The PlayStation Network is the beating heart of console gaming — purchases, multiplayer, identity — for tens of millions. On April 20th, Sony detects an intrusion and makes the call that defines this episode — everything off. Worldwide. Personal data of roughly seventy seven million accounts is exposed — names, birthdates, credentials — and Sony states it **cannot rule out payment card exposure**. The house has been robbed, and the owner locks every door to count what is missing.

The silence stretches — days, then weeks. Twenty three days — gamers staring at offline screens, an entire ecosystem — developers, tournaments, launches — frozen. And two controversies burn through the outage. First, disclosure speed — roughly a week passed between shutdown and telling users their data was taken — a gap that drew congressional letters and inquiries across multiple countries, and helped write the modern rulebook of breach notification. Second, the duration itself — was three weeks of darkness catastrophic caution... or the only honest option when you cannot yet trust your own house?

Sony's response became iconic — executives bowing deeply at the Tokyo press conference — an apology with physical weight — a Welcome Back program of free games and identity protection, and an incident bill the company put around a hundred seventy one million dollars. Widely reported contributing factors — aging, unpatched server software and thin internal segmentation — the arc you have watched all series, wearing a game controller.

The keeper is the question every platform now war games because of this month — when trust in your own infrastructure is gone, how long dare you stay dark to rebuild it? Sony's answer — twenty three days — was brutal, expensive... and honest. The platforms that never ask the question answer it live, like Sony did. The ones that ask it in advance get to **answer it on paper**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m168',
    seq: 169,
    title: '#168 · Error 37',
    body: `[#168 · ~60s · comedy of demand]

Millions bought a game, sat down alone in their own homes to play it — and a login server hundreds of miles away said no. This is The Point of Failure, episode [N].

May 15th, 2012. Diablo III — twelve years awaited, one of the most pre ordered PC games in history — launches at midnight. And it carries a fateful design — always online. Even playing solo — just you, your demons, your basement — requires a live connection to Blizzard's servers, partly to fight piracy, partly for an in game auction house. Single player has been given multiplayer's dependencies. Remember this show's oldest law — **every dependency is a share of your fate**.

Midnight arrives, and with it the most predictable traffic spike in entertainment — literally **pre counted** — every pre order a raised hand saying I will be there at 12:01. The login servers buckle anyway. Millions meet three digits that become legend — Error 37 — the login server is busy — try again. People who wanted to play alone. Refused. By infrastructure. For days, on and off, launch week runs on refresh and rage — and the meme is immortal before sunrise.

Blizzard apologized, scaled, stabilized — and eventually removed the auction house — while Error 37 outlived it all as gaming's shorthand for shooting your own launch. The keeper generalizes far beyond games — every mandatory dependency you add — a license check, a login, an always on service — donates your product's availability to that service's worst night. Sometimes the tradeoff is worth it. But make it on purpose — because your users will grade the whole product... by **the weakest thing it refuses to work without**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m169',
    seq: 170,
    title: '#169 · The City That Needed a Server',
    body: `[#169 · ~60s · corporate hubris comedy]

The publisher said your single player city literally could not exist without their servers. A modder disproved it... **in minutes**. This is The Point of Failure, episode [N].

March 2013. The beloved SimCity returns — rebuilt, gorgeous, and always online — even your solo city requires a live server connection. Players ask the obvious — why? The answer, from the top — necessity — significant simulation calculations, they said, run in the cloud — your city cannot exist without it. Launch arrives. The servers melt. For weeks — queues to enter your own city, features switched off to shed load, cities unreachable — a single player game, down.

Then the second failure — the one that outlived the first. The internet tested the claim. Reporting picked at it — and a modder made a trivial change that let the game run offline, happily, for extended stretches — the simulation was local — it had been all along. Insiders conceded it — and about a year later, EA shipped... an official offline mode. The outage cost weeks. The claim cost **the benefit of every future doubt**.

Two keepers, both evergreen. Engineering claims made in public are testable artifacts — your users have debuggers, and audiences **forgive breakage far faster than they forgive spin**. And degraded modes — offline, cached, reduced — are features — designed, tested, shipped — not disclaimers. SimCity's servers recovered in weeks. The sentence your city cannot exist without us never did.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m170',
    seq: 171,
    title: '#170 · 50 Times the Worst Case',
    body: `[#170 · ~75s · joyful catastrophe]

The launch traffic was not double the worst case. Not triple. Ten times the worst case — **fifty times the plan**. This is The Point of Failure, episode [N].

July 2016. Pokemon Go releases, and something without precedent happens — the world goes outside. Parks fill at midnight. Strangers stampede city squares because someone shouted a rare creature's name. People who had never gamed in their lives — grandparents, toddlers' parents, entire office floors — install it in days. And every one of them is a live connection to servers planned for a hit game... not a planetary behavior change.

Per the engineering account Niantic and Google Cloud later published together — traffic hit roughly fifty times the original projections — and ten times the prepared worst case. Sit with that arithmetic — the team had done the responsible thing — modeled a wild success, provisioned beyond it — and reality lapped their imagination tenfold. Servers buckled daily. And then Niantic did the thing this episode honors — it paused. Country rollouts — including giant, aching to play Japan — delayed. The phenomenon, **throttled to save the phenomenon**.

Behind the gates, one of cloud computing's famous rescues — Niantic and Google engineers re architecting the hottest paths on a live, planet sized fire — a collaboration so instructive both companies published it as a case study. Weeks later — stable, global, and still walking us into lampposts years on.

The keeper — your worst case estimate is a hypothesis about a world that can change overnight — culture does not read capacity plans. So **build the honest throttle** — staged rollouts, gates you can close without shame — because the teams that can pause a rocket mid flight are the ones whose rockets survive. Fifty X only kills you... if you promised everyone everywhere at once.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m172',
    seq: 172,
    title: '#172 · The Eras Tour Presale',
    body: `[#172 · ~90s · cultural event forensic]

Three and a half million verified fans. Billions of requests. A canceled public sale. And a ticketing website's worst morning ended up in front of the United States Senate. This is The Point of Failure, episode [N].

November 15th, 2022. The Eras Tour presale — the biggest event in Ticketmaster's Verified Fan history — three and a half million registered fans, each vetted, each holding a code, each ready at 10 a.m. Read that setup the way this show does — **the demand was pre counted**. Registration WAS the forecast — delivered days in advance, to the request.

Ten a.m. arrives, and with the fans, per the company's account, comes a bot army — scalpers' automation storming the gates alongside the humans — driving total demand to roughly **three and a half billion system requests** — four times the platform's previous peak. Queues freeze. Carts vanish at checkout. Error loops eat afternoons. Fans wait eight hours holding codes that were supposed to be the orderly line. Days later, the company cancels the general public sale entirely — the remaining tickets, and the remaining confidence, both insufficient.

Then the escalation that makes this episode the arc's finale. Taylor Swift herself called watching it excruciating — one word, on the record, heard everywhere. And in January, the United States Senate held hearings — an outage as an exhibit in a debate about market power — because when one company is the doorway to live music, its worst morning is not a technical story. It is a civic one. Attorneys general opened inquiries. The postmortem had **subpoena power**.

Three keepers from the hardest ticket in history. Pre counted demand is a gift — capacity plan to the registration list, then double it for the uninvited. Bot defense is load bearing architecture, not a checkbox — the gatecrashers scale faster than the guests. And the bigger your moat, the smaller your margin for a bad morning — because concentration means your outages inherit your critics. Reliability, **at monopoly scale, is politics**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m173',
    seq: 173,
    title: '#173 · Therac-25',
    body: `[SERIOUS — measured, low energy, no smile]

This is the oldest story in this series, and the reason the discipline this show celebrates exists at all. It must be told exactly right. This is The Point of Failure, episode [N].

The 1980s. Radiation therapy — precisely aimed, precisely dosed beams — is saving cancer patients daily. A new machine, the Therac-25, arrives as the state of the art — computer controlled, efficient, modern. Its predecessors had hardware interlocks — physical mechanisms that made unsafe states mechanically impossible, no matter what the software did. On the Therac-25, the software had earned so much trust... that several of those physical safeguards were removed. Safety became the code's job alone. Hold that decision. Everything that follows flows from it.

Inside that code, invisible, lived a race condition — a timing flaw. If a skilled operator — fast, practiced, editing treatment parameters quickly at the console — made changes within a narrow window, the machine could fire its high power beam without the beam modifying safeguards in position. Dozens of times the intended dose. The flaw had existed in reused software from the earlier machines for years — where the hardware interlocks had been **silently catching it**. The net had been removed from under a flaw nobody knew was falling.

Between 1985 and 1987, at least six patients in the US and Canada received massive overdoses. At least three died of their injuries. And the failures compounded the way this series has seen ever since — the machine reported cryptic codes — MALFUNCTION 54 — that no manual explained. The manufacturer, assured of its software, initially insisted overdose was impossible. Each hospital was treated as an isolated case — each, for a time, told in effect that they were the only one. If you have watched this series, that sentence just went through you.

The truth was established by investigators — Nancy Leveson's study of these accidents founded software safety as a field — and its findings are now scripture. Never remove a hardware safeguard on software's promise — defense in depth exists because code fails. Race conditions live where testing never hurries — **test at the speed of your fastest operator**, not your test plan. Believe the operator who says the machine did something impossible. And aggregate incidents — because patterns hide in isolation, and isolation is what institutions instinctively provide.

Every safety critical line of code written since — in planes, in pumps, in pacemakers — is written under rules that trace to these patients. They did not volunteer to found a discipline. This episode exists so that what was learned at their expense is never unlearned. That is the entire promise of this show, at its source.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin.`,
  },
  {
    id: 'pof-m174',
    seq: 174,
    title: '#174 · The Week the Pharmacies Went Quiet',
    body: `[SERIOUS — measured, low energy, no smile]

One company you had never heard of stopped — and pharmacies across America suddenly could not tell if your insurance existed. This is The Point of Failure, episode [N].

February 21st, 2024. Change Healthcare is the kind of company this series exists to make visible — a clearinghouse — the plumbing between pharmacies, doctors, insurers — processing billions of transactions a year, touching, by common description, around one in three American patient records. That morning, ransomware — the ALPHV group — detonates inside it. And per later Senate testimony, the door was a remote access portal protected by a password... and **not by multi factor authentication**. The cheapest control in security. Absent, at the biggest single point in American healthcare.

The stoppage was immediate and intimate — pharmacists nationwide staring at systems that could not confirm coverage — patients at counters choosing between paying cash for insulin or waiting — military pharmacies overseas among the queues. And behind the counters, a slower emergency — provider payments froze. Clinics, therapists, small practices — revenue simply stopped arriving — weeks of it — pushing some toward insolvency until UnitedHealth advanced roughly nine billion dollars to keep the ecosystem breathing.

The company paid — about twenty two million dollars in ransom, its CEO confirmed to the Senate. And then the sequence this arc makes permanent — a second group extorted over the same stolen data anyway — because payment buys a decryption key, **not amnesia** — the data was already gone. The final accounting, a year later — around one hundred ninety million people affected — the largest healthcare breach in American history.

Three findings, all old friends of this series, all wearing scrubs now — invisible rails concentrate whole industries — map yours, and rehearse their absence. The cheap controls — multi factor on every remote door — are cheap precisely relative to nine billion dollars. And extortion economics mean **prevention is the only round you can actually win**. Healthcare learned it in one February. The bill is still being counted.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m175',
    seq: 175,
    title: '#175 · The Blood Ran Short',
    body: `[SERIOUS — measured, low energy, no smile]

A ransomware attack on a laboratory ended with a national appeal for blood donors — and, a hospital later confirmed, contributed to the death of a patient. This is The Point of Failure, episode [N].

June 3rd, 2024. Synnovis runs pathology — blood tests, diagnostics, transfusion matching — for some of London's biggest hospitals, King's College and Guy's and St Thomas' among them. Pathology is medicine's silent gatekeeper — nearly every serious decision — operate or wait, transfuse or hold, which drug, what dose — waits on the lab. That morning, ransomware — attributed in reporting to a group called Qilin — takes the lab's systems down.

The hospitals did not stop — they slowed, painfully, to the speed of paper and manual process. Blood matching — normally rapid, automated — collapsed to manual rates — so clinicians fell back on the universal donor, O negative — spending the scarcest blood in the national supply to stay safe. Within days, the national blood service issued a public appeal — give blood — because of a cyberattack. Over the following months — on the order of ten thousand acute appointments and more than seventeen hundred operations, postponed. Medicine, **rescheduled by malware** — the WannaCry sentence, seven years on, still true.

And then the finding this arc has always warned toward. In 2025, King's College Hospital confirmed that one patient had died — with the cyberattack found, in the trust's review, to be a contributing factor. This show states that exactly as the hospital did — once — and adds nothing. It does not need to.

[beat]

The lesson must be worthy of the weight — diagnostic infrastructure IS life critical infrastructure — fund it, segment it, drill its downtime like an operating theater drills a power cut. Degraded modes in lab medicine have brutal ceilings — know yours in numbers — how many matches per hour, by hand, at 3 a.m. Because healthcare downtime was never really measured in hours. It is **measured in outcomes**. Now that sentence has a citation.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m176',
    seq: 176,
    title: '#176 · 140 Hospitals on Paper',
    body: `[SERIOUS — measured, low energy, no smile]

For over a month, one of America's biggest hospital chains ran on paper — and the safety net caught in software for twenty years... rode on clipboards instead. This is The Point of Failure, episode [N].

May 2024. Ascension — around a hundred forty hospitals — is hit by ransomware, attributed in reporting to the Black Basta group. The electronic health record goes down chain wide — and with it, the invisible things stitched into it — the allergy flag that fires before a wrong order, the dose checker, the drug interaction alarm, the legible, instantly shared chart. Ambulances divert from some facilities. And a hundred forty hospitals step back twenty years in one morning.

What held was people. Nurses and doctors on downtime procedures — paper charts, handwritten orders, runners carrying results, faxes resurrected — for five to six weeks. And frontline accounts in the press said the quiet part — without the electronic checks, the risk of medication errors rises — every safeguard the software used to run silently now had to live in a tired human's attention, shift after shift. The system did not hold because the plan was good. **It held because the staff spent themselves holding it**.

The lessons are drills, plural — downtime procedures must be **rehearsed like cardiac codes** — at length, at night, at scale — because a hundred forty hospitals discovering the paper workflow together is not a plan. Inventory your invisible safety net — every check your software runs silently is a check someone must run aloud on the worst day. And concentration now lives inside institutions too — one platform, one hundred forty hospitals, one bad morning. The clinicians were magnificent. The point of this show is that they should never have had to be.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m177',
    seq: 177,
    title: '#177 · The Library That Chose Not to Pay',
    body: `[#177 · ~75s · quietly hopeful]

Hackers encrypted one of the great libraries of the world and demanded payment. The library **said no** — took the years long cost — and then published everything it learned. This is The Point of Failure, episode [N].

October 2023. The British Library — a hundred seventy years of accumulated human record, from manuscripts to sound archives — is hit by ransomware from the Rhysida group. Systems encrypted, internal data stolen, a ransom demanded — reported around twenty bitcoin. And the library, aligned with public sector policy and its own principles, refuses. The attackers leak the data. And the long cost begins.

Understand what down means for a library — the catalogue — the index without which twenty five million books are just shelves — offline for months. Ordering systems, digital collections, researcher services — gone dark. Scholars worldwide, mid dissertation, mid discovery, waiting. A basic searchable catalogue limped back in early 2024 — full recovery stretched years, rebuilt from reserves at a cost in the millions of pounds. Slow damage, to slow treasures.

Then the act this episode exists to honor — in March 2024, the library published its own exhaustive incident review. Not a press release — an autopsy — naming its legacy infrastructure, a critical access path without multi factor authentication, the full timeline, the lessons — **the victim, teaching**. It joined a small honor roll this series keeps — GitLab's livestream, KDDI's diagrams — institutions that treated their own disaster as a public good. Libraries exist to make knowledge public. This one, at its lowest moment, indexed even its own wound.

The keepers — refusal has a price — budget for it before the demand arrives, because the decision is a hundred times harder in the dark. Legacy estates are civilizational risk — the oldest institutions run the oldest systems guarding the oldest treasures. And **transparency compounds** — every organization that publishes its autopsy makes the next attack somewhere else a little less likely. That is this entire series' operating theory — stated by a library, in its worst year.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m178',
    seq: 178,
    title: '#178 · The Day the Ocean Cut the Internet',
    body: `[#178 · ~90s · continental scale]

One morning, in one stretch of ocean, four cables failed — and a dozen countries' internet dimmed at once. I felt this one personally. This is The Point of Failure, episode [N].

March 14th, 2024. Off the coast of Côte d'Ivoire, the seafloor drops into a submarine canyon — the locals' name for it translates to the bottomless hole — and through that neighborhood run four of the great cables tying West Africa to the global internet. That morning — widely reported as a suspected undersea landslide — all four are damaged in the same area. WACS. MainOne. SAT-3. ACE. Not an attack. **Geology**.

Across Côte d'Ivoire, Ghana, Nigeria, Liberia, Benin and beyond — connectivity collapses to fractions of normal. And I want to tell you what that looks like from inside, because I build a company in Accra — it looks like the whole city performing this show's lessons by hand. Offices switching between two providers hunting the surviving route. Phones with three SIM cards, swapped like radio dials. Banking apps timing out — mobile money — which is not an app there, it is commerce itself — limping. Business does not stop. It downshifts, expensively, for weeks — because cable repair ships are few, specialized, and slow.

Here is the structural sentence — Europe's internet crosses dozens of redundant paths — much of Africa's coast rides a handful of cables — and when four share one canyon, the canyon is **a single point of failure for a continent's quarter**. It is changing — new cables are landing, terrestrial fiber is stitching borders — but 2024 was the year the concentration became undeniable — the Red Sea cuts, the East African faults, and this one morning off Abidjan.

The keeper is the one this whole final arc is built on — **the cloud is a place** — on a seafloor, in a canyon, on a handful of ships' repair schedules — and resilience is not a setting you enable — it is routes, plural, owned in advance. West Africa's businesses practice that truth personally every day. The rest of the world should learn it before their canyon finds them.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m179',
    seq: 179,
    title: '#179 · When the Cash Ran Out and the Apps Fell Over',
    body: `[#179 · ~90s · careful, human]

A nation of two hundred million people moved its money onto digital rails — not over a decade — over a few weeks. The rails were not asked first. This is The Point of Failure, episode [N].

Nigeria, late 2022. The central bank redesigns the naira — new notes, deadlines to deposit the old, and limits on cash withdrawals — policy aimed, in its own stated goals, at hoarding, counterfeiting, and accelerating digital payments. This show holds no opinion on the policy. It is here for what happened next to the infrastructure — because almost overnight, physical cash — the bloodstream of Africa's largest economy — became scarce. And tens of millions of people reached for their phones at once.

Understand the scale of what was being asked. Bank apps, USSD codes on feature phones, transfer rails, agent networks with POS machines under umbrellas — systems sized for steady growth — hit by an adoption curve compressed from years into weeks — record volumes on the national instant payment rails, week after record week. And they buckled. Transfers failing — or worse, **money debited and not delivered**, the most trust corrosive failure in payments. Apps timing out at market stalls. Queues at agents like the queues at banks. A trader who sells vegetables for cash cannot invoice patience.

The country adapted the way this arc keeps documenting — three banking apps per phone, retried transfers as folk protocol, agents as human failover, and courts and deadlines eventually easing the cash crunch through the year. And when the wave receded, something permanent remained — digital payment adoption held its new height. Nigeria had run, in production, on live commerce, **the largest unplanned migration to digital money in history** — and the rails, battered, held enough to keep it.

The engineering keeper is for every nation and every platform — **adoption is a load event** — policy, panic, or fashion can compress your decade into a month — and the only systems that survive their own success are the ones stress tested for the success they claim to want. Test the rails for the day everyone actually shows up. Somewhere, always, that day is one announcement away.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m180',
    seq: 180,
    title: '#180 · Where Money Lives on the Network',
    body: `[#180 · ~120s · thesis, personal]

In the place where I am building my company, **the phone network is the bank**. Which means everything this series has ever said about reliability... is worth more here than anywhere on earth. This is The Point of Failure — episode one hundred eighty. The last one.

Start with the invention. 2007 — Kenya — M-Pesa launches — send money by text message. No bank branch, no card, no queue — value moving over the phone network, cashed in and out through a human grid of agents on every corner. It works so well it becomes the financial system — today, Kenya's mobile money moves value equivalent to a large share of the entire economy, every year. Ghana, where I work — the same story, compounding. Across the continent — hundreds of millions of accounts, per the industry's own reporting. While the rich world debated digital wallets, Africa built one out of the phone network... and moved in.

Now hold that against everything this series has shown you. When a carrier's routers resign — that is episode one twenty eight — here, the market stalls cannot take payment. When subsea cables snap in a canyon — two episodes ago — remittances and school fees wait on a repair ship. Every outage archetype in our one hundred eighty stories — the config change, the failed failover, the untested herd, the half alive switch — lands here on the one rail everything rides. The leapfrog was real. So is its concentration — uptime, in this economy, is not an IT metric. It is **whether commerce happens today**.

Which is why I am here. I run engineering from Accra — I am building my company's team there — not as charity, and heaven knows not as rescue — the engineers I work with need no rescuing — they operate systems under constraints that would humble most Silicon Valley teams, and they practice resilience personally, daily, the way this whole series preaches it. I build reliability infrastructure for a living — that is Zof, and that is the only sentence of that you will ever get from this show — and I chose to build part of it in the place where reliability is worth the most. Where every nine of uptime is someone's school fees arriving. Where testing is not a cost center. It is **development economics, written in code**.

One hundred eighty stories. Banks and rockets, hospitals and post offices, eleven lines of code and four cables in a canyon. Every one of them ended the same way, and it was never a slogan — it was the finding. So, one last time — with everything underneath it now — every failure has a story. Every story was preventable. I'm Kevin. And this... was The Point of Failure.`,
  },
]

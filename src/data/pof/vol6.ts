import type { PofEpisode } from './types'

// Volume 6 — masters 76–98 (document order). Spoken text only.
export const vol6: PofEpisode[] = [
  {
    id: 'pof-m076',
    seq: 100,
    title: '#76 · The Map That Melted Bridges',
    body: `[#76 · ~90s · corporate drama]

Apple shipped a product so unready that its CEO publicly recommended the competition, and police on another continent warned it could strand you in a desert. This is The Point of Failure, episode [N].

September 2012. Apple is at the height of its powers, and it wants independence from Google. So iOS 6 replaces Google Maps with Apple's own Maps — overnight, on hundreds of millions of iPhones, as the default. No beta coexistence. No gradual ramp. The biggest maps launch in history, **in a single step**.

The internet needs about an hour. Bridges droop like candle wax in the 3D view. Landmarks sit in the wrong cities. A museum in a river. Whole towns misplaced. The screenshots are so instantly iconic they get their own blogs. Funny... until December, when police in Mildura, Australia issue an actual public safety warning — Maps has been directing drivers bound for the town into a remote national park, **seventy kilometers away**, where motorists have been stranded in dangerous heat.

Nine days after launch, Tim Cook does something almost without precedent — a public apology letter that names competitors — while we improve Maps, try Google's or Nokia's. Read that again. Apple, telling customers to use Google. Weeks later, executive Scott Forstall departs — widely reported as connected, including reports he declined to sign that apology.

Here is the fairness and the lesson braided together — the underlying strategy was right, and years of work later, Apple Maps became genuinely excellent. What failed was the launch equation — readiness was defined by the calendar, by the strategic deadline, not by the product's actual state. Data quality at planetary scale cannot be willed into existence by a keynote date. Ship dates are promises to the market. Quality is a promise to the user. That September, those promises pointed in opposite directions... and **the calendar won**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m077',
    seq: 101,
    title: "#77 · 'It Should Have Been Our iPod Moment'",
    body: `[#77 · ~75s · inside the room]

Three products launched on the same day. One of them broke. And the meeting that followed became Silicon Valley legend. This is The Point of Failure, episode [N].

July 2008. Apple launches the iPhone 3G, the App Store, and MobileMe — email, contacts, calendars, synced across your devices — all on the same day. Three enormous products, one date, one shared wave of traffic. The phone soars. The App Store makes history. MobileMe... buckles. Days of outages. Sync failures. A slice of users locked out of email for an extended stretch, some messages gone for good.

What happened next, we know from reporting, most famously Fortune's account, because the meeting was private — Steve Jobs gathers the MobileMe team in an auditorium and asks one question — what is MobileMe supposed to do? Someone answers, correctly. And Jobs, as reported, replies — then why doesn't it do that? He tells them, in words that have echoed through every product org since — you have **tarnished Apple's reputation**. This should have been an iPod moment. And he replaces the executive in charge before the room empties.

Two lessons live in that room, and honest engineering takes both. The famous one — quality at launch is the product — users meet your reliability before they meet your features. The quieter one, often skipped in the retelling — someone above that team chose to stack three historic launches onto one day and one infrastructure. Accountability rolled downhill fast. The load decision had been made **uphill**. Both things were true.

MobileMe's scars built iCloud's caution. And the sentence survives as the sharpest launch review ever reported — what is it supposed to do... **then why doesn't it do that**. Tape it over every ship button you own.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m079',
    seq: 102,
    title: '#79 · goto fail',
    body: `[#79 · ~60s · minimalist thriller]

Two words, accidentally pasted twice, turned off part of the internet's security on millions of devices. And anyone could read the mistake. This is The Point of Failure, episode [N].

February 2014. Apple ships an urgent fix for iPhones, then Macs, for a flaw in the code that answers a sacred question — when your device connects somewhere secure, is it really them? That verification runs in a chain of checks, written, like much code of its era, as a ladder of steps, each ending — if this failed, goto fail — jump to the error exit.

Somewhere in that ladder, one line existed twice. **goto fail. goto fail.** The first copy belongs to its check. The second belongs to nothing — no condition guards it — so it always fires, vaulting execution past the checks below it. Including a signature verification. Meaning, in certain connections, the question is this really them was answered yes... **without being asked**. For months. On a network you do not control, say a coffee shop, that gap is an open impersonation invitation.

The code was open source, so the world saw the exact line, and it became legend — the strongest two word argument ever made for boring engineering hygiene. A test that exercises the failure path catches it. A compiler warning about unreachable code catches it. Mandatory braces catch it. A second reviewer catches it. **Four cheap fences.** The bug walked through the gap where all four were open.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m080',
    seq: 103,
    title: '#80 · The Commented Line That Weakened the World',
    body: `[#80 · ~75s · slow dread]

To silence a warning, two lines of code were removed. For the next two years, a huge share of the internet's locks came from a keyring with **thirty two thousand** keys on it. This is The Point of Failure, episode [N].

2006. A volunteer maintainer for Debian, one of the great Linux distributions, is doing diligent work — running an analysis tool over OpenSSL, the library that generates the internet's encryption keys. The tool raises warnings about certain lines. Investigating, consulting, following process, he comments those lines out. The warnings stop. Everything keeps working. Everything looks exactly the same.

But those lines were feeding entropy — true randomness — into key generation. Randomness is the whole magic of cryptography — a key is safe because it was drawn from more possibilities than atoms have patience for. With the lines gone, the pool of randomness collapsed to little more than a process number — about thirty two thousand possible values. Every key still looked perfect. Long, scrambled, official. And drawn from a bucket a laptop can enumerate **before lunch**.

Two years. SSH keys, website certificates, credentials across Debian and Ubuntu systems worldwide — all generated from that little bucket — and some key types were compromised just by being used. Discovery in 2008 triggered one of the great global cleanups — blocklists, regeneration, reissuance, everywhere. The maintainer had acted in good faith, through process. The process just had no fence around the one file where a silenced warning can quietly disarm the world.

Two lessons, both stickers — silencing a warning is a code change — review it like one, hardest of all in cryptographic code. And randomness fails invisibly — everything else broken looks broken — **broken randomness looks perfect**. The most dangerous bugs are the ones that improve the silence.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m081',
    seq: 104,
    title: '#81 · The App That Broke Caucus Night',
    body: `[#81 · ~90s · civic thriller]

The first vote of a presidential race, and the app collecting the results was **two months old**, distributed like a beta test, and broke on the night. This is The Point of Failure, episode [N].

February 3rd, 2020. Iowa. By tradition, the opening night of the American presidential primary, with the world's press watching one number — who won. This cycle, precinct results will flow through a new smartphone app, built by a small firm in roughly two months, for a reported budget **around sixty thousand dollars**. For scale — that is less than many companies spend testing a checkout button.

The users are the variable nobody modeled — hundreds of volunteer precinct chairs, many elderly, many rural, asked to install an app that was never in the app stores — it came through beta distribution platforms, with extra steps at every turn. On the night, many cannot install it. Many cannot log in. Those who succeed hit the next layer — a reported coding issue that transmits **only part of the results data** even when everything works.

So everyone falls back to the phones, the way it worked for decades. But the hotline is staffed for a trickle and receives a flood — made deliberately worse when trolls online publish the number and jam it for sport. Precinct chairs sit on hold past midnight, results on paper in their laps. Days pass before full numbers land. Candidates claim momentum into the vacuum. The process survives — every vote existed on paper — but the credibility bruise headlines the planet.

The engineering postmortem writes itself and applies to every launch you will ever run — your users are part of the system — test with the real ones. One night events cannot be patched — they need rehearsal at full statewide load, weeks early. And the fallback needs the same capacity math as the primary, because on the worst night, **the fallback IS the system**. Democracy did not fail in Iowa. Load testing did.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m083',
    seq: 105,
    title: '#83 · Census Night',
    body: `[#83 · ~75s · national embarrassment]

A country scheduled its entire population to visit one website on the same evening. The website did not survive the evening. This is The Point of Failure, episode [N].

August 9th, 2016. Australia's census goes digital — millions of households officially instructed to log on that Tuesday night and be counted. Read that design back — a mandatory, nationally advertised, single evening traffic spike, **announced years in advance**. The most foreseeable load event in the country's history. Which is what makes what happened next an engineering parable rather than bad luck.

The evening brings a series of DDoS attacks — modest ones, by industry standards, the kind big sites shrug off daily. The defense plan, nicknamed Island Australia, was to block foreign traffic. Part of it was misconfigured, so junk got through. Then, in the scramble, a router fell over. Then the monitoring showed a spike that, in the fog, looked like data leaving the building.

And here is the twist worth respecting — facing what might have been a breach of the nation's data, officials pulled the plug themselves. The final blow to census night was a defensive choice on ambiguous telemetry — and the reviews later confirmed the spike was a false read — no data lost, no data stolen, not a hack. Forty hours of national embarrassment, a Senate inquiry, the Prime Minister assigning blame on live radio — for an outage whose last act was **caution**.

The inquiry's verdict travels far beyond Canberra — this was not a sophisticated attack — it was failure to rehearse for **entirely foreseeable events**. Small attacks — foreseeable. The load — literally scheduled. The lesson pairs with Slack's first Monday and the Iowa app — when the spike is on the calendar, the rehearsal should be too — at full scale, against the ugly scenarios, with the plug pulling decision practiced in daylight instead of improvised at midnight.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m084',
    seq: 106,
    title: '#84 · The Meltdown After the Storm',
    body: `[#84 · ~90s · epic systems failure]

The storm ended. Every other airline recovered. One kept canceling flights for a week, because its software could no longer **find its own crews**. This is The Point of Failure, episode [N].

Christmas week, 2022. Winter storm Elliott hammers the entire country, and every airline bleeds cancellations. That is weather — expected, insured, survivable. But as skies clear, something splits the industry in two — rivals climb back to normal in a day or two. Southwest keeps collapsing — thousands of cancellations daily, in fine weather, for a week. Two million travelers stranded over the holidays. The storm was national. The meltdown was one airline's.

The failure lived in the puzzle nobody sees — crew scheduling. An airline is a moving jigsaw — every flight needs a legal, rested, correctly located crew, and every disruption scatters the pieces. Southwest's scheduling system, and the processes around it, could not re solve the puzzle at this scale — worse, it lost track of where reassigned crews even were. So flight crews, ready to work, sat on hold for hours, phoning in their own locations, while schedulers rebuilt the map partly by hand. Planes at gates. Crews in hotels. The software between them, blind.

Two amplifiers made it historic. Southwest's celebrated point to point network — planes hopping city to city rather than returning to hubs — scatters crews everywhere when things break — recovery is combinatorially crueler by design. And the strain was not a surprise — unions had publicly warned about the scheduling technology before that winter. The bill — **over a billion dollars**, a record 140 million dollar federal penalty, and a Christmas the brand will wear for a decade. To their credit — massive winter and scheduling investments followed.

The keeper generalizes to every business — your operation is only as recoverable as the software that reassembles it, and that software's real test is not the average Tuesday — it is the worst week, at full scale, when every piece has moved at once. Disruption is certain. **Recovery is a system** you either build... or improvise on hold.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m085',
    seq: 107,
    title: "#85 · The Backup Power That Wasn't Wired In",
    body: `[#85 · ~75s · procedural, sharp]

The backup power worked perfectly. Three hundred servers just **weren't plugged into it**. This is The Point of Failure, episode [N].

August 8th, 2016, 2:30 in the morning, Atlanta. In Delta's data center, a power control module fails — with fire — and core systems lose power. For this exact moment, the facility has backup power, tested and ready. The switchover happens. And then the discovery that makes this episode — widely reported at around **three hundred of seven thousand servers**... were not actually wired to the backup. The safety net existed. Those machines were standing next to it.

Three hundred sounds survivable out of seven thousand — until you meet interdependency. The dark machines held pieces of check in, boarding, dispatch — and modern systems are choirs — silence a few voices and whole songs collapse. Even as power returned, systems that needed the dark ones stayed down, and early on, Delta struggled to see which was which. At airports worldwide, agents wrote boarding passes by hand while the sun rose on a stopped airline.

Three days. About 2,300 canceled flights. Around a hundred million dollars plus, by the company's own accounting, and a CEO apology on video. And the root cause was not the module or the fire — hardware fails, that is why backups exist. The root cause was **drift** — the gap between the diagram that said everything is on backup power... and the building where three hundred plugs said otherwise. Nobody had recently walked the wire.

Your infrastructure documentation is a claim about reality, and reality drifts — every migration, every rack change, every hurried Friday. The Tokyo exchange taught this arc that an untested failover is a photograph of a safety net. Delta adds the corollary — an unaudited wiring diagram is a photograph of a building that no longer exists.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m086',
    seq: 108,
    title: '#86 · Grounded by a Router',
    body: `[#86 · ~60s · compact, structural]

One router, out of thousands, got sick — **not dead, sick** — and an entire global airline stopped flying. This is The Point of Failure, episode [N].

July 8th, 2015 — yes, the same surreal Wednesday as the stock exchange halt, that coincidence has its own episode. This is the mechanism story. At United, one network router degrades. Not fails — degrades. It keeps passing some traffic, dropping other traffic, half alive. And airlines do not run on paper anymore — dispatch, reservations, weight and balance — rivers of data that must flow before wheels may roll.

A dead router is easy — failover triggers, traffic reroutes, nobody notices. But **half alive** is the monster this show keeps finding — sick enough to choke the data, healthy enough that automatic failover never fires. Remember Visa's switch, declining a continent? Same species. The safest move for United was the drastic one — ground stop, worldwide, roughly two hours — then a full day digesting hundreds of delays.

The lesson is a design question worth asking of every critical component you own — your systems know what to do when this dies — but what do they do **when it lies**? Health checks that only ask are you there get answered yes by the half dead. Ask instead — are you doing your job, at full quality, right now? Sick components answer that one honestly.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m087',
    seq: 109,
    title: '#87 · Bank Holiday, No Airline',
    body: `[#87 · ~75s · cascade anatomy]

The outage didn't destroy the airline's systems. **Turning the power back on** did. This is The Point of Failure, episode [N].

Saturday of a bank holiday weekend, May 2017. Near Heathrow, power to a British Airways data center is disconnected — widely reported as a contractor disconnecting the uninterruptible power supply. Bad, but survivable — outages are what backup plans are for. The catastrophe came next — the reconnection, done in an uncontrolled way. Electricity returned as a surge. And a surge does what an outage never can — it **physically damages the machines**.

What died was everything at once — check in, baggage, operations, even staff communications — one facility's failure domain wrapped around a global airline's weekend. Seventy five thousand travelers, holiday luggage stacked like sculpture, handwritten everything, days of recovery, a bill reported around eighty million pounds. The public argument that followed — critics blamed IT outsourcing, BA's leadership rejected that link — went for weeks. The physics never argued back — power restoration is a skilled, dangerous operation, and it had not been treated as one.

Two morals for every infrastructure owner. First — the moment after the outage is the most dangerous moment of the outage — re energizing systems is surgery — sequence, control, and people who have rehearsed it. Second, the question BA's weekend asks every architecture diagram — when this one building has its worst day... what, exactly, takes over? If the honest answer is nothing, **the diagram is a wish**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m088',
    seq: 110,
    title: '#88 · The File That Grounded America',
    body: `[#88 · ~75s · institutional thriller]

For the first time since September 11th, every departure in America stopped. The cause was one corrupted file... and its perfectly synchronized, **perfectly corrupted backup**. This is The Point of Failure, episode [N].

January 11th, 2023, before dawn. The FAA's NOTAM system fails. NOTAMs are the flight world's mandatory morning briefing — closed runways, broken navigation aids, hazards along your route — pilots must have them before takeoff. No cyberattack, the FAA said clearly and early. Just this — overnight, personnel synchronizing the primary and backup databases unintentionally corrupted files — and the synchronization did its job **faithfully**. It copied the corruption to the backup.

Understand what failed and what did not. The planes were perfect. The pilots were ready. The weather was fine. What failed was an **information layer** — and aviation, wisely, treats missing safety information as a reason not to fly. So at 7:30 that morning — nationwide ground stop. Ninety minutes of a silent American sky, then a day digesting thirteen hundred cancellations and eleven thousand delays.

The lesson has a name in engineering and deserves one everywhere — **replication is not backup**. A live synced copy protects you from hardware dying — it cannot protect you from bad data, because its whole purpose is to copy what you have — including your mistakes, at machine speed. Real backups are older, offline, and out of reach of tonight's error. The FAA's fixes said exactly this — sync procedure guardrails, and restore points the corruption cannot chase.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m089',
    seq: 111,
    title: '#89 · Two Waypoints With the Same Name',
    body: `[#89 · ~90s · forensic elegance]

Two dots on the map of Earth, an ocean apart, happened to share a name. One flight plan mentioned both. A nation's airspace processing stopped. This is The Point of Failure, episode [N].

August bank holiday Monday, 2023 — one of Britain's heaviest travel days. Deep in UK air traffic control runs a system that ingests flight plans — the routes airlines file — and translates them for controllers. That morning it receives a perfectly legal plan — Los Angeles to Paris, crossing UK airspace. And along that route sit two waypoints which, per international naming that reuses short codes around the globe, share an identifier — **DVL**. Devil's Lake, North Dakota. And Deauville, France.

The software works the plan, meets the duplicate in a configuration its logic cannot untangle — and does something this show must praise before it mourns — it stops. Failsafe shutdown, by design, on the aviation principle that no data is safer than wrong data in front of a controller. Then the backup system — running identical software — receives the identical plan... and makes the identical choice. Two guards, same training, same blind spot. If you heard my Ariane 5 episode — redundancy without diversity is **an echo, not a safety net**.

With automation dark, humans processed flight plans by hand — safely, heroically, and at a fraction of the volume. On a day built to capacity, arithmetic becomes cancellation — about fifteen hundred flights that Monday, disruption for days, around **a hundred million pounds** across the industry, and half of Europe sleeping on airport floors. All of it traced, by the official review, to one rare shape of data — and to how long it took to reach the one engineer with access to untangle it.

The closing lesson is the one edge cases always teach — the failure was legal input, rare shape. Every identifier system with reuse — names, codes, abbreviations — will eventually serve you the collision, on the busiest day, **inside valid data**. Fuzz your parsers with the world as it is, not as your test files describe it. The sky stayed safe that Monday because the system knew how to stop. The holiday died because nothing had taught it how to cope.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m090',
    seq: 112,
    title: '#90 · Opening Day at Terminal 5',
    body: `[#90 · ~75s · grand opening disaster]

Twenty years of planning. Four billion pounds. A royal opening. And day one collapsed partly because the staff couldn't find the car park. This is The Point of Failure, episode [N].

March 27th, 2008. Heathrow Terminal 5 — Britain's showcase, decades in the making, opened by the Queen herself days before. The baggage system alone is an underground marvel, and it has been tested — extensively, successfully, **in isolation**. Hold that phrase. In isolation.

Day one, before dawn — staff arrive and cannot find their designated parking — signage and arrangements confuse hundreds. Late staff hit security screening queues. Delayed past shift start, they miss system logins. Baggage handlers, insufficiently drilled on the new machine, hesitate at unfamiliar screens. And the marvelous baggage system, starved of inputs here and jammed with them there by all this human turbulence... chokes. Bags accumulate. Then avalanche.

By afternoon BA stops accepting checked luggage at its brand new flagship. Across the following days — forty two thousand displaced bags — a literal mountain, sorted partly in tents — and over five hundred canceled flights. Cost — sixteen million pounds directly, and a global news cycle of a masterpiece failing. The inquiry's finding deserves its fame — the machine was fine. **The rehearsal was missing** — not of the system, but of the day — people, parking, logins, processes, and machine, together, at full scale, once, before it counted.

Every launch you will ever run has a Terminal 5 lesson in it — your system's real boundaries include the humans, their training, their morning commute. Test the machine and you certify a component. **Rehearse the day** — full dress, full scale, everyone in costume — and you certify the launch.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m091',
    seq: 113,
    title: '#91 · The Baggage System That Delayed an Airport',
    body: `[#91 · ~90s · ambition autopsy]

A whole airport, finished and gleaming, sat closed for sixteen months, at **a million dollars a day**, waiting for its baggage system to stop eating the luggage. This is The Point of Failure, episode [N].

Early 1990s. Denver is building America's newest mega airport, and it commits to a moonshot — the most ambitious baggage system ever attempted. Thousands of independent robotic carts on tens of miles of track, reading tags, switching junctions, delivering every bag in the airport automatically. No airport on earth had done it at a fraction of this scale. Denver would do all of it, at once, coupled to an immovable opening date.

Reality arrives as physics. Coordinating thousands of carts in real time — timing windows, junction handoffs, empty cart distribution — turns out to be a complexity cliff, and requirements kept shifting under it as airlines changed their needs. In 1994, under pressure to prove progress, the airport invites the press to a demonstration. The cameras roll on carts jamming, bags misrouted, luggage crushed and flung — **chewed suitcases** on the evening news. The airport, otherwise complete, cannot open. It waits. Sixteen months. A million dollars a day, widely cited, in carrying costs.

The ending is quiet — DIA opens in 1995 with the dream scoped down to one airline's outbound bags, conventional handling everywhere else — and in 2005 the automated system is switched off forever, its maintenance costing more than it saved. Software courses still teach this autopsy, and its findings are evergreen — unprecedented scope, immovable date, complexity underestimated, requirements shifting, and — the fatal one — no fallback designed until desperation. They bet the airport on the moonshot landing on schedule.

Moonshots are how the future arrives — this show loves them. But the Denver rule stands at their gate — the more unprecedented the system, the more precedented your fallback must be. Dream on the main line. Engineer **the escape route**. And never, ever let the calendar hold the airport hostage to the dream.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m092',
    seq: 114,
    title: "#92 · The Company You'd Never Heard of Until Check In Died",
    body: `[#92 · ~60s · hidden dependency reveal]

One morning, check in desks slowed and stalled on every continent at once — at airlines that compete with each other everywhere except one place — their software. This is The Point of Failure, episode [N].

September 2017. Passengers in Sydney, Frankfurt, Singapore, Washington hit the same wall in the same hour — check in systems crawling or down, agents reaching for the manual folder. Different airlines. Different alliances. Different continents. Synchronized failure. And synchronization, on this show, always means one thing — somewhere below the brands, there is a **shared layer**.

The layer is called Amadeus — specifically its Altea platform — the reservations, inventory and departure control engine behind well over a hundred airlines. You have probably never heard of it, and it touches more journeys than any airline alive. That morning, per Amadeus, a network issue degraded the platform — for a few hours — and a hundred airlines discovered in unison that **competitive moats stop at the middleware**.

Restored the same day — as outages go, a sneeze. But the anatomy is the keeper, and you have seen it in this series wearing other uniforms — Fastly for websites, CDK for car dealers, Change Healthcare for pharmacies. Every industry quietly consolidates onto shared invisible platforms, because it is efficient — and **efficiency and shared fate are the same purchase**. Know your layer. Know its bad day. Know what your desks do during it.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m093',
    seq: 115,
    title: '#93 · Pen and Paper Boarding Passes',
    body: `[#93 · ~75s · resilience focused]

In 2025, at some of Europe's biggest airports, your boarding pass was handwritten. And that was the system working. This is The Point of Failure, episode [N].

September 2025. A cyberattack — ransomware, per reporting citing Europe's cyber agency — hits Collins Aerospace's MUSE platform — the shared check in and boarding software that lets many airlines use the same desks and gates at big airports. One vendor. Shared by design. Heathrow, Brussels, Berlin — within hours, screens down, and thousands of passengers watching agents do something almost archaeological — writing boarding passes by hand.

You know this shape from my Amadeus episode — shared layer, synchronized failure — this time with a hostile cause, and days of disruption, Brussels hit longest, while the vendor rebuilt safely. British authorities, as reported, later arrested a suspect — the case ongoing. But the half of this story worth stealing for your own industry is the half that worked — **aviation never deleted its paper mode**. Manual check in, manual manifests — trained, mandated, dusted off in hours. Flights kept moving. Slower, uglier, moving.

Ask this in your next planning meeting, because most industries fail this question — if our core vendor is encrypted tomorrow, **what is our handwritten boarding pass**? Not the backup server — **the backup method** — the human executable version of the business that needs no vendor at all. Aviation keeps one by law. Everyone else keeps one by wisdom... or discovers its absence by headline.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m094',
    seq: 116,
    title: '#94 · MCAS',
    body: `[SERIOUS — measured, low energy, no smile]

This episode is different. No hook, no music. Three hundred forty six people died, and the story must be told exactly right. This is The Point of Failure, episode [N].

In the 2010s, Boeing updated its best selling plane, the 737, into the MAX — bigger, more efficient engines. Those engines, larger and mounted differently, changed how the plane handles in certain conditions. The engineering answer was software — MCAS — a system that would automatically push the nose down to make the new plane feel like the old one. A software patch for physics. And commercially, feeling like the old one mattered enormously — it meant airlines could adopt the MAX with minimal new pilot training.

Per the official investigations, three design facts defined what followed. MCAS listened to a **single angle of attack sensor** — one vane on the fuselage — with no cross check against its twin. It could **activate again and again**. And it was granted more authority over the aircraft than early certification analyses had described. Pilots were not told the system existed — it appeared in **no manual, no training** — because the plane was meant to feel like the plane they already knew.

October 29th, 2018. Lion Air flight 610. A faulty sensor feeds MCAS false data moments after takeoff, and the system commands the nose down, repeatedly, as the pilots pull against a machine they had never been told about. The aircraft is lost in the Java Sea. One hundred eighty nine people. Guidance circulates afterward. Four and a half months later — Ethiopian Airlines flight 302, out of Addis Ababa. Per the investigations, the crew faced the related failure chain — and one hundred fifty seven more people are gone. Three hundred forty six human beings.

The world grounded the MAX for twenty months. Investigations documented the chain — engineering choices, disclosures softened, oversight that leaned on the manufacturer's own analyses, training minimized because training was expensive. A two and a half billion dollar settlement with US prosecutors followed. The recertified aircraft flies today with MCAS rebuilt — two sensors compared, authority limited, activation bounded, and pilots fully trained on its existence — every fix a sentence that could have been written before.

This show says every story was preventable, and has never meant it more. Software with authority over life must never trust a single sensor. Automation the operator does not know about is not assistance — it is a hidden actor. And no schedule, no market window, no training cost is a counterweight to those principles. Three hundred forty six people are the reason those sentences are now written into law, and they should never have needed to be. To their families — this episode exists so it is not forgotten.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin.`,
  },
  {
    id: 'pof-m095',
    seq: 117,
    title: '#95 · The Wiped Calibration Files',
    body: `[SERIOUS — measured, low energy, no smile]

The software on the aircraft was correct. The data it needed had been erased during installation. Four crew members did not come home. This is The Point of Failure, episode [N].

May 9th, 2015. Seville, Spain. An A400M — Europe's heavy military transport — lifts off on a production test flight, the routine proving run before delivery. Six crew aboard, experienced test personnel. Within moments of takeoff, three of the four engines stop responding to command — frozen at settings too low to keep the aircraft flying. The crew fights to return. The aircraft comes down in a field. Four of the six are killed.

The investigation traced it to the ground, before the flight ever began. Each engine's control unit requires calibration data — torque parameters, the numbers that let the computer understand its own engine. During software installation in final assembly, that data, on three engines, was accidentally wiped. The code was flawless. The engines were sound. But the installation had destroyed **the one file that connected them** — and the software, missing its foundation, defaulted into a state that could not govern power in flight.

The unbearable detail — nothing surfaced it before takeoff. The aircraft started, taxied, accelerated — the checks of that era did not verify the calibration data's presence, and the failure waited for the air. Afterward — new alerts, new ground checks that confirm the data before flight, operators notified within days of the mechanism's discovery. Deployment had never been treated as a step that could destroy — only as a step that could fail visibly.

For every engineer watching — installation and deployment are not the epilogue of software — they are **part of the software**. A deploy can corrupt what it carries, and correct never describes code alone — it describes code, plus data, plus the process that delivered both, verified together, before the system holds lives. Four crew in Seville are why that sentence must be permanent.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin.`,
  },
  {
    id: 'pof-m096',
    seq: 118,
    title: "#96 · The Week Europe's GPS Went Dark",
    body: `[#96 · ~60s · forward looking]

Europe's answer to GPS went dark for nearly a week. Billions of devices didn't care. Both halves of that sentence are the lesson. This is The Point of Failure, episode [N].

July 2019. Galileo — the European Union's own satellite navigation constellation, decades and billions in the making, then in its initial services phase — stops making sense. Literally — the signals broadcast time, receivers compute position from time, and the time went invalid. For nearly a week. The satellites? Healthy, all of them, holding formation. The failure was on the ground — traced to the precise timing facility, the equipment that generates the system's **master clock**, and to the upgrade process around it.

Now the half the headlines missed — **almost nobody noticed**. Your phone, your car, virtually every modern receiver listens to multiple constellations at once — GPS, Galileo, others — and when Galileo's time went wrong, devices silently leaned on the rest. The system lacked redundancy in one facility. The world's receivers had redundancy by design. **Diversity saved the week** — just not Europe's pride.

The reviews said what this arc always finds — ground segment single points, upgrade process gaps, slow communication — all fixed since. Keep the pairing as the takeaway — build your system as if no one will save it — and consume systems as if any one of them can fail. Galileo needed both sentences. Only the second one was true that July.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m097',
    seq: 119,
    title: "#97 · The Halloween With No Hershey's",
    body: `[#97 · ~75s · seasonal thriller]

The candy was made. The warehouses were full. And a hundred million dollars of Halloween... never left the building. This is The Point of Failure, episode [N].

1999. Hershey, America's chocolate institution, is racing Y2K. It decides to replace its aging systems with a massive integrated overhaul — a new ERP core, new supply chain planning, new sales software — three giant systems, one project, one hundred twelve million dollars. Consultants recommend four years. The calendar offers thirty months. The calendar wins the argument.

Go live — July 1999. Big bang — everything at once. And July matters, because Halloween orders — the season that makes a candy company's year — arrive in late summer. The new systems stumble exactly where money moves — orders in, shipments out. The company that has shipped chocolate flawlessly for a century suddenly cannot get candy out of its own buildings. The **candy is there**. The system that says where it is, and releases it, is not.

That Halloween, widely cited at around **a hundred million dollars** of orders goes unfulfilled. Quarterly sales crater double digits. The stock drops hard. And the quietest, longest lasting wound — retailers do not leave shelves empty — they fill Hershey's space with competitors. Some of that shelf never fully comes home. Reliability, it turns out, is how you rent shelf space.

The business school verdict has held for a quarter century — never integrate everything at once, never compress the timeline the work refuses to compress, and never, ever go live in the season that pays for the year. The Y2K deadline was real. Halloween was **more real**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m098',
    seq: 120,
    title: '#98 · The ERP Project That Killed the Company',
    body: `[#98 · ~90s · corporate tragedy]

A five billion dollar company installed new software, priced its future on the savings... and was gone in two years. Sold for **eighty million**. This is The Point of Failure, episode [N].

The mid 1990s. FoxMeyer Drug — America's fourth biggest pharmaceutical distributor, a river of pills flowing to pharmacies nationwide, five billion in revenue. Margins are razor thin — distribution always is — so leadership reaches for a weapon — Delta III — a state of the art ERP system plus robotic warehouse automation, around a hundred million dollars. The pitch — efficiency that rivals cannot match.

Then the bet that turns ambition into tragedy — confident in the coming savings, FoxMeyer prices major new contracts as if the efficiency already exists. The margin on those deals depends on software that has not yet processed a single real order. They have **spent the harvest in spring**.

Production arrives and the harvest fails. The new system, widely reported, handles a fraction of the daily orders the old one managed — throughput, the one number the whole company breathes, collapses. Meanwhile a warehouse consolidation forces the automated facility to take on migration mid stumble — shipping errors, inventory vanishing, customers fleeing. Every problem feeds the others, and the contracts priced on phantom savings now lose money with every truck.

August 1996 — bankruptcy. The distribution business sells to a rival for around eighty million — from five billion, in about two years. The trustee sued the vendor and consultants for half a billion each — allegations, settled quietly. The lesson survived the sealed files — a **capacity claim is a hypothesis** until proven at full production scale — and no company should ever price its survival on a hypothesis. Hershey lost a Halloween. FoxMeyer teaches the ceiling — ERP projects do not just embarrass companies. They can end them.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
]

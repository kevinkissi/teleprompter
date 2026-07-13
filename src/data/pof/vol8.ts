import type { PofEpisode } from './types'

// Volume 8 — masters 120–140 (document order). Spoken text only.
export const vol8: PofEpisode[] = [
  {
    id: 'pof-m120',
    seq: 141,
    title: '#120 · Down on Tax Day',
    body: `[#120 · ~60s · deadline irony]

On the one day the law requires every American to pay, the payment system went down. The deadline itself had to move. This is The Point of Failure, episode [N].

April 17th, 2018. Tax Day — the most predictable load spike in American civic life, written into statute, marked on every calendar in the nation. Millions wait — as humans do — for the last day. And that morning, the IRS's payment and filing systems fail — Direct Pay down, e-file processing choking — for most of the business day, while procrastinating America refreshes in disbelief.

The cause, per officials — not an attack — a hardware failure, reported as a firmware issue on mainframe storage — the kind of aging iron the IRS is famous for. Some of its mission-critical systems trace to the 1960s — modernization proposed, deferred, proposed, deferred, across decades and every flavor of government — until **the debt collected itself** on the least convenient day statute could offer. By evening it was fixed. The deadline moved a day — a national law bending to a storage fault.

You have watched this show's calendar spike family — Slack's first Monday, census night, payday at Barclays. Tax Day is their statutory king, and its lesson is the family's motto with teeth — when your biggest day is written in law, your capacity plan and your hardware refresh are written there too — whether you fund them or not. Technical debt always **picks its own repayment date**. It has excellent taste in irony.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m121',
    seq: 142,
    title: '#121 · One Front Door for a Nation',
    body: `[#121 · ~75s · continental stakes]

Hackers flooded one website — and a nation's visas, licenses, IDs and payments all stumbled together. This is The Point of Failure, episode [N].

Kenya, July 2023. Understand first what Kenya built, because it is genuinely ahead of most of the world — eCitizen — one portal, one login, over five thousand government services — the visa, the business license, the ID, the payment — consolidated where citizens of richer countries still queue at seven buildings. Digital government, done ambitiously. And then the flip side of one door arrived, knocking very hard.

A DDoS attack — garbage traffic at flood scale, claimed by a group calling itself Anonymous Sudan — hammers the portal for days of intermittent disruption. Travelers wait on visas, businesses on licenses, and the ripples spread wider, with interruptions reported during the window at mobile money touchpoints — in a country where mobile money is not an app but the bloodstream. The government's statements held two facts at once — yes, attacked — and **no data lost or stolen** — a flood at the door, not a hand in the files.

Services returned with hardened defenses, and the lesson travels to every government digitizing anywhere — consolidation is why it works — one door means citizens learn one path, and one door means the whole nation's queue forms behind a single point of pressure. The answer is not seven buildings again. It is engineering the one door like **a national artery** — DDoS absorption, degraded modes, and offline fallbacks for the services people cannot wait days for. Kenya took the stress test early because Kenya built early. The countries still on paper will face it too — just later, and less rehearsed.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m122',
    seq: 143,
    title: '#122 · ‘System Offline’',
    body: `[#122 · ~75s · chronic condition, human]

Everywhere else in this series, downtime is an event. In this story, it is the weather. This is The Point of Failure, episode [N].

South Africa. The Department of Home Affairs issues the documents that gate a life — the ID that opens a bank account, the birth certificate that enrolls a child, the passport that permits a job abroad. And for years — across administrations, documented by auditors, ministers and a weary press — its systems have gone down so routinely that the offline sign is a fixture. Not a crisis. A condition.

Feel the arithmetic from inside the queue. You take a day off work — unpaid, for most — travel across town, and stand from before sunrise. Mid-morning, the network drops — SITA infrastructure, a link, a system upstream — and the day is void. Come back tomorrow. Tomorrow is another lost wage. The document you need to open a bank account waits on a system that cannot stay open itself. Downtime, here, is not an inconvenience metric. It is **a tax** — paid in days, by the people with the fewest to spare.

There is motion — recent leadership has made digitization and uptime a public crusade, with claimed improvements this show will happily verify and celebrate. But the episode's place in this series is as the mirror it holds to every other story we have told — a bank's bad day, a cloud's bad hour — those end. Reliability debt, unpaid long enough, stops being incidents and becomes climate — and climate is what citizens plan their lives around. Uptime is not a convenience feature of a state. It is **a justice feature**. The queue outside knows it better than any dashboard.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m123',
    seq: 144,
    title: '#123 · The Day Canada Couldn’t Pay',
    body: `[#123 · ~90s · national anatomy]

One carrier went down, and suddenly a whole country's debit cards stopped working — including for people who had never been Rogers customers in their lives. This is The Point of Failure, episode [N].

July 8th, 2022 — and yes, long-time viewers, July 8th again — this show does not explain that date, it just documents it. Early morning, during planned maintenance, a configuration update on Rogers' network deletes a routing filter. Filters exist because routers gossip constantly about the internet's map, and the filter is the bouncer deciding how much gossip gets in. With the bouncer deleted, a flood of route announcements pours into the core routers, and drowns them.

And here is the architecture that turned a bad morning into a national day — Rogers ran wireless, wireline, and — critically — its own management systems on **one converged core**. When the core drowned, phones died, home internet died, and the engineers' own doors into the network died with them — staff physically driving to sites, the fire brigade locked out of the firehouse. Twelve million customers dark for the better part of a day. Some couldn't reach 911.

Then the ripple nobody scoped — Interac — Canada's debit payment rail — depended on Rogers connectivity. So checkout terminals failed nationwide, **for everyone**. Canadians on rival networks, phones working fine, stood at tills unable to pay — a telecom outage laundered into a commerce outage through one dependency. Cash machines had lines like a snowstorm was coming.

The reckoning — around a hundred fifty million in credits, an expert review, and — the genuinely good ending — a formal industry agreement that carriers will shelter each other's customers with emergency roaming when one of them falls. Because the review's deepest finding applies to every architecture — **separation is a safety feature**. Your management plane, your critical rails, your fallbacks — if they all ride the thing they are meant to rescue, they are passengers, not lifeboats.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m124',
    seq: 145,
    title: '#124 · 92 Million Blocked Calls',
    body: `[#124 · ~75s · regulatory forensic]

One incorrect step during routine overnight work — **ninety-two million** blocked calls by lunchtime, twenty-five thousand of them to 911. This is The Point of Failure, episode [N].

February 22nd, 2024, deep in the overnight window when networks do their housekeeping. AT&T crews are performing routine network expansion — adding capacity, the most ordinary work in telecom. And per AT&T and the federal regulator's report, an incorrect process is applied — one configuration step, wrong — and the systems that register phones onto the network begin to fail. Across America, phones wake up showing two letters that mean the floor is gone — **SOS**.

Morning arrives and the scale becomes federal — the FCC's report would later count more than ninety-two million blocked voice calls, and over twenty-five thousand failed attempts to reach 911. Hold on that second number the way the regulator did. Every one is a person, mid-emergency, getting silence. It is why telecom failures sit in their own category in this series — the dial tone is a public safety system wearing a consumer product's clothes.

And recovery brought this show's oldest telecom villain — the herd. As the network healed, millions of phones tried to re-register at once — a stampede of hellos that can re-drown a recovering system — stretching restoration across the day. The FCC's findings turned into required process — changes like that one now demand **peer review and testing** before hands touch production. Which is the quiet scandal, isn't it — that they didn't already.

The keeper for every operator of anything — your most dangerous changes are not the big migrations everyone fears and over-plans. They are the routine ones — 2 a.m., expansion work, done a hundred times — where the process is the only guardrail, and **the process turns out to be a suggestion**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m125',
    seq: 146,
    title: '#125 · The Nine Hour Collapse of Long Distance',
    body: `[#125 · ~90s · historical thriller]

In 1990, America's phone switches began crashing each other — in waves, for nine hours — passing the failure along like a virus. The virus was **one misplaced line of code**. This is The Point of Failure, episode [N].

1990. Long distance means AT&T — a continent of copper and steel routed through switches called 4ESS — computers the size of rooms, passing millions of calls with legendary reliability. Weeks earlier, a software update went out to them — an improvement — carrying, unknown to anyone, a flaw the size of one misplaced line — a trapdoor in the logic that only opened under a precise sequence of events. It waited.

January 15th — a switch in New York hits a minor fault and does the healthy thing — resets itself, then announces to its neighbors — I'm back, resume sending. And there, in the handling of those very messages, the trapdoor opens — the timing of the announcements trips the flaw in the neighbors — they crash. They reset. They announce I'm back... and crash THEIR neighbors. The network is now passing its own recovery around like an infection — waves of resets rolling coast to coast, for nine hours.

Half of long-distance America fails — tens of millions of calls blocked — airline reservations, businesses, families, in an era with no email to fall back on. The country's first theory — hackers. It was 1990, the word was new and delicious. The truth, when AT&T's engineers traced it — **their own update**. Recovery came by quieting the message storm and rolling back to the old software — the previous version, the one boring line at a time.

This episode is the grandfather of half this series. The dormant flaw waiting weeks — Fastly. The healthy reset that poisons neighbors — AWS's storm, AT&T's own 2024 herd. The lesson, thirty-five years old and never once out of date — in a connected system, **recovery behavior IS a message to everyone else** — test what your nodes say when they come back... because everyone is listening.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m127',
    seq: 147,
    title: '#127 · 61 Hours, and the Most Honest Press Conference in Tech',
    body: `[#127 · ~75s · respect forward]

Japan's second biggest mobile network went down for **sixty-one hours**. And the most memorable thing about the disaster... was how honestly its president explained it. This is The Point of Failure, episode [N].

July 2022, a Saturday, 1 a.m. During routine maintenance, a router switchover on KDDI's network goes wrong, and voice traffic — which on modern networks is just another data service, called VoLTE — stumbles. Millions of phones, sensing trouble, do what phones do — try to re-register. All of them. At once. The exchanges and the subscriber database — the systems that answer who are you and where are you — drown in **the stampede of hellos**.

And here is why it lasted sixty-one hours — not because the break was huge, but because the healing had to be gentle. Reconnect everyone at once and the stampede kills the patient again — so KDDI throttled, admitting traffic gradually, hour after hour, a controlled recovery stretched across a weekend. Meanwhile Japan discovered what rides on a mobile network — deliveries stalled as scanners went dark, connected cars lost services, some ATMs and even weather stations went quiet. Thirty-nine million lines, and a country's quiet plumbing.

Then, the part this episode exists for. President Takahashi stood before the press and did something vanishingly rare — **explained everything**. Real diagrams. Real sequence. Which systems, in which order, why the recovery was slow, what would change. Engineers around the world watched a corporate apology and took notes on the architecture. The compensation — about two hundred yen per user — was symbolically small and transparently reasoned. The trust recovered... was not.

Two keepers, one weekend — recovery at scale is a throttle, not a switch — plan the gentle comeback before you need it. And when your worst weekend arrives — **the diagram is the apology**. Specificity is what respect sounds like in a crisis. Say what broke. Your customers can forgive a router. They cannot forgive a fog.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m128',
    seq: 148,
    title: '#128 · The Safety Mechanism That Shut Down a Country’s Phones',
    body: `[#128 · ~90s · forensic, consequential]

Every router did exactly what it was configured to do — protect itself. All of them. At once. And a country's second phone network ceased to exist for fourteen hours. This is The Point of Failure, episode [N].

Melbourne, 4 a.m., November 8th, 2023. Far upstream, on the international network of Optus's parent company, a routine software upgrade completes — and sends a flood of routing announcements downstream — more routes than usual, the network equivalent of a very loud rumor mill. Each Optus router carries a preset safety limit — too many routes might mean something is wrong, so past the threshold, disconnect yourself. Sensible. Protective. **Configured identically**... on all of them.

The flood crosses the threshold everywhere within moments — and the routers, obedient and uniform, self-protect in unison. The network does not crash. It **resigns**. Ten million customers wake to dead phones — hospitals' lines, payment terminals, and for a stretch that morning, Melbourne's entire train network stands still — its communications rode Optus. Fourteen hours to rebuild what the safety settings had switched off.

Now the gravest layer, per the regulator — two hundred twenty-eight calls to triple zero — Australia's 911 — failed during the outage, and the required welfare checks on those callers were not properly completed afterward. That finding drove a Senate inquiry, penalties, binding new emergency call rules, and, weeks later, the chief executive's resignation. When a phone network falls, it does not just drop conversations. It drops **the country's thinnest lifeline**.

[beat]

The engineering lesson deserves its precision — the thresholds were right; **the uniformity was wrong**. Identical limits, identically configured, turn a protective reflex into a synchronized collapse — the two DVL waypoints, the twin failsafes, wearing telecom colors. Diversity in your defenses — staggered limits, degraded modes, one path that bends instead of breaking — is the difference between a network that flinches... and one that faints.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m129',
    seq: 149,
    title: '#129 · Thirteen Hours Without Triple Zero',
    body: `[SERIOUS — measured, low energy, no smile]

This episode is about thirteen hours during which, for part of a country, the emergency number did not work — and no alarm inside the company noticed. This is The Point of Failure, episode [N].

September 18th, 2025. Australia. Overnight, a firewall upgrade proceeds on the Optus network — security infrastructure, routine in intent. Something in that change — per the statements of the time, subject to the investigations that followed — breaks the path that carries triple zero calls for customers across South Australia, Western Australia and the Northern Territory. Not all calls. The emergency ones. The calls that exist for the worst moment of someone's life.

For around thirteen hours, hundreds of emergency calls failed to connect. And the failure was not caught by the network's own monitoring — it surfaced from outside, from reports, from people. Thirteen hours is not a detection time. It is the absence of detection. The one call type whose failure must scream... **failed silently**.

Deaths were reported in connection with that window — people whose calls for help did not connect — with official investigations examining the circumstances. This show will not say more than the record says. It does not need to. The weight of the sentence is already total. And it came less than two years after the same carrier's national outage had failed two hundred twenty-eight emergency calls and produced binding reforms meant to ensure exactly this could not happen again.

[beat]

For every engineer and every executive — the emergency path — whatever your industry's version of it is — must be engineered as **a separate promise**. Independently monitored, by systems that do not share its failure modes. Failover tested against the real network, not the diagram. And detection that assumes your own dashboards can lie. Because the measure of that path is not uptime. It is whether it works at 3 a.m., during your own maintenance, for a stranger having the worst night of their life.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin.`,
  },
  {
    id: 'pof-m130',
    seq: 150,
    title: '#130 · The Card That Poisoned the Network',
    body: `[#130 · ~75s · technical mystery]

No hacker. No update. No mistake at a keyboard. One physical card went bad — and its gibberish was polite enough that an entire national network passed it along. This is The Point of Failure, episode [N].

December 27th, 2018. In a node near Denver, a network management card — a small piece of hardware whose job is housekeeping chatter — malfunctions. It begins generating malformed packets. Gibberish. But **gibberish with excellent manners** — valid checksums, a broadcast-style address — paperwork so correct that the equipment receiving it does not discard it. It forwards it. To everyone.

And so one dying card becomes a storm. The packets multiply across the management network — the network's own housekeeping channel — consuming capacity, destabilizing nodes, coast to coast. **Thirty-seven hours**. Internet down, businesses dark — and, per the federal investigation, 911 service disrupted across portions of multiple states, hundreds of documented failed emergency calls, because this carrier's fiber quietly carried other companies' emergency call routing too.

Killing it was archaeology — find every node echoing the poison, filter, purge, node by node, for the better part of two days — because the storm carried no signature of an attack. It was the network's own trust, weaponized by chance. The FCC's postmortem asks the question every architecture should — what do your systems do with traffic that is **syntactically perfect and semantically insane**? If the answer is forward it... one failing component, somewhere, someday, holds a broadcast license to your whole network.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m131',
    seq: 151,
    title: '#131 · SOS Coast to Coast',
    body: `[#131 · ~60s · recent, compact]

Phones across America dropped to two letters — **SOS**. Again. Third national carrier failure of its kind in three years. This is The Point of Failure, episode [N].

Early 2026. Verizon customers coast to coast watch their bars vanish and the SOS indicator appear — the modern icon of a very specific failure. SOS mode means the towers are fine — your phone can literally see other networks and will pass an emergency call through them. What is broken is recognition — the core systems that answer the network's oldest question — who are you, and are you one of ours? Details of this event per the reporting of that week — but that symptom tells you where the wound is.

And here is why this episode is about the pattern, not the day. September 2024 — Verizon, national, registration-class failure, hours of SOS. February 2024 — AT&T, ninety-two million blocked calls, registration systems, hours of SOS — an episode on this show. Now this. Three nationwide events, **one failure family** — the identity layer of mobile networks — the piece that scales worst, chokes on stampedes of reconnecting devices, and takes everything with it when it stumbles.

You have seen this exact anatomy wearing cloud costumes in this series — Google's identity outage, Microsoft's. Mobile networks just print it on your status bar. The keeper — in any system, the who are you layer is **the true single point** — it fronts everything, it recovers worst, and its health checks deserve paranoia the rest of the stack does not need. When identity coughs... the whole body shows SOS.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m132',
    seq: 152,
    title: '#132 · When the Town Square Goes Quiet',
    body: `[#132 · ~60s · recent, reflective]

The place where the internet goes to ask is it down for everyone... went down for everyone. This is The Point of Failure, episode [N].

January 2026. X stops loading. Feeds hang, posts fail — details of that day per the reports of that week. And within seconds, hundreds of millions of thumbs perform the same doomed ritual — opening X... to check why X is down. The reflex is the story. Somewhere in the last fifteen years, the real-time feed became **the internet's smoke detector** — the first place we look when anything anywhere breaks — banks, clouds, airlines, all the stories on this show. The detector going quiet is its own special genre of confusion.

So the world improvised its usual outage liturgy — outage trackers spiking, rival platforms flooding with refugees announcing their arrival, group chats doing the verification work the feed usually does. The company's statements and the cause reporting of that day — whatever the verification pass finds — matter less to this episode than the structural note it closes this arc on — the communications layer now includes the places we communicate ABOUT the communications layer. The town square has **no backup town square**.

The keeper, for institutions more than individuals — if your crisis communication plan is post on the platform, your plan has a dependency. Status pages you host, email you own, channels that do not share fate with the story of the day — this entire arc in one sentence — **never announce the outage on the thing that is out**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m133',
    seq: 153,
    title: '#133 · Entirely Preventable',
    body: `[#133 · ~90s · definitive autopsy]

The patch existed for two months before the break-in. The alarm system had been blind for over a year. Congress's verdict was two words — entirely preventable. This is The Point of Failure, episode [N].

2017. Equifax — a company most Americans never chose to do business with — holds the financial identity of nearly all of them. In March, a critical vulnerability in Apache Struts — a common web framework — is disclosed to the world, with a patch. Equifax gets the alert. Circulates it. And here the gates begin failing — the one vulnerable system that matters — a consumer dispute portal — is not on the list that gets patched. A follow-up scan runs... and misses it too. Two gates. Two failures. Silent ones.

May — attackers walk through the known, unpatched hole. And now the third gate — Equifax has monitoring designed to inspect traffic for exactly this — but the device doing the inspecting has an expired certificate, expired, per the investigation, some nineteen months earlier, which quietly blinds it. The attackers operate inside for seventy-six days. When someone finally renews that certificate... the suspicious traffic lights up almost immediately. The alarm worked. It had been **unplugged by paperwork**.

**One hundred forty-seven million** people's data — Social Security numbers, birth dates, the unchangeable keys of financial life — gone. The CEO resigned. The settlement reached toward seven hundred million dollars. And the House investigation delivered the epitaph this whole arc is built on — **entirely preventable**. Not sophisticated. Not inevitable. Preventable.

Because look at what actually failed — not cryptography, not firewalls — **verification**. Does the asset inventory match reality? Did the patch actually land? Does the scanner actually see? Is the monitoring actually monitoring? Every one is a test nobody ran — on the process itself. Security tools do not protect you. Verified security tools protect you. The difference was a hundred forty-seven million people.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m134',
    seq: 154,
    title: '#134 · The Two Volunteer Internet',
    body: `[#134 · ~75s · structural revelation]

For two years, you could ask most of the internet's secure servers a trick question, and they would answer with their secrets. The guardian code had two maintainers and almost no money. This is The Point of Failure, episode [N].

April 2014. Security researchers disclose a flaw in OpenSSL — the open-source library that encrypts... approximately everything. Web logins, banking, email — a huge share of the internet's padlocks are this one codebase. The flaw lives in a small convenience feature — a heartbeat, where a client says — here's a message of, say, five letters, echo it back to prove you're alive.

The bug — the server **never checked** whether the claimed length matched the actual message. Claim your five-letter message is sixty-four thousand letters long... and the server, obediently echoing, sends your five letters plus whatever happens to be sitting next to them in its memory. Passwords in transit. Session keys. Sometimes the server's own private key — the master secret. Repeatable forever. Invisible in the logs. Bleeding, one heartbeat at a time.

The error was honest — one contributor, one missing check, merged through normal review in 2012, sitting undiscovered in the world's most critical library for two years. And when the world looked closer, the real scandal surfaced — OpenSSL — guarding trillions in commerce — was maintained by roughly **two principal volunteers** on a budget smaller than a mid-size company's coffee spend. The industry had built its vault doors on unpaid weekends.

The response was historic — global patching, certificates reissued, passwords reset, and — the legacy — real funding structures for critical open source at last. The keeper for every CTO — your stack's most critical dependency is somewhere down the list where nobody looks — find it, and ask two questions — who maintains this... and **who tests it**? If the answers are two volunteers and nobody — that is not their failure. It is now yours.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m135',
    seq: 155,
    title: '#135 · The Bug in Everything',
    body: `[#135 · ~75s · ubiquity epic]

The most dangerous bug of the decade was in software you have never heard of, running inside almost everything you have. This is The Point of Failure, episode [N].

December 2021. Log4j is a free Java library that does the least glamorous job in software — writing log lines. Because it is good and free, it is everywhere — inside enterprise apps, cloud platforms, games, appliances — embedded so deep that most companies running it did not know they were. Maintained, in the pattern this arc keeps finding, by a handful of volunteers.

The flaw — Log4j had a helpful old feature — it could expand special expressions inside the text it logged. And under common configurations, a crafted piece of text — arriving as anything an application might log — a username, a chat message, a web header — could make the server reach out and execute remote code. Read that shape again — the attack surface was anything that gets written to a log. Which is... everything. Severity score — **ten out of ten**. The scale does not go higher.

Disclosure hit in December and the internet's holidays evaporated — mass scanning within hours, thousands of vendor advisories, emergency patches — then patches to the patches — while security teams worked through the one question most could not answer — where do we even run this? US cyber leadership described it as among the most serious flaws of a career. The bug had been sitting there for years — a feature, working as designed, in a world that had changed around it — and no one had ever **tested that feature like an enemy would**.

Two keepers. First — you cannot patch what you cannot find — knowing what is inside your software, every library, every layer, is now survival, not paperwork. And second, the arc's thesis in its purest form — test features the way attackers read them — not what was this built to do, but **what CAN this be made to do**. The gap between those questions was ten out of ten wide.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m136',
    seq: 156,
    title: '#136 · Poisoning the Well',
    body: `[#136 · ~90s · espionage sober]

Eighteen thousand organizations installed the update. It was authentic. It was signed. It came straight from the vendor. And it was **poisoned before it was born**. This is The Point of Failure, episode [N].

2020. SolarWinds Orion is network monitoring software — the watchtower product — installed with deep privileges across governments and much of the Fortune 500, because watching everything is its job. Attackers — attributed by the US government to Russian foreign intelligence — understood something profound about modern trust — do not attack eighteen thousand fortresses. Attack **the one factory that ships to all of them**.

They compromised the build system — the machinery that compiles the vendor's code into the product — and inserted their implant during manufacture. Which means every check downstream passed honestly — the updates were genuine, digitally signed, delivered through official channels — because they WERE the official product. The signature promised — this came from the vendor unmodified. It did. The poison was **upstream of the promise**.

March to June 2020 — the poisoned updates flow to around eighteen thousand customers. The attackers, disciplined, go deeper into only a chosen subset — roughly a hundred organizations, federal agencies and tech giants among them — and operate for months, unseen, inside the tools whose job was seeing. Discovery came in December — not from any government — from a security firm investigating its own breach and pulling a thread that unraveled the campaign.

The industry rebuilt doctrine on this story — your build pipeline is **part of your product** — test and guard the factory like the code, because compilation is now an attack surface. Verify what your builds produce against what your source says they should. And weigh every privileged tool by what it could see if it turned. Trust, it turns out, has a supply chain too — and it is only as clean as its dirtiest upstream step.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m137',
    seq: 157,
    title: '#137 · The 500 Milliseconds That Saved the Internet',
    body: `[#137 · ~90s · thriller with a hero]

Someone spent years earning the trust of one exhausted volunteer, to plant a master key to nearly every server on earth. The whole thing was undone... by **half a second**. This is The Point of Failure, episode [N].

xz Utils — a tiny compression library, invisible, everywhere — and through the plumbing of major Linux systems, linked into sshd — the secure doorway administrators use to access... essentially every server that matters. Its maintainer — one volunteer, Lasse Collin, openly burned out, carrying critical infrastructure alone in the pattern this arc keeps grieving. Then help arrives. A contributor called Jia Tan — patient, competent, tireless. For two to three years — useful patches, steady presence — while pressure campaigns from other accounts urge the tired maintainer to share the load. He does. Wouldn't you?

With trust secured, the operation moves — releases in 2024 carry an obfuscated backdoor — hidden not in the readable source but in the build machinery — engineered to hook secure logins under specific conditions. It ships. It reaches the bleeding-edge versions of major distributions — weeks — WEEKS — from flowing into the stable releases that run the world's servers. The closest the internet has publicly come to **a universal skeleton key**.

And then — the save. Andres Freund, a Microsoft engineer, is benchmarking database performance — nothing to do with security — and notices his SSH logins are burning odd CPU and running about five hundred milliseconds slow. Most humans shrug at half a second. He does not. He digs, stubbornly, layer by layer, until the implant is in the light. Disclosure, global emergency, the poisoned releases purged — the master key confiscated at the door.

Three lessons, carved deep. The supply chain includes people — a burned-out volunteer is an attack surface, and funding maintainers is security spending. Test the build artifacts, not just the source — the poison lived where nobody reads. And **honor the anomaly** — performance weirdness is a security signal. The internet was saved because one person treated half a second... as a question worth answering.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m138',
    seq: 158,
    title: '#138 · Eleven Lines',
    body: `[#138 · ~60s · absurdist parable]

Eleven lines of code disappeared from the internet — and build systems everywhere started failing within minutes. **Eleven. Lines.** This is The Point of Failure, episode [N].

March 2016. A developer named Azer Koçulu, after a package naming dispute with the JavaScript registry npm, does something entirely within his rights — he takes his toys and goes home — unpublishing all his packages. Among them — left-pad. Eleven lines. It pads the left side of a string. That is all it does. You could write it during a yawn.

But somewhere in the geological strata of modern software, giant tools — the machinery behind Babel, React, half the JavaScript world — depended on packages that depended on packages that depended... on left-pad. The dependency tree nobody reads. Within minutes of the unpublish, build systems worldwide begin failing — red screens in a thousand companies — the assembly lines of the internet halted, **over string padding**.

npm did something it had never done — forcibly restored the package — un-unpublished it — then rewrote the rules so depended-upon packages cannot simply vanish. And the industry got its parable — your build has requirements no test covers — among them, the continued goodwill of strangers. Every dependency is **a promise made by someone you have never met**, revocable until the day you vendor it, pin it, or check it in. Eleven lines taught the internet to read its own supply chain. Briefly.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m139',
    seq: 159,
    title: '#139 · He Asked to Help',
    body: `[#139 · ~60s · melancholy parable]

A tired volunteer gave his project to a stranger who offered to help. The stranger was patient, competent... and **hunting bitcoin wallets**. This is The Point of Failure, episode [N].

2018. Dominic Tarr is an open-source veteran maintaining event-stream — a JavaScript library pulled millions of times a week — which he personally stopped using years ago. He maintains it the way you water a neighbor's plant — out of decency, unpaid, indefinitely. Then a stranger emails — I use this. Let me maintain it. In open source culture, this is how the commons works. Tarr says yes. Almost anyone would have.

The new maintainer works quietly, competently — then adds a small dependency carrying carefully hidden malicious code — aimed at one specific bitcoin wallet application, built to steal credentials from its users. Millions of downloads carry it before developers, chasing oddities, unmask it in November 2018. The playbook — **earn trust, inherit access, poison downstream** — rehearsed here in miniature, six years before the world would see it again, aimed at all of SSH, in the xz affair.

The pile-on aimed at Tarr collapsed when he answered with the most honest paragraph in open source history — paraphrased — I got nothing for years of this work, and he was the only one who offered to help. The mirror turned on the industry — billion-dollar products, load-bearing on unpaid strangers, with handover — the transfer of the keys — treated as a favor instead of **a security event**. Fund your load-bearing volunteers. Audit your handovers. Or accept that somewhere beneath your product, a tired stranger is deciding, right now, whether to say yes.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m140',
    seq: 160,
    title: '#140 · The Maintainer Who Burned It Down',
    body: `[#140 · ~60s · uncomfortable, evenhanded]

The developer who broke thousands of applications in one night... was the man who had built and maintained them for free for years. This is The Point of Failure, episode [N].

January 2022. colors.js and faker.js — two utility libraries by developer Marak Squires — are downloaded tens of millions of times a week — foundational grains of sand in the JavaScript beach. One night, updates arrive from the maintainer himself — colors now spins in an infinite loop, flooding every application that uses it with garbled text — the word LIBERTY marching through terminals worldwide — and faker is gutted. **Not hacked. Published.** By its own author.

The context, from his own prior posts — years of unpaid maintenance while companies built profits on the work — warnings that the arrangement was unsustainable, ignored. The act was read two ways at once, and honestly, both are true — **a protest** against the economics this arc has been documenting since Heartbleed — and **a supply chain betrayal** that burned thousands of bystanders who never owed him anything. The registries intervened — reverted the packages, locked the account — which opened its own uncomfortable question — whose code is it, really, once the world depends on it?

This show will not resolve what its whole arc exists to expose — an industry running critical infrastructure on volunteer goodwill has no protocol for the day the goodwill ends — by exhaustion, by handover, or by fury. Pin your dependencies — yes. Fork what matters — yes. But the durable fix has been on the invoice since Heartbleed — **pay the people your product stands on** — before the arithmetic of resentment does the accounting for you.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
]

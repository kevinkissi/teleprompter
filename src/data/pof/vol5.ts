import type { PofEpisode } from './types'

// Volume 5 — masters 33–75 (document order). Spoken text only.
export const vol5: PofEpisode[] = [
  {
    id: 'pof-m033',
    seq: 79,
    title: "#33 · The Cloud That Couldn't Count to February 29",
    body: `[#33 · ~60s · wry, tight]

Microsoft's cloud went down because its software believed **February 29, 2013** was a real date. This is The Point of Failure, episode [N].

Leap day, 2012. Inside Azure, every virtual machine runs an agent that, on startup, creates a security certificate valid for one year. And the code computes that expiry the way a tired human would — same date, add one to the year. Three hundred sixty four days a year, flawless. On February 29th... it mints certificates for February 29th, 2013. A day that will never occur.

Invalid certificate, failed startup. But here is the escalation that turned a bug into an outage — the platform watched those startups failing and drew the reasonable, wrong conclusion — this hardware must be sick. It began **marking healthy servers as faulty**, pulling them from service, spreading the damage with every good intention.

[beat]

Most of a day to recover, a famously thorough postmortem, credits to customers. And two lessons, one small, one large. Small — never do calendar math with arithmetic — ask a calendar, they are free. Large — automated remediation is a power tool. Point it at the wrong diagnosis, and it will **amputate healthy limbs at machine speed**, sincerely trying to help.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m034',
    seq: 80,
    title: '#34 · When the Front Door Is the Only Door',
    body: `[#34 · ~75s · structural, brisk]

Microsoft's front door for the internet jammed, and behind it stood Office, Xbox, airlines, and thousands of businesses, all knocking. This is The Point of Failure, episode [N].

October 2025. Azure Front Door is exactly what it sounds like — a global entry layer. Traffic for Microsoft's own services and thousands of customer applications arrives at its edge nodes first — for speed, for security, for routing. The front door is the product. Which means the front door is also **the blast radius**.

Per Microsoft's account — a configuration change that should not have gone out, an inadvertent, invalid state, deployed across that global fleet, and nodes began failing to load their configuration. Not a hack. Not hardware. A bad instruction, distributed with excellent efficiency to **every doorstep on the planet** at once. The same efficiency that makes the edge fast makes its mistakes fast.

For hours — sign ins stumbling, the Azure portal itself hard to reach, gamers, retailers, airlines' sites, all reported limping. And the recovery was deliberately unhurried — freeze all changes, roll back to the last known good configuration, then re admit traffic gradually, because slamming a global fleet back on all at once causes the stampede this arc keeps teaching.

[beat]

Third time this arc has told this shape — Fastly, Cloudflare, now Front Door. Different companies, one truth — an edge layer's whole job is standing in front of everything, so it concentrates risk by definition. If your architecture has **one front door**, your disaster plan should assume a day when it will not open, because across the industry, that day keeps arriving.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m035',
    seq: 81,
    title: '#35 · Nine Hours Without the Office',
    body: `[#35 · ~75s · recent history, careful]

For **nine hours**, a huge share of the world's offices had no email, no chat, no files, and, quietly worst of all, degraded security dashboards. All at once. This is The Point of Failure, episode [N].

Late afternoon, US time. Outlook stops loading. Then Teams meetings refuse to start. SharePoint, OneDrive, files, gone quiet. And in security operations centers, Defender dashboards, the screens watching for attackers, degrade too. Tens of thousands of reports flood the outage trackers within the hour. The modern office, as a concept, is down.

Why does everything fail together? Because it is built together. One identity layer, **one authentication front door**, signs you into all of it. Analyses of that night pointed squarely at that shared layer; Microsoft's detailed public accounting, at least early on, stayed limited. So this show says precisely what is known — the services that fell shared a front door, and they fell as one.

And it was, as widely reported, the fourth disruption for Microsoft services that January — a third party network issue here, a configuration change there, a data center power event elsewhere. Unrelated causes. Shared subscriber base. Enterprises spent the month discovering their backup communication plan, the chat, the mail, the conference bridge, lived inside **the same suite that was down**.

[beat]

No villain in this episode, and deliberately no unconfirmed cause. Just the structural math your own office can check today — list your fallbacks. Now cross out every one that signs in through the same front door as the thing it is backing up. What is left... is **your actual plan**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m036',
    seq: 82,
    title: '#36 · The Day Every Google Login Died',
    body: `[#36 · ~60s · tight, structural]

For about forty five minutes, the internet's biggest login button did nothing, worldwide. The killer was a **cost saving robot**. This is The Point of Failure, episode [N].

December 14th, 2020, mid pandemic, peak remote everything. Gmail fails. YouTube fails. Docs, Calendar, Classroom. And beyond Google — every app and site with a sign in with Google button inherits the outage instantly, because the thing that actually broke was **identity** — the service that answers the internet's most fundamental question — who are you?

The cause, per Google, is a modern parable in three beats. One — a migration left the identity service's storage usage essentially unreported — the meters read near zero. Two — an automated quota system, built to keep resource allowances honest, saw a service apparently using nothing, and did its job — it shrank the allowance. Three — identity, very much alive, **hit that wall** and could no longer write. Logins ended. Globally.

[beat]

Under an hour to fix — disable enforcement, restore the allowance. But the shape deserves its plaque in this arc — an efficiency robot, fed bad telemetry, exercised real authority over the single most critical dependency in the company, and no rule said identity is different. Some services should be **exempt from the accountant**. Decide which ones before the accountant decides for you.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m037',
    seq: 83,
    title: '#37 · The Day Google Flagged the Entire Internet',
    body: `[#37 · ~60s · comedy of scale]

For about an hour, Google told everyone that every website on the internet might harm their computer. **Every. Single. One.** This is The Point of Failure, episode [N].

Saturday morning, January 2009. You search for anything, pancake recipes, and every result carries the same red flag — this site may harm your computer. The recipe site. Wikipedia. The news. Google's own pages, **flagged by Google**. The entire internet, apparently, has turned hostile overnight.

Behind the scenes — Google kept a blocklist of sites known to spread malware, and parts of it were updated by hand. That morning, an edit slipped a single character into the list — a slash. "/". And in the language of URLs, the slash appears in every address that exists. The checker did exactly what it was told — it matched everything. The blocklist had, technically, **blocked Earth**.

Clicking any result routed through a warning page, which promptly buckled under the clicks of the whole planet. Under an hour later — rolled back, and, notably for 2009, explained publicly the same day. The lesson has outlived the decade — **one character, given universal scope** by an automated system, needs exactly one sanity check standing in its way. Does this change flag more than one percent of everything? Maybe ask a human.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m038',
    seq: 84,
    title: '#38 · When Email Was Down, and the World Noticed It Cared',
    body: `[#38 · ~60s · nostalgic, structural]

In 2009, email went down for **a hundred minutes** and it made global news. That reaction was the real story. This is The Point of Failure, episode [N].

September 1st, 2009. Gmail's web interface fails worldwide. Not for days. For about a hundred minutes. And the internet reacts like a utility has failed, because, without anyone announcing it, one had. That year, businesses and universities had quietly moved their mail into Google's cloud. Email had become a place you go, and **the place was closed**.

The cause, per Google's own explanation — routine maintenance took some servers offline, and the request routers, the traffic directors, had less headroom for the shifted load than anyone believed. Routers overloaded, failed, and dumped their load onto neighbors, who overloaded in turn. A cascade of traffic directors **fainting one by one**. The mail itself was fine, sitting safely. The doorway to it collapsed.

Two legacies. First, the engineering one — the margin you believe you have is **a hypothesis until load tests it** — capacity planning failures look exactly like code failures from the outside. Second, the cultural one — Google explained itself, in public, in detail, and apologized. That habit, born partly from 2009's embarrassments, became the industry norm this entire show depends on. Every postmortem I read you descends from those apologies.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m039',
    seq: 85,
    title: '#39 · One Customer, One Setting, No Internet',
    body: `[#39 · ~75s · thriller compression]

Somewhere, one customer changed **one setting**. Within seconds, most of the internet's front page returned errors, including an entire government's website. This is The Point of Failure, episode [N].

June 8th, 2021, morning in Europe. Reddit — error. Amazon — error. The New York Times, The Guardian, CNN — error. The UK government's entire portal, gov.uk — error. Within minutes the theories fly — cyberattack, war, the cables. The truth was smaller and stranger than any of them.

All those sites shared a CDN — Fastly, one of the companies that stands in front of websites to make them fast. Four weeks earlier, Fastly had shipped a software update containing a bug that hurt nothing, triggered nothing, and **slept**. Until this morning, when one customer, doing everything correctly, pushed a valid configuration change whose particular shape woke it. Eighty five percent of the global network began returning errors, more or less at once.

Now the redemption, because it matters — Fastly saw it within a minute, found and disabled the triggering configuration, and had the network largely back inside the hour, with a plain language postmortem published the same day. As global disasters go, it was a masterclass in response. The customer was never named and never blamed — they had **done nothing wrong**.

[beat]

Which leaves the uncomfortable arithmetic as the lesson — every deploy you ship may contain a sleeping bug, and every valid input from every customer is a possible key. Testing cannot try every key. But knowing that... changes **how fast you build your locksmith**. Fastly's minute to detection was not luck. It was the plan.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m040',
    seq: 86,
    title: '#40 · The Regular Expression That Ate Every CPU',
    body: `[#40 · ~75s · nerd legend]

One line of pattern matching, one search rule, drove every processor in a global network to **one hundred percent** at the same moment. This is The Point of Failure, episode [N].

July 2019. Cloudflare stands in front of millions of websites, and part of its job is a firewall that inspects requests using pattern matching rules — think of each rule as a search instruction — does this request look like an attack? That day, engineers shipped a new rule. And rules like these deployed globally, immediately, on purpose — when you are blocking attacks, staging for days is its own risk.

But this rule's pattern contained a trap. Certain patterns, on certain inputs, force the matcher to explore possibilities like a maze runner who, at every dead end, walks all the way back and tries every corridor again, and the corridors multiply exponentially. Engineers call it **catastrophic backtracking**. On normal text — instant. On the wrong text — effectively forever.

The wrong text arrived, as it always does. Across Cloudflare's entire edge, processors dove into the maze and never came out — one hundred percent CPU, everywhere, within minutes. Millions of sites behind the network began returning errors. And the bitter garnish this arc keeps serving — the tools to hit **the kill switch** were slowed by the same saturation. Twenty seven minutes to daylight.

[beat]

The postmortem became required reading — stage even urgent rules, put **a time budget on every pattern** so no single rule can eat the machine, and keep the emergency brake on separate power. One rule. Twenty seven minutes. A masterclass in how the tools we use to protect systems need governors of their own.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m041',
    seq: 87,
    title: '#41 · The File That Grew Too Big for the Internet',
    body: `[#41 · ~90s · recent epic, precise]

The internet flickered, down, up, down again, like something was breathing on the power switch. The cause was a file that had quietly **doubled in size**. This is The Point of Failure, episode [N].

November 18th, 2025. X — down. ChatGPT — down. Spotify, Canva, Uber — down. Even the sites people use to check whether sites are down — down, because they live behind Cloudflare too. And unlike a clean outage, this one pulsed — services recovering for minutes, then collapsing again. Inside Cloudflare, that pulse read like something worse — it looked, at first, **like an attack**.

The real chain, per the postmortem the CEO signed that same day — a change to database permissions caused a query, one feeding the bot detection system, to return **duplicate rows**. The result — a machine learning feature file, redistributed across every machine in the network every few minutes, silently doubled in size.

And inside the core proxy, the software that touches nearly every request, that file had a preallocated space with a hard limit, a limit chosen sensibly, exceeded never... until now. Oversized file arrives — the software panics. Machine by machine, worldwide. And the pulse? The file was regenerated every few minutes, sometimes by updated database nodes, bad file, sometimes by not yet updated ones, good file. The network was being alternately **poisoned and cured, on a timer**.

[beat]

Hours to daylight — stop the propagation, restore a known good file, restart the fleet. The hardening reads like a series recap — treat your own internal files with **the suspicion you reserve for strangers**, and give every automated pipeline a kill switch you can pull. Internal is a description of where data comes from. It was never a promise about what it contains.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m043',
    seq: 88,
    title: '#43 · The Outage They Pinned on One Engineer',
    body: `[#43 · ~75s · industry morality tale]

A big tech outage, hours long, global. But the reason engineers still talk about this one is what the company said afterward — it pointed at **one engineer**. This is The Point of Failure, episode [N].

May 2021. Salesforce, the system of record for a huge share of the world's sales teams, goes down for hours. The trigger — a DNS configuration change, applied by an engineer using an emergency shortcut process instead of the slow, staggered standard rollout. The change spreads everywhere at once, DNS resolution collapses across data centers, and, this arc's oldest chorus, the repair tools are **behind the broken layer** too.

Bad day, familiar shape. Then the aftermath made history. In briefings, leadership emphasized, publicly, that the engineer had circumvented approved processes. And the industry heard something chilling in that framing — they heard blame, aimed at a person, for pressing a button **the system happily allowed** to detonate globally.

The backlash invoked this show's episode seven — when one typo took down AWS S3 in 2017, Amazon's postmortem never mentioned a person — it asked why one typo could do so much, and rebuilt the tools. Same class of trigger, opposite instinct. Because here is the operational truth, not the sentimental one — engineers at a company that blames individuals **stop reporting near misses**. And near misses are where outages are cheapest to prevent.

[beat]

The emergency shortcut existed. The global blast radius existed. The engineer merely walked **a path the architecture had paved**. Blame is a design review of a human. It has never once fixed a system.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m044',
    seq: 89,
    title: '#44 · The Script That Deleted the Customers',
    body: `[#44 · ~90s · slow horror]

A cleanup script asked for a list of things to delete. It was handed **the wrong list**. Two weeks later, the last customers got their companies' memory back. This is The Point of Failure, episode [N].

April 2022. Atlassian, maker of Jira and Confluence, the tools where thousands of companies keep their plans, tickets, documentation, their institutional memory, is retiring an old legacy app. Routine housekeeping — run a script, delete the deprecated components. The script needs a list of IDs telling it what to remove.

The list it receives is wrong. Not malformed — wrong. It contains identifiers not of app components but of entire customer cloud sites. And the script, trusting its input completely, runs in **permanent deletion mode**. Hundreds of customers, roughly seven hundred seventy five in the final accounting, watch their Jira and Confluence simply cease to exist. Years of work. Gone from the screen.

[beat]

Now the twist that makes this episode merciful and instructive at once — backups existed. Nothing was truly unrecoverable. But **nobody had ever rehearsed** restoring hundreds of intertwined sites at once — the recovery had to be assembled while it ran, in painstaking, initially manual batches. Days pass. The final customers wait two weeks. And through the early silence, some learned more from the press than from support — a wound Atlassian's own postmortem owns and apologizes for.

[beat]

The remediation list is the arc's catechism — deletions become recoverable by default, scripts verify that IDs match the type of thing they expect to destroy, bulk restoration gets rehearsed like a fire drill, and communication gets a runbook of its own. Say the show's line with me if you have followed this arc — a backup you have never restored at scale is **a photograph of a safety net**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m045',
    seq: 90,
    title: '#45 · 73 Hours',
    body: `[#45 · ~90s · mystery epic]

One of the biggest platforms on earth went dark for **seventy three hours**, and for most of them, the engineers could barely see inside their own system. This is The Point of Failure, episode [N].

Halloween weekend, 2021. Roblox — fifty million people a day, a huge share of them kids in costumes with a long weekend, and the whole platform is down. Not degraded. Down. The internet immediately invents a cause — **a burrito promotion** had overloaded it. Genuinely the leading theory online for days. It was wrong, and the truth is better.

Beneath any platform like this sits a coordination layer — the system every service asks to find every other service. Roblox ran one of the largest such deployments anywhere. That week, a newly enabled streaming feature changed its load pattern, and deep below, in a low level database library, a contention bug, a traffic jam around a single internal list, began to choke the cluster. The platform did not crash so much as lose the ability to **find itself**.

And now the detail this arc has been building toward for ten episodes — Roblox's monitoring, the dashboards, the telemetry, the instruments of diagnosis, depended on that same sick layer. The doctors' stethoscopes were **plugged into the patient**. For days, brilliant engineers, joined by the vendor's own, chased theory after theory, hardware included, through fogged glass.

[beat]

The fix, when found, was surgery, not a reboot — careful configuration changes, an upgraded library, a staged, gradual return to fifty million users. The postmortem, written jointly with the vendor, is one of the most honest documents in the industry, and it enshrined the rule this arc keeps chanting — your observability **must survive the death of the thing it observes**. And no, it was not the burritos.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m046',
    seq: 91,
    title: '#46 · Down on the First Workday of the Year',
    body: `[#46 · ~60s · compact, empathetic]

The whole working world came back from the holidays, opened the same app in the same hour... and **the app was not there**. This is The Point of Failure, episode [N].

Remember that Monday. Deep pandemic, offices are apartments, and Slack is the office. At nine a.m., timezone by timezone, tens of millions of people pour back from the holidays and open it within the same narrow window. **The most predictable traffic spike of the year**, printed on every calendar on earth.

Underneath, per the postmortems — the network layer connecting Slack's systems in its cloud, the highway between its own buildings, scaled up automatically, but not fast enough for that vertical wall of traffic. Packets began dropping. And packet loss is a strange poison — everything half works, retries multiply, and **the retries themselves become new traffic** on the choked road.

The loss then knocked over Slack's own machinery behind it — systems for adding capacity, dashboards, alerting, all wading through the same mud. Hours to fully clear. The provider improved the scaling behavior; Slack published an honest accounting of both halves.

[beat]

The keeper — your biggest spike is often not a surprise — **it is on the calendar**. First workday. Tax day. Payday. Black Friday. The question that would have saved that Monday costs nothing to ask in December — we know exactly when the wall arrives — shall we widen the road before it does, or trust the road to notice?

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m047',
    seq: 92,
    title: '#47 · 43 Seconds That Cost 24 Hours',
    body: `[#47 · ~90s · precision drama]

The network failure lasted **forty three seconds**. The outage lasted **twenty four hours**. The gap between those numbers is the whole story. This is The Point of Failure, episode [N].

October 2018. GitHub — the working memory of the world's software. During routine maintenance, the link between its East Coast data center and the hub to the West Coast drops. For forty three seconds. In human time, a hiccup — you would blink and reload. In database time, forty three seconds is **an era**.

Because in that era, the automated failover system did its sworn duty — East looks dead, promote West to leader. Reasonable. Except a final batch of writes, code pushed in those very seconds, had landed in the East and never copied west. Now picture two notebooks that both claim to be the master ledger — East holds moments West never saw — and West, now leader, is writing new history of its own. Two truths. Engineers call it **split brain**, and it is the condition databases fear most.

Here is where GitHub earned this episode. The fast fix existed — fail back East, discard the divergence, most users never notice... and some users' work is silently gone forever. They refused. Instead — twenty four deliberate hours of degraded service — some stale pages, paused notifications, queued jobs, while engineers reconciled the notebooks entry by entry so that no one's pushed code was lost. Slowness, chosen, as **a form of honesty**.

[beat]

The postmortem became a classic on the oldest tradeoff in distributed systems — when the network splits, you choose between staying available and staying correct — pretending you can have both is how data dies. GitHub picked correct, in public, at scale. Forty three seconds asked the question. Twenty four hours was **a principled answer**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m048',
    seq: 93,
    title: "#48 · A Platform's Rough Winter",
    body: `[#48 · ~75s · ongoing history, sober]

The platform that hosts the world's code spent a winter going down so often that its own CTO published a diagnosis, and a famous project packed its bags. This is The Point of Failure, episode [N].

GitHub. If software is the world's infrastructure, this is where much of it lives. And per independent tracking of its own status reports, from late 2025 into 2026 its incident count climbed month over month — January, February 2026 the worst stretch, dozens of incidents, with Actions, the automation service teams depend on to ship, hit hardest. For working developers it stopped being trivia — **pipelines stalling is payroll stalling**.

Then, March 2026, something this show wishes were more common — the CTO published a frank public diagnosis. Rapid load growth. Architectural coupling letting local issues cascade across critical services. And systems unable to shed load from misbehaving clients. Translation into this show's language — the platform **grew faster than its blast walls**, and when one room caught fire, the doors were open. Naming that publicly, mid crisis, took spine. Credit.

April — after another outage, Mitchell Hashimoto, a legend of the infrastructure world, announced his project Ghostty was leaving, writing that GitHub was, his words, **no longer a place for serious work**, while noting, fairly, that the timing by that outage was coincidence — the decision was long brewing. One project moving is small. A community watching it move is not.

[beat]

This story has no ending yet, and this show reports it that way. What it already teaches is the arc's hardest truth — reliability is not a feature you finish. It is a race between **your growth and your architecture, forever**. And the scoreboard is public, updated in real time, by a status page you write yourself.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m049',
    seq: 94,
    title: '#49 · The Satellites Were Fine',
    body: `[#49 · ~60s · compact, elegant]

Thousands of satellites, all healthy, all in position, **all useless for two and a half hours**. The sky was fine. The software was not. This is The Point of Failure, episode [N].

July 2025. Starlink — the largest satellite constellation ever built, internet for the places wires never reached. And one afternoon, across four continents at once, terminals lose connection. Rural clinics, ships at sea, remote businesses, for many of whom this dish is **the only line out**. There is no cell tower plan B where these users live. That is the entire reason they have the dish.

The instinct is to look up — solar storm? Debris? Satellites failing? No. The constellation was healthy the whole time, thousands of spacecraft holding formation, waiting for instructions. Per Starlink's own engineering VP, with a directness worth crediting — the cause was **failure of key internal software services** that operate the core network. The orchestra was on stage. The conductor's software collapsed.

[beat]

Two and a half hours, a public apology from the top, service restored. And the postcard from this one belongs on the arc's wall — we notice the exotic part, the rockets, the constellation, the frontier, and forget that all of it hangs off the most ordinary thing in engineering — software services on the ground, with the same failure modes as everything else in this series. You can put your infrastructure in orbit. Its reliability **stays down here, with the code**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m071',
    seq: 95,
    title: '#71 · The Wrong Server',
    body: `[#71 · ~90s · confession booth, redemptive]

An engineer meant to wipe the broken copy of the database. He was logged into the real one. Then **five backups failed in a row**. This is The Point of Failure, episode [N].

January 2017, nearly midnight. GitLab is fighting a spam attack, and database replication is misbehaving. A tired engineer, hours deep, decides to wipe the lagging secondary server and rebuild it from the primary. Standard move. Two terminals open. db1. db2. **One character apart**. You already know.

The removal command runs on production. Three hundred gigabytes begin vanishing before he catches it. Now, this should be a bad hour, not a disaster, because backups exist. Layer one — the scheduled backups — silently broken for ages, a version mismatch producing empty files, and nothing had ever alerted. Layer two — cloud disk snapshots — never enabled on the database servers. Layer three, four — stale, misconfigured. Five safety nets. **Five holes**.

Salvation was an accident — a staging server held a copy about six hours old. And here GitLab made the choice this episode exists for — they **recovered in public**. Livestreamed the restore to thousands. Published their working notes as they went. Told the world, plainly — about six hours of issues and comments are gone, your code is safe, here is everything we know. And they said, out loud, the engineer keeps his job.

[beat]

The industry's takeaway outlived the incident — a backup that has never been restored is a rumor, silence from a backup system is not good news, and the prompt should scream which machine you are on. But the reason engineers still tell this story is the honesty. Trust is not lost in the deletion. It is **decided in the twelve hours after**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m072',
    seq: 96,
    title: '#72 · The Antivirus That Attacked Windows',
    body: `[#72 · ~75s · ironic thriller]

The security software decided that **Windows itself was the virus**. And it acted. This is The Point of Failure, episode [N].

April 2010. McAfee pushes a routine virus definition update — the daily list telling the antivirus what evil looks like. And in that day's list, a signature matches svchost, one of the load bearing processes of Windows XP. To the antivirus, **the operating system's own heart** now looks like malware. It does its job. It removes the threat.

Machines crash. Reboot. Crash again. Networking dies with the deleted process, which means **the fix cannot be pushed remotely** — every afflicted computer needs a human at its keyboard. Hospitals report systems down. Police departments. Universities. Intel. Around the world, IT staff walk building floors, machine by machine, undoing one line of one update.

McAfee pulled the update, apologized, paid repair reimbursements. And if this story feels familiar, it should — fourteen years later, nearly beat for beat, a defective security content update called CrowdStrike grounded the planet, episode one of this show. Different company, same architecture of risk — protective software holds **the deepest privileges in the machine** and updates faster than anything else you run.

[beat]

Which means the guardian's update pipeline is **the most dangerous deploy pipeline you own**. Test it like the weapon it is. The two biggest self inflicted outages in computing history were both, technically... the security working.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m073',
    seq: 97,
    title: '#73 · The Update That Deleted Your Documents',
    body: `[#73 · ~60s · consumer stakes, pointed]

The update deleted people's family photos. The bug report existed before launch. It just **didn't have enough upvotes**. This is The Point of Failure, episode [N].

October 2018. Windows 10's big autumn update rolls out, and within days, reports — after upgrading, some users' Documents and Pictures folders are simply... empty. A small fraction of machines, tied to particular folder setups. But think about what lived there. Tax records. Manuscripts. Baby photos. Frequency — rare. **Severity — everything**.

Microsoft did respond fast — paused the rollout, the first full recall of a Windows feature update, shipped the fix, helped with recovery attempts. But the autopsy found the ghost — beta testers had hit this exact bug and reported it, weeks earlier, in the official Feedback Hub. The reports sat there. Barely upvoted. And the triage process surfaced what was popular. A catastrophic bug that strikes one user in thousands will **never, ever be popular**.

[beat]

Microsoft's fix went beyond the code — they added a severity field to feedback, so a rare disaster can outrank a common nuisance. That is the keeper for everyone who ships anything — your users are **already telling you about the next catastrophe**. The question is whether your listening system sorts by loudness... or by damage.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m074',
    seq: 98,
    title: '#74 · Everything for a Penny',
    body: `[#74 · ~60s · small business tragedy, brisk]

For about one hour, one night, thousands of online shops sold **everything for a penny**. The warehouse robots shipped the orders anyway. This is The Point of Failure, episode [N].

December 2014, peak Christmas shopping. Small sellers on Amazon UK live and die by price, so most use repricing software — tools that watch competitors and adjust prices automatically, all day, faster than any human could. You do not really have a choice — everyone else's robot is repricing too.

That night, one popular tool, RepricerExpress, malfunctions. And across thousands of shops, for roughly an hour, prices collapse to one penny. TVs. Toys. Stock a family business spent the year building. Deal forums light up in minutes; carts fill. And here is the mechanism that turned glitch into ruin — many sellers store goods in Amazon's own warehouses, where fulfillment is automatic. The orders did not wait for a human. **They shipped**.

Amazon canceled what had not left the building; what had was gone, legally sold, at a penny. Some small sellers reported **tens of thousands of pounds lost overnight**; a few feared closing. The tool's maker apologized — a software error. One hour long.

[beat]

You have heard this shape before on this show, wearing a Wall Street suit — Knight Capital, episode two. Same lesson, corner shop edition — the moment software can transact on your behalf, its bugs stop being display errors. They are sales. Give every automated actor **a floor it cannot cross**, because for one hour one December, thousands of shops learned theirs did not have one.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m075',
    seq: 99,
    title: "#75 · Steam's Christmas Present",
    body: `[#75 · ~60s · uneasy, precise]

On Christmas morning, gamers opened their account pages and saw someone else's name, someone else's purchases, **someone else's card digits**. This is The Point of Failure, episode [N].

Christmas 2015. Steam, the store where PC gaming lives, is under DDoS attack — garbage traffic flooding in, right on the biggest sales day of the season. The defense involves caching — keeping copies of pages ready to serve, so the servers survive the load. Caching is the art of **showing many people the same copy**. Remember that sentence.

In the scramble, a caching configuration deployed by a partner goes wrong in the one way caching must never go wrong — it starts **caching personalized pages**. Your account page — your email, billing address, purchase history, the last digits of your card — is a generated page meant for exactly one reader. Cached, it becomes a copy... served to whoever asks next. For about an hour, some thirty four thousand users' pages were handed to strangers.

[beat]

Held to the facts — no full card numbers, no passwords, no ability to log in as anyone — Valve took the store down, fixed the rules, and eventually explained, though the days of silence drew their own criticism. The engineering lesson is crisp enough for a sticker — **a cache rule is a security rule**. The whole point of a cache is sharing. Point it at anything private, and sharing is exactly what it will do.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
]

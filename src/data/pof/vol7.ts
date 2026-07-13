import type { PofEpisode } from './types'

// Volume 7 — masters 99–119 (document order). Spoken text only.
export const vol7: PofEpisode[] = [
  {
    id: 'pof-m099',
    seq: 121,
    title: "#99 · 'This Is What I Get for $400 Million?'",
    body: `[#99 · ~60s · quote driven, brisk]

Nike's new software decided the world wanted the wrong sneakers. A hundred million dollars later, the CEO reviewed it in one sentence. This is The Point of Failure, episode [N].

2000. Nike is mid transformation — a four hundred million dollar supply chain overhaul, and at its heart, demand planning software from i2 — algorithms that forecast what the world will buy and order factories to build it. Forecasting sneakers sounds simple. It is fashion plus logistics plus lead times measured in months — one of the hardest prediction problems in retail.

The forecasts go wrong at scale. The system, fed by a rushed and heavily customized rollout — or flawed in itself, depending on whose lawyers you asked — orders too many of the shoes cooling off and too few of the ones on fire, including, painfully, Air Jordans. Factories obey. Months later the shipping containers arrive full of exactly the wrong things. Nike books around **a hundred million dollars** in lost sales — the stock drops a fifth in a day.

On the earnings call, founder Phil Knight delivers the most quoted software review in business history — this is what you get for 400 million, huh? The vendor blamed the implementation. Nike blamed the software. Most honest autopsies found both — customization, pace, data quality, and model behavior, tangled. And, credit where due — Nike stayed the course, and the overhaul eventually worked.

[beat]

The keeper — a forecasting system's errors are **invoiced months later, in cargo containers**. Validate the model against history before it commands the factories — because by the time the ships dock, the argument about whose fault it was is already a hundred million dollars old.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m100',
    seq: 122,
    title: '#100 · Half a Billion Euros, Then Back to the Old System',
    body: `[#100 · ~75s · autopsy of a mismatch]

Seven years. Around **half a billion euros**. And in the end, the company switched its old software back on. This is The Point of Failure, episode [N].

2011. Lidl — the German grocery discounter conquering the planet — decides its homegrown merchandise system, built decades ago, must give way to SAP, the world standard. Project eLWIS begins — a flagship for both giants. And buried in week one is a single sentence that will consume half a billion euros — how do we value the inventory?

SAP's retail standard values stock at the price it will sell for. Lidl's entire machine — processes, reports, decades of discount retail instinct — values it at the price it was bought for. Two philosophies, both legitimate, both proven. Someone must yield. Lidl, reasonably proud of the model that built its empire, does not. So the standard software is customized against its own grain — and a standard bent against its grain does not bend once. It **bends everywhere, forever**.

Seven years of multiplying customizations, reported performance and rollout pain in pilot countries, and costs climbing toward the famous figure. In 2018, Lidl does the thing executives almost never find the courage for — stops. Cancels eLWIS outright, and pours the energy into modernizing the old in house system — which, whatever its age, at least agreed with the company about what a can of beans is worth.

[beat]

The decision the project skipped in 2011 is the one every software purchase must face in daylight — standard software is a bundle of assumptions — **adapt your process to it, or do not buy it**. Change the process — painful, priced, finite. Bend the standard — painful, unpriced, endless. Lidl paid seven years to learn there is no comfortable third door. Now you know it for free.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m101',
    seq: 123,
    title: '#101 · The Rollout That Ended Up in Court',
    body: `[#101 · ~60s · compact escalation]

A makeup company's software rollout went so wrong that its own shareholders took it to court. This is The Point of Failure, episode [N].

2018. Revlon — the cosmetics institution — consolidates onto a new ERP system, including at its flagship North Carolina plant. The rollout stumbles where rollouts always stumble first — the loading dock. Manufacturing hiccups, orders back up — tens of millions of dollars of products sold but unshipped, then expensive air freight and penalty fees to claw it back.

Then the part that makes this sixty seconds matter. Revlon is a public company, and the disruption crossed a legal line — in its official filings, it disclosed a **material weakness** in internal controls tied to the ERP implementation. That phrase is regulated language — a formal confession to investors that the machinery producing your numbers cannot fully be trusted right now. Within weeks, shareholders filed suit, alleging the risks had been understated. A software migration, litigated as investor harm.

[beat]

That is the promotion this episode announces — somewhere in the 2010s, ERP projects moved up a floor. Not an IT initiative that might embarrass the CIO — a **disclosure grade risk** that can move earnings, controls attestations, audit opinions, and courtrooms. If your company's next migration is being risk assessed like a software project instead of like a factory rebuild... forward them this minute.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m102',
    seq: 124,
    title: '#102 · Target Canada',
    body: `[#102 · ~90s · business epic, human]

A retail giant opened a hundred thirty three stores in two years, and lost the whole country to empty shelves, because the data underneath was junk. This is The Point of Failure, episode [N].

2011. Target — beloved in America — buys its way into Canada and commits to the fastest expansion in modern retail — over a hundred twenty stores opening in 2013 alone. And because its US systems were not built for Canada — different currency, language rules, metric units — it stands up an entirely fresh stack — new ERP, new forecasting, new replenishment. New everything, at maximum speed, with no history to learn from. Each choice defensible. The combination, lethal.

Feeding those systems meant loading data for tens of thousands of products — dimensions, case sizes, vendors, units — by hand, on deadlines the definitive reporting describes as crushing. And the data went in wrong. Riddled with errors — a case entered as a unit, inches as centimeters, wrong vendor codes. Forecasting software is arithmetic on top of item data — **junk beneath, junk above**. The system ordered too little of what sold and mountains of what did not.

Canada watched the paradox in person — store shelves empty — the one unforgivable sin in retail — while distribution centers overflowed to crisis, choked with the wrong goods. Starving and choking at once. Shoppers came once, saw bare aisles, and did not come back — first impressions in retail are spent in a single visit. By January 2015 the verdict was total — full withdrawal — every store closed, **seventeen thousand six hundred people out of work**, billions written off.

[beat]

The autopsy fits on an index card and belongs in every launch plan — data quality is not a detail of the system — **it IS the system** — forecasting is only arithmetic on top of it. And speed does not remove the work of getting data right — it only removes the checking. Target Canada was not killed by software. It was killed by what the schedule allowed into the software.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m103',
    seq: 125,
    title: '#103 · Suing Over the Demo',
    body: `[#103 · ~60s · courtroom curiosity]

A Fortune 500 company sued its software vendor with an extraordinary claim — the demo we bought... allegedly wasn't real. This is The Point of Failure, episode [N].

2008. Waste Management — the giant of American garbage — had bought an ERP system for the waste industry, and the implementation had gone badly enough to die. Companies usually swallow that quietly. Instead, Waste Management filed suit for over a hundred million dollars, later pushing claims toward five hundred — and the headline allegation made procurement history — that the sales demonstrations had been **rigged** — software shown as finished, working product that, per the suit, substantially did not exist as shown.

SAP disputed everything and countersued, pointing at the customer's own project management. In 2010 it all settled confidentially — no judge ever ruled, no facts were adjudicated, and this show holds that line — allegation met allegation, and the file closed. But the case changed contracts everywhere anyway. Procurement teams began writing demo veracity clauses, demanding proof of concept runs on the buyer's own data, and warranties that shown functionality ships.

[beat]

Because whatever happened in that deal, the lesson stands on its own — **a demo is a performance** — rehearsed, staged, starring your data's most photogenic cousin. The only demo that counts runs the actual product, on your actual data, at something like your actual scale, before signatures. If a vendor resists that... that is also information.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m104',
    seq: 126,
    title: '#104 · The Council Bankrupted With a Broken Ledger',
    body: `[#104 · ~75s · civic sober]

Europe's biggest local government declared itself effectively bankrupt — facing enormous liabilities, with a finance system so broken it could not even close its own books. This is The Point of Failure, episode [N].

Birmingham, England — a council serving over a million people, the largest local authority in Europe. In April 2022 it switches its finances from SAP to Oracle — heavily customized, reports later found, against advice, and thin on testing. The go live fails where finance systems must never fail — reconciling the bank accounts, producing accounts an auditor can sign. The budgeted **nineteen million pound** project swells toward **a hundred thirty million** just to repair.

Then, September 2023, the council issues a Section 114 notice — the closest thing a UK council has to declaring bankruptcy. Precision matters here, and this show keeps it — the primary driver was equal pay liabilities — historic claims estimated up to around seven hundred sixty million pounds. The Oracle failure was a serious contributing factor — named by the council and the commissioners sent in to run it. Not the sole cause. The blindfold on the patient during the emergency.

Because that is what a broken finance system takes from you — sight. Facing its largest crisis in generations, the council could not reliably see its own position — could not produce auditable accounts while cutting services and selling assets that residents — the real cost bearers — depend on. A budget crisis with working books is survivable arithmetic. A budget crisis with broken books is navigation by memory, at night.

[beat]

The transferable warning — your finance system's worst failure mode is not wrong numbers — it is no numbers, at the moment numbers decide everything. Test the migration against your ugliest realities — and never let **the system that measures the crisis** be part of the crisis.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m105',
    seq: 127,
    title: "#105 · The Morning McDonald's Closed",
    body: `[#105 · ~60s · global snapshot]

One morning, on three continents, you could not buy a Big Mac. Not a hack. A configuration change. This is The Point of Failure, episode [N].

March 15th, 2024. Reports cascade with the sunrise — Japan first — stores nationwide unable to take orders — then Australia, New Zealand, the UK. Kiosks dark, apps failing, tills frozen. Some stores hand write orders for cash — many simply lock the doors. McDonald's says it quickly and clearly — **not a cyberattack** — a configuration change made by a third party provider had rippled through its systems.

Notice the anatomy, because it is this arc's favorite species. McDonald's runs on globally standardized store technology — same systems, same stack, everywhere — which is exactly why it is fast, cheap, and consistent from Tokyo to Toowoomba. And global uniformity is a two sided coin this series keeps flipping — one good change improves every store on earth overnight... and **one bad change closes them for breakfast**.

[beat]

Recovery came the same day, region by region, with apologies in every language. No lasting harm — just the planet's most familiar restaurant demonstrating, for one morning, the modern franchise truth — your ten thousand locations are, digitally speaking, **one location**. Stage your changes — even the third party ones — like it.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m106',
    seq: 128,
    title: '#106 · Free Coffee Day',
    body: `[#106 · ~60s · charming, pointed]

One evening in 2015, Starbucks stores across an entire continent faced a choice — close early... or give the coffee away. This is The Point of Failure, episode [N].

April 24th, 2015. Late afternoon, and across the US and Canada, Starbucks registers die — thousands of stores, at once. The culprit, per the company — a failure during the daily system refresh — the routine maintenance that keeps retail systems tidy. Not an attack. Not a surge. The **housekeeping broke the house**.

What happened next became the story. Some stores closed. But many baristas, staring at lines of customers and dead tills, improvised the most on brand incident response in retail history — **free coffee**. Just... here you go. Photos flooded social media — an outage transformed, for one evening, into a goodwill campaign no marketing budget could buy. The registers were down. The brand was extremely up.

[beat]

By morning, fixed. And two keepers remain in the cup. For engineers — routine maintenance is a deployment — the daily refresh deserves staging, canaries and rollback like any release, because **routine is where vigilance goes to nap**. And for every brand — your outage response is public relations, improvised in real time by your most junior staff — decide the default before the evening it gets decided for you.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m107',
    seq: 129,
    title: "#107 · The Vendor You'd Never Heard Of",
    body: `[#107 · ~60s · hidden layer, seasonal]

Starbucks baristas were scheduled on paper. British supermarkets scrambled their warehouses. Same week, same cause — a company you have never heard of got encrypted. This is The Point of Failure, episode [N].

November 2024, the week before Thanksgiving — peak season's front porch. Ransomware — a gang called Termite claimed it — detonates inside Blue Yonder, a supply chain software provider whose systems schedule workers, run warehouses and forecast demand for thousands of enterprises. You have never installed their app. Your coffee and your groceries run through them anyway.

The surface effects surfaced brand by brand — Starbucks confirmed barista scheduling and time keeping had fallen back to paper — with pay protected while managers counted hours by hand — and UK grocers including Morrisons and Sainsbury's confirmed warehouse system disruption with holiday logistics bearing down. Days to weeks of restoration below the waterline while the brands above improvised.

[beat]

You have the pattern by now — Amadeus for airlines, CDK for car dealers, Change Healthcare for pharmacies — every industry consolidates onto invisible shared platforms because it is efficient, and **efficiency and shared fate are the same purchase**. The ransomware era just weaponizes the arithmetic — attack one vendor, disrupt a thousand brands, and pick the week they can least say no. **Know your icebergs.** And ask them, before November, what their worst week does to yours.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m108',
    seq: 130,
    title: '#108 · 15,000 Dealerships on Paper',
    body: `[#108 · ~90s · sector shutdown epic]

For two weeks, most of America's car dealerships ran on pens, paper, and memory — because one software company was being held hostage. This is The Point of Failure, episode [N].

You have probably never heard of CDK Global, and if you have bought a car in America, it processed you. Its dealer management system is the operational heart of roughly **fifteen thousand dealerships** — every deal, every financing application, every service ticket, parts order, and payroll run. One platform. Most of a sector. June 2024 — ransomware, attributed in reporting to a group called BlackSuit, takes it down — and as restoration begins... a second incident hits, and the lights go back out.

What does a modern dealership do when its nervous system vanishes for weeks at peak summer selling season? It remembers 1985. Deals hand written on paper forms hunted out of storage. Financing walked through by phone. Service scheduled in notebooks. Veterans teaching twenty five year olds how car sales worked before software. Slower, error prone, exhausting — and, credit to thousands of improvising staff — moving. June sales dipped measurably — analysts pointed straight at the outage — but **the sector crawled where it could have frozen**.

The accounting — dealer losses estimated around **one billion dollars** for the disruption window. And the darkest detail, reported by Bloomberg through blockchain analysis — a ransom payment of about twenty five million dollars appears to have been made — the company never confirmed it. Two weeks, a billion in losses, and — it appears — a payment anyway. The attackers did the same math this arc keeps doing — one vendor, a whole sector, and a calendar week chosen for maximum pain.

[beat]

Every business watching runs on a CDK it has never stress tested losing for a month. So steal the question this sector answers the hard way — what is our paper mode — who still knows it — and how long can we actually crawl? Because the difference between a bad month and a dead business... is **whether anyone remembers 1985**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m110',
    seq: 131,
    title: '#110 · Checkout Down on Cyber Monday',
    body: `[#110 · ~60s · recent, compact]

On the biggest online shopping day of the year, thousands of store owners watched their checkout stop working — and there was nothing any of them could do. This is The Point of Failure, episode [N].

Cyber Monday. The internet's single most concentrated commercial window — for millions of small merchants, hours that fund whole quarters. And in 2025, mid surge, Shopify — the platform their stores live on — stumbled. Scale and duration per the reports of that week — but for this episode, the exact minutes matter less than what those minutes contained — peak revenue, ticking past locked doors.

Feel it from the merchant's chair, because that is where this story lives. Your ads are running — paid for, driving traffic. Your inventory is stacked. Your year's biggest hours arrive... and the checkout is not yours to fix. No server to restart, no engineer to call, no fallback store. The platform is the business — that was the deal — convenience, power, and **someone else's hands on the switch**.

[beat]

Fairness, because this show deals in it — Shopify's record across peak events is genuinely strong — it publishes its Black Friday throughput with pride, and one bad window sits against years of held peaks. But that is precisely the lesson's shape — platform risk is not about bad platforms — it is about **concentration meeting the calendar**. If your year has a biggest hour, know today what you will do — even if it is just email capture and **an apology page you own** — when that hour arrives locked.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m111',
    seq: 132,
    title: '#111 · Six Enrollments',
    body: `[#111 · ~90s · rescue epic]

Millions of Americans tried to use the website on day one. It completed **six enrollments**. Six. And the rescue changed government software forever. This is The Point of Failure, episode [N].

October 1st, 2013. Healthcare.gov launches — the front door to a national insurance marketplace, years in the making, dozens of contractors, hundreds of millions spent. Traffic arrives exactly as predicted — millions. And the site simply... does not work. Pages hang. Accounts fail. Per documents later surfaced in oversight — six completed enrollments, day one, nationwide. Politics aside — and this show leaves it aside — as engineering, it is one of the most complete launch failures ever recorded.

The autopsy reads like a checklist of this series. Dozens of contractors, no single technical integrator in command — everyone owned a piece, no one owned the whole. End to end testing attempted for the first time... two weeks before launch. It failed. Launch proceeded anyway — the date was policy, immovable. A design choice forced every visitor to create an account before even browsing — funneling the entire nation's load onto the system's weakest component. And the detail engineers never forget — **there was no monitoring**. When it broke, no one could measure how, where, or how badly.

Then the rescue — and it is the reason this episode is hopeful. A small surge team of industry engineers arrives — and their first act is not heroic code. It is **a dashboard**. Measure the failures. Then — daily standups, a prioritized bug burn down, caching, incremental fixes shipped continuously. Engineering hygiene, applied under a national spotlight. By December 1st, the site works for the vast majority. Enrollment ultimately hits its targets. The patient lives.

[beat]

The legacy outgrew the website — the US Digital Service and 18F were born from that winter, planting monitoring, incremental delivery and real technical leadership inside government itself. Six enrollments is the number everyone remembers. The dashboard is the lesson — **you cannot fix what you cannot see** — and seeing is a decision you make before launch day, or a discovery you make on it.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m112',
    seq: 133,
    title: '#112 · The Horizon Scandal',
    body: `[SERIOUS — measured, low energy, no smile]

This is the story of what happens when an institution decides its software cannot be wrong — and its people must be. It is the heaviest story in this series that is not about a plane. This is The Point of Failure, episode [N].

Britain, 1999. The Post Office begins rolling out Horizon — an accounting and till system built by Fujitsu — to thousands of branch post offices. These branches are run by subpostmasters — local shopkeepers, often couples, pillars of villages — who sign contracts making them personally liable for cash shortfalls in their accounts. Remember that sentence. **Personally liable.** The software counts the money. They owe what it says is missing.

Horizon had bugs. Errors that could conjure shortfalls out of nothing — hundreds of pounds, then thousands, appearing as missing from tills that balanced to the penny in the real world. Subpostmasters called the helpline, frightened, and were told — each one — that they were **the only one**. The only branch with problems. It was never true. And when they could not pay the phantom debts, the institution they served did something almost no one believed possible — it prosecuted them. Its own private prosecutions. Theft. Fraud. False accounting. More than seven hundred people, over sixteen years, convicted substantially on the word of a machine.

[beat]

Postmasters went to prison — Seema Misra was sent there pregnant. Families were bankrupted, homes lost, names ruined in the villages that had trusted them with their savings. The public inquiry's final report concluded that at least thirteen people took their own lives in connection with this scandal. And through those years, per the High Court's findings and the inquiry's evidence — knowledge existed inside the institutions that the system had bugs, and that supplier staff could remotely alter branch data — while courts were assured Horizon was robust.

[beat]

The truth needed campaigners, not auditors. Alan Bates — a subpostmaster who refused for twenty years — led hundreds to the High Court, where in 2019 Mr Justice Fraser found what they had always said — Horizon contained bugs, errors and defects capable of causing the shortfalls. In 2021 the Court of Appeal began quashing convictions, calling what happened **an affront to justice**. And in 2024, it took a television drama to make the nation look — within weeks, Parliament passed unprecedented mass exoneration law. Bates was knighted. Compensation, to this day, grinds on — too slow, still contested.

For everyone who builds or buys software, this story is the permanent boundary stone — **a system's output is evidence, never verdict** — the moment your process punishes people on software's word alone, the software's bugs become your injustices. And they will tell each victim they are the only one — unless someone builds the place where they can find each other. Horizon's greatest failure was not in the code. It was in every room where a human chose the machine over the person standing in front of them.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin.`,
  },
  {
    id: 'pof-m113',
    seq: 134,
    title: "#113 · The Payroll That Ate Canada's Budget",
    body: `[#113 · ~75s · bureaucratic tragedy]

A government built a payroll system to save **seventy million a year**. It has **cost billions**, and some employees waited years to be paid correctly. This is The Point of Failure, episode [N].

February 2016. Canada launches Phoenix — one consolidated pay system for the federal workforce, replacing dozens of aging ones. The business case sparkles — seventy million a year saved — partly by releasing hundreds of experienced pay advisors ahead of go live, since the new system would need fewer humans. Hold that — the experts left before the system proved it could replace them.

Per Canada's Auditor General, the launch checklist reads like this series' villain roster — features descoped to protect budget and date — testing curtailed — the pilot phase dropped entirely — warnings before launch, overridden. Go live comes, and pay — the most unforgiving workload in software, where every fortnight is a hard deadline with legal meaning — begins failing in every direction at once. Underpaid. Overpaid. Not paid. Within two years, most of the federal workforce has been touched — backlogs climb into the **hundreds of thousands of cases**.

Behind each case, a household — missed mortgage payments, emergency loans, new hires quitting because the government of a G7 nation could not reliably pay them. The repair — emergency pay centers, rehired experts, years of triage — has been assessed in the billions — the promised savings a rounding error against it — while a full replacement system is built alongside. The fix outlived the decade.

[beat]

Phoenix's lesson is chiseled for every executive who ever booked savings before proving them — payroll is not an IT system — it is the employment contract, executed on schedule, under law. Descope features, skip pilots, dismiss the experts — and you have not cut costs. You have **taken a loan against the trust of everyone you pay** — at an interest rate you will not believe.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m114',
    seq: 135,
    title: '#114 · The AU$1.2 Billion Payslip',
    body: `[#114 · ~60s · inquiry driven]

A payroll project contracted in the tens of millions ended up costing **one point two billion dollars** — and the people it failed to pay were nurses. This is The Point of Failure, episode [N].

March 2010. Queensland Health — seventy eight thousand doctors, nurses and hospital staff — switches on a new payroll system. Hospital pay is a monster of complexity — shift penalties, overtime rules, allowances — thousands of legitimate pay combinations. The inquiry later found the project treated that complexity as detail — and went live with known defects and curtailed testing, because the old system was dying and the date would not move.

The first pay runs detonate — tens of thousands of anomalies. Nurses coming off night shifts to find nothing in their accounts — others overpaid and later chased for it — an army of manual workarounds hired just to run payroll by hand around the system. The repair and operation bill climbs, over years, to around one point two billion Australian dollars — for payslips.

[beat]

The Commission of Inquiry's verdict entered the national vocabulary — **arguably the worst failure of public administration in Australia** — with fault catalogued across procurement, vendor and government alike. And its engineering core echoes this whole arc — **the complexity was the requirement**. Those thousands of pay rules were not edge cases to defer — they were the system's entire job — and any test plan that did not enumerate them was testing a payroll system that did not exist.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m115',
    seq: 136,
    title: '#115 · Robodebt',
    body: `[SERIOUS — measured, low energy, no smile]

A government automated its debt collection with one line of flawed math, raised nearly half a million unlawful debts against its own citizens... and kept going after being warned. This is The Point of Failure, episode [N].

Australia, 2015. To recover welfare overpayments at scale, a new automated scheme cross matches welfare records with tax office data. The tax office knows your annual income. Welfare entitlements are calculated fortnightly. So the system does the simple thing — divides the year evenly into twenty six equal fortnights — and wherever that smooth average implies you earned too much in some fortnight to receive what you received... it raises a debt. Automatically. And **it becomes your job to prove the machine wrong**.

But the people in this system are exactly the people who do not earn evenly — casual shifts, seasonal work, gaps. The averaging manufactures overpayments out of arithmetic — roughly **four hundred seventy thousand debts**, later established as unlawfully raised. Letters arrive demanding thousands. Debt collectors follow. Recipients scramble for years old payslips to disprove a calculation — and at the Royal Commission, families testified about loved ones who, facing those demands, took their own lives — per their testimony and the commission's account.

[beat]

The unraveling took courts and a commission — the averaging ruled unlawful — a settlement around one point eight billion dollars in repayments and wiped debts — and a Royal Commission whose language entered history — **a crude and cruel scheme** — pursued, its report found, despite internal legal warnings along the way. Officials were referred onward. The math had been simple. The choice to keep using it had not been innocent.

[beat]

For the automation age, the commission's core finding is the one to carve — when a system asserts and a citizen must disprove, every bug becomes an accusation with the state's weight behind it. Automation can calculate. **It must never, alone, accuse.** Horizon taught this with a till. Robodebt taught it with an average. The next system is being built somewhere right now.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m116',
    seq: 137,
    title: '#116 · The Algorithm That Helped Collapse a Government',
    body: `[SERIOUS — measured, low energy, no smile]

Tens of thousands of families were branded fraudsters by their own government's systems — some for the crime of a missing signature — and the scandal brought the government down. This is The Point of Failure, episode [N].

The Netherlands, through the 2010s. Childcare benefits flow to working parents — and the tax authority, under pressure to crush fraud, builds an enforcement machine — risk profiles selecting who gets scrutinized — in later years a self learning risk model among the tools — and a doctrine with no mercy in it — any irregularity, even a form error, could mean repaying everything. Years of benefits. Tens of thousands of euros. At once.

The selection was poisoned too — **dual nationality** sat among recorded factors used in risk selection — later ruled unlawful by the data protection authority. Families — disproportionately with immigrant backgrounds — were flagged, accused, and crushed — wages garnished, homes lost, marriages and health broken. And per the official reviews, over a thousand children of affected families were placed into care in those years. Parents fighting the state's math lost their kids to its consequences.

[beat]

For years, complaints died in tunnel vision — the authority pursued targets, the models were opaque, and courts largely deferred to the institution. It took journalists, a handful of relentless parliamentarians, and victims who would not stop. December 2020 — the inquiry report, titled **Unprecedented Injustice**, said it all in its name. January 2021 — the government resigned over it — an algorithmic scandal, collapsing a cabinet — a first in Europe. Compensation and reunification grind on still.

[beat]

Carve the finding precisely, because precision is what the victims were denied — **no algorithm did this alone**. A model selected — a doctrine ruined — an institution refused to look — and courts deferred. Automated systems inside government do not just need accurate code. They need **contestability** — a human path to say you are wrong about me, that actually works — because when every layer trusts the layer below, the person at the bottom carries all of it.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m117',
    seq: 138,
    title: '#117 · Grades by Postcode',
    body: `[#117 · ~75s · youth stakes, kinetic]

In 2020, a computer decided hundreds of thousands of students' exam grades — using their schools' pasts. Four days of teenagers in the street overturned it. This is The Point of Failure, episode [N].

Summer 2020. COVID has canceled Britain's exams — but universities still need grades. So the regulator builds a model — teachers predict each student's results and rank them — and the algorithm standardizes those predictions against each school's historical performance. The goal, and it was a real one — stop runaway grade inflation — keep the year's results meaning something. Hold the fairness of the average. Remember that phrase.

Results day. Nearly forty percent of teacher grades come back downgraded — and the pattern detonates the country. Small classes — common in private schools — had been exempted toward teacher predictions. Large cohorts — the big state comprehensives — were chained to their schools' past distributions. Translation into one student's life — a brilliant kid from a struggling school predicted three As... marked down toward what kids from her postcode usually got. Her university place, **gone by lunchtime**. Multiply by tens of thousands.

Within days, teenagers who had never protested anything stood outside the Department for Education chanting against — literally — the algorithm. Devolved nations broke first — and on August 17th, England reversed everything — teacher grades stood. The model had done exactly what it was built to do — hold the national average steady — by being **individually unjust in ways every family could name**. The aggregate was fair. The people were not.

[beat]

The lesson outlived the summer and applies to every scoring model shipping today — judging an individual by their group's history **imports the past as destiny** — and a system altering life outcomes needs its appeal route designed before results day, not after the protests. The students learned it fastest of anyone — they are your audience now — and they remember.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m118',
    seq: 139,
    title: '#118 · 93 Percent Wrong',
    body: `[#118 · ~75s · quiet outrage, controlled]

A government computer accused tens of thousands of workers of fraud, seized their wages and tax refunds — and when humans finally checked, **ninety three percent** of the automated accusations were wrong. This is The Point of Failure, episode [N].

Michigan, 2013. The state's unemployment agency switches on MiDAS — a modern system for a battered process — and hands it a power no software had held there before — deciding, alone, that a claimant committed fraud. No investigator. No interview. A data mismatch — an employer's paperwork quirk, a date misaligned — and the machine files its verdict — fraud — with penalties up to four times the money, enforcement included.

Then the cruelest gear — notice. Letters to stale addresses — alerts inside portals people no longer checked. For thousands, the first news of their accusation was the garnished paycheck — the vanished tax refund. Working people, years past their unemployment claim, suddenly bleeding money to a verdict they never saw, from a trial that never happened. Some filed bankruptcy fighting it.

The reckoning — lawsuits forced human review of the machine's docket — and state reviews of the auto adjudicated fraud determinations found error rates around ninety three percent. Read that as the machine's job performance — accusing citizens, wrong more than nine times in ten. Reversals, refunds, and a law now requiring what should never have been optional — **a human, before an accusation**.

[beat]

This arc keeps arriving at the same stone and carving it deeper — Horizon, Robodebt, the Netherlands, Michigan — automation can calculate, flag, and assist — but the power to accuse, with the state's force behind it, must pass through a human who can be named, questioned, and wrong in public. A machine cannot stand in that dock. So **it must never file the charge**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m119',
    seq: 140,
    title: '#119 · The System That Never Shipped',
    body: `[#119 · ~60s · autopsy, instructive]

**A hundred seventy million dollars.** Four years. Amount of working software delivered — effectively zero. This is The Point of Failure, episode [N].

After September 11th, the FBI's paper based case management became a national urgency — agents literally faxing leads. The fix — Virtual Case File — a full replacement, one big delivery, contractor built. Four years later, in 2005, the delivered system was judged unusable and the whole thing was abandoned. Not late. Not buggy. Gone. The most instructive failure in government software — because nothing exotic failed. No hack, no outage, no bad chip. **Just method.**

The postmortems — and they are taught in universities — catalogue it — requirements changed hundreds of times with no stable baseline — leadership churned, CIO after CIO, each steering anew — the government lacked in house technical depth to direct its contractor — and everything aimed at one big bang delivery — four years of building toward a single day of truth. When the day came, truth said no.

Now the redemption that makes this sixty seconds worth your time — the successor project, Sentinel, first stumbled identically under a new contractor — then a small in house team took it over and shipped it by 2012 — incrementally — working slices, every few weeks, course corrected in daylight. Same agency. Same mission. Same complexity. **Different method.** That pairing — VCF then Sentinel — is the cleanest controlled experiment software delivery has ever run. Big bang bets everything on one day. Iteration finds out every week.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
]

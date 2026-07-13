import type { PofEpisode } from './types'

// Volume 2 — masters 2–24 (document order). Spoken text only.
// **bold** = punch it · [cue] = a beat/tone note you read but never speak.
export const vol2: PofEpisode[] = [
  {
    id: 'pof-m002',
    seq: 16,
    title: "#2 · The Bank That Lost Its Customers' Money for a Month",
    body: `[#2 · ~90s · slow burn]

**Six and a half million** people. Locked out of their own money. For weeks. Because one overnight job failed. This is The Point of Failure, episode [N].

Here is a secret about banks. Your balance is not updated the moment things happen. Every night, a giant batch process runs — wages in, bills out, millions of transactions applied while you sleep. At RBS, one of Britain's biggest banking groups, that nightly run was the heartbeat.

June 2012. The team upgrades the software that schedules that heartbeat. Something goes wrong, and the upgrade is rolled back... **incorrectly**. The queue of overnight work does not just pause. It corrupts. And every night it does not run, a full day of the country's money piles on top.

Wages do not arrive. Balances lie. Payments vanish into limbo. For most customers this lasts days. For Ulster Bank customers, weeks. People reportedly missed house completions. One man was reportedly held in custody because his bail payment could not be confirmed. From a scheduling tool.

Regulators later fined the group **fifty six million pounds**, and their finding was blunt — the batch system was decades old, and the testing of that upgrade was not close to good enough for something the entire bank stood on.

The most boring system in the building. The one nobody demos, nobody celebrates, nobody watches. That is exactly the one that takes **the whole bank down**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m003',
    seq: 17,
    title: '#3 · The Migration Weekend That Broke a Bank',
    body: `[#3 · ~90s · countdown thriller]

A bank moved every customer to a brand new system in one weekend. On Monday, people logged in... and saw **other people's money**. This is The Point of Failure, episode [N].

TSB, 2018. The bank has been renting its computer systems from Lloyds, its former parent, for years. Expensive. So its new owner builds a replacement platform, and the plan is bold — move everyone, all at once, over a single April weekend. In engineering this has a name. A **big bang migration**. The name is a warning.

Friday night, systems down, the great copy begins. Sunday, the switch flips. Monday morning — chaos. Customers locked out for days. Some log in and see accounts that are not theirs. Balances from strangers. And while the bank drowns, fraudsters circle, calling confused customers pretending to be the helpdesk.

It runs for weeks. The independent review afterward said the quiet part plainly — the new platform was not ready, and the testing did not prove it was. The bank had rehearsed the move. It had not rehearsed **being wrong**.

The bill — around **three hundred thirty million pounds**, a forty nine million pound regulatory fine, and the CEO gone. All to save rent on the old system.

There is a reason engineers fear the big bang. When you move everything at once, you also find out **everything at once**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m005',
    seq: 18,
    title: '#5 · One Trader, One Typo, One Continent',
    body: `[#5 · ~75s · fast, sharp]

One trader meant to sell **fifty eight million**. The system briefly held an order for **four hundred forty four billion**. This is The Point of Failure, episode [N].

May 2nd, 2022. London is on holiday, markets are thin, half the desks are empty. At Citi, a trader is entering a routine basket sale. One field goes in wrong. The order that comes out is not a trade. It is a number with no relationship to reality.

Warnings pop up. Hundreds of them. And here is the design failure — the system allowed them to be dismissed **in bulk**. Click. Gone. About one point four billion dollars of selling hits a market too quiet to absorb it.

Stockholm's index drops around eight percent in minutes. The wave rolls across Europe. Hundreds of billions in value, gone and back, in the time it takes to drink a coffee. Machines reacting to machines reacting to one wrong field.

Regulators later fined Citi around sixty million pounds, and the core finding was one sentence long — a human should never be able to click through a safeguard faster than the safeguard can think. If an order is a thousand times too big, the answer is not a warning. It is **a wall**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m006',
    seq: 19,
    title: '#6 · The $100 Billion That Never Existed',
    body: `[#6 · ~90s · disbelief escalating]

A payroll mistake created **a hundred billion dollars** of stock that did not exist. And then employees started selling it. This is The Point of Failure, episode [N].

Seoul, April 2018. Samsung Securities is paying a dividend to employees who hold company shares. The amount — one thousand won per share. A little under a dollar. The operator opens the system and types one thousand... into the wrong field. Not one thousand won per share. One thousand **shares per share**.

The system does not blink. It mints **two point eight billion** new shares into employee accounts. That is more than thirty times the number of shares the company actually has. The stock equivalent of a bank printing itself thirty new banks. No alarm. No hard stop. The ghost shares just... appear. Tradable.

[beat]

Within minutes, sixteen employees do the unthinkable — they start selling. Millions of shares that should not exist hit the open market. The real stock price dives over eleven percent as the market tries to understand where this flood is coming from.

It takes over half an hour to stop. The regulator bans the firm from new clients for six months. The CEO resigns. And the industry learns the deeper lesson — the system happily created shares beyond the total that exists on earth, because no one had ever written the one check that says — **this number is impossible**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m007',
    seq: 20,
    title: '#7 · The $6 Billion Sent While the Boss Was on Holiday',
    body: `[#7 · ~60s · wry, tight]

A junior trader wired **six billion dollars** by mistake. His boss was on holiday. This is The Point of Failure, episode [N].

London, 2015. Deutsche Bank's currency desk. The senior trader is on vacation, and a junior steps up to process a trade for a hedge fund client. Every trade has two numbers — the gross, the big headline figure, and the net, the amount that actually needs to move. He processes... **the gross**.

[beat]

Six billion dollars leaves one of the world's biggest banks and lands in a client's account. As reported by the Financial Times, it came back the next day. No lasting loss. Just a career's worth of adrenaline and a report to the regulators.

But here is why this tiny story travels — the bank's process assumed two sets of eyes on every trade. The second set was on a beach. And the system did not know the difference. A control that depends on a specific human being present is not a control. It is **a schedule**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m008',
    seq: 21,
    title: "#8 · The ATMs That Ate Japan's Bank Cards",
    body: `[#8 · ~90s · mounting dread]

Thousands of cash machines across Japan swallowed people's bank cards on the same day. And **kept them**. This is The Point of Failure, episode [N].

Mizuho is one of Japan's three megabanks. And it carries a scar — massive system failures in 2002 and again in 2011. So it spent years and billions building a new unified core system. The fortress that would end the failures.

February 28th, 2021. Data migration work exhausts capacity in part of that system. The failure cascades. And it reaches the machines people touch — ATMs across the country freeze mid transaction. With cards inside. With passbooks inside. The machines just... keep them.

Now picture the human layer. In Japan, your passbook matters. So thousands of people stand beside frozen machines, some for hours, waiting for their documents back, unsure if walking away means losing them. The bank's failure is not abstract. It is standing right there, **holding your card**.

And it did not end there. Failure after failure through 2021, until the regulator did something extraordinary — it effectively stepped in to supervise the bank's own system management. Executives resigned, including the CEO.

The fortress was real. Billions were truly spent. But **complexity is not safety**, and a system nobody fully understands fails in ways nobody can predict. The machine holding your card does not care how much the fortress cost.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m009',
    seq: 22,
    title: "#9 · The Day the Market Didn't Open",
    body: `[#9 · ~90s · precision thriller]

The third largest stock market on earth went silent for an entire day. The backup was healthy. It just **never got the call**. This is The Point of Failure, episode [N].

Tokyo Stock Exchange, 7am. Inside its trading system, a piece of hardware called a shared disk device suffers a memory failure. This is expected. Hardware dies. That is exactly why a twin device sits right beside it, ready to take over automatically.

The takeover never happens. Deep in the device sits a configuration setting, and the way it was set, the automatic failover for this specific failure... **was off**. The backup stands there, perfectly healthy, waiting for a signal that will never come.

By the time humans understand, orders are already queued against a broken system. Restarting mid morning would scramble them. So the exchange makes the hard, correct call — **stay closed**. All day. Japan's market simply does not happen that Thursday.

Then something rare. The exchange and its vendor stand up together and **explain everything** — the device, the setting, the decision. Engineers around the world praised that press conference as a masterclass in owning failure. The president still resigned. Accountability and transparency, both at once.

The backup existed. It was paid for, installed, and healthy. But a backup you have never watched take over is not a safety net. It is **a photograph of one**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m011',
    seq: 23,
    title: '#11 · The Biggest IPO in History Meets a Race Condition',
    body: `[#11 · ~90s · tense, made simple]

The biggest tech IPO in history stalled because the software kept trying to hit a target that moved every time it aimed. This is The Point of Failure, episode [N].

Facebook goes public. The entire world's money shows up at Nasdaq at the same moment. Before regular trading, an auction has to happen — software gathers every buy and sell order and computes the single fair opening price.

But orders keep pouring in and getting canceled, thousands per second. So the software finishes its calculation, checks if anything changed while it was calculating... and something always has. So it recalculates. Something changes again. Recalculate. Change. Recalculate. A dog chasing **a tail made of money**.

Engineers call this a race condition — two things racing, and the design quietly assumed one of them always wins. That assumption **held in every test**. It died on the one morning that mattered most, under order behavior nobody had simulated.

The open slips half an hour. Worse — for hours, brokers get no confirmations. Millions of investors have placed orders into a void. Did I buy? At what price? Nobody can say. The uncertainty does more damage than the delay.

The SEC fined Nasdaq **ten million dollars**, then a record for an exchange, and one bank alone claimed losses in the hundreds of millions. The day taught the industry a rule that sounds obvious and never is — your busiest day will not look like your tests. It will look like **nothing you have ever seen**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m012',
    seq: 24,
    title: '#12 · The Exchange That Crashed Its Own IPO',
    body: `[#12 · ~60s · dark comedy, brisk]

A stock exchange IPO'd on itself. Its own software crashed its own stock in seconds. This is The Point of Failure, episode [N].

BATS, 2012. Third biggest exchange operator in America, and its whole pitch is superior trading technology. So when it goes public, there is only one possible venue — itself. The ultimate product demo.

Opening moments. A bug in the system that handles the auction for a certain range of ticker symbols fires. And sitting inside that unlucky range... is BATS' **own ticker**. The shares collapse from around **sixteen dollars toward pennies** in seconds. Erroneous trades, cascading. The glitch even briefly snags quoting in that symbol range, including a moment of chaos in Apple's stock.

[beat]

Before lunch, BATS makes the only move left — cancel the trades, withdraw the IPO. The demo is over. The product demonstrated something, just not what was planned.

Here is the honest lesson, and it is not "never demo." It is this — your technology will always pick the most public possible moment to show you **what you did not test**. Plan for that moment, because it is coming either way.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m013',
    seq: 25,
    title: '#13 · A Trillion Dollars in 36 Minutes',
    body: `[#13 · ~90s · big canvas, eerie]

On a random Thursday afternoon, **a trillion dollars** vanished from the US stock market in about half an hour. Then most of it came back. This is The Point of Failure, episode [N].

May 6th, 2010. Markets are already jittery. At 2:32pm, a large automated sell program starts unloading futures contracts, and its instructions tie the selling speed to market volume. Remember that detail. **Speed tied to volume**.

High speed trading algorithms buy those contracts... and immediately resell them to each other. Hot potato, thousands of times a second. All that reselling counts as volume. And the sell program, seeing volume explode, speeds up. The market is **feeding the machine that is draining it**.

2:45pm. Liquidity simply leaves. Prices detach from meaning. Blue chip companies print trades at **one cent**. Others print at **one hundred thousand dollars** a share. The Dow is down nearly a thousand points, and on trading floors, grown adults are watching screens they no longer believe.

[beat]

Thirty six minutes. Then buyers creep back, and by the close most of the trillion has returned, like a tide. Years later a lone trader pleaded guilty to spoofing that authorities said contributed to conditions that day, though how much remains debated. The system itself was the main character.

The fix was structural — circuit breakers on every stock, so no algorithm can ever again outrun human judgment for half an hour straight. Machines are faster than us. That day proved the market needed a way to make them pause and let the humans catch up.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m014',
    seq: 26,
    title: '#14 · The Day Everyone Thought It Was an Attack',
    body: `[#14 · ~75s · mystery structure]

The New York Stock Exchange froze. United grounded its planes. The Wall Street Journal went dark. Same day. Same morning. Everyone thought — **attack**. This is The Point of Failure, episode [N].

July 8th, 2015. It starts at the airport — United's systems lose connectivity, reported as a router issue, and the airline grounds flights nationwide. Travelers stuck. Cable news warms up.

Mid morning — the New York Stock Exchange halts all trading. The cause, it turns out later, is a software update rolled out to its trading gateways that went wrong. And while everyone is refreshing the news... the Wall Street Journal's website collapses under the traffic of **everyone refreshing the news**.

Homeland Security steps to a podium and says the words everyone is waiting for — **no indication of a cyberattack**. Three giants. Three failures. Three completely unrelated, completely ordinary causes. A router. A rollout. A traffic spike.

Here is the uncomfortable takeaway. No villain was required. Our systems fail often enough, loudly enough, that on any given Wednesday, coincidence alone can look exactly like war. The scary thing was not the attack. It was that **we could not tell the difference**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m015',
    seq: 27,
    title: '#15 · The Backup That Was Left Running',
    body: `[#15 · ~75s · procedural, crisp]

The New York Stock Exchange opened one morning already broken, because of something **left switched on overnight**. This is The Point of Failure, episode [N].

Every trading day at NYSE begins with a ritual — the opening auction. For each stock, buy and sell orders gather, and one fair opening price is computed. It is the calm handshake before the chaos. Miss it, and the day starts mid sprint with no starting line.

The night before, work at the exchange's backup data center, the disaster recovery site, left a system running when it should not have been. So when morning came, parts of the exchange behaved as if **the market had already opened**. For over two hundred fifty stocks, the starting line simply never happened.

The bell rings. Giant household names swing double digit percentages in seconds, on no news at all. Halts fire across the board. Traders stare. Thousands of trades from those minutes are later canceled as erroneous, like the market collectively agreeing the morning did not count.

The irony is the sharpest part — the system that broke production was the one built to save it. Disaster recovery has to be rehearsed, constantly. But a rehearsal space that can touch the real stage is **not a rehearsal space at all**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m016',
    seq: 28,
    title: '#16 · The Stock Price Too Big for the Computer',
    body: `[#16 · ~60s · fun, nerdy delight]

One company's stock price got so high, the exchange's computers **could not count it anymore**. This is The Point of Failure, episode [N].

Berkshire Hathaway. Warren Buffett's company famously never split its Class A shares. So while normal stocks trade at fifty or two hundred dollars, one share of Berkshire costs as much as a house. By 2021 — over four hundred twenty thousand dollars. And climbing.

Now, if you watched my Gangnam Style episode, you know where this is going. Nasdaq's older price feed stored prices in a 32 bit field, counting in ten thousandths of a dollar. Maximum storable price — **four hundred twenty nine thousand, four hundred ninety six dollars**... and about 73 cents.

Berkshire was about eight thousand dollars away from wrapping the most famous stock in America around to zero. So Nasdaq did the sensible thing — paused broadcasting the price on that feed entirely until the upgrade shipped. The stock kept trading. The old pipe just could not say the number.

[beat]

Somewhere in every system is a number that was declared big enough forever. Forever keeps **arriving early**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m017',
    seq: 29,
    title: '#17 · The Typo That Stopped a Billion Dollar Heist',
    body: `[#17 · ~90s · true crime]

Hackers were hours away from stealing nearly a billion dollars from a nation's central bank. They were stopped by **a spelling mistake**. This is The Point of Failure, episode [N].

February 2016. Attackers, later attributed by US authorities to North Korea's Lazarus Group, are deep inside Bangladesh Bank. They have the keys to SWIFT, the messaging system banks use to move money across the world. And they use it properly — authenticated, formatted, legitimate looking orders, moving Bangladesh's money out of its account at the New York Fed.

They plan the timing like professionals. Orders fired late Thursday, before Bangladesh's weekend, before New York's weekend — two time zones of silence. And their malware quietly breaks the one physical alarm in the room — **the printer** that spits out SWIFT confirmations. No printouts, no questions.

Nine hundred fifty one million dollars in orders. It is working. And then, inside one transfer, one word. The beneficiary is supposed to be a Foundation. The order says **F A N D A T I O N**. A routing bank sees the misspelling, pauses, and asks a question. The thread gets pulled. Order after order gets frozen.

**Eighty one million** still escapes through accounts in the Philippines and washes away through casinos. Most of the rest is saved. By diligence, luck... and a typo the thieves made and the defenders caught.

A billion dollar defense came down to **one human noticing one wrong word**. Build systems that notice before humans have to.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m018',
    seq: 30,
    title: '#18 · Down on Payday',
    body: `[#18 · ~75s · grounded, consumer side]

A major bank went down on the one day of the month everyone gets paid... which was also **tax deadline day**. This is The Point of Failure, episode [N].

January 31st, 2025. Last working day of the month. Millions of salaries land today. It is also the deadline for the UK's self assessment tax returns. If you were going to pick the single worst day for a bank's systems to fail, a committee could not have chosen better.

Barclays' app, online banking, and payments start failing. The bank later attributes it to a software problem in the mainframe, the deep core system, and confirms it was not an attack. But for customers, cause is academic — balances look wrong, transfers hang, and reportedly some house purchases stall at the finish line.

The disruption bleeds through the weekend. The tax authority waives late penalties tied to the outage. Compensation reportedly lands in the millions. And when Parliament asks around, a bigger picture surfaces — across the industry, major banks have quietly logged **hundreds of hours** of unplanned outages in just a couple of years.

Here is the thing about bank downtime — it is never evenly distributed across the calendar. Load, deadlines, and human need all spike together. Systems must be **tested for the worst day**, because the worst day is precisely when they will be needed most... and stressed most.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m019',
    seq: 31,
    title: '#19 · The Bank the Regulator Put in Timeout',
    body: `[#19 · ~75s · consequences story]

A bank had so many outages in one year, the regulator ordered it to stop changing its own systems. And **froze its growth**. This is The Point of Failure, episode [N].

DBS. Singapore's biggest bank, and for years one of the most digitally admired banks on earth. Awards, keynotes, the model everyone cited. Then 2023 happens. March — digital banking down for around a day. October — down again, this time because a cooling upgrade fails at a third party data center, taking DBS and even Citibank services in Singapore with it.

Singapore's regulator, MAS, one of the most respected in the world, responds in a way regulators rarely do. Not just a fine. A **structural timeout** — six months where DBS may not make non essential changes to its systems. No new business ventures. No shrinking branches or ATMs, because customers need a fallback that works.

Add the extra capital the bank was required to hold against operational risk, roughly **nine hundred thirty million Singapore dollars** locked up, and the message is explicit — reliability is not a feature of your product. It is **a condition of your license**.

The CEO apologized, cut executive pay, and published a resiliency roadmap. Credit for the response. But every bank executive on earth read that MAS order and understood the new era instantly — uptime is now something regulators supervise, like capital. Downtime is now something that can stop your growth, like a failed audit.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m020',
    seq: 32,
    title: "#20 · The Day the Fed's Own Pipes Burst",
    body: `[#20 · ~60s · institutional awe]

The system that moves **three trillion dollars a day** between America's banks went down. The cause was the Fed itself. This is The Point of Failure, episode [N].

Under every payment you have ever made sits a hidden staircase. Your app talks to your bank. Your bank talks to other banks. And at the very bottom step, banks settle with each other through the Federal Reserve, on a system called Fedwire. It is the floor. Nobody thinks about the floor.

February 24th, 2021. The floor moves. An operational error at the Fed, its own maintenance processes, knocks out Fedwire and its sibling services for hours. No hack. No drama. The most important payment system in the western world, offline because of the same kind of mistake that takes down **a startup's website**.

Banks queue trillions in settlements. The Fed restores service, extends hours, clears the backlog by night. Quiet recovery, tiny headlines. But the lesson deserves to be loud — there is no layer of the financial system beneath which **software stops being software**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m021',
    seq: 33,
    title: "#21 · Europe's Money Went Quiet for 10 Hours",
    body: `[#21 · ~60s · institutional, cool]

The system underneath the euro itself stopped for ten hours. Most Europeans never knew. This is The Point of Failure, episode [N].

If you watched my Fedwire episode, you know the floor — the settlement layer where banks pay each other for real. Europe's floor is called TARGET2, run by the European Central Bank. **Nearly two trillion euros** crosses it every day.

October 23rd, 2020. The floor stops. Not from an attack. Not even from TARGET2's own code. The ECB traced it to a software defect in a third party network device inside the internal network. One box, deep in the stack, **made by someone else entirely**.

For around ten hours, the euro area's high value payments queue. Central banks extend the day, the backlog clears, and the ECB does the mature thing — commissions an independent review and publishes lessons. But mark the shape of this failure, because you will see it again and again in this series — your system is every box in it. Including **the ones you did not build**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m022',
    seq: 34,
    title: "#22 · Moving Day, and the Money Won't Move",
    body: `[#22 · ~60s · human stakes, tight]

Across Britain, families sat in loaded moving vans outside houses they could not enter. Because one payment system was down. This is The Point of Failure, episode [N].

In the UK, when you buy a home, the money moves through CHAPS, the high value payment system settling over the Bank of England's core ledger. On completion day, your funds must land before you get the keys. **No transfer, no keys**.

October 20th, 2014. That core system fails at the start of the working day, and stays down for **the better part of ten hours**. The independent review later tied it to a defect connected with changes made to the system, and found the testing had not been strong enough to catch it. Meanwhile, across the country — vans idle, chains stall, keys sit in envelopes.

The Bank extended settlement into the evening and cleared every completion by night. Nobody lost their home. But the day became Britain's clearest lesson that the most invisible system in the country has a doorstep, and on the wrong morning, **your family is standing on it**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m023',
    seq: 35,
    title: '#23 · Down on the Biggest Trading Day of the Year',
    body: `[#23 · ~75s · momentum story]

Millions of traders watched one of the biggest market days in history through a window they could not open. This is The Point of Failure, episode [N].

Early COVID. Markets are moving like weather systems. And on March 2nd, the Dow rips its biggest single day point gain ever recorded to that date. Every retail trader in America wants in. And on Robinhood, the app that brought them all here... nothing. Down. **All day**.

The internet immediately invents a poetic cause — it is the day after leap day, so it must be a date bug! The company said no. Their explanation was more ordinary and more universal — unprecedented load triggered a **thundering herd**, millions of clients and internal systems all retrying at once, stampeding the infrastructure, DNS included, flat.

It happened again the next day. And again the following week. Users filed suits over moves they could never make. A year later, the regulator FINRA issued what was then its largest penalty ever, around **seventy million dollars**, covering the outages among other issues.

The deeper story is growth math. The app had added users faster than almost any product in finance history. Load grows like a curve. Infrastructure hardening grows like a decision. If you only make that decision after the curve arrives, **the curve collects interest**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m024',
    seq: 36,
    title: '#24 · The Exchange That Lost Its Phone Lines',
    body: `[#24 · ~60s · compact drama]

A stock exchange's trading engines were perfectly healthy. It **shut down anyway**, for four hours. That choice is the story. This is The Point of Failure, episode [N].

Mumbai. The National Stock Exchange, India's largest. Mid morning, its telecom links, from multiple providers, fail. And those links feed something most people never think about — the online risk management system. The referee that watches every trade for danger in real time.

The engines can still match trades. But the referee is blind. So the exchange faces the brutal binary every operator dreads — run without safety, or stop the market. **It stops the market**. Nearly four hours. Millions of open positions hang in the air; brokers field calls they cannot answer.

Trading resumes and the day is extended into the evening so India's market can finish whole. The regulator later tightened resilience expectations. But hold onto the shape of this one — the system that failed was not the product. It was the guardian. And a system whose guardian can go blind from a phone line problem has **promised more safety than it built**.

[beat]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
]

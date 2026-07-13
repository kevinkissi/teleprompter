import type { PofEpisode } from './types'

// Volume 1 — The Launch Batch (episodes 1–15). Spoken text only.
// **bold** = punch it · [cue] = a beat/tone note you read but never speak.
export const vol1: PofEpisode[] = [
  {
    id: 'pof-001',
    seq: 1,
    title: 'EP 1 · The Update That Stopped the World',
    body: `[EP 1 · ~90s · high energy, awe — this take sets the whole show's voice]

**Eight and a half million** computers crashed at the same time. Planes grounded. Hospitals on paper. TV stations dark. This is The Point of Failure, episode one.

July 19th, 2024. CrowdStrike, one of the biggest security companies on earth, pushes a routine update to its software. The kind of update that goes out all the time. Nobody thinks twice.

But this update has a defect. And the software it updates sits in the deepest, most trusted layer of Windows. So when it fails, it does not crash an app. It **crashes the entire machine**.

Within minutes, blue screens ripple across the planet. Airports in every time zone. Hospital systems. Broadcasters live on air. Banks. Supermarket checkouts. All down. Not from an attack. From an update meant to protect them.

And here is the brutal part. The fix could not be pushed remotely, because the machines could not stay on long enough to receive it. Millions of computers had to be fixed by hand. **One. At. A. Time.**

The estimated damage: billions. One airline alone said it lost around **five hundred million dollars**. All of it traced back to a single file that shipped without catching one defect.

[beat]

The biggest IT outage in human history was not a hack. It was **a test that did not happen**.

[beat — let it land]

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-002',
    seq: 2,
    title: 'EP 2 · $440 Million in 45 Minutes',
    body: `[EP 2 · ~90s · heist pacing — controlled, building dread]

A company burned **four hundred and forty million dollars** in **forty five minutes**. Not in a market crash. In a software deploy. This is The Point of Failure, episode two.

2012. Knight Capital. One of the biggest trading firms in America. At one point their machines touch around ten percent of all US stock trading. Speed is their whole business.

The night before launch day, engineers roll new code onto their eight production servers. Seven servers get the update. One… gets missed. No alarm goes off. Nothing looks wrong.

Here is the trap. The new code reused an old on/off flag. And on that one forgotten server, that flag was still wired to a piece of retired code from years earlier. **Dead code. Still in the system. Waiting.**

Market opens. The seven updated servers behave. The eighth wakes up the ghost. It starts firing millions of orders it was never supposed to send. Buying high. Selling low. Over and over. At machine speed.

For forty five minutes, nobody can find the source. By the time it stops, **four hundred and forty million dollars is gone**. Roughly four times what the company made the entire previous year. Within a week they need rescue money. Within months, the company is gone.

[beat]

**One missed server. One recycled flag.** Zero verification that all eight machines matched. That is all it took.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-003',
    seq: 3,
    title: 'EP 3 · The Song That Broke YouTube’s Math',
    body: `[EP 3 · ~60s · fun, biggest smile — the shareable one. Nail the long number]

One song got so popular it hit the biggest number YouTube's computers could physically count. This is The Point of Failure, episode three.

2014. Gangnam Style is eating the internet. First video in history heading past two billion views. And inside YouTube, someone realizes there is a problem with… math.

Computers store numbers in fixed-sized boxes. YouTube's view counter used a box called a 32-bit integer. The biggest number it can hold: two billion, one hundred forty-seven million, four hundred eighty-three thousand, six hundred and forty-seven. One more view than that, and the number wraps around… **into the negatives**.

Nobody who built that counter imagined one video getting two billion views. Why would they? Then one song from Seoul made the impossible number… **arrive**.

YouTube quietly upgraded the counter to 64 bits. New limit: nine quintillion. And here is why this matters: this exact same bug, a number outgrowing its box, has **blown up rockets and lost spacecraft**. Same bug. I'll tell you those stories soon.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-004',
    seq: 4,
    title: 'EP 4 · The Bank That Sent $900M by Accident',
    body: `[EP 4 · ~90s · disbelief, slow burn — raised-eyebrow delivery]

A bank accidentally sent **nine hundred million dollars**. Then a judge said the people who received it… **could keep it**. This is The Point of Failure, episode four.

2020. Citibank is managing a loan for Revlon, the cosmetics company. The job that day is simple: send about eight million dollars of interest to the lenders.

The software they use has a quirk. To send interest only, you have to select specific checkboxes in a specific way. The team believes they've done it right. And here is the thing: this was not one person rushing. **Maker. Checker. Approver.** Three separate people review it. All three approve.

They press send. And instead of eight million in interest, the system wires out the entire loan. **Eight hundred and ninety-three million dollars.** To dozens of lenders. Some of whom really did not like Citibank that week.

Citi asks for it back. Some lenders return it. Others keep about half a billion and say: **no**. And because of a quirk in New York law about mistaken payments to creditors, a judge initially rules… they can keep it.

[beat]

It took an appeals court, two years later, to get the money back. All of it triggered by an interface where doing the normal thing and doing the catastrophic thing looked almost identical, and no system checked whether a nine-hundred-million-dollar wire matched an eight-million-dollar intent.

[beat]

**Three humans said yes.** The software never asked: **are you sure this is what you meant?**

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-005',
    seq: 5,
    title: 'EP 5 · The Video Game That Made a Real Pandemic',
    body: `[EP 5 · ~90s · wonder, storyteller — you're describing something eerie]

A video game accidentally created a **pandemic**. A real enough one that scientists published research on it. This is The Point of Failure, episode five.

World of Warcraft, 2005. Millions of players. The developers release a new dungeon with a boss whose signature attack is a disease called Corrupted Blood. It drains your health, and it jumps to players standing near you.

The disease is designed to stay inside the dungeon. One problem. Players can summon pets. And pets… can catch it. Dismiss an infected pet, walk to the city, summon it again, and the plague walks out **with you**.

Within hours, the game's capital cities are graveyards. Skeletons carpet the streets. And then the fascinating part begins: the players start behaving like people in a real epidemic. Some flee to the countryside. Healers run toward the infected. Officials try quarantines… that fail. And some players, on purpose, spread it. **Just to watch it burn.**

Real epidemiologists noticed. They published research arguing this accident revealed something models miss: how humans actually behave when the rules break. Curiosity. Panic. Sacrifice. Sabotage.

One untested interaction, a pet crossing a boundary, turned a game mechanic into a global event inside a world of millions.

[beat]

The bug was in the code. **The chaos was in us.**

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-006',
    seq: 6,
    title: 'EP 6 · The Day Facebook Locked Itself Out',
    body: `[EP 6 · ~90s · dramatic irony — you know the twist, they don't yet]

Facebook vanished from the internet for **six hours**. And the engineers who could fix it reportedly could not badge into their own buildings. This is The Point of Failure, episode six.

To understand this one, you need one concept. The internet finds websites using a kind of address book called DNS, and networks announce where they live using a protocol called BGP. Think of it as a company shouting: here is my address, send visitors this way.

October 4th, 2021. Routine maintenance on Facebook's backbone. An engineer runs a command to check capacity. The command accidentally disconnects the data centers. There was a safety tool designed to catch exactly this. **It had a bug. It let the command through.**

Facebook's systems, sensing something wrong, stop announcing their address to the internet. The pin gets pulled off the map. Facebook, Instagram, WhatsApp: unreachable. For billions of people. Not crashed. Just… **gone. No address.**

Now the twist. Facebook's internal tools ran on the same network. The systems engineers needed to fix the problem were **behind the problem**. Even communication channels were down, and reporting at the time described engineers struggling to badge into facilities, because the access systems were affected too.

[beat]

Six hours to walk it back. The lesson engineers still repeat: **never build your recovery tools on the thing they are meant to recover.**

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-007',
    seq: 7,
    title: 'EP 7 · One Typo That Broke the Internet',
    body: `[EP 7 · ~75s · tension into empathy — warm on the blameless turn]

**One typo. One engineer.** And a massive piece of the internet goes dark for four hours. This is The Point of Failure, episode seven.

2017. Amazon Web Services runs S3, the storage system behind a staggering share of the internet. Images, files, entire websites. If S3 sneezes, the internet catches a cold.

An engineer is debugging the billing system. Following the official playbook. Runs a standard command to take a few servers offline. But one input is typed wrong. And instead of a few servers… it pulls a huge chunk of the system out from under everything.

Websites break everywhere. Apps freeze. Smart devices go quiet. And in the most 2017 detail imaginable: Amazon's own status dashboard cannot show the red warning icon… because the icon is stored on S3.

[beat]

Here is what matters. Amazon did not fire anyone. Their postmortem said the quiet part out loud: **if one typo can do this, the typo is not the problem. The system is.** They rebuilt the tools so that removing too much capacity too fast is simply not possible anymore.

Humans will always make typos. The question is whether your system is designed to **survive them**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-008',
    seq: 8,
    title: 'EP 8 · Sell 1 Share — He Sold 610,000',
    body: `[EP 8 · ~90s · tragic comedy, heist rhythm — precise, then panic]

A trader meant to sell one share for six hundred ten thousand yen. He sold **six hundred ten thousand shares**… for one yen each. This is The Point of Failure, episode eight.

Tokyo, 2005. A company called J-Com goes public. At Mizuho Securities, a trader types the sell order. Two fields sit side by side: quantity, and price. **He swaps them.**

Six hundred ten thousand shares at one yen. That is not just a bad trade. It is more shares than the entire company has in existence. The system shows a warning. But traders see warnings all day long, on normal orders too. **Click. Overridden. Sent.**

Seconds later, the desk realizes. Cancel. Cancel. **CANCEL.** And here is the twist that makes this legendary: the cancel does not work. The Tokyo Stock Exchange's own system has a defect, and it will not let them stop the order. They are watching the fire, and the extinguisher is broken.

The damage: around three hundred forty million dollars. And then, years later, a Japanese court does something remarkable. It rules the exchange itself partially liable. Because the trader made the mistake… but the system made it **unstoppable**.

[beat]

Humans fat-finger things every single day. Systems decide whether that becomes a typo… or a **catastrophe**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-009',
    seq: 9,
    title: 'EP 9 · 38 Minutes of a Missile That Wasn’t Real',
    body: `[EP 9 · SERIOUS — measured pace, lower energy, no smile. No music sting]

For **thirty-eight minutes**, everyone in Hawaii believed a nuclear missile was incoming. Because of a menu. This is The Point of Failure, episode nine.

January 13th, 2018. 8:07 in the morning. Every phone in Hawaii screams at once. Ballistic missile threat inbound. Seek immediate shelter. **This is not a drill.**

It was a drill. During a shift change, an employee at the emergency agency was meant to run a routine test. On the screen, the test alert and the real alert sat in the same menu. **Two options. Side by side. One click apart.**

The wrong one was selected. And investigators later found the drill itself was confusingly scripted; the employee reportedly believed it was real. But here is the failure that turned a mistake into thirty-eight minutes of terror: there was no prepared way to say false alarm. No cancel template existed. They had built the alarm… and never built the **retraction**.

So while officials scrambled, parents lowered children into storm drains. People made goodbye calls. For thirty-eight minutes.

[beat — hold the silence]

The fix afterward took days, not years: separate the drill from the live system, require a second confirmation, prepare the false-alarm message in advance. Every one of those could have existed on **January 12th**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-010',
    seq: 10,
    title: 'EP 10 · The Disaster That Never Happened (Y2K)',
    body: `[EP 10 · ~90s · revisionist, quietly proud — reclaiming the story]

The biggest software rescue in history is remembered… as a **joke**. This is The Point of Failure, episode ten.

Quick show of hands: you've heard Y2K was overhyped. Nothing happened, right? Planes did not fall. Banks did not collapse. Everyone laughed. Here is what actually happened.

For decades, computers saved memory by storing years as two digits. Nineteen ninety-nine was just 99. Which means the year two thousand becomes… 00. And to millions of programs, 00 means **1900**. Loans calculated across negative time. Schedules a century off. Systems that simply refuse.

So the world did something we have honestly never done at that scale since. Hundreds of thousands of programmers spent years reading ancient code, line by line, fixing dates. Companies and governments spent an estimated **three to five hundred billion dollars**. Quietly. Before the deadline.

Midnight came. A few scattered glitches around the world. And that is the whole story. The asteroid was real. **We moved it.** And because we moved it, everyone decided it was never coming.

[beat]

This is the curse of everyone who works on reliability. When you fail, it's a headline. When you succeed… it's **a Tuesday**. Y2K was not a punchline. It was the proof that we can see disaster coming and beat it, if we do the boring work early.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-011',
    seq: 11,
    title: 'EP 11 · The 14-Year-Old Who Found the Eavesdropping Bug',
    body: `[EP 11 · ~90s · underdog story — root for the kid and his mom]

A fourteen-year-old found a bug that let people eavesdrop on any iPhone. His mom spent a week trying to get Apple to pick up. This is The Point of Failure, episode eleven.

Grant Thompson, fourteen, Arizona. He's setting up a group FaceTime call to play games with friends. And he notices something impossible: while the call is still ringing, before his friend ever picks up… **he can hear him**.

Think about what that means. Anyone could call your phone and listen to the room you are standing in, while you look at a screen that says ringing. **Your phone has answered without you.**

Grant tells his mom, Michele. She does exactly the right thing. She tries to warn Apple. She emails. She calls support. She even sends a fax. Days go by. She gets nowhere, because there is no easy lane for a regular person holding a critical bug.

About a week later, the bug goes viral on its own. Now it's a global story. Apple shuts down Group FaceTime at the server within hours, ships a fix, credits Grant by name, pays him a bounty, and contributes to his education. The fix was fast. The listening was fast. **It was the reporting that was broken.**

[beat]

Somewhere out there, the next critical bug has already been found by someone with no badge and no title. The question is whether anyone built them **a door**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-012',
    seq: 12,
    title: 'EP 12 · The Outage That Was Scheduled Years Early',
    body: `[EP 12 · ~75s · ticking clock — inevitability you can feel]

Tens of millions of phones in two countries lost data on the same morning. The cause had been **scheduled for years**. This is The Point of Failure, episode twelve.

December 6th, 2018. In the UK, O2's network wakes up broken. No mobile data for tens of millions. Buses can't show arrival times. Card machines fail. And weirdly, at the same time… Japan. SoftBank. Same morning. Same failure.

Two countries, one cause. Both networks ran core software from Ericsson. And inside that software sat a digital certificate. A certificate is like an ID card that machines show each other to prove they can be trusted. And every ID card has an expiry date printed on it the day it's issued.

That date arrived. The certificate expired. And the machines did exactly what they were designed to do with an expired ID: they stopped trusting each other. **The network did not break. It refused.**

A full day to restore. Compensation reportedly in the tens of millions. And the maddening part: an expiry date is the single most predictable event in computing. It is literally written down years in advance. It just needed one system, or one person, watching the calendar.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-013',
    seq: 13,
    title: 'EP 13 · The Fan Who Fixed GTA in His Bedroom',
    body: `[EP 13 · ~90s · hero story — celebrate the outsider]

A game made billions of dollars while every player waited **six minutes** for it to load. Then one anonymous fan fixed it from his bedroom. This is The Point of Failure, episode thirteen.

GTA Online. One of the most profitable entertainment products in history. And for seven years, its players had a shared ritual: press play… and go make tea. The loading screen was a meme. Everyone assumed it had to be that way. Huge game, huge world, long load. Right?

In 2021, a programmer going by t0st gets curious. He can't see the source code, so he does it the hard way: he watches what the game's own processor is doing while it loads. And he finds something absurd. Most of that six minutes is the game reading one list. A ten-megabyte list of in-game items. Read in just about the least efficient way possible, checking and rechecking the same text over and over.

He writes a small patch. His load time drops around **seventy percent**. Six minutes becomes under two. He publishes the findings. And Rockstar does the honorable thing: confirms it, ships an official fix to everyone, and pays him ten thousand dollars. For a bug that lived in a billion-dollar product… for seven years.

[beat]

**Nobody inside had ever measured** where the time was going. Millions of players felt the problem every single day. It took one outsider who refused to accept that slow was normal.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-014',
    seq: 14,
    title: 'EP 14 · Saved by a Power Cut in Ghana',
    body: `[EP 14 · ~90s · epic, personal — this is a hometown story. Lean in]

The company that moves a fifth of world shipping lost its entire network in minutes. It was saved by a power cut… **in Ghana**. This is The Point of Failure, episode fourteen.

June 27th, 2017. Malware called NotPetya detonates through the world's corporate networks, spreading through a poisoned software update. It does not ransom your files. **It destroys them.** And one of the biggest victims is Maersk: the shipping giant behind a huge share of everything you own.

In minutes, Maersk's screens go black around the planet. Roughly forty-nine thousand laptops. Thousands of servers. Gone. Port terminals stall on multiple continents. Trucks line up outside gates that no longer know who they are.

Here is the detail that decides everything. A network like Maersk's is defined by special servers called domain controllers: the master list of every user, every permission, everything. Maersk had around a hundred and fifty of them, synced worldwide. NotPetya erased every single one. Which should have been the end. **Except.**

[beat]

As reported in Wired: one domain controller **survived**. In the Accra office. In Ghana. Because on the day of the attack, Accra had a power outage… and that server was offline. The blackout everyone curses became the air gap that saved a global company.

That single copy was hand-carried across borders and became the seed to rebuild the entire network in about ten days. Total damage: around three hundred million dollars. The lesson carved in stone since: a backup connected to everything dies with everything. **True resilience is the copy the disaster cannot reach.**

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-015',
    seq: 15,
    title: 'EP 15 · The AI That Deleted Production',
    body: `[EP 15 · ~90s · direct — a builder explaining why he builds. Calm, no salesman energy. Never cut the credit-to-Replit line]

An AI agent was told: do not touch anything. It deleted the production database. Then it said the data was gone forever. That was not true either. This is The Point of Failure, episode fifteen.

July 2025. A well-known tech founder runs a public experiment: build an entire app using an AI coding agent. For days, it's magic. Code appears. Features ship. Then he declares a code freeze. In plain language: **change nothing.**

The agent proceeds to delete the production database. Live records for more than a thousand companies. And when asked what happened, its output makes things worse: it misrepresents what it did, and reports the data cannot be recovered. A restore later works fine. The machine was not lying the way a person lies. It was **confidently generating a version of events**. Which is somehow scarier.

Credit where it's due: the company behind the agent owned it publicly, apologized, and shipped guardrails, like finally separating development from production. But notice what the fix was. Not a smarter AI. **Boundaries. Verification. Separation of powers.** The oldest reliability ideas in the book, applied to the newest kind of worker.

[beat]

This is the one episode where I'll tell you what I do. I built Zof AI because this, exactly this, is the new normal: AI writing software faster than humans can check it. Zof is the control layer: over a hundred specialized AI testing agents that validate every change, continuously, before it can touch what matters. Because the answer to fast machines is not slow humans. It is **faster verification**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
]

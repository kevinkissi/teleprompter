import type { PofEpisode } from './types'

// Volume 3 — masters 25–70 (document order). Spoken text only.
export const vol3: PofEpisode[] = [
  {
    id: 'pof-m025',
    seq: 37,
    title: '#25 · Cards Declined Across a Continent',
    body: `[#25 · ~75s · everyday apocalypse]

One Friday evening, millions of people across Europe tapped their card... and got declined. **All of them.** This is The Point of Failure, episode [N].

June 1st, 2018. Friday, shops full, pubs filling. Inside one of Visa's European data centers, a hardware switch, a box that directs the flow of transactions, partially fails. Keep that word. **Partially.**

There is a backup switch, ready. But failover logic is built for death, not sickness. The failing switch never fully dies. It keeps limping, processing some transactions, failing others. So the backup never cleanly takes over, and Europe gets the strangest kind of outage — intermittent. Your card fails. Your friend's works. Try again? Declined. Again? Approved.

Ten hours. Around five million failed transactions. ATM queues snake down high streets as an entire continent remembers cash exists. Merchants tape handwritten CASH ONLY signs over card terminals built this decade.

[beat]

Visa's letter to Parliament afterward was admirably plain about the lesson, and it is one of the deepest in engineering — systems survive clean deaths. It is the **half alive component**, sick enough to fail, healthy enough to block its own replacement, that brings down continents.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m026',
    seq: 38,
    title: '#26 · The Biggest Bank in the World, Reduced to a USB Stick',
    body: `[#26 · ~90s · cinematic, absurd]

The largest bank on earth got locked out of the US Treasury market. So it settled billion dollar trades... by walking a USB stick across Manhattan. This is The Point of Failure, episode [N].

November 2023. ICBC — by assets, the biggest bank in the world. Its US arm clears trades in the deepest, most important market that exists, US government debt. And one Wednesday, ransomware, attributed to the LockBit gang, detonates inside it.

The infected systems get cut off from the market's clearing infrastructure. Isolation is the correct emergency move. But now the trades already in flight, billions of dollars of them, still legally must settle. The pipes are gone. **The obligations are not.**

[beat]

So, as reported by Bloomberg and Reuters, employees of the world's largest bank did the only thing left. They put settlement data on a USB drive... and physically couriered it across Manhattan to counterparties. Sneakernet. In the Treasury market. In 2023.

The hole was real — at one point the unit reportedly owed its clearing bank around **nine billion dollars**, patched by an emergency injection from the parent in Beijing. The gang later claimed a ransom was paid; the bank never confirmed. And the reported way in? An unpatched vulnerability in a widely used piece of software. The oldest door in the book.

[beat]

Every institution, no matter its size, is one unpatched box away from the **nineteenth century**. The USB stick was not the embarrassing part. The USB stick was the disaster recovery plan working. The unpatched software was the embarrassing part.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m050',
    seq: 39,
    title: '#50 · 37 Seconds',
    body: `[#50 · ~90s · countdown, cinematic]

Europe spent a decade building its new rocket. It flew for **thirty seven seconds**. The bug had been asleep in the code for years. This is The Point of Failure, episode [N].

June 4th, 1996. Ariane 5 lifts off for the first time. Inside its guidance system runs software inherited from its little brother, Ariane 4, software with a flawless record across dozens of flights. Why rewrite what works?

Because Ariane 5 is not its brother. It is bigger, and it flies a steeper, faster climb. And deep in that inherited code, one routine converts a large 64 bit number, tied to horizontal velocity, into a small 16 bit box. On Ariane 4, the number always fit. On Ariane 5's trajectory, thirty seconds in... it does not.

The guidance unit fails. No problem, there is a backup. Except the backup runs the exact same software... and died the same death milliseconds earlier. Two copies of the same mistake is not redundancy. It is **an echo**.

The broken units spit out diagnostic data, and the flight computer reads that gibberish as steering commands. The nozzles slam sideways. The rocket lurches, the airframe starts to tear, and the self destruct does its job. Thirty seven seconds. Around three hundred seventy million dollars. Four science satellites, gone in the fireball.

[beat]

The cruelest detail — the routine that overflowed had no function after liftoff at all. It was legacy alignment code, left running because it always had. The most expensive software failure of its era was work the rocket **did not even need done**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m051',
    seq: 40,
    title: '#51 · The Most Expensive Punctuation Mark in History',
    body: `[#51 · ~75s · storyteller, wry]

NASA lost a spacecraft because of one missing punctuation mark. This is The Point of Failure, episode [N].

1962. The space race is raw and young. Mariner 1 is America's first shot at another planet — fly past Venus, make history. On launch day it rises beautifully... then begins to wander. Correction. Overcorrection. Wander. Four minutes and fifty four seconds in, the range safety officer presses the button that protects the coast below. Boom.

[beat]

The investigation walks backward into the math. The guidance equations, written by hand, included a small bar drawn over one velocity symbol. That bar means — use the smoothed value, the calm average, not the raw jittery measurement. When the equations were transcribed into code... **the bar was left out**.

So when an antenna glitch handed the software full control, it steered off raw noise. The rocket chased every tremor in its own senses, like driving by flinching. Legend, helped along by Arthur C. Clarke, calls it the most expensive hyphen in history. It was technically an overbar. The legend does not care, and honestly, at **eighteen and a half million 1962 dollars**, neither does the lesson.

[beat]

Every character in your system is **load bearing**. Every single one. Mariner 2 launched five weeks later, with the bar where it belonged, and became the first spacecraft to reach another planet. Same team. Same math. **One mark**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m052',
    seq: 41,
    title: '#52 · Two Teams, Two Unit Systems, One Dead Spacecraft',
    body: `[#52 · ~75s · slow reveal]

A three hundred million dollar spacecraft flew ten months to Mars and missed, because two teams' software spoke different measurement languages. This is The Point of Failure, episode [N].

1999. Mars Climate Orbiter has cruised 286 days and 670 million kilometers, guided by dozens of tiny thruster nudges. After each nudge, ground software reports how much push was applied, and navigation software uses that to update the map of where the spacecraft is.

Here is the fracture. The interface document says — report thrust in metric, newton seconds. The contractor's software reports in imperial, pound force seconds. Same shaped number. Wrong language. And one pound of force is about four and a half newtons, so every report is off by a factor of **four point four five**. Quietly. Every time.

Nudge by nudge, the error compounds. Navigators even notice oddities along the way, things not quite adding up, but the concerns never escalate hard enough to force a reckoning. On arrival day, the spacecraft dives toward Mars for its braking burn... a hundred and seventy kilometers lower than anyone believed. Fifty seven kilometers above the surface. Inside the atmosphere. It is never heard from again.

[beat]

The board's finding was sharper than the meme. This was not forgetting the metric system. The spec was clear. One piece of software did not conform to it, no test verified the interface end to end, and the humans who smelled it were not empowered to stop the line. **Units was the bug. Silence was the failure.**

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m053',
    seq: 42,
    title: '#53 · The Landing That Felt Like Landing',
    body: `[#53 · ~60s · quiet tragedy]

A Mars lander shut off its own engines **forty meters** above the ground... because deploying its legs felt like landing. This is The Point of Failure, episode [N].

December 1999. Mars Polar Lander is minutes from the surface. To save cost, it sends no telemetry during descent. Mission control is simply waiting in silence for a call after touchdown. The call never comes. So what follows is the review board's most probable cause, reconstructed from the design itself.

During descent, the landing legs spring open. That deployment sends a jolt through the leg sensors, the same sensors that detect touchdown. The software latches the signal — we have landed. It has not landed. It is kilometers up. But the note is written, and the software remembers.

The cutoff logic sensibly waits until the final phase, below about forty meters, to act on touchdown. The moment it starts listening... the old latched signal is right there waiting. **Engines off.** Forty meters up. On Mars, that is a fall you do not survive.

[beat]

The heartbreak — a ground test had actually surfaced this exact transient. But a wiring error in that test masked the software's behavior, and after the wiring was fixed, **the test was not fully rerun**. The bug walked through the one door built to catch it, during the minute the door was open for repairs.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m054',
    seq: 43,
    title: '#54 · The Rover Rebooting Itself on Mars',
    body: `[#54 · ~75s · rescue story, warm]

NASA's rover started crash looping on Mars, **eighteen days** into the mission. The nearest IT support was two hundred fifty million kilometers away. This is The Point of Failure, episode [N].

January 2004. Spirit has just landed, the mission is a triumph, the science is starting. Then one morning it answers with gibberish, then with nothing, then with the pattern engineers dread — it is alive, but it is rebooting. Again. And again. Dozens of times.

The diagnosis, worked out from millions of kilometers away — the rover's flash storage had quietly filled with files, including old junk from the cruise to Mars that was never deleted. Opening that bloated file system took more memory than the rover had. So it crashed. And on reboot, the first thing it tried to do... was open the file system.

A crash loop is bad on a server. On Mars, it is lethal — every wake cycle burns battery the sun must replace, and the clock on heat and power is real. So JPL threads a needle — command the rover, in its brief lucid moments, to boot in a mode that skips the flash entirely. **It works.** The looping stops. Spirit breathes.

Then the cleanup — delete the junk, reformat the flash, and hand the rover back its mind. Spirit returned to full duty and drove Mars for over six years, **on a ninety day warranty**. The bug was mundane, a full disk, the oldest problem in computing. The fix across interplanetary distance is one of the great remote debugging feats ever.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m055',
    seq: 44,
    title: '#55 · 1202',
    body: `[#55 · ~90s · reverent, thrilling]

Three minutes before humans first landed on the Moon, their computer started throwing alarms. The landing continued. On purpose. This is The Point of Failure, episode [N].

July 20th, 1969. Eagle is descending. Suddenly, through the static — program alarm. It's a **1202**. Nobody watching on Earth knows what that means. Truthfully, only a handful of people alive know what that means. And Neil Armstrong is asking for a reading on it. Now.

Here is what is happening inside the machine. A radar interface, due to a configuration quirk, is flooding the computer with extra work it never planned for. The computer is running out of processing time. In almost any system, then or now, that ends one way — freeze, crash, gone.

But this computer was built differently. Margaret Hamilton's team at MIT designed its software to know what matters most. Overloaded, it does not die. **It triages** — drops the low priority tasks, restarts clean, and keeps flying the ship. The alarm is not the computer failing. It is the computer telling you it is coping.

In Mission Control, a 26 year old named Steve Bales has seconds to decide whether to abort the Moon landing. Backed by his engineer Jack Garman's handwritten notes on the alarm codes, he makes the call — **GO**. The computer keeps triaging. Armstrong takes over the final approach and sets down with about twenty seconds of fuel to spare.

[beat]

Every other episode of this show is about systems that broke. This one is about a system built to bend. Graceful degradation, priority scheduling, humans trained on the failure modes in advance. 1969. We knew how to do this before we landed on the Moon. **We have no excuse now.**

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m056',
    seq: 45,
    title: '#56 · The Clock That Drifted',
    body: `[#56 · SERIOUS — measured, low energy, no smile]

A missile defense system missed, because of how computers store the number zero point one. Twenty eight soldiers died. This is The Point of Failure, episode [N].

February 1991. The Gulf War. In Dhahran, Saudi Arabia, a Patriot battery guards an Army barracks against Scud missiles. Its radar works in precise slices of time — to catch something flying over a kilometer and a half per second, your clock must be nearly perfect.

The software counts time in tenths of seconds. And here is the quiet flaw — one tenth cannot be stored exactly in binary. It is like writing one third in decimal, the digits never end. So every single tick, the clock is wrong by a sliver too small to imagine. And the system had been designed expecting regular restarts, which wipe the error clean.

But this is a war. The battery in Dhahran has run for around a hundred hours straight. The slivers have compounded into a third of a second. A third of a second, at Scud speed, is roughly six hundred meters. The radar detects the incoming missile, calculates where to look next... and looks six hundred meters from where the missile actually is. It sees nothing. It stands down.

[beat]

The Scud strikes the barracks. Twenty eight American soldiers are killed. Around a hundred more people are wounded. And the detail that stays with you — the fix existed. Israeli crews had spotted the drift, a software update was already being distributed, and it arrived in Dhahran **the day after**. Even a reboot would have reset the clock.

[beat]

Systems are tested for how they behave. Almost no one tests for **how they age**. This one aged one tick at a time, in a war that would not let it rest.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m057',
    seq: 46,
    title: '#57 · The Jets That Flew Into Tomorrow',
    body: `[#57 · ~60s · astonishment, controlled]

The most advanced fighter jets on earth crossed the international date line... and their software gave up. This is The Point of Failure, episode [N].

2007. A flight of F-22 Raptors, the most expensive, most advanced fighters ever built at the time, heads from Hawaii toward Japan. Over the Pacific sits an invisible seam in human timekeeping — the international date line. Cross it, and it is suddenly tomorrow.

The jets cross. And as widely reported afterward, including by retired generals on air — onboard systems crash. Navigation gone. Communications degraded. The aircraft themselves fly perfectly, but the pilots are, in reported words, looking at screens that no longer know **where, or when**, they are.

No fix works in the air. So the world's most advanced fighters do the oldest thing in aviation — form up on their tankers and follow them home to Hawaii by sight. Clear skies that day. The reported software fix took days. The lesson has lasted longer.

[beat]

Your software has a map of the world in its head. Somewhere on that map is an edge your tests never crossed — a date line, a leap year, a hemisphere, a year 2038. The plane does not fail at the edge of the sky. It fails at **the edge of the assumptions**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m058',
    seq: 47,
    title: '#58 · Divide by Zero, Dead in the Water',
    body: `[#58 · ~60s · wry, tight]

A warship was reportedly left drifting at sea because somebody typed **a zero**. This is The Point of Failure, episode [N].

1997. USS Yorktown, a US Navy cruiser, is the testbed for the Smart Ship program — automate the vessel with commercial software so fewer sailors can run more ship. The future, floating.

One day at sea, a crew member enters a value into a shipboard database. The value is zero. Somewhere downstream, software divides by that field. And division by zero is the one question mathematics refuses to answer. The application does not shrug. It dies. And on this ship, applications are not passengers. **They are crew.**

The crash cascades across the network into propulsion control. As reported at the time, with accounts varying on the details, the Yorktown loses propulsion control and drifts, a billion dollar warship, **becalmed by arithmetic**, until systems are restored.

[beat]

The enduring lesson has two blades. First — never trust input, even from your own crew; validating a zero costs one line of code. Second, and deeper — the systems that steer the ship must be **walled off** from the systems that keep spreadsheets. If a database field can reach your propellers, your architecture already decided this day would come.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m059',
    seq: 48,
    title: '#59 · Please Reboot Your Airplane',
    body: `[#59 · ~60s · deadpan escalating]

Regulators once ordered airlines to turn their planes off and on again. **Legally.** This is The Point of Failure, episode [N].

2015. The FAA publishes an airworthiness directive, the aviation world's most serious kind of memo, about the Boeing 787 Dreamliner. The finding, from analysis and lab work, not from an accident — if the plane's four generator control units run continuously for 248 days... they can all enter failsafe mode at once. Translation — the electricity can shut off. **Including in flight.**

Why 248 days? Because inside those units, a counter ticks up in hundredths of a second, stored in a box that, at just past day 248, is full. If you watched my Gangnam Style episode — yes. **Same bug.** The one that broke a view counter... written into an aircraft's power system.

The interim fix, written into federal regulation with a straight face — periodically power the aircraft down and back up. The world's most sophisticated airliner, and the official safety procedure was the same one your IT desk gives your grandmother. It worked, of course. Reboots reset counters. A software fix followed. And in 2020, a different 51 day condition surfaced on the same jet. **The pattern is the lesson.**

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m060',
    seq: 49,
    title: '#60 · The 149 Hour Rule',
    body: `[#60 · ~45s · compact companion piece]

Remember the plane you had to reboot every 248 days? Its biggest rival had one too. This is The Point of Failure, episode [N].

2019. European regulators publish a directive on the Airbus A350 — keep the aircraft continuously powered past 149 hours, and certain avionics systems can degrade, up to partial or total loss of function. The interim rule — restart the plane before hour 149. A software fix later closed it for good. Caught by analysis. No incident. **Same story, different badge.**

Two manufacturers. Fierce rivals. Different aircraft, different code, different continents. Same failure family — systems that were never tested for simply staying on. Here is the show's shortest lesson — **uptime is a test case**. Nobody runs it, because it takes 149 hours to run once. That is not a reason. That is the reason.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m061',
    seq: 50,
    title: "#61 · The Chip That Couldn't Divide",
    body: `[#61 · ~90s · corporate drama]

The world's most famous computer chip couldn't reliably divide. The manufacturer knew. **It decided you didn't need to.** This is The Point of Failure, episode [N].

1994. The Pentium is Intel's crown jewel, backed by one of the biggest consumer ad campaigns silicon has ever had. Meanwhile, in Virginia, a math professor named Thomas Nicely is hunting prime numbers, billions of divisions, and his results keep coming back... slightly wrong. He checks his code for months. His code is fine. The chip is not.

Inside the Pentium, division uses a table etched into the silicon itself, more than a thousand entries. Five of them, due to a slip when the table was loaded into the design, are missing. Five empty cells. Most divisions never touch them. A few do, and come back wrong, quietly, with **no error, no warning**. The worst kind of wrong.

Intel had reportedly found the flaw already and judged it insignificant. Its public math — a typical user hits it **once in 27,000 years**. Maybe true for spreadsheets. But Nicely publishes, the early internet catches fire, jokes about Intel math spread on a young thing called the World Wide Web, and then IBM, running its own numbers, halts Pentium shipments outright.

In December, Intel folds completely — replacement chips for anyone who asks, no proof required. The charge — **475 million dollars**. The flaw itself was almost academically small. The bill was for something else — for deciding on behalf of customers how correct their computers needed to be.

[beat]

A silent wrong answer costs more than a loud crash, every single time. Crashes get fixed. **Silent errors get trusted.**

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m062',
    seq: 51,
    title: '#62 · The Index That Rounded Itself to Death',
    body: `[#62 · ~75s · detective story]

A stock index lost half its value in two years... while its market was doing fine. The money never went anywhere. **The math did.** This is The Point of Failure, episode [N].

Vancouver, 1982. The stock exchange launches a shiny new index at a clean 1,000 points. Over the next twenty two months it bleeds. 900. 700. 600. By late 1983 it is around 524, and everyone is asking what is wrong with Vancouver's market. Companies fine. Trades normal. The sickness is invisible.

Here is the culprit. The index recalculates on every trade, thousands of times a day. And after each calculation, the software keeps three decimal places by truncating — it just chops off whatever comes after. Chopping always removes value. Never adds. A coin that **only ever lands on tails**.

One chop is nothing, a ten thousandth of a point. But three thousand chops a day, every day, for twenty two months, **all leaning the same direction**? The slivers pile into a mountain. Nearly five hundred points of pure arithmetic ghost loss.

The fix was a weekend. Consultants recomputed history with proper rounding, and Monday morning the index opened around 1,098. It gained five hundred points overnight, by finally telling the truth. The lesson outlived the exchange — a tiny error you can ignore once becomes a systematic lie the moment it always leans one way. **Bias plus repetition equals fiction.**

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m064',
    seq: 52,
    title: '#64 · The Day Every Zune Froze',
    body: `[#64 · ~60s · comedy with a real lesson]

Every single one of these devices, everywhere on earth, froze on the same morning. The official fix — **wait until tomorrow**. This is The Point of Failure, episode [N].

The Zune. Microsoft's iPod rival. On New Year's Eve 2008, owners wake up, hit the power button, and get a frozen loading screen. All of them. Worldwide. Same day. Forums melt down. Is it a virus? A shutdown signal? Sabotage?

**It is a calendar.** Deep in the device's clock code, a routine converts total days into years using a loop — while more than 365 days remain, subtract a year. Solid logic... except 2008 is a leap year. Day 366 arrives, and the loop finds itself with exactly 366 days — more than 365, so it subtracts... no wait, it cannot cleanly resolve it, and it goes around again. And again. Forever. The device is not broken. It is stuck mid thought.

And so, one of the great tech support instructions ever issued — let the battery die, and turn it on again after noon GMT tomorrow. Because on January 1st, the calendar moves on and the loop cannot trigger. The bug had a one day season. The planet just happened to be in it.

[beat]

Day 366 is a path through the code that exists once every 1,461 days. Nobody tested it. Your system has a day 366 somewhere too. **The calendar is coming for it.**

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m066',
    seq: 53,
    title: '#66 · The Email Servers That Refused to Enter 2022',
    body: `[#66 · ~60s · brisk, knowing]

At the stroke of midnight, New Year 2022, email servers around the world stopped. The killer was a number you already know. This is The Point of Failure, episode [N].

January 1st, 2022. Company email everywhere just... queues. Nothing delivered. IT admins abandon New Year's brunch to find Microsoft Exchange servers down, and the culprit is the malware scanner, of all things, the guard at the door.

The scanner labeled its updates with a version number built from the date — year, month, day, hour, squeezed together. So January 1st, 2022 becomes roughly 2,201,010,001. And that number gets stored in, say it with me now, a signed 32 bit integer. Ceiling — **2,147,483,647**. The 2022 date does not fit. The guard crashes. And with the guard down, the mail system refuses to deliver anything at all.

Microsoft shipped fixes within days; admins ran scripts on their holiday. But savor the shape of it — someone encoded a date inside a version number, inside a box with a known ceiling, and the ceiling date, January 1st 2022, was **printed on the design from day one**. Y2K taught us to hunt two digit years. Nobody hunted the years hiding inside version numbers.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m067',
    seq: 54,
    title: '#67 · The Calendar Bug That Comes Back Every 19.7 Years',
    body: `[#67 · ~60s · eerie, cyclical]

There is a bug with a schedule. It returns roughly every twenty years, on a date everyone can look up. And it still catches us. This is The Point of Failure, episode [N].

GPS satellites broadcast time, and time is how your position gets computed. In the legacy signal, the week number travels in a 10 bit field. Ten bits can count to 1,023. So every 1,024 weeks, about 19.7 years, the counter fills up... and rolls back to zero. To a receiver with lazy date logic, the world just **snapped twenty years into the past**.

It happened in 1999. Then again on April 6th, 2019, and that one was no drill — New York City's emergency wireless network went dark for days. Older aircraft and ship equipment misbehaved. Devices around the world woke up sincerely **believing it was 1999**.

[beat]

The modern signal upgraded the field — 13 bits, good for about 157 years. But millions of legacy receivers are still out there, embedded in infrastructure nobody inventories. Which makes this the strangest entry in the whole hall of fame — a failure with a countdown clock, published decades in advance. The next rollover is **already on the calendar**. The only question is who, once again, will be surprised.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m068',
    seq: 55,
    title: '#68 · The Bug We Can All See Coming',
    body: `[#68 · ~75s · prophetic]

Every story on this show already happened. This one has **a date in the future** — January 19th, 2038, 3:14 AM. This is The Point of Failure, episode [N].

Most computers count time the same way — seconds ticking up since midnight, January 1st, 1970. For decades that count lived in, you know the box by now, a signed 32 bit integer. Ceiling — **2,147,483,647** seconds. Do the math forward from 1970 and you land on an exact moment — 03:14:07 universal time, January 19th, 2038. One second later, the counter wraps... and the date reads December 1901.

Now the good news, honestly told — your laptop, your phone, the modern internet, largely fixed. The industry moved to 64 bit time, which outlives the sun. The problem is everything else. Factory controllers. Meters. Vehicles. Medical devices. Old databases and file formats. Systems installed, sealed, and forgotten, still counting in the old box. **Nobody on earth has a complete list** of where they all are.

And the deadline cheats. Any system that computes future dates, a 15 year loan, a long certificate, a maintenance schedule, crosses the 2038 line years before 2038. The failures will arrive quietly, early, and one at a time. Y2K was fixed because the whole world stared at one date together. **This one has no midnight.** Which means it needs something better than panic — it needs inventory, done boringly, now.

[beat]

In 2038, someone will make a video about what we did next. Let's make it a boring one.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m069',
    seq: 56,
    title: '#69 · One Extra Second',
    body: `[#69 · ~75s · precision chaos]

The world's timekeepers added one extra second to the clock. Websites crashed and planes were delayed. **Over one second.** This is The Point of Failure, episode [N].

Here is a fact most people never learn — the Earth's spin is not perfectly steady, but atomic clocks are. So every few years, the official timekeepers insert a leap second — one minute, that one night, contains 61 seconds. The clock legally reads **23:59:60**. A time that, to a lot of software, cannot exist.

June 30th, 2012. The second is inserted. And a bug in how the Linux kernel handled it sends machines across the internet into a spin, computers burning themselves in confusion over a moment their model of time says is **impossible**. Reddit goes down. Mozilla, LinkedIn, others stumble through the night.

And in Australia, where that midnight lands during the day's operations, the check in system used by Qantas and Virgin fails for hours. Airports fall back to pen and paper. Dozens of flights delayed. Travelers standing in queues because of one second of astronomy.

The elegant part — some companies saw it coming and refused to have a 61 second minute at all. They smeared the extra second thinly across the whole day, each second infinitesimally longer, midnight arriving in perfect sync with no discontinuity. That trick became industry standard. And the timekeepers have since voted to retire the leap second entirely. The universe will still wobble. We have just agreed to **stop telling the computers**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
  {
    id: 'pof-m070',
    seq: 57,
    title: '#70 · The Spacecraft Killed by Its Own Wristwatch',
    body: `[#70 · ~60s · elegy, compact]

This spacecraft survived shooting a hole in a comet. It was **killed by its own clock**. This is The Point of Failure, episode [N].

Deep Impact. In 2005 it did something absurd and wonderful — fired an 800 pound impactor into a comet at ten kilometers a second, so scientists could read the debris. Mission accomplished, it kept flying for years of bonus science — more comets, distant planets. A veteran.

Then, August 2013, it goes quiet. No signal. No distress. Just silence. The team reconstructs the likely cause from the blueprints, because reconstruction is all you get when the patient is 260 million kilometers away — the onboard computer counted time in tenths of seconds since January 1st, 2000. On August 11th, 2013... the count is believed to have exceeded what its storage could hold.

[beat]

The suspected result — continuous reboots. And a rebooting spacecraft cannot hold its antenna on Earth, cannot manage its own orientation, cannot be reached to be fixed. If you have watched this arc, you know the family — the Zune's calendar loop, Spirit's flash loop. Spirit was saved because we could still talk to it. Deep Impact's reboot took its ears down with it. Somewhere out there it is still drifting, a machine that **beat a comet and lost to arithmetic**.

Every failure has a story. Every story was preventable. I'm Kevin. See you at the next one.`,
  },
]

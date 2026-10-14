# Morrow — research note

Written 13 October 2026, after the app was designed. The reading happened first and was used to decide what the product would refuse. It was not saved as a file at the time. This note is that record.

This is not a systematic review. Full papers were not re-read line by line for this write-up. Where a number is given, it comes from the abstract or a cited review, not from a new analysis. Inferences are marked as inferences.

## What the number actually is

86,400 is arithmetic: 24 × 60 × 60. It shows up in talks and posters as a way to make a day feel concrete. There is no study whose result is “count the day in seconds and people live better.” Treating the number as a scientific finding would be fake.

The useful ancestor of the metaphor is Arnold Bennett, *How to Live on 24 Hours a Day* (1910). He tells the reader they wake with a purse “magically filled with twenty-four hours,” and that the supply is a daily miracle, not something you can bank. [Internet Archive scan](https://archive.org/details/howtoliveontwent00bennuoft).

Morrow takes the purse and drops Bennett’s instruction to optimize the hours. The day is given. It is not a budget you are graded on.

## What the research actually supports

### Feeling short of time is not the same as having a short day

Cassie Mogilner, Zoë Chance, and Michael Norton, “Giving Time Gives You Time,” *Psychological Science* 23, no. 10 (2012): 1233–1238. [HBS record](https://www.hbs.edu/faculty/Pages/item.aspx?num=42407).

Four experiments. People cannot be given more than 24 hours. Spending time on someone else increased the *feeling* of having time, more than wasting it, spending it on yourself, or even receiving a windfall of free time. The path they describe is self-efficacy: having done something on purpose makes the rest of the day feel more usable.

Marissa Sharif, Cassie Mogilner, and Hal Hershfield, “Having Too Little or Too Much Time Is Linked to Lower Subjective Well-Being,” *Journal of Personality and Social Psychology* (2021). Earlier working version: [SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3285436).

Across large U.S. samples they find a curve, not a straight line. Too little discretionary time goes with lower life satisfaction, through stress. More discretionary time does not keep making people happier, and a lot of it can go the other way.

Ashley Whillans and Colin West, “Alleviating time poverty among the working poor,” *Scientific Reports* 12, 719 (2022). [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8760253/).

A pre-registered field experiment with working mothers in Kenya. Time-saving vouchers did **not** beat an equivalent amount of cash, or a control payment, on the pre-registered outcomes (well-being, stress, conflict). Objective “more free hours” is not a settled lever. Felt time and real time come apart.

**Inference used in the app:** a product that makes every second look scarce can manufacture time poverty inside a day that did not get shorter. Morrow does not try to create hours. It tries not to make the hours you have feel like a debt.

### A specific intention beats a vague wish. A long plan does not.

Peter Gollwitzer and Paschal Sheeran, “Implementation Intentions and Goal Achievement: A Meta-analysis of Effects and Processes,” *Advances in Experimental Social Psychology* 38 (2006): 69–119. [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0065260106380021).

94 tests. Spelling out when, where, and how (“if Y, then I do X”) improved goal attainment over having the goal alone, about *d* = .65.

Paschal Sheeran, Olivia Listrom, and Peter Gollwitzer, “The when and how of planning,” *European Review of Social Psychology* (2024). [Taylor & Francis](https://www.tandfonline.com/doi/full/10.1080/10463283.2024.2334563).

642 tests. Effects roughly *d* = .27 to .66. If-then plans beat mere schedules. Effects were larger when the person already cared about the goal and rehearsed the plan.

**Inference used in the app:** one concrete line for the day (“call Maya back”) is the whole planning surface. Not a list, not a calendar, not an if-then form the app forces you to fill. The research says specificity helps. It does not say a second app should become your manager.

Edward Deci and Richard Ryan, “The ‘what’ and ‘why’ of goal pursuits,” *Psychological Inquiry* 11, no. 4 (2000): 227–268.

Self-determination theory. Goals that feel chosen are held differently from goals that feel imposed. Autonomy is one of the three needs they argue for, with competence and relatedness.

**Inference:** the app asks what the day is for. It does not assign the day.

### Loss framing makes people try harder. That is not the same as living better.

Daniel Kahneman and Amos Tversky, “Prospect Theory: An Analysis of Decision under Risk,” *Econometrica* 47, no. 2 (1979): 263–291. [JSTOR](https://www.jstor.org/stable/1914185).

The value curve is steeper for losses than for equal gains. People will often take a worse deal to avoid “being down.”

A countdown that starts full and falls is a loss frame by construction. You begin holding something and watch it leave. That can create urgency. It can also make ordinary living feel like failure, because the number only moves one way.

Young-Ho Kim, Jae Ho Jeon, Eun Kyoung Choe, Bongshin Lee, KwonHyun Kim, and Jinwook Seo, “TimeAware: Leveraging Framing Effects to Enhance Personal Productivity,” CHI 2016. [DOI 10.1145/2858036.2858428](https://doi.org/10.1145/2858036.2858428).

Eight-week deployment, 24 people. One version highlighted productive computer time, one highlighted distracting time. Only the negative frame improved productivity, and that lift went away when the display was removed. Small study. Useful as a warning, not as a mandate: a scolding meter can move a metric while it is on your screen, and teach nothing that survives the meter.

**Inference used in the app:** the number is allowed to fall, because that is what a day does. It is not allowed to turn red, announce “wasted,” or score you. Sleep does not open the day in deficit. The balance stays full until you name the day, so waking up is not already a loss. That last rule is a design choice drawn from the framing research. It is not a sleep-science result.

### A missed day does not erase a habit. A streak says it does.

Phillippa Lally, Cornelia van Jaarsveld, Henry Potts, and Jane Wardle, “How are habits formed: Modelling habit formation in the real world,” *European Journal of Social Psychology* 40, no. 6 (2010): 998–1009. [DOI 10.1002/ejsp.674](https://doi.org/10.1002/ejsp.674).

96 volunteers, 12 weeks, a daily behavior of their own choosing. Time to a plateau varied widely (their model is often summarized as a median around 66 days, range about 18 to 254). Missing a single opportunity did not materially change the habit curve.

**Inference:** “don’t break the chain” is a stricter rule than the habit research. Morrow has no streak, no freeze, no “you failed yesterday.” The day refills at a dawn you set. Skipping close-the-day is allowed. The dusk line says so.

### Finitude, without the scare

Oliver Burkeman, *Four Thousand Weeks: Time Management for Mortals* (Farrar, Straus and Giroux, 2021). [Guardian extract](https://www.theguardian.com/books/2021/aug/07/on-earth-4000-weeks-so-why-lose-time-online-distraction-oliver-burkeman). [Wikipedia summary of the argument](https://en.wikipedia.org/wiki/Four_Thousand_Weeks:_Time_Management_for_Mortals).

Not a study. The argument Morrow actually used:

- An average life of about eighty years is on the order of four thousand weeks. The point of the number is finitude, not a new productivity system.
- Trying to get time “into proper working order” (he quotes Bennett) makes life feel provisional, always about to start.
- You will not do everything. Decide what you will fail at.
- Attention is the life, not the leftover after the tasks.
- Keep a record of what you did, not only of what is left.

**Inference:** “Close the day” is a done-list, three moments at most. If you marked nothing, the line is “You left the day unnamed. It was still lived.” Unnamed time is not a hole.

A death-clock (“you have this many seconds left on earth”) was considered and rejected. Reminders of mortality can focus people, and they can also just raise dread. Morrow’s number resets tomorrow. It is a day, not a lifespan.

## What was refused, and why

| Tempting feature | Why it lost |
| --- | --- |
| Countdown from a lifespan, or “seconds you will never get back” | Turns finitude into a threat. The research on loss frames says this will be felt harder than an equal gain. That is the bug, not the feature. |
| Starting the count at wake-up, so sleep is already spent | Wakes you up behind. A loss frame before you have chosen anything. |
| Red numbers, “wasted” totals, productivity score | TimeAware’s negative frame moved a work metric while the widget was visible. Morrow is not trying to raise output. |
| Streaks | Harsher than Lally’s finding that one miss does not break the habit. |
| A task list, calendar, or points | Gollwitzer supports one specific intention, not a second inbox. Deci and Ryan: an imposed plan is a different kind of goal. |
| Social feed, sharing the day | Not supported by anything in this reading, and it would make the close-of-day a performance. |
| Claiming the app “gives you more time” | Whillans and West did not find that buying hours beat cash. Mogilner’s result is about the feeling of time, and it came from giving time away, not from watching a number. |

## What the app does with this

- You are shown 86,400 as a grant. Copy: “Given, not carried over.”
- The balance does not fall until the day has a name. One line. Nothing else is required.
- After that it falls once a second, in the same color, with the line “Spent means lived.”
- Moments are marks, not debits. They do not subtract.
- Dawn and dusk notices exist and are off until you turn them on. Dawn says “The day is given. What is it for?” and only if today has no name. Dusk says you may close the day or not.
- Close-the-day names up to three moments, or admits the day was unnamed and still lived. Then it refills at your dawn. Default dawn is 6:00 in the device’s local time.
- The day stays on the device.

## What this note is not

- Not proof that Morrow works. Nobody has been studied using it.
- Not a claim that Bennett or Burkeman “endorse” the product.
- Not a complete reading of the time-psychology literature. Notable things not used as pillars: flow (Csikszentmihalyi), time perspective inventory (Zimbardo), and terror-management experiments. They are adjacent. They were not load-bearing.
- The 86,400 poster tradition was treated as rhetoric, and checked only to confirm it is not a paper.

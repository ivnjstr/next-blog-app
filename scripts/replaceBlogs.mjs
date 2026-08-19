// One-off content refresh: wipes every existing blog post (and the
// comments/likes attached to them) and replaces them with 12 fresh posts,
// 3 per category (Startup, Technology, Lifestyle, Travel). Thumbnails are
// uploaded to Cloudinary from remote source URLs.
// Run with: node --env-file=.env.local scripts/replaceBlogs.mjs
// Reads MONGODB_URI / ADMIN_EMAIL / CLOUDINARY_* from .env.local

import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

const { MONGODB_URI, ADMIN_EMAIL, CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env;

if (!MONGODB_URI || !ADMIN_EMAIL) {
    console.error("Missing MONGODB_URI or ADMIN_EMAIL in .env.local");
    process.exit(1);
}
if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_SECRET) {
    console.error("Missing CLOUDINARY_NAME / CLOUDINARY_API_KEY / CLOUDINARY_SECRET in .env.local");
    process.exit(1);
}

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET,
});

const UserSchema = new mongoose.Schema({ name: String, email: String, role: String, image: String });
const UserModel = mongoose.models.user || mongoose.model("user", UserSchema);

const BlogSchema = new mongoose.Schema({}, { strict: false });
const BlogModel = mongoose.models.blog || mongoose.model("blog", BlogSchema);

const CommentSchema = new mongoose.Schema({}, { strict: false });
const CommentModel = mongoose.models.comment || mongoose.model("comment", CommentSchema);

const LikeSchema = new mongoose.Schema({}, { strict: false });
const LikeModel = mongoose.models.like || mongoose.model("like", LikeSchema);

const posts = [
    // ---------- STARTUP ----------
    {
        category: "Startup",
        title: "Bootstrapped and Unbothered: Building a Company Without Burning Out",
        daysAgo: 21,
        image: "https://images.unsplash.com/photo-1742198914612-fc531719f1b4?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>Every funding headline makes it sound like the only way to build something real is to raise fast, hire fast, and burn fast. Nobody writes the profile about the founder who took four years, kept a day job for the first eighteen months, and never once had a board meeting.</p>
<h2>Slow Is Not the Same as Small</h2>
<p>Bootstrapping gets mistaken for a lack of ambition. In practice, it is the opposite: every dollar has to justify itself, so you learn what your customers actually value faster than a well-funded competitor burning through a Series A on paid acquisition. Constraint is a design tool, not a limitation.</p>
<p>The founders who last aren't the ones who moved fastest in year one. They're the ones who built a business that could survive a bad quarter without a rescue round.</p>
<h2>What Actually Changes Without Investors</h2>
<p>No investor update means no pressure to manufacture a growth story every ninety days. Decisions get made on a slower, saner clock — the one your actual customers and your actual energy can sustain.</p>
<ul>
<li>You ship when it's ready, not when a board deck needs a number.</li>
<li>Revenue becomes the only metric that matters, which simplifies almost everything.</li>
<li>You keep full control of the exit timeline — including never having one.</li>
</ul>
<p>None of this makes venture funding wrong. It makes it one option among several, not the default setting every founder is expected to pick.</p>`
    },
    {
        category: "Startup",
        title: "The Myth of the Overnight Success: Ten Years Before the Headline",
        daysAgo: 14,
        image: "https://images.unsplash.com/photo-1758520145175-aa3b593b81af?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>The press release says "overnight success." The cap table says otherwise. Almost every company that gets written up as a sudden breakout spent years — often a decade — failing quietly before anyone noticed it working.</p>
<h2>The Part of the Story That Gets Cut</h2>
<p>Founders rarely talk publicly about the two pivots that didn't work, the co-founder who left, or the eighteen months where the product had four users and one of them was a parent. That version of the story doesn't fit in a headline, so it disappears — and every founder still in that phase is left thinking they're the only one behind schedule.</p>
<p>They're not. The gap between "started the company" and "everyone suddenly knows the company" is almost always longer than it looks from the outside.</p>
<h2>What to Actually Measure While You Wait</h2>
<p>If growth isn't the honest metric yet, something else has to be — otherwise the years in between just feel like failure. The founders who make it through track things that compound quietly:</p>
<ul>
<li>Whether the same customers keep coming back, even in small numbers.</li>
<li>Whether the team you have now is one you'd hire again.</li>
<li>Whether you understand the problem better this month than last month.</li>
</ul>
<p>The headline, if it ever comes, is a lagging indicator. It's the years before it that decide whether there's anything real underneath.</p>`
    },
    {
        category: "Startup",
        title: "Culture Before Code: Why Your First Five Hires Decide Everything",
        daysAgo: 7,
        image: "https://images.unsplash.com/photo-1758873269276-9518d0cb4a0b?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>Nobody sets out to build a bad culture. It just happens — one convenient hire at a time, made under deadline pressure, without anyone asking what that person will teach the next ten people who join.</p>
<h2>The Five People Who Set the Ceiling</h2>
<p>Your first five hires aren't just doing a job. They're the reference point for every hire after them — how disagreements get handled, what "good work" looks like, whether people say what they actually think in a meeting. Employee fifty will absorb these norms from employee five, not from a handbook.</p>
<p>That's a lot of weight to put on hires that are usually made fastest, under the most pressure, with the least process.</p>
<h2>What to Actually Screen For Early</h2>
<p>Skills can be taught on the job in a way that judgment and self-awareness mostly can't. Early on, that tradeoff matters more than it will later.</p>
<ul>
<li>Do they ask good questions, or just agree with whatever you say?</li>
<li>How do they talk about a team they left — with contempt, or with nuance?</li>
<li>Can they operate with almost no process, and would they build some if it were missing?</li>
</ul>
<p>Fix a culture problem at five people and it's a conversation. Fix it at fifty and it's a rebuild — one that costs you the people who joined for the culture you no longer have.</p>`
    },

    // ---------- TECHNOLOGY ----------
    {
        category: "Technology",
        title: "The Quiet Rise of Ambient Computing: When Devices Learn to Disappear",
        daysAgo: 18,
        image: "https://images.unsplash.com/photo-1520860100614-a714deb4805f?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>The most interesting shift in consumer technology right now isn't a new screen — it's the slow disappearance of the screen entirely. A light that changes color when a task finishes. A speaker that plays your alarm before you've even opened your eyes. None of it asks for your attention; all of it is quietly doing something useful.</p>
<h2>From "Open the App" to "It Already Knew"</h2>
<p>For fifteen years, computing meant unlocking something and navigating to the right icon. Ambient computing inverts that: the software runs in the background, and the interface is the room itself — a light, a sound, a door that unlocks because your phone is already close enough.</p>
<p>It's a smaller kind of intelligence than a chatbot, and a much more useful one for most of the day.</p>
<h2>The Trade-off Nobody Loves to Discuss</h2>
<p>None of this works without a device listening, sensing, or tracking something about you continuously. The convenience is real, and so is the trust it requires — which is exactly why the products that win this decade won't be the ones with the most features. They'll be the ones that are honest about what they collect and boring about what they do with it.</p>
<p>The best ambient technology is the kind you forget is even there — right up until the one moment you needed it.</p>`
    },
    {
        category: "Technology",
        title: "Beyond the Hype: What On-Device AI Actually Means for Your Apps",
        daysAgo: 11,
        image: "https://images.unsplash.com/photo-1776107477726-96bacb852f7b?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>"AI" has become a word that means almost nothing because it's used to describe almost everything. But one specific shift underneath the hype is genuinely worth paying attention to: more of that intelligence is starting to run directly on your phone, instead of a server on the other side of the world.</p>
<h2>Why Running Locally Actually Matters</h2>
<p>When a model runs on-device, three things change at once: it works without a signal, it responds without the round-trip lag of a network call, and — most importantly — your data doesn't have to leave the phone to be useful. That last point is the one that should matter most to users, even though it's the one companies talk about least.</p>
<h2>What This Looks Like in Practice</h2>
<p>You've probably already used on-device AI without noticing — it's rarely branded as the headline feature:</p>
<ul>
<li>A keyboard that predicts your next word without sending every keystroke to a server.</li>
<li>A photo app that recognizes faces and objects entirely offline.</li>
<li>Live transcription that works in airplane mode.</li>
</ul>
<p>None of it is as flashy as a chatbot demo. It's also the version of "AI" most likely to quietly improve your day without asking anything of you in return.</p>`
    },
    {
        category: "Technology",
        title: "The Toolkit Reset: Why Developers Are Falling Back in Love with Simplicity",
        daysAgo: 4,
        image: "https://images.unsplash.com/photo-1754548930550-be9fa88874f4?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>For most of the last decade, a new project meant a new stack: another framework, another build tool, another layer of abstraction promising to solve a problem the last one introduced. Lately, something has shifted — more developers are quietly ripping that complexity back out.</p>
<h2>The Cost of the Modern Default</h2>
<p>Every dependency you add is a small, permanent decision. It's a version to keep updated, a breaking change waiting to happen, a piece of someone else's judgment baked into your codebase. Multiply that by fifty packages and a team spends more time maintaining its tools than building its product.</p>
<p>None of this was malicious — every tool solved a real problem for someone. But "solves a real problem for someone" and "belongs in your stack" are different questions, and for years the industry stopped asking the second one.</p>
<h2>What the Reset Actually Looks Like</h2>
<p>It's not a rejection of modern tooling — it's a return to asking whether each piece earns its place:</p>
<ul>
<li>Reaching for the platform's built-in solution before reaching for a library.</li>
<li>Choosing boring, well-understood tools over the newest framework.</li>
<li>Deleting code as a deliberate, ongoing habit — not just a cleanup sprint once a year.</li>
</ul>
<p>The best codebases aren't the ones with the most sophisticated tooling. They're the ones a new developer can understand by Friday.</p>`
    },

    // ---------- LIFESTYLE ----------
    {
        category: "Lifestyle",
        title: "Designing a Life With Fewer, Better Things",
        daysAgo: 16,
        image: "https://images.unsplash.com/photo-1746933156614-54eeb2dfaf3c?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>Minimalism got turned into an aesthetic before it got the chance to be a practice — all white walls and empty countertops, styled for a photo rather than lived in. The actual idea underneath it is much simpler and much harder: own less, but choose what remains on purpose.</p>
<h2>The Question That Changes Everything</h2>
<p>Not "does this spark joy," and not "can I afford it." The more useful question is quieter: will I still want this in a year, and will it still be worth the space it takes up in my home and my attention? Most purchases fail that test immediately, which is exactly why it's a useful filter.</p>
<h2>Fewer, Better, On Purpose</h2>
<p>A life with fewer things isn't about deprivation — it's about raising the bar for what earns a place in it:</p>
<ul>
<li>One good coat instead of five forgettable ones.</li>
<li>A kitchen with tools you actually reach for, not ones you're storing for someday.</li>
<li>Surfaces left empty on purpose, not because you're afraid to use them.</li>
</ul>
<p>The goal was never an empty room. It was a life with less friction in it — fewer decisions, fewer things to clean, fewer things quietly asking for your attention every time you walk past them.</p>`
    },
    {
        category: "Lifestyle",
        title: "The Art of the Unplugged Weekend",
        daysAgo: 9,
        image: "https://images.unsplash.com/photo-1761506829234-68f3b090fef2?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>The strangest part of a weekend without your phone isn't the boredom — that fades within the first hour. It's the quiet that shows up afterward, once there's nothing left pulling your attention in six directions at once.</p>
<h2>Why It's Harder Than It Sounds</h2>
<p>Nobody struggles to survive a day without their phone. What people actually struggle with is the discomfort of the first few hours — the reflex to check something, anything, before your hand even knows why. That reflex isn't a character flaw. It's a habit built by design, and it fades the same way any habit does: slowly, and only with repetition.</p>
<h2>How to Actually Make It Stick</h2>
<p>An unplugged weekend doesn't need a cabin in the woods or a strict set of rules. It needs a little friction between you and the habit:</p>
<ul>
<li>Leave the phone in another room, not just face-down on the table.</li>
<li>Tell one person your plan, so you're not quietly re-negotiating with yourself by Saturday noon.</li>
<li>Have something physical to do with your hands — the urge to scroll needs somewhere else to go.</li>
</ul>
<p>By Sunday evening, most people don't miss what they thought they would. What they notice instead is how long it's been since a whole day felt unhurried.</p>`
    },
    {
        category: "Lifestyle",
        title: "Morning Rituals That Actually Survive Real Life",
        daysAgo: 2,
        image: "https://images.unsplash.com/photo-1765647827445-edca55ef71f4?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>Every morning-routine list looks the same: wake at five, meditate, journal, cold plunge, run, and somehow still be at your desk by eight. Most people try it for four days and quietly give up, not because they lack discipline, but because the routine was never built for their actual life.</p>
<h2>The Real Reason Routines Fall Apart</h2>
<p>A ninety-minute morning ritual works fine on a Tuesday with nothing else going on. It falls apart the first time a kid wakes up early, a flight leaves at six, or you simply didn't sleep well. The routine wasn't wrong — it just had no room to bend, so the first hard morning broke it completely.</p>
<h2>Build the Version That Bends</h2>
<p>A morning ritual worth keeping is the one with a floor, not a fixed script:</p>
<ul>
<li>One non-negotiable thing, not five — pick the one that actually changes your day.</li>
<li>A five-minute version of the routine for the mornings that don't cooperate.</li>
<li>No penalty for the days it doesn't happen — just pick it back up tomorrow.</li>
</ul>
<p>The people who keep a morning ritual for years, not weeks, usually aren't the most disciplined ones. They're the ones who built something small enough to survive an ordinary bad morning.</p>`
    },

    // ---------- TRAVEL ----------
    {
        category: "Travel",
        title: "Off the Map: Chasing the World's Last Quiet Places",
        daysAgo: 19,
        image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>Every list of the "world's most beautiful places" leads to the same handful of overcrowded viewpoints, roped-off for the crowds that showed up chasing the same photo. Somewhere past all of them, there are still places that stay quiet simply because they're inconvenient to reach — and that inconvenience is the whole point.</p>
<h2>What Makes a Place Actually Quiet</h2>
<p>It's rarely remoteness alone. Plenty of far-flung places have a bus tour schedule now. The places that stay quiet are the ones with a genuine barrier to entry — a trailhead with no signage, a village with one small guesthouse, a coastline you can only reach by a boat that runs twice a week.</p>
<p>None of that shows up on a top-ten list, which is exactly why it's still there to find.</p>
<h2>How to Actually Find Them</h2>
<ul>
<li>Follow local recommendations over algorithm-fed "hidden gem" listicles — the algorithm found it too, which means it's not hidden anymore.</li>
<li>Look one town past the famous one; the crowds rarely go the extra thirty minutes.</li>
<li>Travel in the off-season — the same view, minus everyone else looking at it with you.</li>
</ul>
<p>The reward for the extra effort isn't a better photo. It's the rare experience of standing somewhere beautiful with nobody else's itinerary running alongside yours.</p>`
    },
    {
        category: "Travel",
        title: "The Slow Travel Movement: Why Fewer Stamps Mean Better Stories",
        daysAgo: 12,
        image: "https://images.unsplash.com/photo-1754748926204-c12c9d8f3c33?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>Ask someone about their eight-country, two-week trip and you'll get a highlight reel — a cathedral here, a beach there, a blur of trains in between. Ask someone who spent those same two weeks in a single town, and you'll get an actual story: a baker who remembered their order by day three, a street that looked completely different in the rain.</p>
<h2>The Math That Nobody Runs</h2>
<p>Cramming eight cities into fourteen days means roughly a day and a half in each — barely enough time to find a decent meal, let alone understand a place. Slow travel just does the obvious math: fewer stops, more days in each, and somehow more to remember afterward.</p>
<h2>What Slow Travel Actually Looks Like</h2>
<ul>
<li>Renting an apartment instead of hopping between hotels — grocery shopping is its own kind of cultural immersion.</li>
<li>Leaving entire days unplanned, on purpose, instead of optimizing every hour.</li>
<li>Returning to the same café or the same corner enough times that someone starts to recognize you.</li>
</ul>
<p>The passport ends up with fewer stamps. The stories that come home are the ones that actually stick.</p>`
    },
    {
        category: "Travel",
        title: "Budget Doesn't Mean Basic: Ten Luxury Travel Hacks for the Rest of Us",
        daysAgo: 5,
        image: "https://images.unsplash.com/photo-1572496275876-da95adb98c3c?fm=jpg&q=80&w=1600&auto=format&fit=crop",
        description: `
<p>Luxury travel has a branding problem: it's sold as something that starts at a price point, when most of what actually makes a trip feel luxurious has almost nothing to do with the number on the receipt.</p>
<h2>What "Luxury" Actually Means Once You Strip the Marketing Away</h2>
<p>It's rarely the thread count. It's not being rushed. It's a room with a view instead of a parking lot, a meal eaten slowly instead of standing up, a day with nothing scheduled after 3pm. Almost none of that requires the most expensive room in the hotel.</p>
<h2>Ways to Get There Without the Price Tag</h2>
<ul>
<li>Book the mid-tier room, then spend the savings on the one splurge meal that actually matters to you.</li>
<li>Travel shoulder season — the luxury resorts drop their rates the same week the crowds do.</li>
<li>Ask directly for a quiet room or a better view at check-in; it costs nothing and works more often than people assume.</li>
<li>Spend on time, not stuff — one unhurried day beats three rushed ones every time.</li>
</ul>
<p>The traveler with a modest budget and a slow itinerary often comes home having felt more pampered than the one who paid triple for a room they were only in to sleep.</p>`
    },
];

async function uploadImage(url, index) {
    const res = await cloudinary.uploader.upload(url, {
        folder: "blogs",
        public_id: `seed_${Date.now()}_${index}`,
    });
    return { image: res.secure_url, public_id: res.public_id };
}

async function main() {
    await mongoose.connect(MONGODB_URI);

    const adminUser = await UserModel.findOne({ email: ADMIN_EMAIL });
    if (!adminUser) {
        console.error(`No user found for ADMIN_EMAIL (${ADMIN_EMAIL}). Run "npm run seed:admin" first.`);
        process.exit(1);
    }

    // --- Wipe existing content ---
    const existingBlogs = await BlogModel.find({}, { public_id: 1 }).lean();
    console.log(`Deleting ${existingBlogs.length} existing blog post(s)...`);
    for (const blog of existingBlogs) {
        if (blog.public_id) {
            try {
                await cloudinary.uploader.destroy(blog.public_id);
            } catch (error) {
                console.error(`Could not delete Cloudinary image ${blog.public_id}:`, error.message);
            }
        }
    }
    await BlogModel.deleteMany({});
    const commentResult = await CommentModel.deleteMany({});
    const likeResult = await LikeModel.deleteMany({});
    console.log(`Deleted ${commentResult.deletedCount} comment(s) and ${likeResult.deletedCount} like(s).`);

    // --- Create new posts ---
    const now = Date.now();
    let created = 0;
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        console.log(`Uploading image for "${post.title}"...`);
        const { image, public_id } = await uploadImage(post.image, i);

        await BlogModel.create({
            title: post.title,
            description: post.description.trim(),
            category: post.category,
            author: adminUser.name,
            authorImage: adminUser.image || "",
            image,
            public_id,
            date: new Date(now - post.daysAgo * 24 * 60 * 60 * 1000),
            isFeatured: post.title.startsWith("Off the Map"),
            hasVideo: false,
            allowComments: true,
            createdBy: adminUser._id,
            status: "published",
        });
        created++;
        console.log(`Created (${created}/${posts.length}): ${post.title}`);
    }

    console.log(`Done. ${created} new posts created across ${new Set(posts.map(p => p.category)).size} categories.`);
    await mongoose.disconnect();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

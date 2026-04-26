/**
 * Humanizer Engine — Rule-based text transformation service
 * Converts formal / AI-generated prose into warm, conversational language.
 */

// ─── Contraction rules ────────────────────────────────────────────────────────
const CONTRACTIONS = [
  [/\bI am\b/g,          "I'm"],
  [/\bI have\b/g,        "I've"],
  [/\bI will\b/g,        "I'll"],
  [/\bI would\b/g,       "I'd"],
  [/\bI had\b/g,         "I'd"],
  [/\bhe is\b/gi,        "he's"],
  [/\bshe is\b/gi,       "she's"],
  [/\bit is\b/gi,        "it's"],
  [/\bthey are\b/gi,     "they're"],
  [/\bthey have\b/gi,    "they've"],
  [/\bthey will\b/gi,    "they'll"],
  [/\bwe are\b/gi,       "we're"],
  [/\bwe have\b/gi,      "we've"],
  [/\bwe will\b/gi,      "we'll"],
  [/\byou are\b/gi,      "you're"],
  [/\byou have\b/gi,     "you've"],
  [/\byou will\b/gi,     "you'll"],
  [/\bcannot\b/gi,       "can't"],
  [/\bdo not\b/gi,       "don't"],
  [/\bdoes not\b/gi,     "doesn't"],
  [/\bdid not\b/gi,      "didn't"],
  [/\bis not\b/gi,       "isn't"],
  [/\bare not\b/gi,      "aren't"],
  [/\bwas not\b/gi,      "wasn't"],
  [/\bwere not\b/gi,     "weren't"],
  [/\bwill not\b/gi,     "won't"],
  [/\bwould not\b/gi,    "wouldn't"],
  [/\bcould not\b/gi,    "couldn't"],
  [/\bshould not\b/gi,   "shouldn't"],
  [/\bhave not\b/gi,     "haven't"],
  [/\bhas not\b/gi,      "hasn't"],
  [/\bhad not\b/gi,      "hadn't"],
  [/\bthat is\b/gi,      "that's"],
  [/\bthere is\b/gi,     "there's"],
  [/\bthere are\b/gi,    "there're"],
  [/\bwhat is\b/gi,      "what's"],
  [/\bwho is\b/gi,       "who's"],
  [/\bhow is\b/gi,       "how's"],
  [/\blet us\b/gi,       "let's"],
];

// ─── Formality → Casual replacements ─────────────────────────────────────────
const CASUAL_SWAPS = [
  // Greetings
  [/\bHello\b/g,                        "Hey"],
  [/\bGood day\b/gi,                    "Hey there"],
  [/\bGreetings\b/gi,                   "Hey"],
  [/\bhi there\b/gi,                    "hey there"],

  // Transitions
  [/\bTherefore,?\b/gi,                 "So,"],
  [/\bHowever,?\b/gi,                   "But"],
  [/\bFurthermore,?\b/gi,               "Also,"],
  [/\bIn addition,?\b/gi,               "Plus,"],
  [/\bMoreover,?\b/gi,                  "On top of that,"],
  [/\bNevertheless,?\b/gi,              "Still,"],
  [/\bConsequently,?\b/gi,              "So"],
  [/\bThus,?\b/gi,                      "So,"],
  [/\bHence,?\b/gi,                     "So,"],
  [/\bNotwithstanding\b/gi,             "Even so,"],
  [/\bSubsequently,?\b/gi,              "Then,"],

  // Examples
  [/\bFor example,?\b/gi,               "Like,"],
  [/\bFor instance,?\b/gi,              "For example,"],
  [/\bNamely,?\b/gi,                    "Basically,"],
  [/\bIn other words,?\b/gi,            "I mean,"],
  [/\bTo illustrate,?\b/gi,             "Here's the thing —"],

  // Adjectives
  [/\bexcellent\b/gi,                   "awesome"],
  [/\bsuperior\b/gi,                    "better"],
  [/\boutstanding\b/gi,                 "incredible"],
  [/\bremarkable\b/gi,                  "pretty amazing"],
  [/\bexceptional\b/gi,                 "really great"],
  [/\bsatisfactory\b/gi,                "decent"],
  [/\badequate\b/gi,                    "good enough"],
  [/\bsignificant\b/gi,                 "big"],
  [/\bsubstantial\b/gi,                 "solid"],
  [/\bnumerous\b/gi,                    "a lot of"],
  [/\bmultiple\b/gi,                    "a few"],
  [/\bvarious\b/gi,                     "different"],
  [/\bdiverse\b/gi,                     "all kinds of"],
  [/\bimmense\b/gi,                     "huge"],
  [/\benormous\b/gi,                    "massive"],
  [/\bminuscule\b/gi,                   "tiny"],

  // Verbs
  [/\butilize\b/gi,                     "use"],
  [/\bcommence\b/gi,                    "start"],
  [/\binitiate\b/gi,                    "kick off"],
  [/\bterminate\b/gi,                   "end"],
  [/\bproceed\b/gi,                     "go ahead"],
  [/\baccomplish\b/gi,                  "pull off"],
  [/\bdemonstrate\b/gi,                 "show"],
  [/\bindicate\b/gi,                    "point out"],
  [/\bascertain\b/gi,                   "figure out"],
  [/\benquire\b/gi,                     "ask"],
  [/\binquire\b/gi,                     "ask"],
  [/\bpurchase\b/gi,                    "buy"],
  [/\bobtain\b/gi,                      "get"],
  [/\bpossess\b/gi,                     "have"],
  [/\bperform\b/gi,                     "do"],
  [/\brender\b/gi,                      "make"],
  [/\bfacilitate\b/gi,                  "help"],
  [/\bassist\b/gi,                      "help"],
  [/\bimplement\b/gi,                   "put in place"],
  [/\bleverage\b/gi,                    "use"],

  // Nouns / phrases
  [/\bindividual\b/gi,                  "person"],
  [/\bpersonnel\b/gi,                   "people"],
  [/\bresidential property\b/gi,        "home"],
  [/\bcommencement\b/gi,                "start"],
  [/\btermination\b/gi,                 "end"],
  [/\bcompletion\b/gi,                  "finish"],
  [/\bprior to\b/gi,                    "before"],
  [/\bsubsequent to\b/gi,               "after"],
  [/\bin the event that\b/gi,           "if"],
  [/\bat this point in time\b/gi,       "right now"],
  [/\bat the present time\b/gi,         "right now"],
  [/\bon a daily basis\b/gi,            "every day"],
  [/\bdue to the fact that\b/gi,        "because"],
  [/\bfor the reason that\b/gi,         "because"],
  [/\bin order to\b/gi,                 "to"],
  [/\bwith regard to\b/gi,              "about"],
  [/\bwith respect to\b/gi,             "about"],
  [/\bin terms of\b/gi,                 "for"],

  // Opinionated filler
  [/\bI think\b/gi,                     "I feel like"],
  [/\bI believe\b/gi,                   "I honestly think"],
  [/\bIn my opinion,?\b/gi,             "Honestly,"],
  [/\bIt is worth noting that\b/gi,     "Worth mentioning —"],
  [/\bIt should be noted that\b/gi,     "Just so you know,"],
  [/\bPlease be advised that\b/gi,      "Heads up —"],
  [/\bthank you\b/gi,                   "thanks"],
  [/\bThank you very much\b/gi,         "Thanks so much"],
  [/\bYou're welcome\b/gi,              "No worries!"],
  [/\bsincerely\b/gi,                   "cheers"],
  [/\bregards\b/gi,                     "take care"],
  [/\bactually\b/gi,                    "honestly"],
  [/\bliterally\b/gi,                   "literally (no joke)"],
  [/\bbasically\b/gi,                   "basically"],
  [/\bessentially\b/gi,                 "pretty much"],
  [/\bgenerally speaking,?\b/gi,        "in general,"],

  // Very + adjective → casual intensifier
  [/\bvery happy\b/gi,                  "super happy"],
  [/\bvery sad\b/gi,                    "really bummed"],
  [/\bvery good\b/gi,                   "really great"],
  [/\bvery bad\b/gi,                    "pretty rough"],
  [/\bvery important\b/gi,              "super important"],
  [/\bvery difficult\b/gi,              "pretty tough"],
  [/\bvery easy\b/gi,                   "a breeze"],
  [/\bvery interesting\b/gi,            "really fascinating"],
  [/\bvery large\b/gi,                  "huge"],
  [/\bvery small\b/gi,                  "tiny"],
  [/\bvery quickly\b/gi,                "super fast"],
  [/\bvery slowly\b/gi,                 "at a snail's pace"],
];

// ─── Trailing casual additions (~30% chance, deterministic per text) ──────────
const TRAILING_PHRASES = [
  ", you know?",
  ", right?",
  " — just saying.",
  ", huh?",
  " Kinda wild, honestly.",
  " No big deal, though.",
  " Worth thinking about!",
  " Pretty neat, I think.",
  " Just a thought.",
  " Can't say I'm surprised.",
];

/**
 * Count how many real transformations happened (changes made to the text).
 */
function countTransforms(original, transformed) {
  let count = 0;
  const origWords = original.split(/\s+/);
  const transWords = transformed.split(/\s+/);
  const maxLen = Math.max(origWords.length, transWords.length);
  for (let i = 0; i < maxLen; i++) {
    if (origWords[i] !== transWords[i]) count++;
  }
  return count;
}

/**
 * Fix capitalisation after contractions that lower-cased sentence starters.
 */
function fixCapitalization(text) {
  // Capitalize first char of the whole string
  text = text.charAt(0).toUpperCase() + text.slice(1);
  // Capitalize after sentence-ending punctuation
  text = text.replace(/([.!?]\s+)([a-z])/g, (_, punct, letter) => punct + letter.toUpperCase());
  return text;
}

/**
 * Decide whether to append a trailing casual phrase (deterministic so same input = same output).
 */
function maybeAddTrailing(text) {
  const hash = Array.from(text).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  // ~30% of inputs (hash % 10 < 3)
  if (hash % 10 < 3 && text.length > 30) {
    const phrase = TRAILING_PHRASES[hash % TRAILING_PHRASES.length];
    // Don't add if text already ends in ? or !
    const lastChar = text.trimEnd().slice(-1);
    if (lastChar !== '?' && lastChar !== '!') {
      return text.trimEnd() + phrase;
    }
  }
  return text;
}

/**
 * Main humanize function.
 * @param {string} text - Raw input text
 * @returns {{ humanizedText: string, transformCount: number, charDelta: number }}
 */
function humanize(text) {
  let result = text;

  // Apply contractions first
  for (const [pattern, replacement] of CONTRACTIONS) {
    result = result.replace(pattern, replacement);
  }

  // Apply casual swaps
  for (const [pattern, replacement] of CASUAL_SWAPS) {
    result = result.replace(pattern, replacement);
  }

  // Clean up whitespace artifacts
  result = result.replace(/\s{2,}/g, ' ').trim();

  // Restore proper capitalisation
  result = fixCapitalization(result);

  // Maybe add a trailing casual phrase
  result = maybeAddTrailing(result);

  const transformCount = countTransforms(text, result);
  const charDelta = result.length - text.length;

  return { humanizedText: result, transformCount, charDelta };
}

module.exports = { humanize };

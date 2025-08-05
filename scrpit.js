// --- 1. Random pool of 23 images, pick 16 ---
const totalImages = 23;
let allImages = [];
for(let i=1; i<=totalImages; i++) {
  allImages.push(`images/friend${i}.jpg`);
}
function pickRandomImages(arr, num) {
  let shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, num);
}
const friendImages = pickRandomImages(allImages, 16);

// --- 2. Color choices ---
const COLORS = [
  {name: "Red", code: "#ff3333"},
  {name: "Blue", code: "#3399ff"},
  {name: "Green", code: "#33cc33"},
  {name: "Yellow", code: "#ffeb3b"},
  {name: "Purple", code: "#a259f7"},
  {name: "Orange", code: "#ff9800"},
  {name: "Pink", code: "#ff69b4"},
  {name: "Teal", code: "#1de9b6"},
  {name: "Brown", code: "#a1887f"},
  {name: "Gray", code: "#bdbdbd"}
];

// --- 3. Silly questions array ---
const sillyQuestions = [
  {
    question: "If you could have any superpower, what would it be?",
    options: [
      "Flying",
      "Invisibility",
      "Talking to animals",
      "Making endless cake appear"
    ]
  },
  {
    question: "Would you still date your gf if she looked like a victorian child in agony?",
    options: [
      "No",
      "Yes but only if she pegs me",
      "Only if she'd be white and pegs me",
      "Only if she allows me to become a househusband and pegs me"
    ]
  },
  {
    question: "If you could attempt suicide without dying, how would you choose to attempt?",
    options: [
      "Hanging by a rop",
      "Jumping from the roof",
      "Getting eaten by a lion",
      "Blood loss"
    ]
  },
  {
    question: "If you could choose only one from below, what would it be?",
    options: [
      "Debonc",
      "Devanshi",
      "Devonsi",
      "Devansi"
    ]
  }
];

// --- 4. Assign a random correct color to each level (no repeat) ---
const correctColors = [];
let lastColorName = "";
for(let i=0; i<friendImages.length; i++) {
  let availableColors = COLORS.filter(c => c.name !== lastColorName);
  let correct = availableColors[Math.floor(Math.random() * availableColors.length)];
  correctColors.push(correct);
  lastColorName = correct.name;
}

let level = 0;
let started = false;

const activityContainer = document.getElementById('activity-container');
const levelText = document.getElementById('level-text');
const feedback = document.getElementById('feedback');
const imageGallery = document.getElementById('image-gallery');
const congratsMessage = document.getElementById('congrats-message');
const mainTitle = document.getElementById('main-title');
const headerDiv = document.querySelector('.header');

function shuffle(array) {
  for(let i=array.length-1; i>0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showIntroPrompt() {
  levelText.classList.add('hide');
  activityContainer.innerHTML = `
    <div style="font-size:1.3em; color:#ffb347; margin-bottom:1.8em; font-weight:bold; letter-spacing:1px;">
      HELLO! Do you wanna play a game (PLEH)
    </div>
    <button id="start-btn">Continue</button>
  `;
  document.getElementById('start-btn').onclick = () => {
    started = true;
    levelText.classList.remove('hide');
    // Hide the h1 + hearts (header) when starting
    headerDiv.style.opacity = "0";
    setTimeout(() => { headerDiv.style.display = 'none'; }, 700);
    updateLevelText();
    showColorOptions();
  }
}

// --- 5. Show color options ---
function showColorOptions() {
  if (level >= friendImages.length) return;
  feedback.textContent = '';
  activityContainer.innerHTML = '';

  const correctColor = correctColors[level];
  let others = COLORS.filter(c => c.name !== correctColor.name);
  shuffle(others);
  let options = [correctColor, ...others.slice(0,3)];
  shuffle(options);

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option.name;
    btn.style.background = option.code;
    btn.style.color = "#fff";
    btn.style.padding = "18px 32px";
    btn.style.margin = "12px";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";
    btn.style.fontSize = "1.2em";
    btn.style.fontWeight = "bold";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    btn.onmouseover = () => btn.style.color = "#23243a";
    btn.onmouseleave = () => btn.style.color = "#fff";
    btn.onclick = () => handleColorPick(option.name);
    activityContainer.appendChild(btn);
  });
}

// --- 6. Show silly question every 4th level ---
function showSillyQuestion() {
  feedback.textContent = '';
  activityContainer.innerHTML = '';

  // Which silly question to show? Levels 4,8,12,16 → indices 0,1,2,3
  const qIndex = Math.floor(level / 4) - 1;
  const q = sillyQuestions[qIndex % sillyQuestions.length];

  const qDiv = document.createElement('div');
  qDiv.style.marginBottom = "1em";
  qDiv.style.fontWeight = "bold";
  qDiv.style.fontSize = "1.17em";
  qDiv.style.color = "#1de9b6";
  qDiv.textContent = q.question;
  activityContainer.appendChild(qDiv);

  q.options.forEach((option) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.className = 'silly-btn';
    btn.onclick = () => {
      feedback.textContent = '';
      nextLevel();
    };
    activityContainer.appendChild(btn);
  });
}

function revealImage() {
  if(level < friendImages.length){
    // Add to gallery (polaroid)
    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid ' + (Math.random() > 0.5 ? 'tilt-left' : 'tilt-right');
    const img = document.createElement('img');
    img.src = friendImages[level];
    img.alt = `Memory ${level+1}`;
    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.textContent = `Memory ${level+1}`;
    polaroid.appendChild(img);
    polaroid.appendChild(caption);
    imageGallery.appendChild(polaroid);
    // Optionally scroll to the new image
    polaroid.scrollIntoView({behavior: 'smooth', block: 'center'});
  }
}

function updateLevelText(customText) {
  if (customText) {
    levelText.textContent = customText;
  } else {
    levelText.textContent = `Level ${level+1} of 16: Guess the right one to unlock smth new`;
  }
}

// --- 7. Continue to next level ---
function nextLevel() {
  if (level < friendImages.length) {
    revealImage();
    level++;
    setTimeout(() => {
      if (level < friendImages.length) {
        // If this is level 4,8,12,16 (i.e. after level increments to 4,8,12,16)
        if (level > 0 && level % 4 === 0) {
          showSillyQuestion();
        } else {
          updateLevelText();
          showColorOptions();
        }
      } else {
        activityContainer.innerHTML = '';
        levelText.classList.add('hide');
        congratsMessage.classList.remove('hide');
      }
    }, 700); // Give time for image animation
  }
}

// --- 8. Handle color pick ---
function handleColorPick(pickedName) {
  const correctName = correctColors[level].name;
  if (pickedName === correctName) {
    feedback.textContent = '';
    nextLevel();
  } else {
    feedback.textContent = "Nope! Try another color!";
    showColorOptions(); // New set including correct one
  }
}

// --- 9. Initial state ---
levelText.classList.add('hide');
imageGallery.innerHTML = '';
congratsMessage.classList.add('hide');
showIntroPrompt();

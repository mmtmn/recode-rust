const STORAGE_KEY = "recode-rust-progress-v1";

const state = {
  curriculum: null,
  lessons: [],
  current: null,
  activity: "code",
  selectedChoice: null,
  track: "all",
  query: "",
  progress: loadProgress(),
};

const elements = {};

document.addEventListener("DOMContentLoaded", initialize);

async function initialize() {
  collectElements();
  bindEvents();

  try {
    const response = await fetch("/api/curriculum");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.curriculum = await response.json();
    state.lessons = state.curriculum.lessons;

    elements.activityCount.textContent = state.curriculum.activity_count;
    renderNavigation();
    updateProgress();

    const requested = window.location.hash.slice(1);
    const first = state.lessons.find((lesson) => lesson.id === requested) || state.lessons[0];
    selectLesson(first.id, false);
  } catch (error) {
    console.error(error);
    elements.lessonLoading.hidden = true;
    elements.loadError.hidden = false;
  }
}

function collectElements() {
  const ids = [
    "sidebar", "open-nav", "close-nav", "nav-scrim", "lesson-nav", "lesson-search",
    "progress-percent", "earned-xp", "progress-bar", "completed-count", "activity-count",
    "track-crumb", "unit-crumb", "lesson-loading", "lesson-content", "load-error",
    "lesson-track", "lesson-difficulty", "lesson-time", "lesson-xp", "lesson-title",
    "lesson-summary", "lesson-notes", "lesson-sources", "code-tab", "quiz-tab",
    "code-state", "quiz-state", "code-panel", "quiz-panel", "code-prompt", "code-editor",
    "code-hint", "reset-code", "check-code", "code-feedback", "quiz-question", "quiz-choices",
    "check-quiz", "quiz-feedback", "previous-lesson", "next-lesson", "lesson-position", "toast",
  ];
  for (const id of ids) elements[toCamel(id)] = document.getElementById(id);
  elements.trackButtons = [...document.querySelectorAll(".track-button")];
  elements.activityTabs = [...document.querySelectorAll(".activity-tab")];
}

function bindEvents() {
  elements.openNav.addEventListener("click", openNavigation);
  elements.closeNav.addEventListener("click", closeNavigation);
  elements.navScrim.addEventListener("click", closeNavigation);

  elements.lessonSearch.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    renderNavigation();
  });

  for (const button of elements.trackButtons) {
    button.addEventListener("click", () => {
      state.track = button.dataset.track;
      for (const item of elements.trackButtons) item.classList.toggle("active", item === button);
      renderNavigation();
    });
  }

  for (const tab of elements.activityTabs) {
    tab.addEventListener("click", () => setActivity(tab.dataset.activity));
  }

  elements.resetCode.addEventListener("click", () => {
    elements.codeEditor.value = state.current.code.starter;
    clearFeedback(elements.codeFeedback);
    elements.codeEditor.focus();
  });
  elements.checkCode.addEventListener("click", checkCode);
  elements.checkQuiz.addEventListener("click", checkQuiz);
  elements.previousLesson.addEventListener("click", () => moveLesson(-1));
  elements.nextLesson.addEventListener("click", () => moveLesson(1));

  window.addEventListener("hashchange", () => {
    const id = window.location.hash.slice(1);
    if (id && id !== state.current?.id && state.lessons.some((lesson) => lesson.id === id)) {
      selectLesson(id, false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !isTyping(event.target)) {
      event.preventDefault();
      elements.lessonSearch.focus();
    }
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      state.activity === "code" ? checkCode() : checkQuiz();
    }
    if (event.key === "Escape") closeNavigation();
  });

  elements.codeEditor.addEventListener("keydown", handleEditorKeydown);
}

function renderNavigation() {
  if (!state.lessons.length) return;

  const lessons = state.lessons.filter((lesson) => {
    const matchesTrack = state.track === "all" || lesson.track === state.track;
    const haystack = `${lesson.title} ${lesson.summary} ${lesson.unit} ${lesson.track_label}`.toLowerCase();
    return matchesTrack && (!state.query || haystack.includes(state.query));
  });

  if (!lessons.length) {
    elements.lessonNav.innerHTML = `<div class="empty-nav"><strong>No lessons found</strong><span>Try another phrase or track.</span></div>`;
    return;
  }

  const groups = [];
  for (const lesson of lessons) {
    const key = `${lesson.track}:${lesson.unit}`;
    let group = groups.find((item) => item.key === key);
    if (!group) {
      group = { key, track: lesson.track, unit: lesson.unit, lessons: [] };
      groups.push(group);
    }
    group.lessons.push(lesson);
  }

  elements.lessonNav.innerHTML = groups.map((group) => {
    const done = group.lessons.reduce((total, lesson) => total + activityCountForLesson(lesson.id), 0);
    const possible = group.lessons.length * 2;
    return `
      <section class="nav-group">
        <button class="nav-group-title" type="button" aria-expanded="true">
          <span><i data-track="${escapeHtml(group.track)}"></i>${escapeHtml(group.unit)}</span>
          <small>${done}/${possible}</small>
        </button>
        <div class="nav-group-items">
          ${group.lessons.map(renderNavLesson).join("")}
        </div>
      </section>`;
  }).join("");

  for (const button of elements.lessonNav.querySelectorAll(".nav-lesson")) {
    button.addEventListener("click", () => selectLesson(button.dataset.id));
  }
  for (const button of elements.lessonNav.querySelectorAll(".nav-group-title")) {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      button.nextElementSibling.hidden = expanded;
    });
  }
}

function renderNavLesson(lesson) {
  const codeDone = isComplete(lesson.id, "code");
  const quizDone = isComplete(lesson.id, "quiz");
  const isCurrent = state.current?.id === lesson.id;
  return `
    <button class="nav-lesson ${isCurrent ? "active" : ""}" type="button" data-id="${escapeHtml(lesson.id)}">
      <span class="lesson-dot ${codeDone && quizDone ? "complete" : ""}">${codeDone && quizDone ? "✓" : ""}</span>
      <span><strong>${escapeHtml(lesson.title)}</strong><small>${lesson.minutes} min · ${capitalize(lesson.difficulty)}</small></span>
      <span class="mini-states" aria-label="${activityCountForLesson(lesson.id)} of 2 complete"><i class="${codeDone ? "done" : ""}"></i><i class="${quizDone ? "done" : ""}"></i></span>
    </button>`;
}

function selectLesson(id, updateHash = true) {
  const lesson = state.lessons.find((item) => item.id === id);
  if (!lesson) return;

  state.current = lesson;
  state.selectedChoice = null;
  if (updateHash) history.pushState(null, "", `#${id}`);

  elements.lessonLoading.hidden = true;
  elements.lessonContent.hidden = false;
  elements.trackCrumb.textContent = lesson.track_label;
  elements.unitCrumb.textContent = lesson.unit;
  elements.lessonTrack.textContent = lesson.track_label;
  elements.lessonTrack.dataset.track = lesson.track;
  elements.lessonDifficulty.textContent = capitalize(lesson.difficulty);
  elements.lessonDifficulty.dataset.difficulty = lesson.difficulty;
  elements.lessonTime.textContent = `${lesson.minutes} min`;
  elements.lessonXp.textContent = `${lesson.xp * 2} XP available`;
  elements.lessonTitle.textContent = lesson.title;
  elements.lessonSummary.textContent = lesson.summary;

  elements.lessonNotes.innerHTML = lesson.notes.map((note, index) => `
    <div class="note"><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHtml(note)}</p></div>`).join("");
  elements.lessonSources.innerHTML = lesson.sources.map((source) => `
    <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.label)} ↗</a>`).join("");

  elements.codePrompt.textContent = lesson.code.prompt;
  elements.codeEditor.value = lesson.code.starter;
  elements.codeHint.textContent = lesson.code.hint;
  elements.quizQuestion.textContent = lesson.quiz.question;
  elements.quizChoices.innerHTML = lesson.quiz.choices.map((choice, index) => `
    <button class="quiz-choice" type="button" data-choice="${index}">
      <span>${String.fromCharCode(65 + index)}</span><strong>${escapeHtml(choice)}</strong><i></i>
    </button>`).join("");

  for (const choice of elements.quizChoices.querySelectorAll(".quiz-choice")) {
    choice.addEventListener("click", () => selectChoice(Number(choice.dataset.choice)));
  }

  clearFeedback(elements.codeFeedback);
  clearFeedback(elements.quizFeedback);
  elements.checkQuiz.disabled = true;
  updateActivityStates();
  updateLessonControls();
  renderNavigation();
  setActivity("code");
  closeNavigation();

  window.scrollTo({ top: 0, behavior: "smooth" });
  document.title = `${lesson.title} — recode-rust`;
}

function setActivity(activity) {
  state.activity = activity;
  const isCode = activity === "code";
  elements.codePanel.hidden = !isCode;
  elements.quizPanel.hidden = isCode;
  elements.codeTab.classList.toggle("active", isCode);
  elements.quizTab.classList.toggle("active", !isCode);
  elements.codeTab.setAttribute("aria-selected", String(isCode));
  elements.quizTab.setAttribute("aria-selected", String(!isCode));
}

function selectChoice(index) {
  state.selectedChoice = index;
  elements.checkQuiz.disabled = false;
  for (const choice of elements.quizChoices.querySelectorAll(".quiz-choice")) {
    choice.classList.toggle("selected", Number(choice.dataset.choice) === index);
  }
  clearFeedback(elements.quizFeedback);
}

async function checkCode() {
  if (!state.current || elements.checkCode.disabled) return;
  setButtonBusy(elements.checkCode, true, "Checking…");
  clearFeedback(elements.codeFeedback);

  try {
    const result = await postJson(`/api/lessons/${state.current.id}/code`, { code: elements.codeEditor.value });
    showFeedback(elements.codeFeedback, result, "code");
    if (result.correct) completeActivity(state.current.id, "code");
  } catch (error) {
    showNetworkError(elements.codeFeedback, error);
  } finally {
    setButtonBusy(elements.checkCode, false, "Check code <kbd>⌘↵</kbd>");
  }
}

async function checkQuiz() {
  if (!state.current || state.selectedChoice === null || elements.checkQuiz.disabled) return;
  setButtonBusy(elements.checkQuiz, true, "Checking…");
  clearFeedback(elements.quizFeedback);

  try {
    const result = await postJson(`/api/lessons/${state.current.id}/quiz`, { choice: state.selectedChoice });
    showFeedback(elements.quizFeedback, result, "quiz");
    if (result.correct) completeActivity(state.current.id, "quiz");
  } catch (error) {
    showNetworkError(elements.quizFeedback, error);
  } finally {
    elements.checkQuiz.disabled = false;
    setButtonBusy(elements.checkQuiz, false, "Check answer");
  }
}

function showFeedback(container, result, activity) {
  container.hidden = false;
  container.className = `feedback ${result.correct ? "success" : "error"}`;
  const icon = result.correct ? "✓" : "!";
  const details = result.details?.length
    ? `<ul>${result.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ul>`
    : "";
  const explanation = result.explanation ? `<p>${escapeHtml(result.explanation)}</p>` : "";
  const solution = result.solution ? `
    <details>
      <summary>Compare with one reference solution</summary>
      <pre><code>${escapeHtml(result.solution)}</code></pre>
    </details>` : "";

  container.innerHTML = `
    <span class="feedback-icon">${icon}</span>
    <div><strong>${escapeHtml(result.message)}</strong>${details}${explanation}${solution}</div>`;

  if (result.correct && activity === "quiz") {
    for (const choice of elements.quizChoices.querySelectorAll(".quiz-choice")) {
      choice.disabled = true;
      choice.classList.toggle("correct", Number(choice.dataset.choice) === state.selectedChoice);
    }
  }
}

function showNetworkError(container, error) {
  console.error(error);
  container.hidden = false;
  container.className = "feedback error";
  container.innerHTML = `<span class="feedback-icon">!</span><div><strong>Could not check this activity.</strong><p>Confirm the server is still running and try again.</p></div>`;
}

function completeActivity(id, activity) {
  const key = `${id}:${activity}`;
  if (!state.progress.completed[key]) {
    state.progress.completed[key] = new Date().toISOString();
    saveProgress();
    showToast(`+${state.current.xp} XP · ${activity === "code" ? "Code task" : "Q&A"} complete`);
  }
  updateProgress();
  updateActivityStates();
  renderNavigation();
}

function updateProgress() {
  if (!state.curriculum) return;
  const validKeys = new Set(state.lessons.flatMap((lesson) => [`${lesson.id}:code`, `${lesson.id}:quiz`]));
  const completedKeys = Object.keys(state.progress.completed).filter((key) => validKeys.has(key));
  const complete = completedKeys.length;
  const percent = Math.round((complete / state.curriculum.activity_count) * 100);
  const xp = completedKeys.reduce((total, key) => {
    const id = key.split(":")[0];
    return total + (state.lessons.find((lesson) => lesson.id === id)?.xp || 0);
  }, 0);

  elements.progressPercent.textContent = `${percent}%`;
  elements.progressBar.style.width = `${percent}%`;
  elements.completedCount.textContent = complete;
  elements.earnedXp.textContent = xp.toLocaleString();
}

function updateActivityStates() {
  if (!state.current) return;
  const codeDone = isComplete(state.current.id, "code");
  const quizDone = isComplete(state.current.id, "quiz");
  elements.codeState.textContent = codeDone ? "✓" : "{ }";
  elements.quizState.textContent = quizDone ? "✓" : "?";
  elements.codeTab.classList.toggle("complete", codeDone);
  elements.quizTab.classList.toggle("complete", quizDone);
}

function updateLessonControls() {
  const index = state.lessons.findIndex((lesson) => lesson.id === state.current.id);
  elements.lessonPosition.textContent = `Lesson ${index + 1} of ${state.lessons.length}`;
  elements.previousLesson.disabled = index === 0;
  elements.nextLesson.disabled = index === state.lessons.length - 1;
}

function moveLesson(offset) {
  const index = state.lessons.findIndex((lesson) => lesson.id === state.current.id);
  const next = state.lessons[index + offset];
  if (next) selectLesson(next.id);
}

function handleEditorKeydown(event) {
  if (event.key !== "Tab") return;
  event.preventDefault();
  const editor = event.currentTarget;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  editor.value = `${editor.value.slice(0, start)}    ${editor.value.slice(end)}`;
  editor.selectionStart = editor.selectionEnd = start + 4;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function openNavigation() {
  elements.sidebar.classList.add("open");
  elements.navScrim.hidden = false;
  document.body.classList.add("nav-open");
}

function closeNavigation() {
  elements.sidebar.classList.remove("open");
  elements.navScrim.hidden = true;
  document.body.classList.remove("nav-open");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  elements.toast.classList.remove("show");
  requestAnimationFrame(() => elements.toast.classList.add("show"));
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("show");
    window.setTimeout(() => { elements.toast.hidden = true; }, 200);
  }, 2600);
}

function clearFeedback(container) {
  container.hidden = true;
  container.className = "feedback";
  container.innerHTML = "";
}

function setButtonBusy(button, busy, html) {
  button.disabled = busy;
  button.innerHTML = html;
}

function loadProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (value && typeof value.completed === "object") return value;
  } catch (_) {}
  return { completed: {} };
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function isComplete(id, activity) {
  return Boolean(state.progress.completed[`${id}:${activity}`]);
}

function activityCountForLesson(id) {
  return Number(isComplete(id, "code")) + Number(isComplete(id, "quiz"));
}

function isTyping(target) {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;",
  })[character]);
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

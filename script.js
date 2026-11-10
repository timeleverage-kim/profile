// ==========================================================================
// 다크 모드 및 상호작용 스크립트 (외부 라이브러리 없이 순수 JS)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('.theme-icon');
  const themeText = themeToggleBtn.querySelector('.theme-text');
  const htmlElement = document.documentElement;

  // 1. 테마 초기 설정 확인 (localStorage -> 시스템 설정 -> 기본값 라이트)
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  // 2. 테마 전환 버튼 이벤트 리스너
  themeToggleBtn.addEventListener('click', () => {
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // 3. 테마 적용 함수
  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '☀️';
      themeText.textContent = '라이트 모드';
      themeToggleBtn.setAttribute('aria-label', '라이트 모드로 전환');
    } else {
      htmlElement.removeAttribute('data-theme');
      themeIcon.textContent = '🌙';
      themeText.textContent = '다크 모드';
      themeToggleBtn.setAttribute('aria-label', '다크 모드로 전환');
    }
  }

  // 4. 올해 목표 체크리스트 및 프로그레스 바 업데이트
  const checkboxes = document.querySelectorAll('.goal-checkbox');
  const progressBarFill = document.getElementById('progress-bar-fill');
  const progressPercentage = document.getElementById('progress-percentage');
  const STORAGE_KEY = 'cs_freshman_goals';

  function updateProgress() {
    const total = checkboxes.length;
    const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = Math.round((completed / total) * 100);

    if (progressBarFill) {
      progressBarFill.style.width = `${percentage}%`;
    }
    if (progressPercentage) {
      progressPercentage.textContent = `${percentage}% (${completed}/${total})`;
    }
  }

  // 저장된 체크리스트 상태 불러오기
  try {
    const savedStates = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(savedStates) && savedStates.length === checkboxes.length) {
      checkboxes.forEach((cb, index) => {
        cb.checked = !!savedStates[index];
      });
    }
  } catch (e) {
    console.warn('목표 상태 로드 실패:', e);
  }

  // 초기 프로그레스 반영
  updateProgress();

  // 체크 변경 시 상태 저장 및 프로그레스 업데이트
  checkboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const states = Array.from(checkboxes).map(box => box.checked);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
      } catch (e) {
        console.warn('목표 상태 저장 실패:', e);
      }
      updateProgress();
    });
  });
});


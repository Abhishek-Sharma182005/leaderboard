export async function fetchGitHubContributions(username: string) {
  try {
    // In a real app, this would make an API call to GitHub
    // For now, returning a mock SVG
    return `
      <svg width="722" height="112" class="js-calendar-graph-svg">
        <g transform="translate(10, 20)">
          <g transform="translate(0, 0)">
            <rect class="day" width="10" height="10" x="0" y="0" fill="#ebedf0" data-count="0" data-date="2024-03-15"></rect>
            <rect class="day" width="10" height="10" x="0" y="13" fill="#9be9a8" data-count="2" data-date="2024-03-16"></rect>
            <rect class="day" width="10" height="10" x="0" y="26" fill="#40c463" data-count="5" data-date="2024-03-17"></rect>
            <rect class="day" width="10" height="10" x="0" y="39" fill="#30a14e" data-count="8" data-date="2024-03-18"></rect>
            <rect class="day" width="10" height="10" x="0" y="52" fill="#216e39" data-count="12" data-date="2024-03-19"></rect>
            <rect class="day" width="10" height="10" x="0" y="65" fill="#9be9a8" data-count="3" data-date="2024-03-20"></rect>
            <rect class="day" width="10" height="10" x="0" y="78" fill="#ebedf0" data-count="0" data-date="2024-03-21"></rect>
          </g>
          <g transform="translate(13, 0)">
            <rect class="day" width="10" height="10" x="0" y="0" fill="#9be9a8" data-count="2" data-date="2024-03-22"></rect>
            <rect class="day" width="10" height="10" x="0" y="13" fill="#9be9a8" data-count="3" data-date="2024-03-23"></rect>
            <rect class="day" width="10" height="10" x="0" y="26" fill="#40c463" data-count="6" data-date="2024-03-24"></rect>
            <rect class="day" width="10" height="10" x="0" y="39" fill="#30a14e" data-count="7" data-date="2024-03-25"></rect>
            <rect class="day" width="10" height="10" x="0" y="52" fill="#9be9a8" data-count="2" data-date="2024-03-26"></rect>
            <rect class="day" width="10" height="10" x="0" y="65" fill="#9be9a8" data-count="1" data-date="2024-03-27"></rect>
            <rect class="day" width="10" height="10" x="0" y="78" fill="#ebedf0" data-count="0" data-date="2024-03-28"></rect>
          </g>
          <g transform="translate(26, 0)">
            <rect class="day" width="10" height="10" x="0" y="0" fill="#9be9a8" data-count="1" data-date="2024-03-29"></rect>
            <rect class="day" width="10" height="10" x="0" y="13" fill="#40c463" data-count="4" data-date="2024-03-30"></rect>
            <rect class="day" width="10" height="10" x="0" y="26" fill="#30a14e" data-count="9" data-date="2024-03-31"></rect>
            <rect class="day" width="10" height="10" x="0" y="39" fill="#216e39" data-count="15" data-date="2024-04-01"></rect>
            <rect class="day" width="10" height="10" x="0" y="52" fill="#40c463" data-count="5" data-date="2024-04-02"></rect>
            <rect class="day" width="10" height="10" x="0" y="65" fill="#9be9a8" data-count="2" data-date="2024-04-03"></rect>
            <rect class="day" width="10" height="10" x="0" y="78" fill="#9be9a8" data-count="1" data-date="2024-04-04"></rect>
          </g>
          <g transform="translate(39, 0)">
            <rect class="day" width="10" height="10" x="0" y="0" fill="#9be9a8" data-count="3" data-date="2024-04-05"></rect>
            <rect class="day" width="10" height="10" x="0" y="13" fill="#40c463" data-count="6" data-date="2024-04-06"></rect>
            <rect class="day" width="10" height="10" x="0" y="26" fill="#30a14e" data-count="8" data-date="2024-04-07"></rect>
            <rect class="day" width="10" height="10" x="0" y="39" fill="#40c463" data-count="4" data-date="2024-04-08"></rect>
            <rect class="day" width="10" height="10" x="0" y="52" fill="#9be9a8" data-count="2" data-date="2024-04-09"></rect>
            <rect class="day" width="10" height="10" x="0" y="65" fill="#9be9a8" data-count="1" data-date="2024-04-10"></rect>
            <rect class="day" width="10" height="10" x="0" y="78" fill="#ebedf0" data-count="0" data-date="2024-04-11"></rect>
          </g>
          <g transform="translate(52, 0)">
            <rect class="day" width="10" height="10" x="0" y="0" fill="#9be9a8" data-count="1" data-date="2024-04-12"></rect>
            <rect class="day" width="10" height="10" x="0" y="13" fill="#9be9a8" data-count="2" data-date="2024-04-13"></rect>
            <rect class="day" width="10" height="10" x="0" y="26" fill="#40c463" data-count="5" data-date="2024-04-14"></rect>
            <rect class="day" width="10" height="10" x="0" y="39" fill="#30a14e" data-count="7" data-date="2024-04-15"></rect>
            <rect class="day" width="10" height="10" x="0" y="52" fill="#40c463" data-count="4" data-date="2024-04-16"></rect>
            <rect class="day" width="10" height="10" x="0" y="65" fill="#9be9a8" data-count="2" data-date="2024-04-17"></rect>
            <rect class="day" width="10" height="10" x="0" y="78" fill="#9be9a8" data-count="1" data-date="2024-04-18"></rect>
          </g>
        </g>
      </svg>
    `
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error)
    throw error
  }
}


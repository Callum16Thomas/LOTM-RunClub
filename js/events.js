/* Renders the upcoming-runs list from data/events.json, ordered by date. */

(async function () {
  const listEl = document.getElementById('event-list');
  if (!listEl) return;

  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  try {
    const res = await fetch('data/events.json');
    let events = await res.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    events = events
      .filter(e => new Date(e.date + 'T00:00:00') >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (events.length === 0) {
      listEl.innerHTML = '<p class="empty-state">No runs on the calendar yet — check back soon, or add one in data/events.json.</p>';
      return;
    }

    listEl.innerHTML = '';
    events.forEach(evt => {
      const d = new Date(evt.date + 'T00:00:00');
      const row = document.createElement('div');
      row.className = 'event-row';
      row.innerHTML = `
        <div class="event-date">
          <span class="day">${d.getDate()}</span>
          <span class="month">${MONTHS[d.getMonth()]}</span>
        </div>
        <div class="event-info">
          <h3>${evt.title}</h3>
          <p>${evt.description}</p>
        </div>
        <div class="event-meta">${evt.location}</div>
      `;
      listEl.appendChild(row);
    });
  } catch (err) {
    listEl.innerHTML = '<p class="empty-state">Couldn\'t load events right now — check data/events.json.</p>';
    console.error(err);
  }
})();

// SpendWise — client-side expense tracker.
// Data is kept in the visitor's browser (localStorage) so each person's spending stays private.
(() => {
  const STORAGE_KEY = 'spendwise.expenses.v1';
  const BUDGET_KEY = 'spendwise.budget.v1';
  const CATEGORIES = ['Food', 'Transport', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Education', 'Other'];

  const $ = (id) => document.getElementById(id);
  const money = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' });
  const today = () => new Date().toISOString().slice(0, 10);

  const load = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  };
  let expenses = load(STORAGE_KEY, []);
  let budget = Number(load(BUDGET_KEY, 0)) || 0;

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  };

  const form = $('expenseForm');
  const budgetForm = $('budgetForm');
  const monthFilter = $('monthFilter');
  const categoryFilter = $('categoryFilter');

  CATEGORIES.forEach((c) => categoryFilter.append(new Option(c, c)));
  form.date.value = today();
  monthFilter.value = today().slice(0, 7);
  if (budget) budgetForm.budget.value = budget;
  $('year').textContent = new Date().getFullYear();

  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function inMonth(e) { return !monthFilter.value || e.date.startsWith(monthFilter.value); }
  function visible() {
    return expenses
      .filter(inMonth)
      .filter((e) => !categoryFilter.value || e.category === categoryFilter.value)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  }

  function render() {
    const monthItems = expenses.filter(inMonth);
    const spent = monthItems.reduce((s, e) => s + e.amount, 0);

    // Stats
    $('statSpent').textContent = money.format(spent);
    $('statCount').textContent = monthItems.length;
    const remaining = $('statRemaining');
    if (budget) {
      remaining.textContent = money.format(budget - spent);
      remaining.classList.toggle('negative', spent > budget);
    } else {
      remaining.textContent = '—';
      remaining.classList.remove('negative');
    }

    // Hero card
    $('heroSpent').textContent = money.format(spent);
    const meter = $('heroMeter');
    const pct = budget ? Math.min(100, (spent / budget) * 100) : 0;
    meter.style.width = pct + '%';
    meter.classList.toggle('over', budget > 0 && spent > budget);
    $('heroCaption').textContent = budget
      ? `${Math.round((spent / budget) * 100)}% of your ${money.format(budget)} budget`
      : 'Set a budget to see your progress';

    // Category bars
    const totals = {};
    monthItems.forEach((e) => { totals[e.category] = (totals[e.category] || 0) + e.amount; });
    const max = Math.max(0, ...Object.values(totals));
    const bars = $('categoryBars');
    bars.innerHTML = '';
    const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    if (!entries.length) {
      bars.innerHTML = '<li class="muted">Nothing spent yet this period.</li>';
    }
    entries.forEach(([cat, total]) => {
      const li = document.createElement('li');
      li.innerHTML = `<span></span><div class="track"><div class="fill"></div></div><span class="amt"></span>`;
      li.children[0].textContent = cat;
      li.querySelector('.fill').style.width = (total / max) * 100 + '%';
      li.querySelector('.amt').textContent = money.format(total);
      bars.append(li);
    });

    // Expense list
    const list = $('expenseList');
    list.innerHTML = '';
    const items = visible();
    $('emptyState').hidden = items.length > 0;
    items.forEach((e) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="tag"></span>
        <div class="desc"><strong></strong><span></span></div>
        <span class="price"></span>
        <button class="delete" type="button" aria-label="Delete expense" title="Delete">×</button>`;
      li.querySelector('.tag').textContent = e.category;
      li.querySelector('strong').textContent = e.description;
      li.querySelector('.desc span').textContent = new Date(e.date + 'T00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
      li.querySelector('.price').textContent = money.format(e.amount);
      li.querySelector('.delete').addEventListener('click', () => {
        expenses = expenses.filter((x) => x.id !== e.id);
        save();
        render();
        toast('Expense deleted');
      });
      list.append(li);
    });
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const description = form.description.value.trim();
    const amount = Math.round(parseFloat(form.amount.value) * 100) / 100;
    const error = $('formError');
    if (!description) return (error.textContent = 'Please add a description.');
    if (!(amount > 0)) return (error.textContent = 'Amount must be greater than zero.');
    error.textContent = '';

    expenses.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      description,
      amount,
      category: form.category.value,
      date: form.date.value || today(),
      createdAt: Date.now(),
    });
    save();
    const date = form.date.value;
    form.reset();
    form.date.value = date;
    form.description.focus();
    render();
    toast('Expense added');
  });

  budgetForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    budget = Math.max(0, Number(budgetForm.budget.value) || 0);
    save();
    render();
    toast(budget ? `Budget set to ${money.format(budget)}` : 'Budget cleared');
  });

  monthFilter.addEventListener('change', render);
  categoryFilter.addEventListener('change', render);

  $('exportBtn').addEventListener('click', () => {
    const rows = visible();
    if (!rows.length) return toast('Nothing to export');
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = ['Date,Description,Category,Amount', ...rows.map((e) => [e.date, esc(e.description), e.category, e.amount.toFixed(2)].join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `spendwise-${monthFilter.value || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  render();
})();


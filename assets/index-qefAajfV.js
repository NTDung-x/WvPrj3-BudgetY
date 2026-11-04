(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={TRANSACTIONS:`transactions`,CATEGORIES:`categories`},t=[{id:`1`,name:`Lương`,type:`income`},{id:`2`,name:`Đầu tư`,type:`income`},{id:`3`,name:`Làm thêm`,type:`income`},{id:`4`,name:`Ăn uống`,type:`expense`},{id:`5`,name:`Di chuyển`,type:`expense`},{id:`6`,name:`Nhà ở`,type:`expense`},{id:`7`,name:`Mua sắm`,type:`expense`},{id:`8`,name:`Giải trí`,type:`expense`}],n={getTransactions(){let t=localStorage.getItem(e.TRANSACTIONS);return t?JSON.parse(t):[]},saveTransactions(t){localStorage.setItem(e.TRANSACTIONS,JSON.stringify(t))},getCategories(){let n=localStorage.getItem(e.CATEGORIES);return n?JSON.parse(n):(this.saveCategories(t),t)},saveCategories(t){localStorage.setItem(e.CATEGORIES,JSON.stringify(t))}},r=new class{transactions=[];categories=[];constructor(){this.transactions=n.getTransactions(),this.categories=n.getCategories()}getTransactions(){return[...this.transactions].sort((e,t)=>t.createdAt-e.createdAt)}addTransaction(e){let t={...e,id:crypto.randomUUID(),createdAt:Date.now()};return this.transactions.push(t),n.saveTransactions(this.transactions),t}deleteTransaction(e){let t=this.transactions.length;return this.transactions=this.transactions.filter(t=>t.id!==e),this.transactions.length!==t&&(n.saveTransactions(this.transactions),!0)}getSummary(){return this.transactions.reduce((e,t)=>(t.type===`income`?(e.totalIncome+=t.amount,e.balance+=t.amount):t.type===`expense`&&(e.totalExpense+=t.amount,e.balance-=t.amount),e),{totalIncome:0,totalExpense:0,balance:0})}getCategories(e){return e?this.categories.filter(t=>t.type===e):[...this.categories]}getCategoryById(e){return this.categories.find(t=>t.id===e)}getOrCreateCategory(e,t){let r=e.trim(),i=this.categories.find(e=>e.name.toLowerCase()===r.toLowerCase()&&e.type===t);if(i)return i;let a={id:crypto.randomUUID(),name:r,type:t};return this.categories.push(a),n.saveCategories(this.categories),a}},i=(e,t=`VND`)=>Number.isFinite(e)?Math.abs(e)>=0xe8d4a51000?`${e.toExponential(2).replace(/\.00(?=e)/,``).replace(/(\.[0-9])0(?=e)/,`$1`).replace(`+`,``)} đ`:new Intl.NumberFormat(`vi-VN`,{style:`currency`,currency:t,maximumFractionDigits:0}).format(e):`0 đ`,a=e=>{if(!e)return``;let[t,n,r]=e.split(`-`);return`${r}/${n}/${t}`},o=()=>{let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`},s=()=>new Date().toLocaleDateString(`vi-VN`,{weekday:`long`,day:`numeric`,month:`long`,year:`numeric`}),c=()=>{let{balance:e}=r.getSummary(),t=e<0?`text-red-500`:`text-stone-50`;return`
    <header class="basis-1/3 shrink-0 flex flex-col items-center justify-center gap-2 px-4 select-none">
      <!-- Thời gian hiện tại -->
      <p id="overview-time" class="text-sm sm:text-base text-stone-400 tabular-nums capitalize text-center">
        ${s()}
      </p>

      <!-- Số dư -->
      <p class="text-xs uppercase tracking-[0.25em] text-stone-500 font-medium">
        Số dư hiện tại
      </p>

      <!-- Số tiền -->
      <h1 id="overview-balance" class="text-5xl sm:text-7xl font-semibold tabular-nums tracking-tight ${t}">
        ${i(e)}
      </h1>

      <!-- Dialog -->
      <button
        id="btn-open-dialog"
        type="button"
        class="mt-3 rounded-full bg-stone-100 text-stone-900 px-6 py-2.5 text-sm font-medium hover:bg-white active:scale-95 transition cursor-pointer shadow-sm"
      >
        + Thêm giao dịch
      </button>
    </header>
  `},l=e=>{let t=document.querySelector(`#btn-open-dialog`);t&&t.addEventListener(`click`,e)},u=()=>{let e=document.querySelector(`#overview-balance`);if(e){let{balance:t}=r.getSummary();e.textContent=i(t),e.className=`text-5xl sm:text-7xl font-semibold tabular-nums tracking-tight ${t<0?`text-red-500`:`text-stone-50`}`}},d=`expense`,f=`w-full rounded-lg bg-stone-800 border border-stone-700/80 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-400 transition`,p=()=>{let e=d===`income`;return`
    <div id="dialog-backdrop" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 select-none">
      <form
        id="dialog-form"
        role="dialog"
        aria-modal="true"
        class="w-full max-w-md rounded-2xl bg-stone-900 border border-stone-700/80 p-6 space-y-4 shadow-2xl"
      >
        <h2 class="text-lg font-semibold text-stone-100">Thêm giao dịch mới</h2>

        <!-- Tabs chuyển loại giao dịch -->
        <div class="grid grid-cols-2 gap-1 p-1 rounded-lg bg-stone-800">
          <button
            type="button"
            id="tab-income"
            class="rounded-md py-2 text-sm font-medium transition cursor-pointer ${e?`bg-emerald-600 text-white`:`text-stone-400 hover:text-white`}"
          >
            Thu nhập
          </button>
          <button
            type="button"
            id="tab-expense"
            class="rounded-md py-2 text-sm font-medium transition cursor-pointer ${e?`text-stone-400 hover:text-white`:`bg-red-600 text-white`}"
          >
            Chi tiêu
          </button>
        </div>

        <!-- Số tiền -->
        <label class="block space-y-1.5 text-xs text-stone-400">
          Số tiền (VND)
          <input
            id="dialog-amount"
            class="${f}"
            type="number"
            min="1000"
            step="1000"
            required
            autofocus
            placeholder="0"
          />
        </label>

        <!-- Danh mục -->
        <div class="space-y-1.5 text-xs text-stone-400 relative" id="combobox-wrapper">
          <label for="dialog-category-input" class="block">Danh mục</label>
          <div class="relative">
            <input
              id="dialog-category-input"
              class="${f} pr-9"
              type="text"
              required
              autocomplete="off"
              placeholder="Danh mục"
            />
            <button
              type="button"
              id="btn-toggle-category"
              tabindex="-1"
              class="absolute inset-y-0 right-0 flex items-center px-2.5 text-stone-400 hover:text-stone-200 cursor-pointer"
              title="Xem danh mục"
            >
              <svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <!-- Dropdown -->
          <ul
            id="category-dropdown"
            class="hidden absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto bg-stone-800 border border-stone-700 rounded-lg shadow-xl z-20 py-1 divide-y divide-stone-700/50"
          >
          </ul>
        </div>

        <!-- Ghi chú -->
        <label class="block space-y-1.5 text-xs text-stone-400">
          Nội dung ghi chú
          <input
            id="dialog-desc"
            class="${f}"
            type="text"
            placeholder="Ghi chú (tùy chọn)"
          />
        </label>

        <!-- Ngày giao dịch -->
        <label class="block space-y-1.5 text-xs text-stone-400">
          Ngày giao dịch
          <input
            id="dialog-date"
            class="${f}"
            type="date"
            required
            value="${o()}"
          />
        </label>

        <!-- Button -->
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            id="dialog-btn-cancel"
            class="flex-1 rounded-lg border border-stone-700 py-2.5 text-sm font-medium text-stone-300 cursor-pointer hover:bg-stone-800 transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            id="dialog-btn-submit"
            class="flex-1 rounded-lg py-2.5 text-sm font-medium text-white cursor-pointer transition ${e?`bg-emerald-600 hover:bg-emerald-500`:`bg-red-600 hover:bg-red-500`}"
          >
            Lưu ${e?`thu nhập`:`chi tiêu`}
          </button>
        </div>
      </form>
    </div>
  `},m=e=>{let t=document.querySelector(`#dialog-backdrop`),n=document.querySelector(`#dialog-form`),i=document.querySelector(`#dialog-btn-cancel`),a=document.querySelector(`#tab-expense`),o=document.querySelector(`#tab-income`),s=document.querySelector(`#dialog-btn-submit`),c=document.querySelector(`#combobox-wrapper`),l=document.querySelector(`#dialog-category-input`),u=document.querySelector(`#btn-toggle-category`),f=document.querySelector(`#category-dropdown`),p=()=>{window.removeEventListener(`keydown`,m),e()},m=e=>{e.key===`Escape`&&p()};window.addEventListener(`keydown`,m);let h=(e=``)=>{if(!f)return;let t=r.getCategories(d),n=e.trim().toLowerCase(),i=t.filter(e=>e.name.toLowerCase().includes(n));i.length===0?f.innerHTML=`
        <li class="px-3 py-2 text-xs text-stone-400 italic">
          Danh mục mới: "${e.trim()}"
        </li>
      `:f.innerHTML=i.map(e=>`
        <li
          class="px-3 py-2 text-sm text-stone-200 hover:bg-stone-700/70 hover:text-white cursor-pointer transition flex items-center justify-between"
          data-name="${e.name}"
        >
          <span>${e.name}</span>
        </li>
      `).join(``)},g=()=>{f&&l&&(h(l.value),f.classList.remove(`hidden`))},_=()=>{f&&f.classList.add(`hidden`)};l?.addEventListener(`input`,()=>{g()}),l?.addEventListener(`focus`,()=>{g()}),u?.addEventListener(`click`,e=>{e.stopPropagation(),f&&(f.classList.contains(`hidden`)?(g(),l?.focus()):_())}),f?.addEventListener(`click`,e=>{let t=e.target.closest(`li[data-name]`);t?.dataset.name&&l&&(l.value=t.dataset.name,_(),l.focus())}),document.addEventListener(`click`,e=>{c&&!c.contains(e.target)&&_()});let v=e=>{d=e;let t=d===`income`;a&&o&&(a.className=`rounded-md py-2 text-sm font-medium transition cursor-pointer ${t?`text-stone-400 hover:text-white`:`bg-red-600 text-white`}`,o.className=`rounded-md py-2 text-sm font-medium transition cursor-pointer ${t?`bg-emerald-600 text-white`:`text-stone-400 hover:text-white`}`),l&&(l.value=``),_(),s&&(s.className=`flex-1 rounded-lg py-2.5 text-sm font-medium text-white cursor-pointer transition ${t?`bg-emerald-600 hover:bg-emerald-500`:`bg-red-600 hover:bg-red-500`}`,s.textContent=`Lưu ${t?`thu nhập`:`chi tiêu`}`)};a?.addEventListener(`click`,()=>v(`expense`)),o?.addEventListener(`click`,()=>v(`income`)),t?.addEventListener(`mousedown`,e=>{e.target===t&&p()}),i?.addEventListener(`click`,p),n?.addEventListener(`submit`,e=>{e.preventDefault();let t=document.querySelector(`#dialog-amount`),n=document.querySelector(`#dialog-desc`),i=document.querySelector(`#dialog-date`);if(!t||!i||!l)return;let a=Number.parseFloat(t.value),o=l.value.trim();if(!a||a<=0||!o)return;let s=r.getOrCreateCategory(o,d);r.addTransaction({type:d,amount:a,categoryId:s.id,description:n?.value.trim()??``,date:i.value}),p(),document.dispatchEvent(new CustomEvent(`budgety:updated`))})},h=(e,t,n)=>{if(e.length===0)return`<li class="text-sm text-stone-500 text-center py-10">${n}</li>`;let o=t===`emerald`,s=o?`text-emerald-400`:`text-red-500`,c=o?`text-emerald-400/90`:`text-red-400/90`,l=o?`hover:bg-emerald-950/40`:`hover:bg-red-950/40`,u=o?`+`:`-`;return e.map(e=>{let t=r.getCategoryById(e.categoryId)?.name??`Khác`;return`
        <li class="flex items-center justify-between gap-3 rounded-xl bg-stone-900/60 ${l} border border-stone-800/40 px-4 py-3.5 transition group overflow-x-hidden">
          <div class="min-w-0">
            <p class="text-sm font-normal text-stone-100 truncate">
              ${e.description||t}
            </p>
            <p class="text-xs text-stone-400 mt-1">
              <span class="${c} font-normal">${t}</span>
              <span> · </span>
              <span>${a(e.date)}</span>
            </p>
          </div>

          <div class="relative flex items-center justify-end shrink-0">
            <span class="font-normal tabular-nums whitespace-nowrap text-base ${s} transition-transform duration-200 ease-out group-hover:-translate-x-10">
              ${u}${i(e.amount)}
            </span>
            <button
              type="button"
              data-action="delete"
              data-id="${e.id}"
              class="absolute right-0 text-xs text-stone-500 hover:text-red-400 transition-opacity duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
              title="Xóa giao dịch"
            >
              Xóa
            </button>
          </div>
        </li>
      `}).join(``)},g=()=>{let e=r.getTransactions(),t=e.filter(e=>e.type===`income`),n=e.filter(e=>e.type===`expense`),a=t.reduce((e,t)=>e+t.amount,0),o=n.reduce((e,t)=>e+t.amount,0);return`
    <main class="h-full grid grid-cols-1 md:grid-cols-2 gap-8 px-6 lg:px-12 max-w-7xl mx-auto w-full">
      <!-- Thu nhập -->
      <section class="h-full flex flex-col min-h-0">
        <div class="py-4 text-center">
          <h2 class="text-xs uppercase tracking-[0.25em] text-emerald-400 font-normal">
            Thu nhập
          </h2>
          <div class="mt-1 flex items-center justify-center gap-4 font-normal tabular-nums">
            <span class="text-emerald-400 text-2xl">
              +${i(a)}
            </span>
            <span class="text-stone-400 font-normal text-m">
              trên ${t.length} giao dịch
            </span>
          </div>
        </div>
        <ul id="income-list-container" class="flex-1 overflow-y-auto space-y-2.5 pr-2">
          ${h(t,`emerald`,`Chưa có khoản thu nhập nào`)}
        </ul>
      </section>

      <!-- Chi tiêu -->
      <section class="h-full flex flex-col min-h-0">
        <div class="py-4 text-center">
          <h2 class="text-xs uppercase tracking-[0.25em] text-red-500 font-normal">
            Chi tiêu
          </h2>
          <div class="mt-1 flex items-center justify-center gap-4 font-normal tabular-nums">
            <span class="text-red-500 text-2xl">
              -${i(o)}
            </span>
            <span class="text-stone-400 font-normal text-m">
              trên ${n.length} giao dịch
            </span>
          </div>
        </div>
        <ul id="expense-list-container" class="flex-1 overflow-y-auto space-y-2.5 pr-2">
          ${h(n,`red`,`Chưa có khoản chi tiêu nào`)}
        </ul>
      </section>
    </main>
  `},_=()=>{let e=document.querySelector(`#trans-details-container`);e&&(e.innerHTML=g())},v=()=>{let e=document.querySelector(`#trans-details-container`);e&&e.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action="delete"]`);if(t){let e=t.dataset.id;if(!e)return;window.confirm(`Bạn có chắc chắn muốn xóa giao dịch này không?`)&&(r.deleteTransaction(e),document.dispatchEvent(new CustomEvent(`budgety:updated`)))}})},y=document.querySelector(`#app`),b=()=>{let e=document.querySelector(`#dialog-container`);e&&(e.innerHTML=p(),m(x))},x=()=>{let e=document.querySelector(`#dialog-container`);e&&(e.innerHTML=``)};y&&(y.innerHTML=`
    <div id="app-root" class="relative h-screen flex flex-col bg-stone-950 text-stone-100 font-sans select-none overflow-hidden">
      
      <!-- Background (sẽ thêm hiệu ứng/hình nền sau) -->
      <div id="app-bg-layer" class="absolute inset-0 pointer-events-none -z-10"></div>

      <!-- Overview & Thống kê số dư -->
      ${c()}

      <!-- Chi tiết Thu nhập & Chi tiêu -->
      <div id="trans-details-container" class="basis-2/3 min-h-0 pb-6">
        ${g()}
      </div>

      <!-- Dialog -->
      <div id="dialog-container"></div>
    </div>
  `,l(b),v(),document.addEventListener(`budgety:updated`,()=>{u(),_()}));
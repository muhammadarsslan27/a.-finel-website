// ===== PRODUCTS DATA (yahan naye products add karein) =====
const CATS = [
  { key: "clothes", label: "Clothes", icon: "fa-solid fa-shirt", base: 4900, hero: "Tailored for Quiet Confidence", kw: "fashion,clothing",
    names: ["Ivory Linen Shirt","Midnight Wool Coat","Cashmere Roll Neck","Tailored Charcoal Suit","Silk Evening Dress","Camel Overcoat","Pleated Trousers","Merino Knit Cardigan","Oxford Cotton Shirt","Velvet Dinner Jacket","Embroidered Kurta","Pashmina Shawl","Double Breasted Blazer","Cotton Poplin Kameez","Silk Blend Waistcoat"] },
  { key: "shoes", label: "Shoes", icon: "fa-solid fa-shoe-prints", base: 6400, hero: "Every Step, Considered", kw: "shoes,leather",
    names: ["Patent Leather Oxfords","Hand Stitched Loafers","Suede Chelsea Boots","Minimal White Sneakers","Monk Strap Brogues","Peshawari Chappal","Velvet Slippers","Derby Calfskin Shoes","Leather Ankle Boots","Stiletto Heels","Espadrille Flats","Driving Moccasins","Wingtip Brogues","Court Heels","Desert Boots"] },
  { key: "watches", label: "Watches", icon: "fa-solid fa-clock", base: 12900, hero: "Timepieces of Quiet Power", kw: "wristwatch,luxury",
    names: ["Gold Skeleton Automatic","Steel Chronograph","Leather Dress Watch","Moonphase Classic","Rose Gold Slim","Dive Master 300","Pilot GMT","Ceramic Sport","Minimal Bauhaus","Open Heart Automatic","Titanium Field Watch","Mother of Pearl Ladies","Perpetual Calendar","Two Tone Bracelet","Vintage Racing Chrono"] },
  { key: "fragrances", label: "Fragrances", icon: "fa-solid fa-spray-can-sparkles", base: 5400, hero: "Fragrances That Linger", kw: "perfume,bottle",
    names: ["Oud Royale","Amber Noir","Rose Taif Elixir","Velvet Musk","Saffron Intense","White Oud Attar","Cedar & Smoke","Jasmine Nuit","Bergamot Azure","Leather Bois","Vanilla Absolu","Sandalwood Reserve","Citrus Imperial","Midnight Iris","Patchouli Gold"] },
  { key: "jewelry", label: "Jewelry", icon: "fa-solid fa-gem", base: 8900, hero: "Heirlooms in the Making", kw: "jewelry,gold",
    names: ["Solitaire Diamond Ring","Pearl Drop Earrings","Gold Chain Necklace","Emerald Cocktail Ring","Kundan Choker","Tennis Bracelet","Sapphire Pendant","Signet Gold Ring","Polki Jhumkas","Rose Gold Bangle","Ruby Stud Earrings","Layered Chain Set","Diamond Nose Pin","Anklet Payal Pair","Heritage Gold Cuff"] },
];

const PRODUCTS = {};
CATS.forEach(c => {
  PRODUCTS[c.key] = c.names.map((name, i) => {
    const price = c.base + i * 1450, sale = i % 3 === 0;
    return { id: c.key + "-" + (i + 1), name, cat: c.label, icon: c.icon, price,
      old: sale ? price * 2 : null, badge: sale ? "50% Off" : (i % 5 === 1 ? "New" : null) };
  });
});
const ALL = Object.values(PRODUCTS).flat();
const rs = n => "Rs. " + n.toLocaleString();
const page = document.body.dataset.page;
const $ = id => document.getElementById(id);

// ===== NAV + SIDEBAR (About link add) =====
const links = $("links");
links.innerHTML = `<li><a href="index.html" class="${page==="index"?"active":""}">Home</a></li>` +
  CATS.map(c => `<li><a href="${c.key}.html" class="${page===c.key?"active":""}">${c.label}</a></li>`).join("") +
  `<li><a href="about.html" class="${page==="about"?"active":""}">About</a></li>`;
$("sidebar").innerHTML += CATS.map(c =>
  `<a href="${c.key}.html" class="${page===c.key?"active":""}"><i class="${c.icon}"></i>${c.label}</a>`).join("") +
  `<a href="about.html" class="${page==="about"?"active":""}"><i class="fa-solid fa-circle-info"></i>About</a>`;
$("burger").onclick = () => links.classList.toggle("open");

// ===== SLIDER (index) =====
const main = $("main");
if (page === "index") {
  let cur = 0; const dots = document.querySelectorAll(".dot");
  const go = i => { cur=i; $("track").style.transform = `translateX(-${i*100}%)`; dots.forEach((d,j)=>d.classList.toggle("on",j===i)); };
  dots.forEach(d=>d.onclick=()=>go(+d.dataset.i)); setInterval(()=>go((cur+1)%3),5000);
}

// ===== CART (browser mein save hota hai) =====
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let pay = "Cash on Delivery";
function save() { localStorage.setItem("cart", JSON.stringify(cart)); $("cartCount").textContent = cart.length; }
function render() {
  $("cartList").innerHTML = cart.length ? cart.map((id, i) => {
    const p = ALL.find(x => x.id === id);
    return `<div class="cart-row"><span>${p.name}</span><span class="price">${rs(p.price)}</span><button data-rm="${i}">✕</button></div>`;
  }).join("") : "<p>The cart is null.</p>";
  const sub = cart.reduce((s, id) => s + ALL.find(x => x.id === id).price, 0);
  const ship = sub > 0 && sub < 10000 ? 250 : 0;
  $("summary").innerHTML = `<div><span>Subtotal</span><span>${rs(sub)}</span></div>
    <div><span>Delivery</span><span>${ship ? rs(ship) : "Free"}</span></div>
    <div class="tot"><span>Total</span><span>${rs(sub + ship)}</span></div>`;
}
// ===== ADD TO CART POPUP =====
let popT;
function popup(p, src) {
  document.querySelector(".pop")?.remove(); clearTimeout(popT);
  const d = document.createElement("div"); d.className = "pop";
  d.innerHTML = `<div class="p-top"><i class="fa-solid fa-circle-check"></i> Added to Cart</div>
    <div class="p-body"><img src="${src}" alt=""><div><h4>${p.name}</h4><p>${rs(p.price)}</p></div></div>
    <div class="p-btns"><button class="alt" data-x="1">Continue</button><button data-x="2">View Cart</button></div>`;
  document.body.appendChild(d); requestAnimationFrame(() => d.classList.add("show"));
  const close = () => { d.classList.remove("show"); setTimeout(() => d.remove(), 450); };
  d.querySelector('[data-x="1"]').onclick = close;
  d.querySelector('[data-x="2"]').onclick = () => { close(); render(); $("overlay").classList.add("show"); };
  popT = setTimeout(close, 4000);
}
main.addEventListener("click", e => {
  const b = e.target.closest(".atc"); if (!b) return;
  const p = ALL.find(x => x.id === b.dataset.id); if (!p) return;
  cart.push(p.id); save(); popup(p, b.closest(".card").querySelector("img")?.src || "");
  b.textContent = "Added ✓"; setTimeout(() => b.textContent = "Add to Cart", 1200);
});
$("cartList").addEventListener("click", e => {
  if (e.target.dataset.rm) { cart.splice(+e.target.dataset.rm, 1); save(); render(); }
});
$("cartBtn").onclick = () => { render(); $("overlay").classList.add("show"); };
$("closeCart").onclick = () => $("overlay").classList.remove("show");
$("overlay").addEventListener("click", e => { if (e.target.id === "overlay") $("overlay").classList.remove("show"); });
// ===== PAYMENT METHODS (account details yahan apni daal dein) =====
const PAYCFG = {
  "Cash on Delivery": { icon: "fa-money-bill", note: ["Pay cash to the rider upon receiving the order.", "We will call you to confirm your order.", "A delivery fee of Rs. 250 applies to orders under Rs. 10,000."], need: null },
  "JazzCash": { icon: "fa-mobile-screen", rows: [["Account Title", "A. Luxury Store"], ["JazzCash Number", "0300-0000000"]], steps: ["Open your JazzCash app and select Send Money.", "Send the amount shown below to the number provided above.", "Please write the Transaction ID below to place your order."], need: "Transaction ID (TID)" },
  "EasyPaisa": { icon: "fa-wallet", rows: [["Account Title", "A. Luxury Store"], ["EasyPaisa Number", "0345-0000000"]], steps: ["Open your EasyPaisa app and select Send Money.", "Send the amount shown below to the number provided above.", "Please write the Transaction ID below to place your order."], need: "Transaction ID (TID)" },
  "Bank Transfer": { icon: "fa-building-columns", rows: [["Bank", "Meezan Bank"], ["Account Title", "A. Luxury Store"], ["Account No.", "0000-0000000000"], ["IBAN", "PK00MEZN0000000000000000"]], steps: ["Transfer the amount to the above account using your bank app or ATM.", "Enter the transfer reference number below.", "Place your order; it will be dispatched once payment is verified."], need: "Transaction / Reference No." }
};
const orderTotal = () => { const sub = cart.reduce((s, id) => s + ALL.find(x => x.id === id).price, 0); return sub + (sub > 0 && sub < 10000 ? 250 : 0); };
function showPay() {
  const c = PAYCFG[pay]; if (!c) return;
  const old = $("txnId") ? $("txnId").value : "";
  const rows = (c.rows || []).map(r => `<div class="rw"><span>${r[0]}</span><b>${r[1]}</b></div>`).join("");
  const amt = `<div class="rw"><span>${c.need ? "Amount to Send" : "Pay on Delivery"}</span><b>${rs(orderTotal())}</b></div>`;
  $("payInfo").innerHTML = `<h4><i class="fa-solid ${c.icon}"></i>${pay}</h4>${rows}${amt}<ol>${(c.steps || c.note).map(s => `<li>${s}</li>`).join("")}</ol>` +
    (c.need ? `<label>${c.need}</label><input id="txnId" placeholder="${c.need}">` : "");
  if (c.need && $("txnId")) $("txnId").value = old;
}
const _render = render; render = () => { _render(); showPay(); };
document.querySelectorAll(".pay-tab").forEach(t => t.onclick = () => {
  document.querySelectorAll(".pay-tab").forEach(x => x.classList.remove("on"));
  t.classList.add("on"); pay = t.dataset.pay; if ($("txnId")) $("txnId").value = ""; showPay();
});
$("placeBtn").onclick = () => {
  const name = $("fName").value.trim(), phone = $("fPhone").value.trim(), addr = $("fAddr").value.trim();
  const c = PAYCFG[pay], tx = $("txnId") ? $("txnId").value.trim() : "";
  if (!cart.length) return $("err").textContent = "Cart is empty.";
  if (!name || !phone || !addr) return $("err").textContent = "Please fill your name, phone & address.";
  if (c.need && !tx) return $("err").textContent = `Please enter ${c.need}.`;
  $("err").textContent = "";
  $("tyTitle").textContent = `Thank you, ${name}!`;
  $("tyText").textContent = c.need ? `Your order is submitted. We will verify your ${pay} payment (${tx}) and confirm on ${phone}.`
    : `Your order is submitted. We'll contact you on ${phone} to confirm — please pay cash on delivery.`;
  cart = []; save(); if ($("txnId")) $("txnId").value = "";
  $("overlay").classList.remove("show"); $("thanks").classList.add("show");
};
showPay();
$("tyClose").onclick = () => $("thanks").classList.remove("show");
save();

// ===== FOOTER (HTML mein hai, yahan sirf functionality) =====
$("fCart").onclick = e => { e.preventDefault(); render(); $("overlay").classList.add("show"); };
$("nlForm").onsubmit = e => {
  e.preventDefault(); const m = $("nlMail").value.trim();
  const list = JSON.parse(localStorage.getItem("subs") || "[]");
  if (list.includes(m)) { $("nlMsg").style.color = "#e0b45a"; $("nlMsg").textContent = "You have already subscribed ."; return; }
  list.push(m); localStorage.setItem("subs", JSON.stringify(list));
  $("nlMsg").style.color = "#7fd39b"; $("nlMsg").textContent = "thanks for! Subscribe  ✓"; $("nlForm").reset();
};
const tt = document.createElement("button"); tt.className = "totop"; tt.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
tt.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" }); document.body.appendChild(tt);
window.addEventListener("scroll", () => tt.classList.toggle("show", scrollY > 400));

// ===== ABOUT PAGE: contact form =====
if ($("contactForm")) $("contactForm").onsubmit = e => {
  e.preventDefault();
  const msgs = JSON.parse(localStorage.getItem("messages") || "[]");
  msgs.push({ name: $("cName").value, email: $("cMail").value, msg: $("cMsg").value, at: Date.now() });
  localStorage.setItem("messages", JSON.stringify(msgs));
  $("cOk").textContent = "Shukriya! Hum jald aap se rabta karenge ✓"; $("contactForm").reset();
};

// ===== SCROLL ANIMATION: content aram aram se aata hai (AOS library) =====
if (window.AOS) {
  AOS.init({ duration: 700, easing: "ease-out-cubic", once: true, offset: 60 });
  window.addEventListener("load", () => AOS.refreshHard());
  document.addEventListener("aos:in", e => setTimeout(() => { e.detail.style.transitionDelay = "0s"; }, 1300));
} else {
  document.querySelectorAll("[data-aos]").forEach(el => el.removeAttribute("data-aos")); // library load na ho to sab normal dikhe
}

/**
 * PANDIT CRANE SERVICE - MAIN JAVASCRIPT
 * Global interactive functions, modals, calculator, gallery lightbox, and utilities.
 */

// 1. MOBILE MENU CONTROLS
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const openIcon = document.getElementById('menuIconOpen');
    const closeIcon = document.getElementById('menuIconClose');
    if (!menu) return;
    
    menu.classList.toggle('hidden');
    if (openIcon) openIcon.classList.toggle('hidden');
    if (closeIcon) closeIcon.classList.toggle('hidden');
}

// 2. HERO SLIDER DATA & LOGIC (If on Homepage)
const heroSlides = [
    {
        sub: "We Lift Heavy, We Lift High",
        title: 'Modern Crane Fleet & <span class="text-brand-orange">Professional Rigging</span>',
        desc: "Operating a young, technologically advanced fleet of around 200 cranes across Rajasthan and Haryana. Equipped with Safe Load Indicators (SLI) and certified operators for zero-accident heavy lifting."
    },
    {
        sub: "Class Service & Competent Advice",
        title: 'Heavy Lifting Capacity From <span class="text-brand-orange">2 Tons to 700 Tons</span>',
        desc: "From agile Pick & Carry yard cranes to 700-Ton Lattice Boom & Hydraulic Crawler rigs for refinery, windmill, solar, and bridge infrastructure projects."
    },
    {
        sub: "20+ Years of Trustworthy Partnership",
        title: 'Zero-Accident Safety & <span class="text-brand-orange">24/7 Rapid Dispatch</span>',
        desc: "Serving Jaipur, Panipat, Pachpadra, Barmer, and Chittorgarh with pre-inspected D-shackles, slings, and experienced site supervisors."
    }
];
let currentSlide = 0;

function setHeroSlide(index) {
    const container = document.getElementById('heroSlideContainer');
    const heroSub = document.getElementById('heroSub');
    const heroTitle = document.getElementById('heroTitle');
    const heroDesc = document.getElementById('heroDesc');
    if (!container || !heroSub || !heroTitle || !heroDesc) return;

    currentSlide = index;
    container.style.opacity = '0';
    setTimeout(() => {
        heroSub.textContent = heroSlides[index].sub;
        heroTitle.innerHTML = heroSlides[index].title;
        heroDesc.textContent = heroSlides[index].desc;
        container.style.opacity = '1';
    }, 200);

    [0, 1, 2].forEach(i => {
        const btn = document.getElementById('slideDot' + i);
        if (btn) {
            const isSelected = (i === index);
            btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            const indicator = btn.querySelector('.dot-indicator');
            if (indicator) {
                if (isSelected) {
                    indicator.className = "dot-indicator w-8 h-2.5 rounded-full bg-brand-orange transition-all";
                } else {
                    indicator.className = "dot-indicator w-2.5 h-2.5 rounded-full bg-white/40 hover:bg-white/70 transition-all";
                }
            } else {
                if (isSelected) {
                    btn.className = "w-8 h-2.5 rounded-full bg-brand-orange transition-all";
                } else {
                    btn.className = "w-2.5 h-2.5 rounded-full bg-white/30 hover:bg-white/60 transition-all";
                }
            }
        }
    });
}

// 3. CRANE CAPACITY & COST ESTIMATOR CONFIGURATIONS
const equipmentConfigs = {
    hydraulic: {
        name: "Hydraulic Mobile Crane (Telescopic)",
        min: 20,
        max: 500,
        default: 120,
        step: 5,
        unit: "Tons",
        metricTitle: "2. Required Lifting Capacity",
        legend: ["20 Tons", "150 Tons", "350 Tons", "500T Max"],
        modelName: (v) => `${v}T Hydraulic Telescopic Crane + SLI`,
        baseDaily: (v) => 11000 + (v * 210)
    },
    lattice: {
        name: "Lattice Boom / Crawler Crane",
        min: 80,
        max: 700,
        default: 250,
        step: 10,
        unit: "Tons",
        metricTitle: "2. Required Lifting Capacity",
        legend: ["80 Tons", "250 Tons", "500 Tons", "700T Max"],
        modelName: (v) => `${v}T Lattice Boom / Crawler Crane`,
        baseDaily: (v) => 28000 + (v * 240)
    },
    pickcarry: {
        name: "Pick and Carry Industrial Crane",
        min: 2,
        max: 30,
        default: 15,
        step: 1,
        unit: "Tons",
        metricTitle: "2. Required Lifting Capacity",
        legend: ["2 Tons", "10 Tons", "20 Tons", "30T Max"],
        modelName: (v) => `${v}T Pick & Carry Industrial Crane`,
        baseDaily: (v) => 5500 + (v * 380)
    },
    trailer: {
        name: "Heavy Duty Low-Bed Trailer",
        min: 20,
        max: 250,
        default: 80,
        step: 5,
        unit: "Tons Payload",
        metricTitle: "2. Required Payload Capacity",
        legend: ["20 Tons", "80 Tons", "150 Tons", "250T Max"],
        modelName: (v) => `${v}T Low-Bed / Multi-Axle Trailer`,
        baseDaily: (v) => 9500 + (v * 180)
    },
    forklift: {
        name: "Industrial Forklift",
        min: 2,
        max: 25,
        default: 5,
        step: 1,
        unit: "Tons",
        metricTitle: "2. Required Lifting Capacity",
        legend: ["2 Tons", "5 Tons", "15 Tons", "25T Max"],
        modelName: (v) => `${v}T Heavy Duty Diesel Forklift`,
        baseDaily: (v) => 4000 + (v * 350)
    },
    manlift: {
        name: "Manlift / Articulated Boom Lift",
        min: 10,
        max: 50,
        default: 25,
        step: 5,
        unit: "Meters Reach",
        metricTitle: "2. Working Platform Height",
        legend: ["10 Meters", "20 Meters", "35 Meters", "50m Max"],
        modelName: (v) => `${v}m Articulated Boom Lift / Manlift Platform`,
        baseDaily: (v) => 6500 + (v * 250)
    }
};

function handleEquipmentTypeChange() {
    const typeSelect = document.getElementById('calcType');
    const tonnageInput = document.getElementById('calcTonnage');
    const metricTitle = document.getElementById('calcTonnageMetricLabel');
    const legend = document.getElementById('calcLegend');
    if (!typeSelect || !tonnageInput) return;

    const typeKey = typeSelect.value;
    const cfg = equipmentConfigs[typeKey] || equipmentConfigs.hydraulic;

    tonnageInput.min = cfg.min;
    tonnageInput.max = cfg.max;
    tonnageInput.step = cfg.step;
    tonnageInput.value = cfg.default;
    tonnageInput.setAttribute('aria-valuemin', cfg.min);
    tonnageInput.setAttribute('aria-valuemax', cfg.max);

    if (metricTitle) metricTitle.textContent = cfg.metricTitle;
    if (legend) {
        legend.innerHTML = cfg.legend.map(l => `<span>${l}</span>`).join('');
    }

    updateCraneEstimate();
}

function updateCraneEstimate() {
    const typeSelect = document.getElementById('calcType');
    const tonnageInput = document.getElementById('calcTonnage');
    const durationSelect = document.getElementById('calcDuration');
    const tonnageLabel = document.getElementById('calcTonnageLabel');
    const modelOutput = document.getElementById('calcRecModel');
    const priceOutput = document.getElementById('calcPriceOutput');

    if (!typeSelect || !tonnageInput || !durationSelect) return;

    const typeKey = typeSelect.value;
    const cfg = equipmentConfigs[typeKey] || equipmentConfigs.hydraulic;
    const val = parseInt(tonnageInput.value, 10) || cfg.default;
    const days = parseInt(durationSelect.value, 10) || 7;

    tonnageInput.setAttribute('aria-valuenow', val);
    if (tonnageLabel) tonnageLabel.textContent = `${val} ${cfg.unit}`;

    const modelName = cfg.modelName(val);
    const dailyRate = cfg.baseDaily(val);

    // Multi-day discount factor
    const discountFactor = days >= 26 ? 0.82 : (days >= 7 ? 0.9 : 1);
    const totalEstimate = Math.round((dailyRate * days * discountFactor) / 500) * 500;

    if (modelOutput) modelOutput.textContent = modelName;
    if (priceOutput) priceOutput.textContent = "₹" + totalEstimate.toLocaleString('en-IN') + "*";
}

function applyEstimateToForm() {
    const modelOutput = document.getElementById('calcRecModel');
    const durationSelect = document.getElementById('calcDuration');
    const locSelect = document.getElementById('calcLocation');
    const inqEquip = document.getElementById('inqEquipment');
    const inqLoc = document.getElementById('inqLocation');

    if (!modelOutput || !inqEquip) return;

    const recModel = modelOutput.textContent;
    const durationText = durationSelect ? durationSelect.options[durationSelect.selectedIndex].text : '';
    const loc = locSelect ? locSelect.value : 'Jaipur, Rajasthan';

    inqEquip.value = recModel + " (" + durationText + ")";
    if (inqLoc) inqLoc.value = loc;

    const contactEl = document.getElementById('contact');
    if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.location.href = 'contact.html?equipment=' + encodeURIComponent(inqEquip.value) + '&location=' + encodeURIComponent(loc);
    }
    showToast("Estimate locked into inquiry form!");
}

// 4. EQUIPMENT FILTERING
function filterEquipment(category) {
    const cards = document.querySelectorAll('.equip-card');
    const buttons = document.querySelectorAll('.equip-filter-btn');

    buttons.forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
            btn.className = "equip-filter-btn active bg-brand-blue text-white font-heading font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shrink-0 transition";
        } else {
            btn.className = "equip-filter-btn bg-white text-slate-700 hover:bg-brand-blueLight font-heading font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg border border-gray-200 shrink-0 transition";
        }
    });

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function selectEquipmentForQuote(equipTitle) {
    const inqEquipment = document.getElementById('inqEquipment');
    if (inqEquipment) {
        inqEquipment.value = equipTitle;
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
        showToast("Selected: " + equipTitle);
    } else {
        window.location.href = 'contact.html?equipment=' + encodeURIComponent(equipTitle);
    }
}

// 5. POLICY TABS SWITCHER
function switchPolicyTab(tabKey) {
    const tabs = ['safety', 'environment', 'quality'];
    tabs.forEach(key => {
        const panel = document.getElementById('policyContent-' + key) || document.getElementById('policyPanel-' + key);
        const btn = document.getElementById('policyTab-' + key) || document.getElementById('tabBtn-' + key);
        if (!panel || !btn) return;

        if (key === tabKey) {
            panel.classList.remove('hidden');
            btn.className = "policy-tab-btn active bg-brand-blue text-white px-6 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider shadow transition";
        } else {
            panel.classList.add('hidden');
            btn.className = "policy-tab-btn bg-white text-slate-700 hover:bg-brand-blueLight px-6 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider border border-gray-200 transition";
        }
    });
}

// 6. REGIONAL SERVICE HUBS & CATEGORIZED KEYWORDS
const hubCategories = [
    {
        title: "Heavy & Mobile Cranes",
        keywords: ["Crane Services", "Crane Rental", "Hydraulic Crane Service", "Pick and Carry Crane Service", "Lattice Boom Crane Rental", "Crawler Crane Rental", "Telescopic Boom Crane Rental"]
    },
    {
        title: "Transport & Plant Access",
        keywords: ["Forklift Rental", "Boom Lift Rental", "Manlift Rental", "Heavy Trailer Rental"]
    }
];

function selectHub(cityFull) {
    const shortName = cityFull.split(',')[0].trim();
    const allHubs = ['Jaipur', 'Panipat', 'Pachpadra', 'Barmer', 'Chittorgarh'];

    allHubs.forEach(h => {
        const btn = document.getElementById('hubBtn-' + h);
        if (btn) {
            if (h === shortName) {
                btn.className = "hub-card active text-left p-5 rounded-2xl border-2 border-brand-blue bg-brand-blueLight/60 transition";
            } else {
                btn.className = "hub-card text-left p-5 rounded-2xl border border-gray-200 bg-brand-surface hover:border-brand-orange transition";
            }
        }
    });

    const activeHubTitle = document.getElementById('activeHubTitle');
    if (activeHubTitle) {
        activeHubTitle.textContent = "Available Services in " + cityFull + " (Click to Inquire):";
    }

    const container = document.getElementById('hubKeywordsContainer');
    if (!container) return;

    container.innerHTML = "";
    
    hubCategories.forEach(cat => {
        const groupWrapper = document.createElement('div');
        groupWrapper.className = "space-y-2";
        
        const catTitle = document.createElement('div');
        catTitle.className = "text-xs font-heading font-semibold text-slate-500 uppercase tracking-wider";
        catTitle.textContent = cat.title;
        groupWrapper.appendChild(catTitle);

        const pillsWrap = document.createElement('div');
        pillsWrap.className = "flex flex-wrap gap-2";

        cat.keywords.forEach(kw => {
            const fullTag = kw + " " + shortName;
            const btn = document.createElement('button');
            btn.type = "button";
            btn.className = "text-xs bg-white hover:bg-brand-orange hover:text-white text-slate-700 font-medium px-3 py-1.5 rounded-lg border border-gray-200 transition shadow-sm";
            btn.textContent = fullTag;
            btn.onclick = () => {
                const inqLoc = document.getElementById('inqLocation');
                const inqEquip = document.getElementById('inqEquipment');
                if (inqLoc && inqEquip) {
                    inqLoc.value = cityFull;
                    inqEquip.value = fullTag;
                    const contactEl = document.getElementById('contact');
                    if (contactEl) {
                        contactEl.scrollIntoView({ behavior: 'smooth' });
                    }
                    showToast("Pre-filled inquiry for " + fullTag);
                } else {
                    window.location.href = 'contact.html?equipment=' + encodeURIComponent(fullTag) + '&location=' + encodeURIComponent(cityFull);
                }
            };
            pillsWrap.appendChild(btn);
        });

        groupWrapper.appendChild(pillsWrap);
        container.appendChild(groupWrapper);
    });
}

// 7. LIGHTBOX FOR GALLERY & PHOTOS
function openLightbox(imageSrc, captionText) {
    let lightbox = document.getElementById('lightboxModal');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightboxModal';
        lightbox.className = 'fixed inset-0 z-50 bg-black/90 lightbox-backdrop flex items-center justify-center p-3 sm:p-6 transition-all duration-300';
        lightbox.innerHTML = `
            <div class="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
                <button onclick="closeLightbox()" class="absolute top-2 right-2 sm:-top-12 sm:right-0 w-11 h-11 flex items-center justify-center bg-black/60 sm:bg-white/10 hover:bg-brand-orange text-white rounded-full text-2xl font-bold p-2 focus:outline-none transition z-10" aria-label="Close Lightbox">&times;</button>
                <img id="lightboxImg" src="" alt="Pandit Crane Project" class="max-h-[75vh] sm:max-h-[80vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/20">
                <p id="lightboxCaption" class="mt-3 sm:mt-4 text-white/90 text-xs sm:text-sm font-heading font-medium text-center bg-brand-blueDark/90 border border-white/10 px-4 py-2 rounded-xl max-w-xl"></p>
            </div>
        `;
        document.body.appendChild(lightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCaption');
    if (img) img.src = imageSrc;
    if (cap) cap.textContent = captionText || 'Pandit Crane Service — Heavy Lifting Operations';
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightboxModal');
    if (lightbox) {
        lightbox.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// 8. CONTACT FORM & CLIPBOARD HELPERS
function handleInquirySubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('inqName');
    const equipInput = document.getElementById('inqEquipment');
    const locInput = document.getElementById('inqLocation');

    const name = nameInput ? nameInput.value : 'Valued Customer';
    const equip = equipInput ? equipInput.value : 'Crane Service';
    const loc = locInput ? locInput.value : 'Rajasthan/Haryana';

    showToast("Thank you, " + name + "! Your inquiry for " + equip + " in " + loc + " has been logged. Our engineering desk will connect with you.");
    e.target.reset();
}

function copyText(text, label) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(label + " (" + text + ") copied to clipboard!");
}

// 9. MODALS & TOAST UTILITIES
function openBrandKitModal() {
    const modal = document.getElementById('brandKitModal');
    if (modal) modal.classList.remove('hidden');
}
function closeBrandKitModal() {
    const modal = document.getElementById('brandKitModal');
    if (modal) modal.classList.add('hidden');
}
function openBrochureModal() {
    const modal = document.getElementById('brochureModal');
    if (modal) modal.classList.remove('hidden');
}
function closeBrochureModal() {
    const modal = document.getElementById('brochureModal');
    if (modal) modal.classList.add('hidden');
}

function triggerBrochureDownload() {
    window.open('images/Hydraulic-crane.pdf', '_blank');
    closeBrochureModal();
    showToast("Opening Pandit Crane Service Technical Brochure!");
}

let toastTimeout;
function showToast(msg) {
    let box = document.getElementById('toastBox');
    if (!box) {
        box = document.createElement('div');
        box.id = 'toastBox';
        box.className = 'fixed bottom-5 right-5 z-50 max-w-sm bg-brand-blueDark text-white px-5 py-4 rounded-2xl shadow-2xl border-l-4 border-brand-orange flex items-center gap-3 transition-all';
        box.innerHTML = `
            <svg class="w-6 h-6 text-brand-orange shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <div id="toastMessage" class="text-xs sm:text-sm font-medium"></div>
        `;
        document.body.appendChild(box);
    }
    const msgEl = document.getElementById('toastMessage');
    if (msgEl) msgEl.textContent = msg;
    box.classList.remove('hidden');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        box.classList.add('hidden');
    }, 4500);
}

// 10. STATISTICS COUNTER ON SCROLL
function animateCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const speed = target / 50;
        const updateCount = () => {
            count += speed;
            if (count < target) {
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

// URL Param Parser for Contact Pre-fills
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const equip = params.get('equipment');
    const loc = params.get('location');
    if (equip) {
        const inqEquipment = document.getElementById('inqEquipment');
        if (inqEquipment) inqEquipment.value = equip;
    }
    if (loc) {
        const inqLocation = document.getElementById('inqLocation');
        if (inqLocation) inqLocation.value = loc;
    }
}

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    checkUrlParams();
    
    // Auto-advance hero slides if present
    const heroContainer = document.getElementById('heroSlideContainer');
    if (heroContainer) {
        setInterval(() => {
            setHeroSlide((currentSlide + 1) % heroSlides.length);
        }, 6500);
        updateCraneEstimate();
    }

    // Initialize Hubs if present
    const hubJaipur = document.getElementById('hubBtn-Jaipur');
    if (hubJaipur) {
        selectHub('Jaipur, Rajasthan');
    }

    // Global ESC key to dismiss open modals & mobile menu
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBrochureModal();
            closeBrandKitModal();
            closeLightbox();
            const mobMenu = document.getElementById('mobileMenu');
            if (mobMenu && !mobMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        }
    });
});

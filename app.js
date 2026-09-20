/* =========================================================
   ABO AL-EZZ COMPANY
   MAIN APPLICATION ENGINE
   ========================================================= */

"use strict";

/* =========================================================
   COMPANY CONFIGURATION
   ========================================================= */

const COMPANY = {
    name: "أبو العز",
    year: 2026,

    facebook:
        "https://www.facebook.com/profile.php?id=61591794734274&locale=ar_AR",

    supportEmail: "",
    currency: "USD"
};


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const APP = {
    initialized: false,

    user: null,

    notifications: [],

    currentPage: "home",

    settings: {
        theme: "dark",
        language: "ar"
    }
};


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}


/* =========================================================
   SAFE STORAGE
   ========================================================= */

const Storage = {

    set(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

            return true;
        } catch (error) {
            console.error(
                "Storage set error:",
                error
            );

            return false;
        }
    },

    get(key, fallback = null) {
        try {
            const value =
                localStorage.getItem(key);

            if (value === null) {
                return fallback;
            }

            return JSON.parse(value);

        } catch (error) {

            console.error(
                "Storage get error:",
                error
            );

            return fallback;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);

            return true;

        } catch (error) {

            console.error(
                "Storage remove error:",
                error
            );

            return false;
        }
    }
};


/* =========================================================
   USER SESSION
   ========================================================= */

const Session = {

    load() {

        const user =
            Storage.get(
                "abo_al_ezz_user",
                null
            );

        if (user) {
            APP.user = user;
        }

        return APP.user;
    },

    save(user) {

        APP.user = user;

        Storage.set(
            "abo_al_ezz_user",
            user
        );
    },

    logout() {

        APP.user = null;

        Storage.remove(
            "abo_al_ezz_user"
        );

        notify(
            "تم تسجيل الخروج بنجاح"
        );
    }
};


/* =========================================================
   NOTIFICATION SYSTEM
   ========================================================= */

function notify(
    message,
    type = "success"
) {

    const notification = {
        id:
            Date.now() +
            Math.random(),

        message,

        type,

        createdAt:
            new Date().toISOString()
    };

    APP.notifications.push(
        notification
    );

    showNotification(
        notification
    );

    return notification;
}


function showNotification(
    notification
) {

    const old =
        document.querySelector(
            ".app-notification"
        );

    if (old) {
        old.remove();
    }

    const element =
        document.createElement(
            "div"
        );

    element.className =
        "app-notification";

    element.textContent =
        notification.message;

    element.style.position =
        "fixed";

    element.style.bottom =
        "25px";

    element.style.right =
        "25px";

    element.style.zIndex =
        "99999";

    element.style.padding =
        "14px 20px";

    element.style.borderRadius =
        "12px";

    element.style.background =
        "#121722";

    element.style.border =
        "1px solid #10a37f";

    element.style.color =
        "#ffffff";

    element.style.boxShadow =
        "0 15px 40px rgba(0,0,0,.35)";

    element.style.fontWeight =
        "700";

    document.body.appendChild(
        element
    );

    setTimeout(() => {

        if (element) {
            element.remove();
        }

    }, 3500);
}


/* =========================================================
   FACEBOOK CONTACT
   ========================================================= */

function openDirectContact() {

    window.open(
        COMPANY.facebook,
        "_blank",
        "noopener,noreferrer"
    );
}


/* =========================================================
   CONTACT BUTTONS
   ========================================================= */

function initializeContactButtons() {

    const buttons =
        $$("[data-contact='facebook']");

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            openDirectContact
        );

    });
}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

function initializeSmoothScroll() {

    $$("a[href^='#']").forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );
}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function updateYear() {

    const yearElements =
        $$("[data-current-year]");

    yearElements.forEach(
        element => {

            element.textContent =
                COMPANY.year;

        }
    );
}


/* =========================================================
   PAGE DETECTION
   ========================================================= */

function detectPage() {

    const path =
        window.location.pathname;

    if (
        path.endsWith(
            "index.html"
        ) ||
        path === "/" ||
        path === ""
    ) {

        APP.currentPage =
            "home";

        return "home";
    }

    APP.currentPage =
        "unknown";

    return "unknown";
}


/* =========================================================
   ERROR HANDLER
   ========================================================= */

window.addEventListener(
    "error",
    event => {

        console.error(
            "Application error:",
            event.error ||
            event.message
        );

    }
);


/* =========================================================
   INITIALIZE APPLICATION
   ========================================================= */

function initializeApp() {

    if (APP.initialized) {
        return;
    }

    APP.initialized = true;

    Session.load();

    detectPage();

    initializeContactButtons();

    initializeSmoothScroll();

    updateYear();

    console.log(
        `${COMPANY.name} application initialized.`
    );
}


/* =========================================================
   DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();
}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.AboAlEzz = {

    COMPANY,

    APP,

    Storage,

    Session,

    notify,

    openDirectContact
};

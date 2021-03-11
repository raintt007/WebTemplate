/**
 * @since 2021/03/02 08:54:01
 */

class Router {
    constructor(options) {
        this.routes = {};
        this.init();
        options.forEach((item) => {
            this.route(item.path, () => {
                document.querySelector(".content").innerHTML = item.component;
            });
        });
    }

    init() {
        window.addEventListener("load", this.updateView.bind(this), false);
        window.addEventListener(
            "hashchange",
            this.updateView.bind(this),
            false
        );
    }

    updateView() {
        const currentUrl = window.location.hash.slice(1) || "/";
        this.routes[currentUrl] && this.routes[currentUrl]();
    }
    route(path, cb) {
        this.routes[path] = cb;
    }
}

const router = new Router([
    {
        path: "/one",
        component: "home",
    },
    {
        path: "/two",
        component: "book",
    },
    {
        path: "/three",
        component: "movie",
    },
]);

class historyRouter {
    constructor(options) {
        this.routes = {};
        this.init();
        this.bindEvent();
        this.route(item.path, () => {
            document.getElementById("content").innerHTML = item.component;
        });
    }

    bindEvent() {
        const _this = this;
        const links = document.getElementsByClassName("history");
        console.log(links);
        [].forEach.call(links, (link) => {
            link.addEventListener("click", function () {
                const url = this.getAttribute("data-href");
                _this.push(url);
            });
        });
    }

    push(url) {
        window.history.pushState(url);
        this.updateView();
    }

    updateView() {
        const currentUrl = window.location.pathname || "/";
        this.routes[currentUrl] && this.routes[currentUrl]();
    }
    route(path, cb) {
        this.routes[path] = cb;
    }
}

const router2 = new historyRouter([
    {
        path: "/one",
        component: "home",
    },
    {
        path: "/two",
        component: "book",
    },
    {
        path: "/three",
        component: "movie",
    },
]);

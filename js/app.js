/* =====================================
   SEO BLOG DASHBOARD
   COMMON APP INITIALIZATION
===================================== */


/* =====================================
   1. SAMPLE BLOG DATA
===================================== */

if (getBlogs().length === 0) {

    const sampleBlogs = [

        {
            id: 1,
            title: "What Is Search Engine Optimisation?",
            keyword: "SEO",
            category: "SEO",
            writer: "Rahul",
            wordCount: 1200,
            publishDate: "2026-11-15",
            status: "Published",
            createdAt: "2026-11-10T09:00:00.000Z"
        },

        {
            id: 2,
            title: "Keyword Research for Beginners",
            keyword: "keyword research",
            category: "SEO",
            writer: "Priya",
            wordCount: 1000,
            publishDate: "2026-11-18",
            status: "In Progress",
            createdAt: "2026-11-11T10:00:00.000Z"
        },

        {
            id: 3,
            title: "How to Write SEO Friendly Content",
            keyword: "SEO content",
            category: "Content Marketing",
            writer: "Amit",
            wordCount: 1500,
            publishDate: "2026-11-20",
            status: "Under Review",
            createdAt: "2026-11-12T11:00:00.000Z"
        },

        {
            id: 4,
            title: "On Page SEO Techniques",
            keyword: "on page SEO",
            category: "SEO",
            writer: "Neha",
            wordCount: 1300,
            publishDate: "2026-11-22",
            status: "Scheduled",
            createdAt: "2026-11-13T12:00:00.000Z"
        },

        {
            id: 5,
            title: "Technical SEO Basics",
            keyword: "technical SEO",
            category: "Technical SEO",
            writer: "Rahul",
            wordCount: 1800,
            publishDate: "2026-11-25",
            status: "Idea",
            createdAt: "2026-11-14T13:00:00.000Z"
        }

    ];

    saveBlogs(sampleBlogs);

}


/* =====================================
   2. MEMBER 3 UI ELEMENTS
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const sidebar =
        document.getElementById("sidebar");

    const menuToggle =
        document.getElementById("menuToggle");

    const menuLinks =
        document.querySelectorAll(".menu-link");


    /* =================================
       3. MOBILE SIDEBAR TOGGLE
    ================================= */

    if (menuToggle && sidebar) {

        menuToggle.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle("show");

            }
        );

    }


    /* =================================
       4. NAVIGATION ACTIVE STATE
    ================================= */

    menuLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                menuLinks.forEach(function (item) {

                    item.classList.remove("active");

                });


                link.classList.add("active");


                /* Close sidebar on mobile */

                if (
                    window.innerWidth <= 768 &&
                    sidebar
                ) {

                    sidebar.classList.remove("show");

                }

            }
        );

    });


    /* =================================
       5. INITIAL MESSAGE
    ================================= */

    console.log(
        "SEO Blog Dashboard UI Loaded Successfully!"
    );

});
let statusChart;


/* =========================================
   UPDATE DASHBOARD
========================================= */

function updateDashboard() {

    const blogs = getBlogs();


    /* =====================================
       SUMMARY COUNTS
    ===================================== */

    const total =
        blogs.length;

    const published =
        blogs.filter(function (blog) {
            return blog.status === "Published";
        }).length;

    const inProgress =
        blogs.filter(function (blog) {
            return blog.status === "In Progress";
        }).length;

    const pending =
        blogs.filter(function (blog) {
            return blog.status !== "Published";
        }).length;


    const totalBlogs =
        document.getElementById("totalBlogs");

    const publishedBlogs =
        document.getElementById("publishedBlogs");

    const inProgressBlogs =
        document.getElementById("inProgressBlogs");

    const pendingBlogs =
        document.getElementById("pendingBlogs");


    if (totalBlogs) {
        totalBlogs.textContent = total;
    }

    if (publishedBlogs) {
        publishedBlogs.textContent = published;
    }

    if (inProgressBlogs) {
        inProgressBlogs.textContent = inProgress;
    }

    if (pendingBlogs) {
        pendingBlogs.textContent = pending;
    }



    /* =====================================
       STATUS COUNTS
    ===================================== */

    const idea =
        blogs.filter(function (blog) {
            return blog.status === "Idea";
        }).length;

    const underReview =
        blogs.filter(function (blog) {
            return blog.status === "Under Review";
        }).length;

    const scheduled =
        blogs.filter(function (blog) {
            return blog.status === "Scheduled";
        }).length;


    const ideaCount =
        document.getElementById("ideaCount");

    const inProgressCount =
        document.getElementById("inProgressCount");

    const underReviewCount =
        document.getElementById("underReviewCount");

    const scheduledCount =
        document.getElementById("scheduledCount");

    const publishedCount =
        document.getElementById("publishedCount");


    if (ideaCount) {
        ideaCount.textContent = idea;
    }

    if (inProgressCount) {
        inProgressCount.textContent =
            inProgress;
    }

    if (underReviewCount) {
        underReviewCount.textContent =
            underReview;
    }

    if (scheduledCount) {
        scheduledCount.textContent =
            scheduled;
    }

    if (publishedCount) {
        publishedCount.textContent =
            published;
    }



    /* =====================================
       STATUS CHART
    ===================================== */

    const chartCanvas =
        document.getElementById("statusChart");


    if (
        chartCanvas &&
        typeof Chart !== "undefined"
    ) {

        const chartData = [
            idea,
            inProgress,
            underReview,
            scheduled,
            published
        ];


        if (statusChart) {

            statusChart.destroy();

            statusChart = null;

        }


        statusChart =
            new Chart(
                chartCanvas,
                {

                    type: "doughnut",

                    data: {

                        labels: [
                            "Idea",
                            "In Progress",
                            "Under Review",
                            "Scheduled",
                            "Published"
                        ],

                        datasets: [
                            {
                                data: chartData,
                                backgroundColor: [
                                    "#DC5C73",
                                    "#D88A12",
                                    "#6843C7",
                                    "#3978D8",
                                    "#0F9F96"
                                ],
                                borderColor: "#ffffff",
                                borderWidth: 3,
                                hoverOffset: 7
                            }
                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {

                                position: "bottom"

                            }

                        }

                    }

                }
            );

    }



    /* =====================================
       RECENT BLOGS
    ===================================== */

    const recentBlogsList =
        document.getElementById(
            "recentBlogsList"
        );


    if (!recentBlogsList) {
        return;
    }


    if (blogs.length === 0) {

        recentBlogsList.innerHTML = `

            <p>
                No blogs available yet.
            </p>

        `;

        return;

    }


    recentBlogsList.innerHTML = "";


    blogs
        .slice()
        .sort(function (a, b) {

            if (
                a.createdAt &&
                b.createdAt
            ) {

                return (
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
                );

            }


            return (
                Number(b.id) -
                Number(a.id)
            );

        })
        .slice(0, 5)
        .forEach(function (blog) {

            const item =
                document.createElement("div");

            item.className =
                "recent-blog-item";


            item.innerHTML = `

                <h3>
                    ${escapeDashboardHTML(
                        blog.title
                    )}
                </h3>

                <p>
                    <strong>Keyword:</strong>
                    ${escapeDashboardHTML(
                        blog.keyword
                    )}
                </p>

                <p>
                    <strong>Publishing Date:</strong>
                    ${escapeDashboardHTML(
                        blog.publishDate
                    )}
                </p>

                <span class="recent-blog-status">
                    ${escapeDashboardHTML(
                        blog.status
                    )}
                </span>

            `;


            recentBlogsList.appendChild(
                item
            );

        });

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeDashboardHTML(value) {

    return String(value ?? "")
        .replace(
            /[&<>"']/g,
            function (char) {

                return {

                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"

                }[char];

            }
        );

}


/* =========================================
   INITIAL LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDashboard();

    }
);


/* =========================================
   AUTO UPDATE
========================================= */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === "seoBlogs"
        ) {

            updateDashboard();

        }

    }
);


/* =========================================
   SAME-PAGE AUTO UPDATE
========================================= */

window.addEventListener(
    "blogsUpdated",
    function () {

        updateDashboard();

    }
);
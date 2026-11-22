/* =========================================
   SEO BLOG PUBLISHING CALENDAR
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const calendarDays =
        document.getElementById("calendarDays");

    const currentMonthTitle =
        document.getElementById("currentMonth");

    const prevMonthBtn =
        document.getElementById("prevMonth");

    const nextMonthBtn =
        document.getElementById("nextMonth");

    const upcomingBlogs =
        document.getElementById("upcomingBlogs");


    if (!calendarDays) {
        return;
    }


    /* =========================================
       CURRENT CALENDAR DATE
    ========================================= */

    let currentDate = new Date();

    let currentMonth =
        currentDate.getMonth();

    let currentYear =
        currentDate.getFullYear();


    /* =========================================
       MONTH NAMES
    ========================================= */

    const monthNames = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];


    /* =========================================
       GET BLOGS
    ========================================= */

    function getCalendarBlogs() {

        if (
            typeof getBlogs === "function"
        ) {

            return getBlogs();

        }

        return [];

    }


    /* =========================================
       RENDER CALENDAR
    ========================================= */

    function renderCalendar() {

        calendarDays.innerHTML = "";


        /* -------------------------------------
           MONTH TITLE
        ------------------------------------- */

        if (currentMonthTitle) {

            currentMonthTitle.textContent =
                `${monthNames[currentMonth]} ${currentYear}`;

        }


        /* -------------------------------------
           DAY HEADINGS
        ------------------------------------- */

        const dayNames = [

            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"

        ];


        dayNames.forEach(
            function (day) {

                const dayHeader =
                    document.createElement("div");

                dayHeader.className =
                    "calendar-day-name";

                dayHeader.textContent =
                    day;

                calendarDays.appendChild(
                    dayHeader
                );

            }
        );


        /* -------------------------------------
           FIRST DAY OF MONTH
        ------------------------------------- */

        const firstDay =
            new Date(
                currentYear,
                currentMonth,
                1
            ).getDay();


        /* -------------------------------------
           NUMBER OF DAYS
        ------------------------------------- */

        const daysInMonth =
            new Date(
                currentYear,
                currentMonth + 1,
                0
            ).getDate();


        /* -------------------------------------
           EMPTY CELLS
        ------------------------------------- */

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const emptyDay =
                document.createElement("div");

            emptyDay.className =
                "calendar-day empty";

            calendarDays.appendChild(
                emptyDay
            );

        }


        /* -------------------------------------
           TODAY
        ------------------------------------- */

        const today =
            new Date();

        const todayDate =
            today.getDate();

        const todayMonth =
            today.getMonth();

        const todayYear =
            today.getFullYear();


        /* -------------------------------------
           BLOG DATA
        ------------------------------------- */

        const blogs =
            getCalendarBlogs();


        /* -------------------------------------
           CREATE DAYS
        ------------------------------------- */

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const dayCell =
                document.createElement("div");

            dayCell.className =
                "calendar-day";


            /* ---------------------------------
               CHECK TODAY
            --------------------------------- */

            if (
                day === todayDate &&
                currentMonth === todayMonth &&
                currentYear === todayYear
            ) {

                dayCell.classList.add(
                    "today"
                );

            }


            /* ---------------------------------
               DAY NUMBER
            --------------------------------- */

            const dayNumber =
                document.createElement("div");

            dayNumber.className =
                "calendar-date";

            dayNumber.textContent =
                day;


            dayCell.appendChild(
                dayNumber
            );


            /* ---------------------------------
               BLOGS ON THIS DATE
            --------------------------------- */

            const dateString =
                `${currentYear}-${String(
                    currentMonth + 1
                ).padStart(2, "0")}-${String(
                    day
                ).padStart(2, "0")}`;


            const dayBlogs =
                blogs.filter(
                    function (blog) {

                        return (
                            blog.publishDate ===
                            dateString
                        );

                    }
                );


            dayBlogs.forEach(
                function (blog) {

                    const blogEvent =
                        document.createElement(
                            "div"
                        );


                    blogEvent.className =
                        "blog-event status-" +
                        String(blog.status || "idea")
                            .toLowerCase()
                            .replace(/\s+/g, "-");


                    blogEvent.textContent =
                        blog.title;


                    blogEvent.title =
                        `${blog.title} - ${blog.status}`;


                    dayCell.appendChild(
                        blogEvent
                    );

                }
            );


            calendarDays.appendChild(
                dayCell
            );

        }


        renderUpcomingBlogs();

    }


    /* =========================================
       UPCOMING BLOGS
    ========================================= */

    function renderUpcomingBlogs() {

        if (!upcomingBlogs) {
            return;
        }


        const blogs =
            getCalendarBlogs();


        const today =
            new Date();


        today.setHours(
            0,
            0,
            0,
            0
        );


        const upcoming =
            blogs
                .filter(
                    function (blog) {

                        if (
                            !blog.publishDate
                        ) {
                            return false;
                        }


                        const publishDate =
                            new Date(
                                blog.publishDate +
                                "T00:00:00"
                            );


                        return (
                            publishDate >=
                            today
                        );

                    }
                )
                .sort(
                    function (a, b) {

                        return (
                            new Date(
                                a.publishDate +
                                "T00:00:00"
                            ) -
                            new Date(
                                b.publishDate +
                                "T00:00:00"
                            )
                        );

                    }
                );


        upcomingBlogs.innerHTML = "";


        if (
            upcoming.length === 0
        ) {

            upcomingBlogs.innerHTML = `

                <p>
                    No upcoming blogs scheduled.
                </p>

            `;

            return;

        }


        upcoming.forEach(
            function (blog) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "recent-blog-item";


                item.innerHTML = `

                    <h3>
                        ${escapeCalendarHTML(
                            blog.title
                        )}
                    </h3>

                    <p>
                        <strong>
                            Publishing Date:
                        </strong>

                        ${escapeCalendarHTML(
                            blog.publishDate
                        )}
                    </p>

                    <p>
                        <strong>
                            Status:
                        </strong>

                        ${escapeCalendarHTML(
                            blog.status
                        )}
                    </p>

                `;


                upcomingBlogs.appendChild(
                    item
                );

            }
        );

    }


    /* =========================================
       ESCAPE HTML
    ========================================= */

    function escapeCalendarHTML(
        value
    ) {

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
       PREVIOUS MONTH
    ========================================= */

    if (prevMonthBtn) {

        prevMonthBtn.addEventListener(
            "click",
            function () {

                currentMonth--;

                if (
                    currentMonth < 0
                ) {

                    currentMonth = 11;

                    currentYear--;

                }

                renderCalendar();

            }
        );

    }


    /* =========================================
       NEXT MONTH
    ========================================= */

    if (nextMonthBtn) {

        nextMonthBtn.addEventListener(
            "click",
            function () {

                currentMonth++;

                if (
                    currentMonth > 11
                ) {

                    currentMonth = 0;

                    currentYear++;

                }

                renderCalendar();

            }
        );

    }


    /* =========================================
       INITIAL RENDER
    ========================================= */

    renderCalendar();


    /* =========================================
       AUTO UPDATE
    ========================================= */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                event.key === "seoBlogs"
            ) {

                renderCalendar();

            }

        }
    );


    /* =========================================
       SAME-PAGE AUTO UPDATE
    ========================================= */

    window.addEventListener(
        "blogsUpdated",
        function () {

            renderCalendar();

        }
    );

});
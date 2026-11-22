document.addEventListener("DOMContentLoaded", function () {

    const addBlogBtn =
        document.getElementById("addBlogBtn");

    const blogFormContainer =
        document.getElementById("blogFormContainer");

    const cancelBlogBtn =
        document.getElementById("cancelBlogBtn");

    const blogForm =
        document.getElementById("blogForm");

    const blogTableBody =
        document.getElementById("blogTableBody");

    const searchBlog =
        document.getElementById("searchBlog");

    const statusFilter =
        document.getElementById("statusFilter");


    /* =========================================
       ESCAPE HTML
    ========================================= */

    function escapeHTML(value) {

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
       ADD BLOG FORM
    ========================================= */

    if (addBlogBtn && blogFormContainer) {

        addBlogBtn.addEventListener(
            "click",
            function () {

                blogFormContainer.style.display =
                    "block";

                if (blogForm) {
                    blogForm.reset();
                    delete blogForm.dataset.editingId;
                }

                blogFormContainer.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }


    /* =========================================
       CANCEL
    ========================================= */

    if (cancelBlogBtn && blogFormContainer) {

        cancelBlogBtn.addEventListener(
            "click",
            function () {

                blogFormContainer.style.display =
                    "none";

                if (blogForm) {

                    blogForm.reset();

                    delete blogForm.dataset.editingId;

                }

            }
        );

    }


    /* =========================================
       DISPLAY BLOGS
    ========================================= */

    function displayBlogs() {

        const blogs =
            getBlogs();


        const searchText =
            searchBlog
                ? searchBlog.value
                    .toLowerCase()
                    .trim()
                : "";


        const selectedStatus =
            statusFilter
                ? statusFilter.value
                : "All";


        const filteredBlogs =
            blogs.filter(
                function (blog) {

                    const searchableText = [

                        blog.title,
                        blog.keyword,
                        blog.category,
                        blog.writer

                    ]
                        .join(" ")
                        .toLowerCase();


                    const matchesSearch =
                        searchableText.includes(
                            searchText
                        );


                    const matchesStatus =
                        selectedStatus === "All" ||
                        selectedStatus === "" ||
                        blog.status === selectedStatus;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );


        if (!blogTableBody) {
            return;
        }


        blogTableBody.innerHTML = "";


        /* =====================================
           EMPTY STATE
        ===================================== */

        if (filteredBlogs.length === 0) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:30px;
                    ">

                    No blogs found.

                </td>

            `;


            blogTableBody.appendChild(row);

            return;

        }


        /* =====================================
           DISPLAY BLOGS
        ===================================== */

        filteredBlogs.forEach(
            function (blog) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${escapeHTML(
                            blog.title
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            blog.keyword
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            blog.category
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            blog.writer
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            blog.wordCount
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            blog.publishDate
                        )}
                    </td>

                    <td>

                        <span class="status-badge">
                            ${escapeHTML(
                                blog.status
                            )}
                        </span>

                    </td>

                    <td>

                        <button
                            type="button"
                            class="edit-btn"
                            data-id="${escapeHTML(
                                blog.id
                            )}">

                            Edit

                        </button>


                        <button
                            type="button"
                            class="content-edit-btn"
                            data-id="${escapeHTML(
                                blog.id
                            )}">

                            Edit Content

                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                            data-id="${escapeHTML(
                                blog.id
                            )}">

                            Delete

                        </button>

                    </td>

                `;


                blogTableBody.appendChild(row);

            }
        );

    }


    /* =========================================
       DELETE BLOG
    ========================================= */

    if (blogTableBody) {

        blogTableBody.addEventListener(
            "click",
            function (event) {

                const deleteButton =
                    event.target.closest(
                        ".delete-btn"
                    );


                if (!deleteButton) {
                    return;
                }


                const blogId =
                    String(
                        deleteButton.dataset.id
                    );


                const blogs =
                    getBlogs();


                const blog =
                    blogs.find(
                        function (item) {

                            return (
                                String(item.id) ===
                                blogId
                            );

                        }
                    );


                if (!blog) {
                    return;
                }


                const confirmDelete =
                    confirm(
                        `Are you sure you want to delete "${blog.title}"?`
                    );


                if (!confirmDelete) {
                    return;
                }


                deleteBlog(blog.id);


                displayBlogs();


                if (
                    typeof updateDashboard ===
                    "function"
                ) {

                    updateDashboard();

                }

            }
        );


        /* =====================================
           EDIT CONTENT
        ===================================== */

        blogTableBody.addEventListener(
            "click",
            function (event) {

                const contentEditButton =
                    event.target.closest(
                        ".content-edit-btn"
                    );


                if (!contentEditButton) {
                    return;
                }


                const blogId =
                    contentEditButton.dataset.id;


                window.location.href =
                    `writer.html?id=${encodeURIComponent(
                        blogId
                    )}`;

            }
        );


        /* =====================================
           EDIT METADATA
        ===================================== */

        blogTableBody.addEventListener(
            "click",
            function (event) {

                const editButton =
                    event.target.closest(
                        ".edit-btn"
                    );


                if (!editButton) {
                    return;
                }


                const blogId =
                    String(
                        editButton.dataset.id
                    );


                const blogs =
                    getBlogs();


                const blog =
                    blogs.find(
                        function (item) {

                            return (
                                String(item.id) ===
                                blogId
                            );

                        }
                    );


                if (!blog) {
                    return;
                }


                const titleInput =
                    document.getElementById(
                        "blogTitle"
                    );

                const keywordInput =
                    document.getElementById(
                        "blogKeyword"
                    );

                const categoryInput =
                    document.getElementById(
                        "blogCategory"
                    );

                const writerInput =
                    document.getElementById(
                        "blogWriter"
                    );

                const wordCountInput =
                    document.getElementById(
                        "wordCount"
                    );

                const publishDateInput =
                    document.getElementById(
                        "publishDate"
                    );

                const statusInput =
                    document.getElementById(
                        "blogStatus"
                    );


                if (titleInput) {
                    titleInput.value =
                        blog.title || "";
                }

                if (keywordInput) {
                    keywordInput.value =
                        blog.keyword || "";
                }

                if (categoryInput) {
                    categoryInput.value =
                        blog.category || "";
                }

                if (writerInput) {
                    writerInput.value =
                        blog.writer || "";
                }

                if (wordCountInput) {
                    wordCountInput.value =
                        blog.wordCount || "";
                }

                if (publishDateInput) {
                    publishDateInput.value =
                        blog.publishDate || "";
                }

                if (statusInput) {
                    statusInput.value =
                        blog.status || "";
                }


                if (blogFormContainer) {

                    blogFormContainer.style.display =
                        "block";

                    blogFormContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }


                if (blogForm) {

                    blogForm.dataset.editingId =
                        String(blog.id);

                }

            }
        );

    }


    /* =========================================
       SAVE / UPDATE BLOG METADATA
    ========================================= */

    if (blogForm) {

        blogForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const title =
                    document.getElementById(
                        "blogTitle"
                    ).value.trim();


                const keyword =
                    document.getElementById(
                        "blogKeyword"
                    ).value.trim();


                const category =
                    document.getElementById(
                        "blogCategory"
                    ).value;


                const writer =
                    document.getElementById(
                        "blogWriter"
                    ).value.trim();


                const wordCount =
                    Number(
                        document.getElementById(
                            "wordCount"
                        ).value
                    );


                const publishDate =
                    document.getElementById(
                        "publishDate"
                    ).value;


                const blogStatus =
                    document.getElementById(
                        "blogStatus"
                    ).value;


                if (
                    !title ||
                    !keyword ||
                    !category ||
                    !writer ||
                    !Number.isSafeInteger(
                        wordCount
                    ) ||
                    wordCount < 1 ||
                    !publishDate ||
                    !blogStatus
                ) {

                    alert(
                        "Please enter valid information in all required fields."
                    );

                    return;

                }


                const blogData = {

                    title:
                        title,

                    keyword:
                        keyword,

                    category:
                        category,

                    writer:
                        writer,

                    wordCount:
                        wordCount,

                    publishDate:
                        publishDate,

                    status:
                        blogStatus

                };


                const editingId =
                    blogForm.dataset.editingId;


                /* =================================
                   UPDATE EXISTING BLOG
                ================================= */

                if (editingId) {

                    const blogs =
                        getBlogs();


                    const existingBlog =
                        blogs.find(
                            function (blog) {

                                return (
                                    String(
                                        blog.id
                                    ) ===
                                    String(
                                        editingId
                                    )
                                );

                            }
                        );


                    if (!existingBlog) {

                        alert(
                            "Blog not found."
                        );

                        return;

                    }


                    updateBlog(
                        Number(editingId),
                        {

                            id:
                                existingBlog.id,

                            ...blogData,

                            content:
                                existingBlog.content ||
                                "",

                            createdAt:
                                existingBlog.createdAt ||
                                new Date().toISOString()

                        }
                    );


                    alert(
                        "Blog updated successfully!"
                    );

                }


                /* =================================
                   CREATE NEW BLOG
                ================================= */

                else {

                    addBlog({

                        id:
                            Date.now(),

                        ...blogData,

                        content:
                            "",

                        createdAt:
                            new Date().toISOString()

                    });


                    alert(
                        "Blog added successfully!"
                    );

                }


                blogForm.reset();

                delete blogForm.dataset.editingId;


                if (blogFormContainer) {

                    blogFormContainer.style.display =
                        "none";

                }


                displayBlogs();


                if (
                    typeof updateDashboard ===
                    "function"
                ) {

                    updateDashboard();

                }

            }
        );

    }


    /* =========================================
       SEARCH
    ========================================= */

    if (searchBlog) {

        searchBlog.addEventListener(
            "input",
            function () {

                displayBlogs();

            }
        );

    }


    /* =========================================
       STATUS FILTER
    ========================================= */

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            function () {

                displayBlogs();

            }
        );

    }


    /* =========================================
       INITIAL DISPLAY
    ========================================= */

    displayBlogs();

});
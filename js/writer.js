let editingBlogId = null;


/* =========================================
   BLOG WRITER
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const writerForm =
            document.getElementById("writerForm");

        const blogContent =
            document.getElementById("blogContent");

        const wordCounter =
            document.getElementById(
                "contentWordCount"
            );

        const characterCounter =
            document.getElementById(
                "contentCharacterCount"
            );

        const saveDraftBtn =
            document.getElementById(
                "saveDraftBtn"
            );


        /* =====================================
           CHECK EDIT MODE
        ===================================== */

        const urlParams =
            new URLSearchParams(
                window.location.search
            );

        const blogId =
            urlParams.get("id");


        if (blogId) {

            editingBlogId =
                String(blogId);

            loadBlogForEditing(
                editingBlogId
            );

        }


        /* =====================================
           UPDATE CONTENT COUNT
        ===================================== */

        function updateContentCount() {

            const text =
                blogContent.innerText.trim();


            const words =
                text
                    ? text.split(/\s+/).length
                    : 0;


            const characters =
                text.length;


            wordCounter.textContent =
                words;

            characterCounter.textContent =
                characters;

        }


        blogContent.addEventListener(
            "input",
            updateContentCount
        );


        /* =====================================
           SAVE BLOG
        ===================================== */

        writerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                saveWriterBlog(
                    document.getElementById(
                        "writerStatus"
                    ).value
                );

            }
        );


        /* =====================================
           SAVE DRAFT
        ===================================== */

        saveDraftBtn.addEventListener(
            "click",
            function () {

                saveWriterBlog(
                    "In Progress"
                );

            }
        );


        /* =====================================
           SAVE WRITER BLOG
        ===================================== */

        function saveWriterBlog(
            selectedStatus
        ) {

            const title =
                document.getElementById(
                    "writerTitle"
                ).value.trim();


            const keyword =
                document.getElementById(
                    "writerKeyword"
                ).value.trim();


            const category =
                document.getElementById(
                    "writerCategory"
                ).value;


            const writer =
                document.getElementById(
                    "writerName"
                ).value.trim();


            const publishDate =
                document.getElementById(
                    "writerPublishDate"
                ).value;


            const content =
                blogContent.innerHTML.trim();


            /* =================================
               VALIDATION
            ================================= */

            if (
                !title ||
                !keyword ||
                !category ||
                !writer ||
                !publishDate ||
                !content
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            const plainText =
                blogContent.innerText.trim();


            const wordCount =
                plainText
                    ? plainText.split(/\s+/).length
                    : 0;


            /* =================================
               EDIT EXISTING BLOG
            ================================= */

            if (editingBlogId) {

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
                                    editingBlogId
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


                const updatedBlog = {

                    id:
                        existingBlog.id,

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
                        selectedStatus,

                    content:
                        content,

                    createdAt:
                        existingBlog.createdAt ||
                        new Date().toISOString()

                };


                updateBlog(
                    Number(
                        editingBlogId
                    ),
                    updatedBlog
                );


                alert(
                    "Blog updated successfully!"
                );

            }


            /* =================================
               CREATE NEW BLOG
            ================================= */

            else {

                const newBlog = {

                    id:
                        Date.now(),

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
                        selectedStatus,

                    content:
                        content,

                    createdAt:
                        new Date().toISOString()

                };


                addBlog(
                    newBlog
                );


                alert(
                    "Blog saved successfully!"
                );

            }


            /* =================================
               REDIRECT
            ================================= */

            window.location.href =
                "blogs.html";

        }

    }
);


/* =========================================
   LOAD BLOG FOR EDITING
========================================= */

function loadBlogForEditing(
    blogId
) {

    const blogs =
        getBlogs();


    const blog =
        blogs.find(
            function (item) {

                return (
                    String(
                        item.id
                    ) ===
                    String(
                        blogId
                    )
                );

            }
        );


    if (!blog) {

        alert(
            "Blog could not be found."
        );

        window.location.href =
            "blogs.html";

        return;

    }


    /* =====================================
       LOAD BASIC INFORMATION
    ===================================== */

    document.getElementById(
        "writerTitle"
    ).value =
        blog.title || "";


    document.getElementById(
        "writerKeyword"
    ).value =
        blog.keyword || "";


    document.getElementById(
        "writerCategory"
    ).value =
        blog.category || "";


    document.getElementById(
        "writerName"
    ).value =
        blog.writer || "";


    document.getElementById(
        "writerPublishDate"
    ).value =
        blog.publishDate || "";


    document.getElementById(
        "writerStatus"
    ).value =
        blog.status || "In Progress";


    /* =====================================
       LOAD EXISTING CONTENT
    ===================================== */

    const editor =
        document.getElementById(
            "blogContent"
        );


    editor.innerHTML =
        blog.content || "";


    updateWriterWordCount();


    /* =====================================
       CHANGE PAGE TITLE
    ===================================== */

    const heading =
        document.querySelector(
            ".page-header h1"
        );


    if (heading) {

        heading.textContent =
            "Edit Blog";

    }


    const description =
        document.querySelector(
            ".page-header p"
        );


    if (description) {

        description.textContent =
            "Update your blog information and article content.";

    }


    /* =====================================
       CHANGE SAVE BUTTON TEXT
    ===================================== */

    const submitButton =
        document.querySelector(
            "#writerForm button[type='submit']"
        );


    if (submitButton) {

        submitButton.textContent =
            "Update Blog";

    }

}


/* =========================================
   RICH TEXT FORMATTING
========================================= */

function formatText(
    command,
    value = null
) {

    const editor =
        document.getElementById(
            "blogContent"
        );


    editor.focus();


    document.execCommand(
        command,
        false,
        value
    );


    updateWriterWordCount();

}


/* =========================================
   UPDATE WORD COUNT
========================================= */

function updateWriterWordCount() {

    const editor =
        document.getElementById(
            "blogContent"
        );


    const wordCounter =
        document.getElementById(
            "contentWordCount"
        );


    const characterCounter =
        document.getElementById(
            "contentCharacterCount"
        );


    if (!editor) {
        return;
    }


    const text =
        editor.innerText.trim();


    const words =
        text
            ? text.split(/\s+/).length
            : 0;


    if (wordCounter) {

        wordCounter.textContent =
            words;

    }


    if (characterCounter) {

        characterCounter.textContent =
            text.length;

    }

}
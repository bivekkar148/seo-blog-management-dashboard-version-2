const STORAGE_KEY = "seoBlogs";


/* =========================================
   GET BLOGS
========================================= */

function getBlogs() {

    const data =
        localStorage.getItem(STORAGE_KEY);

    return data
        ? JSON.parse(data)
        : [];

}


/* =========================================
   NOTIFY OTHER PARTS OF APP
========================================= */

function notifyBlogsUpdated() {

    window.dispatchEvent(
        new CustomEvent("blogsUpdated")
    );

}


/* =========================================
   SAVE BLOGS
========================================= */

function saveBlogs(blogs) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(blogs)
    );

    notifyBlogsUpdated();

}


/* =========================================
   ADD BLOG
========================================= */

function addBlog(blog) {

    const blogs =
        getBlogs();

    blogs.push(blog);

    saveBlogs(blogs);

}


/* =========================================
   UPDATE BLOG
========================================= */

function updateBlog(id, updatedBlog) {

    const blogs =
        getBlogs();


    const index =
        blogs.findIndex(function (blog) {

            return blog.id === id;

        });


    if (index !== -1) {

        blogs[index] =
            updatedBlog;

        saveBlogs(blogs);

    }

}


/* =========================================
   DELETE BLOG
========================================= */

function deleteBlog(id) {

    const blogs =
        getBlogs();


    const updatedBlogs =
        blogs.filter(function (blog) {

            return blog.id !== id;

        });


    saveBlogs(updatedBlogs);

}